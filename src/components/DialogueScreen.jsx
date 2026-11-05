import { useCallback, useEffect, useRef } from 'react';
import SceneArt from './SceneArt.jsx';
import CharacterPortrait from './CharacterPortrait.jsx';
import Icon from './Icon.jsx';
import { LineBox, ChoiceBox, NameBox } from './DialogueBox.jsx';
import { CHARACTERS } from '../data/characters.js';
import {
  backgroundAt, castAt, expressionAt, interpolate, isEnd, nextIndex, choiceIndex, sceneProgress,
} from '../engines/StoryEngine.js';

function LetterCard({ node, onNext }) {
  return (
    <div className="letter-card" role="document" aria-label={node.title}>
      <div className="letter-card__seal" aria-hidden="true"><Icon name="key" size={22} /></div>
      <p className="letter-card__title">{node.title}</p>
      {node.body.map((p) => <p key={p} className="letter-card__p">{p}</p>)}
      <p className="letter-card__sign">{node.sign}</p>
      <button type="button" className="btn btn--ink" onClick={onNext} autoFocus>
        Baca bagian bawah surat <Icon name="chevronRight" size={18} />
      </button>
    </div>
  );
}

export default function DialogueScreen({ scene, index, state, dispatch, caseData, onOpenJournal, onPause, reduceMotion }) {
  const cs = caseData ? state.cases[caseData.id] : null;
  const flags = (cs && cs.flags) || {};
  const node = scene.nodes[index];
  const ended = useRef(false);
  const ctx = { name: state.player.name || 'Penyelidik' };

  const endScene = useCallback(() => {
    if (ended.current) return;
    ended.current = true;
    dispatch({ type: 'SCENE_END', effects: scene.onEnd });
  }, [dispatch, scene]);

  useEffect(() => { ended.current = false; }, [scene.id]);

  useEffect(() => {
    if (isEnd(scene, index)) endScene();
  }, [scene, index, endScene]);

  const goNext = useCallback(() => {
    const ni = nextIndex(scene, index, flags);
    if (isEnd(scene, ni)) endScene();
    else dispatch({ type: 'DIALOGUE_INDEX', index: ni });
  }, [scene, index, flags, dispatch, endScene]);

  const choose = useCallback((opt) => {
    const ni = choiceIndex(scene, index, opt, flags);
    if (isEnd(scene, ni)) endScene();
    else dispatch({ type: 'DIALOGUE_CHOICE', index: ni, flag: opt.flag });
  }, [scene, index, flags, dispatch, endScene]);

  if (!node) return <div className="vn" />;

  const bg = backgroundAt(scene, index);
  const cast = castAt(scene, index).filter((c) => CHARACTERS[c]);
  const visibleCast = cast.filter((c) => scene.nodes.slice(0, index + 1).some((n) => n.speaker === c) || node.speaker === c);
  const prog = sceneProgress(scene, index);
  const speakerChar = node.speaker && node.speaker !== 'narrator' ? CHARACTERS[node.speaker] : null;
  const isLast = isEnd(scene, nextIndex(scene, index, flags));

  return (
    <section className={`vn vn--${bg}`} aria-label={`Adegan: ${scene.chapter}`}>
      <div className="vn__bg" key={bg}>
        <SceneArt scene={bg} />
        <div className="vn__vignette" />
        <div className="motes" aria-hidden="true" />
      </div>

      <header className="vn__top">
        <div className="vn__chapter">
          <span className="mono">{caseData ? caseData.id : 'PROLOG'}</span>
          <span className="vn__chapter-label">{scene.chapter}</span>
        </div>
        <div className="vn__progress" role="progressbar" aria-label="Kemajuan adegan" aria-valuemin={1} aria-valuemax={prog.total} aria-valuenow={prog.current}>
          <span style={{ width: `${prog.ratio * 100}%` }} />
        </div>
        <div className="vn__actions">
          {caseData ? (
            <button type="button" className="icon-btn icon-btn--label" onClick={onOpenJournal} aria-label="Buka Jurnal Detektif">
              <Icon name="book" /><span>Jurnal</span>
            </button>
          ) : null}
          <button type="button" className="icon-btn icon-btn--label" onClick={onPause} aria-label="Buka menu jeda">
            <Icon name="menu" /><span>Menu</span>
          </button>
        </div>
      </header>

      <div className="vn__stage">
        {visibleCast.map((c, i) => (
          <CharacterPortrait
            key={c}
            id={c}
            expr={expressionAt(scene, index, c)}
            active={node.speaker === c}
            side={visibleCast.length === 1 ? 'center' : i === 0 ? 'left' : 'right'}
          />
        ))}
      </div>

      <div className="vn__dock">
        {node.type === 'letter' ? (
          <LetterCard node={node} onNext={goNext} />
        ) : node.type === 'name' ? (
          <NameBox
            initial={state.player.name}
            onSubmit={(name) => { dispatch({ type: 'SET_NAME', name }); goNext(); }}
          />
        ) : node.type === 'choice' ? (
          <ChoiceBox prompt={node.prompt} options={node.options} onChoose={choose} />
        ) : (
          <LineBox
            key={`${scene.id}-${index}`}
            speaker={speakerChar ? speakerChar.name : ''}
            role={speakerChar ? speakerChar.role : ''}
            text={interpolate(node.text, ctx)}
            onNext={goNext}
            isLast={isLast}
            settings={state.settings}
            reduceMotion={reduceMotion}
          />
        )}
      </div>
    </section>
  );
}
