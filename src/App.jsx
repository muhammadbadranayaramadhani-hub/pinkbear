import { useCallback, useEffect, useReducer, useState } from 'react';
import MainMenu from './components/MainMenu.jsx';
import DialogueScreen from './components/DialogueScreen.jsx';
import InvestigationScene from './components/InvestigationScene.jsx';
import InspectionPanel from './components/InspectionPanel.jsx';
import EvidenceInventory from './components/EvidenceInventory.jsx';
import EvidenceBoard from './components/EvidenceBoard.jsx';
import KnowledgeChallenge from './components/KnowledgeChallenge.jsx';
import CaseResolution from './components/CaseResolution.jsx';
import CaseResult from './components/CaseResult.jsx';
import CaseArchive from './components/CaseArchive.jsx';
import Settings from './components/Settings.jsx';
import PauseMenu from './components/PauseMenu.jsx';
import GameHUD, { BottomNav } from './components/GameHUD.jsx';
import ObjectivesList from './components/ObjectivesList.jsx';
import Modal from './components/Modal.jsx';
import ConfirmDialog from './components/ConfirmDialog.jsx';
import Toasts from './components/Toasts.jsx';
import { gameReducer, findScene } from './state/gameReducer.js';
import { loadGame, saveGame, hasSave } from './engines/ProgressEngine.js';
import { getCase } from './data/cases/index.js';

function useReducedMotion(setting) {
  const [sys, setSys] = useState(() => {
    try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; }
  });
  useEffect(() => {
    let mq;
    try { mq = window.matchMedia('(prefers-reduced-motion: reduce)'); } catch (e) { return undefined; }
    const on = () => setSys(mq.matches);
    if (mq.addEventListener) mq.addEventListener('change', on);
    return () => { if (mq.removeEventListener) mq.removeEventListener('change', on); };
  }, []);
  return setting === 'kurangi' || sys;
}

export default function App() {
  const [state, dispatch] = useReducer(gameReducer, undefined, loadGame);
  const [view, setView] = useState('menu'); // menu | game | archive | settings
  const [returnTo, setReturnTo] = useState('menu');
  const [overlay, setOverlay] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const reduceMotion = useReducedMotion(state.settings.motion);

  useEffect(() => { saveGame(state); }, [state]);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.motion = reduceMotion ? 'reduce' : 'full';
    root.dataset.textsize = state.settings.textSize;
  }, [reduceMotion, state.settings.textSize]);

  const session = state.session;
  const screen = session ? session.screen : null;
  const caseId = session && session.caseId;
  const caseData = caseId ? getCase(caseId) : null;
  const cs = caseData ? state.cases[caseId] : null;

  useEffect(() => {
    setOverlay((o) => (o && o.type === 'journal' && screen === 'resolution' ? o : null));
    try { window.scrollTo(0, 0); } catch (e) { /* abaikan */ }
  }, [screen, view, session && session.sceneId]);

  useEffect(() => {
    if (view === 'game' && !session) setView('menu');
  }, [view, session]);

  const close = useCallback(() => setOverlay(null), []);
  const markSeen = useCallback((id) => dispatch({ type: 'MARK_SEEN', evidenceId: id }), []);
  const dismissToast = useCallback((id) => dispatch({ type: 'DISMISS_TOAST', id }), []);

  const openJournal = (initial) => setOverlay({ type: 'journal', initial: typeof initial === 'string' ? initial : undefined });
  const openChallenge = (id) => setOverlay({ type: 'challenge', id });
  const go = (s) => { setOverlay(null); dispatch({ type: 'GO', screen: s }); };
  const pause = () => setOverlay({ type: 'pause' });

  // Pintasan papan ketik saat menjelajah.
  useEffect(() => {
    if (view !== 'game' || !['investigate', 'board'].includes(screen)) return undefined;
    function onKey(e) {
      const tag = (e.target && e.target.tagName) || '';
      if (['INPUT', 'TEXTAREA'].includes(tag) || document.querySelector('.overlay') || e.ctrlKey || e.metaKey || e.altKey) return;
      const k = e.key.toLowerCase();
      if (k === 'j') { e.preventDefault(); setOverlay({ type: 'journal' }); }
      if (k === 'b') { e.preventDefault(); dispatch({ type: 'GO', screen: screen === 'board' ? 'investigate' : 'board' }); }
      if (k === 'escape') { e.preventDefault(); setOverlay({ type: 'pause' }); }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [view, screen]);

  function startNew() {
    dispatch({ type: 'NEW_GAME' });
    setOverlay(null);
    setView('game');
  }

  function requestNew() {
    if (hasSave(state)) {
      setConfirm({
        title: 'Mulai penyelidikan baru?',
        message: 'Progres yang tersimpan, termasuk bukti dan lencana, akan diganti dengan permainan baru.',
        confirmLabel: 'Ya, mulai baru',
        danger: true,
        onConfirm: startNew,
      });
    } else startNew();
  }

  function requestRestart(id) {
    setConfirm({
      title: 'Ulangi kasus dari awal?',
      message: 'Bukti, jawaban, dan benang merah di kasus ini akan dihapus. Lencana dan skor terbaikmu tetap tersimpan.',
      confirmLabel: 'Ya, ulangi kasus',
      danger: true,
      onConfirm: () => { setOverlay(null); dispatch({ type: 'RESTART_CASE', caseId: id }); setView('game'); },
    });
  }

  function openCase(id) {
    setOverlay(null);
    dispatch({ type: 'OPEN_CASE', caseId: id });
    setView('game');
  }

  function inspect(h) {
    dispatch({ type: 'INSPECT', hotspotId: h.id });
    setOverlay({ type: 'inspect', id: h.id });
  }

  // ------------------------------------------------------------------ tampilan
  let content = null;

  if (view === 'menu') {
    content = (
      <MainMenu
        state={state}
        canContinue={hasSave(state)}
        onContinue={() => setView('game')}
        onNew={requestNew}
        onArchive={() => { setReturnTo('menu'); setView('archive'); }}
        onSettings={() => { setReturnTo('menu'); setView('settings'); }}
      />
    );
  } else if (view === 'archive') {
    content = (
      <CaseArchive
        state={state}
        backLabel={returnTo === 'game' ? 'Kembali ke permainan' : 'Menu utama'}
        onBack={() => setView(returnTo)}
        onOpenCase={openCase}
        onRestartCase={(id) => { dispatch({ type: 'RESTART_CASE', caseId: id }); setView('game'); }}
        onNewGame={requestNew}
      />
    );
  } else if (view === 'settings') {
    content = (
      <Settings
        settings={state.settings}
        onChange={(patch) => dispatch({ type: 'SETTINGS', patch })}
        backLabel={returnTo === 'game' ? 'Kembali ke permainan' : 'Menu utama'}
        onBack={() => setView(returnTo === 'game' && hasSave(state) ? 'game' : 'menu')}
        onResetAll={() => dispatch({ type: 'RESET_ALL' })}
      />
    );
  } else if (!session) {
    content = null;
  } else if (screen === 'dialogue') {
    const scene = findScene(session.sceneId, caseId);
    content = scene ? (
      <DialogueScreen
        key={scene.id}
        scene={scene}
        index={session.index}
        state={state}
        dispatch={dispatch}
        caseData={caseData}
        onOpenJournal={() => openJournal()}
        onPause={pause}
        reduceMotion={reduceMotion}
      />
    ) : null;
  } else if (screen === 'archive') {
    content = (
      <CaseArchive
        state={state}
        inGame={!state.cases['MYS-001'] || state.cases['MYS-001'].status === 'not-started'}
        backLabel="Menu utama"
        onBack={() => setView('menu')}
        onOpenCase={openCase}
        onRestartCase={(id) => dispatch({ type: 'RESTART_CASE', caseId: id })}
        onNewGame={requestNew}
      />
    );
  } else if (screen === 'result' && caseData && cs) {
    content = (
      <CaseResult
        caseData={caseData}
        cs={cs}
        state={state}
        onArchive={() => dispatch({ type: 'GO', screen: 'archive' })}
        onRestart={() => requestRestart(caseData.id)}
        onMenu={() => setView('menu')}
      />
    );
  } else if (caseData && cs) {
    const active = screen === 'board' ? 'board' : screen === 'investigate' ? 'explore' : null;
    let main = null;
    if (screen === 'investigate') {
      main = (
        <InvestigationScene
          caseData={caseData}
          cs={cs}
          dispatch={dispatch}
          onInspect={inspect}
          onChallenge={openChallenge}
          onScreen={go}
        />
      );
    } else if (screen === 'board') {
      main = <EvidenceBoard caseData={caseData} cs={cs} dispatch={dispatch} onBack={() => go('investigate')} />;
    } else if (screen === 'resolution') {
      main = <CaseResolution caseData={caseData} cs={cs} dispatch={dispatch} onBack={() => go('investigate')} onOpenJournal={() => openJournal()} />;
    }
    content = (
      <div className={`game game--${screen}`}>
        <GameHUD
          caseData={caseData}
          cs={cs}
          active={overlay && overlay.type === 'journal' ? 'journal' : screen === 'board' ? 'board' : null}
          onJournal={() => openJournal()}
          onBoard={() => go(screen === 'board' ? 'investigate' : 'board')}
          onPause={pause}
        />
        <div className="game__main">{main}</div>
        <BottomNav
          active={overlay && overlay.type === 'journal' ? 'journal' : overlay && overlay.type === 'objectives' ? 'objectives' : active}
          unseen={cs.unseen.length}
          onExplore={() => go('investigate')}
          onJournal={() => openJournal()}
          onBoard={() => go('board')}
          onObjectives={() => setOverlay({ type: 'objectives' })}
          onPause={pause}
        />
      </div>
    );
  }

  // ------------------------------------------------------------------ lapisan
  let layer = null;
  if (overlay && view === 'game') {
    if (overlay.type === 'pause') {
      layer = (
        <PauseMenu
          inCase={!!(caseData && cs && cs.status !== 'not-started')}
          onResume={close}
          onArchive={() => { setOverlay(null); setReturnTo('game'); setView('archive'); }}
          onSettings={() => { setOverlay(null); setReturnTo('game'); setView('settings'); }}
          onRestart={() => requestRestart(caseData.id)}
          onMainMenu={() => { setOverlay(null); setView('menu'); }}
        />
      );
    } else if (caseData && cs) {
      if (overlay.type === 'inspect') {
        const h = caseData.hotspots.find((x) => x.id === overlay.id);
        layer = (
          <InspectionPanel
            hotspot={h}
            caseData={caseData}
            cs={cs}
            onClose={close}
            onCollect={(id) => dispatch({ type: 'COLLECT', evidenceId: id })}
            onChallenge={openChallenge}
            onInterview={(sceneId) => { setOverlay(null); dispatch({ type: 'PLAY_SCENE', sceneId }); }}
          />
        );
      } else if (overlay.type === 'journal') {
        layer = (
          <EvidenceInventory
            caseData={caseData}
            cs={cs}
            initial={overlay.initial}
            onClose={close}
            onMarkSeen={markSeen}
            onChallenge={(id) => (screen === 'dialogue' ? null : openChallenge(id))}
          />
        );
      } else if (overlay.type === 'challenge') {
        const ch = caseData.challenges[overlay.id];
        layer = (
          <KnowledgeChallenge
            key={ch.id}
            challenge={ch}
            caseData={caseData}
            record={cs.challenges[ch.id]}
            dispatch={dispatch}
            onClose={close}
            onComplete={() => { setOverlay(null); dispatch({ type: 'CHALLENGE_COMPLETE', id: ch.id }); }}
          />
        );
      } else if (overlay.type === 'objectives') {
        layer = (
          <Modal title="Tujuan Penyelidikan" eyebrow={caseData.id} onClose={close} variant="drawer" className="objectives-sheet">
            <ObjectivesList
              caseData={caseData}
              cs={cs}
              onChallenge={openChallenge}
              onScreen={go}
              onGoLocation={(id) => { dispatch({ type: 'SET_LOCATION', location: id }); setOverlay(null); if (screen !== 'investigate') dispatch({ type: 'GO', screen: 'investigate' }); }}
            />
          </Modal>
        );
      }
    }
  }

  return (
    <div className="app" data-view={view} data-screen={screen || ''}>
      <div className="screen" key={`${view}-${screen}-${session && session.sceneId}`}>{content}</div>
      {layer}
      {confirm ? (
        <ConfirmDialog
          {...confirm}
          onCancel={() => setConfirm(null)}
          onConfirm={() => { const fn = confirm.onConfirm; setConfirm(null); fn(); }}
        />
      ) : null}
      <Toasts toasts={state.toasts} onDismiss={dismissToast} />
    </div>
  );
}
