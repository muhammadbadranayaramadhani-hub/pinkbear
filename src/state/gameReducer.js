// Reducer utama permainan. Semua perubahan state lewat sini agar mudah disimpan dan diuji.

import { CASES, getCase } from '../data/cases/index.js';
import { KP_RULES, BADGES } from '../data/progression.js';
import { PROLOGUE } from '../data/prologue.js';
import { firstIndex } from '../engines/StoryEngine.js';
import { challengeKp, emptyPartRecord } from '../engines/PuzzleEngine.js';
import { freshCaseState, freshGame, newBadges, caseStats, ratingFor } from '../engines/ProgressEngine.js';

let toastSeq = 0;
const toast = (kind, text) => ({ id: `t${Date.now()}-${toastSeq++}`, kind, text });

export function findScene(sceneId, caseId) {
  if (sceneId === PROLOGUE.id) return PROLOGUE;
  const c = caseId ? getCase(caseId) : null;
  if (c && c.scenes[sceneId]) return c.scenes[sceneId];
  for (const cd of Object.values(CASES)) if (cd.scenes[sceneId]) return cd.scenes[sceneId];
  return null;
}

function activeCaseId(state) {
  return (state.session && state.session.caseId) || 'MYS-001';
}

function updateCase(state, caseId, fn) {
  const caseData = getCase(caseId);
  const current = state.cases[caseId] || freshCaseState(caseData);
  return { ...state, cases: { ...state.cases, [caseId]: fn(current, caseData) } };
}

function addKp(cs, amount) {
  return { ...cs, kp: cs.kp + amount };
}

function pushToasts(state, ...items) {
  return { ...state, toasts: [...state.toasts, ...items.filter(Boolean)].slice(-4) };
}

function withBadges(state) {
  const found = newBadges(state);
  if (!found.length) return state;
  const next = { ...state, progress: { ...state.progress, badges: [...state.progress.badges, ...found] } };
  return pushToasts(next, ...found.map((id) => toast('badge', `Lencana baru: ${BADGES.find((b) => b.id === id).title}`)));
}

function startScene(state, sceneId, caseId) {
  const scene = findScene(sceneId, caseId);
  if (!scene) return state;
  const flags = (caseId && state.cases[caseId] && state.cases[caseId].flags) || {};
  return { ...state, session: { ...state.session, screen: 'dialogue', caseId, sceneId, index: firstIndex(scene, flags) } };
}

function collectInto(state, caseId, ids) {
  let next = state;
  const caseData = getCase(caseId);
  ids.forEach((id) => {
    const cs = next.cases[caseId] || freshCaseState(caseData);
    if (cs.evidence.includes(id)) return;
    next = updateCase(next, caseId, (c) =>
      addKp({ ...c, evidence: [...c.evidence, id], unseen: [...c.unseen, id] }, KP_RULES.evidence));
    next = pushToasts(next, toast('evidence', `Bukti baru di Jurnal: ${caseData.evidence[id].title}`));
  });
  return next;
}

function applySceneEnd(state, effects = {}) {
  const caseId = state.session && state.session.caseId;
  let next = state;

  if (effects.unlockCase && !next.progress.unlockedCases.includes(effects.unlockCase)) {
    next = { ...next, progress: { ...next.progress, unlockedCases: [...next.progress.unlockedCases, effects.unlockCase] } };
  }
  if (caseId && effects.flags) {
    next = updateCase(next, caseId, (cs) => ({ ...cs, flags: { ...cs.flags, ...Object.fromEntries(effects.flags.map((f) => [f, true])) } }));
  }
  if (caseId && effects.unlockLocations) {
    next = updateCase(next, caseId, (cs) => ({
      ...cs,
      unlockedLocations: Array.from(new Set([...cs.unlockedLocations, ...effects.unlockLocations])),
    }));
    next = pushToasts(next, toast('info', 'Lokasi baru terbuka di peta penyelidikan.'));
  }
  if (caseId && effects.collect) next = collectInto(next, caseId, effects.collect);

  switch (effects.go) {
    case 'scene':
      return withBadges(startScene(next, effects.scene, caseId));
    case 'investigate': {
      if (effects.location) next = updateCase(next, caseId, (cs) => ({ ...cs, location: effects.location }));
      return withBadges({ ...next, session: { ...next.session, screen: 'investigate', sceneId: null, index: 0 } });
    }
    case 'archive':
      return withBadges({ ...next, session: { ...next.session, screen: 'archive', caseId: null, sceneId: null, index: 0 } });
    case 'result':
      return withBadges({ ...next, session: { ...next.session, screen: 'result', sceneId: null, index: 0 } });
    default:
      return withBadges({ ...next, session: { ...next.session, screen: 'investigate', sceneId: null } });
  }
}

function challengeRecord(cs, ch) {
  return cs.challenges[ch.id] || { parts: ch.parts.map(() => emptyPartRecord()), solved: false, kp: 0 };
}

function updatePart(state, caseId, chId, partIdx, patch) {
  return updateCase(state, caseId, (cs, cd) => {
    const ch = cd.challenges[chId];
    const rec = challengeRecord(cs, ch);
    const parts = rec.parts.map((p, i) => (i === partIdx ? patch(p) : p));
    return { ...cs, challenges: { ...cs.challenges, [chId]: { ...rec, parts } } };
  });
}

export function gameReducer(state, action) {
  switch (action.type) {
    case 'NEW_GAME': {
      const fresh = freshGame(state.settings);
      return { ...fresh, session: { screen: 'dialogue', caseId: null, sceneId: PROLOGUE.id, index: 0 } };
    }

    case 'SET_NAME':
      return { ...state, player: { ...state.player, name: action.name } };

    case 'DIALOGUE_INDEX':
      return { ...state, session: { ...state.session, index: action.index } };

    case 'DIALOGUE_CHOICE': {
      let next = { ...state, session: { ...state.session, index: action.index } };
      const caseId = state.session.caseId;
      if (action.flag && caseId) {
        next = updateCase(next, caseId, (cs) => ({ ...cs, flags: { ...cs.flags, [action.flag]: true } }));
      }
      return next;
    }

    case 'PLAY_SCENE':
      return startScene(state, action.sceneId, activeCaseId(state));

    case 'SCENE_END':
      return applySceneEnd(state, action.effects);

    case 'OPEN_CASE': {
      const caseData = getCase(action.caseId);
      const cs = state.cases[action.caseId];
      const base = { ...state, session: { ...(state.session || {}), caseId: action.caseId } };
      if (!cs || cs.status === 'not-started') {
        const started = updateCase(base, action.caseId, () => ({ ...freshCaseState(caseData), status: 'in-progress' }));
        return startScene(started, caseData.startScene, action.caseId);
      }
      if (cs.status === 'solved') return { ...base, session: { ...base.session, screen: 'result' } };
      return { ...base, session: { ...base.session, screen: 'investigate', sceneId: null } };
    }

    case 'RESTART_CASE': {
      const caseData = getCase(action.caseId);
      const base = { ...state, session: { ...(state.session || {}), caseId: action.caseId } };
      const reset = updateCase(base, action.caseId, () => ({ ...freshCaseState(caseData), status: 'in-progress' }));
      return pushToasts(startScene(reset, caseData.startScene, action.caseId), toast('info', 'Berkas kasus dibuka ulang dari awal.'));
    }

    case 'GO': {
      return { ...state, session: { ...state.session, screen: action.screen, ...(action.extra || {}) } };
    }

    case 'SET_LOCATION': {
      const caseId = activeCaseId(state);
      return updateCase(state, caseId, (cs) => (cs.unlockedLocations.includes(action.location) ? { ...cs, location: action.location } : cs));
    }

    case 'INSPECT': {
      const caseId = activeCaseId(state);
      return withBadges(updateCase(state, caseId, (cs) => {
        if (cs.inspected.includes(action.hotspotId)) return cs;
        return addKp({ ...cs, inspected: [...cs.inspected, action.hotspotId] }, KP_RULES.inspect);
      }));
    }

    case 'COLLECT':
      return withBadges(collectInto(state, activeCaseId(state), [action.evidenceId]));

    case 'MARK_SEEN': {
      const caseId = activeCaseId(state);
      return updateCase(state, caseId, (cs) => ({ ...cs, unseen: action.evidenceId ? cs.unseen.filter((e) => e !== action.evidenceId) : [] }));
    }

    case 'CHALLENGE_HINT':
      return updatePart(state, activeCaseId(state), action.id, action.part, (p) => ({ ...p, hints: Math.max(p.hints, action.level) }));

    case 'CHALLENGE_ATTEMPT':
      return updatePart(state, activeCaseId(state), action.id, action.part, (p) => ({
        ...p,
        attempts: p.attempts + 1,
        wrong: p.wrong + (action.correct ? 0 : 1),
        solved: p.solved || action.correct,
      }));

    case 'CHALLENGE_REVEAL':
      return updatePart(state, activeCaseId(state), action.id, action.part, (p) => ({ ...p, revealed: true, solved: true }));

    case 'CHALLENGE_COMPLETE': {
      const caseId = activeCaseId(state);
      const caseData = getCase(caseId);
      const ch = caseData.challenges[action.id];
      let gained = 0;
      let next = updateCase(state, caseId, (cs) => {
        const rec = challengeRecord(cs, ch);
        if (rec.solved) return cs;
        gained = challengeKp(ch, rec);
        return addKp({ ...cs, challenges: { ...cs.challenges, [ch.id]: { ...rec, solved: true, kp: gained } } }, gained);
      });
      if (gained) next = pushToasts(next, toast('kp', `+${gained} Poin Pengetahuan · ${ch.subject}`));
      next = withBadges(next);
      if (ch.onSolved && ch.onSolved.scene && action.playScene !== false) next = startScene(next, ch.onSolved.scene, caseId);
      return next;
    }

    case 'CONNECT_RESULT': {
      const caseId = activeCaseId(state);
      let next = updateCase(state, caseId, (cs) => {
        if (action.counts && !cs.connections.includes(action.connectionId)) {
          return addKp({ ...cs, connections: [...cs.connections, action.connectionId] }, KP_RULES.connection);
        }
        if (!action.correct) return { ...cs, boardMistakes: cs.boardMistakes + 1 };
        return cs;
      });
      if (action.counts) next = pushToasts(next, toast('kp', `Benang merah terhubung · +${KP_RULES.connection} PP`));
      return withBadges(next);
    }

    case 'FINAL_ATTEMPT': {
      const caseId = activeCaseId(state);
      return updateCase(state, caseId, (cs) => ({ ...cs, finalAttempts: cs.finalAttempts + 1 }));
    }

    case 'FINAL_SOLVED': {
      const caseId = activeCaseId(state);
      const caseData = getCase(caseId);
      let next = updateCase(state, caseId, (cs) => {
        if (cs.status === 'solved') return cs;
        const bonus = cs.finalAttempts <= 1 ? KP_RULES.finalFirstTry : KP_RULES.finalLater;
        const solved = addKp({ ...cs, status: 'solved', result: { submission: action.submission, notes: action.notes || [] } }, bonus);
        const stats = caseStats(caseData, solved);
        return { ...solved, result: { ...solved.result, stats, rating: ratingFor(stats) } };
      });
      const cs = next.cases[caseId];
      const prevBest = next.progress.caseBest[caseId];
      const best = {
        kp: Math.max(cs.kp, (prevBest && prevBest.kp) || 0),
        stars: Math.max(cs.result.rating.stars, (prevBest && prevBest.stars) || 0),
        solvedAt: new Date().toISOString(),
      };
      next = { ...next, progress: { ...next.progress, caseBest: { ...next.progress.caseBest, [caseId]: best } } };
      next = pushToasts(next, toast('kp', 'Kasus terpecahkan!'));
      next = withBadges(next);
      return startScene(next, caseData.endScene, caseId);
    }

    case 'SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.patch } };

    case 'RESET_ALL':
      return { ...freshGame(state.settings) };

    case 'DISMISS_TOAST':
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.id) };

    default:
      return state;
  }
}
