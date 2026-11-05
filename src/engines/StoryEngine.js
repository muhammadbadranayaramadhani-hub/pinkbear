// Mesin cerita: navigasi node dialogue, percabangan, kondisi, dan latar.

export function conditionMet(node, flags = {}) {
  if (!node) return false;
  if (node.if && !flags[node.if]) return false;
  if (node.ifNot && flags[node.ifNot]) return false;
  return true;
}

export function findIndex(scene, id) {
  return scene.nodes.findIndex((n) => n.id === id);
}

function skipHidden(scene, index, flags) {
  let i = index;
  while (i < scene.nodes.length && !conditionMet(scene.nodes[i], flags)) i += 1;
  return i;
}

export function firstIndex(scene, flags) {
  return skipHidden(scene, 0, flags);
}

/** Indeks berikutnya setelah node biasa (mengikuti `goto` bila ada). */
export function nextIndex(scene, index, flags) {
  const node = scene.nodes[index];
  const target = node && node.goto ? findIndex(scene, node.goto) : index + 1;
  return skipHidden(scene, target < 0 ? index + 1 : target, flags);
}

/** Indeks tujuan setelah memilih opsi pada node pilihan. */
export function choiceIndex(scene, index, option, flags) {
  const target = option.goto ? findIndex(scene, option.goto) : index + 1;
  return skipHidden(scene, target < 0 ? index + 1 : target, flags);
}

export function isEnd(scene, index) {
  return index >= scene.nodes.length;
}

export function interpolate(text = '', ctx = {}) {
  return text.replace(/\{(\w+)\}/g, (_, k) => (ctx[k] != null ? ctx[k] : ''));
}

function lastWith(scene, index, key) {
  for (let i = Math.min(index, scene.nodes.length - 1); i >= 0; i -= 1) {
    if (scene.nodes[i][key]) return scene.nodes[i][key];
  }
  return null;
}

export function backgroundAt(scene, index) {
  return lastWith(scene, index, 'bg') || scene.bg;
}

export function castAt(scene, index) {
  return lastWith(scene, index, 'cast') || scene.cast || [];
}

export function expressionAt(scene, index, charId) {
  for (let i = Math.min(index, scene.nodes.length - 1); i >= 0; i -= 1) {
    const n = scene.nodes[i];
    if (n.speaker === charId && n.expr) return n.expr;
  }
  return 'neutral';
}

/** Persentase kemajuan dalam satu adegan (perkiraan, karena ada cabang). */
export function sceneProgress(scene, index) {
  const total = scene.nodes.length;
  return { current: Math.min(index + 1, total), total, ratio: Math.min(1, (index + 1) / total) };
}
