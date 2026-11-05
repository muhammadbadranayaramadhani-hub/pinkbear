// Bundel satu-file untuk uji lokal (mode "test") dan untuk artifact (mode "artifact": React dari CDN).
import * as esbuild from '/opt/npm-tools/node_modules/esbuild/lib/main.js';
import fs from 'node:fs';
import path from 'node:path';

const mode = process.argv[2] || 'test';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const shims = path.join(root, 'build/shims');
const globalModules = '/home/claude/.npm-global/lib/node_modules';

const aliasPlugin = {
  name: 'react-globals',
  setup(b) {
    if (mode !== 'artifact') return;
    b.onResolve({ filter: /^react$/ }, () => ({ path: path.join(shims, 'react.js') }));
    b.onResolve({ filter: /^react\/jsx-runtime$/ }, () => ({ path: path.join(shims, 'jsx-runtime.js') }));
    b.onResolve({ filter: /^react-dom\/client$/ }, () => ({ path: path.join(shims, 'react-dom-client.js') }));
  },
};

const result = await esbuild.build({
  entryPoints: [path.join(root, 'src/main.jsx')],
  bundle: true,
  write: false,
  outdir: path.join(root, 'dist-tmp'),
  format: 'iife',
  jsx: 'automatic',
  minify: true,
  target: ['es2019'],
  loader: { '.js': 'jsx', '.jsx': 'jsx' },
  define: { 'process.env.NODE_ENV': '"production"' },
  nodePaths: [globalModules],
  plugins: [aliasPlugin],
  logLevel: 'warning',
});

let js = '';
let css = '';
for (const f of result.outputFiles) {
  if (f.path.endsWith('.js')) js = f.text;
  if (f.path.endsWith('.css')) css = f.text;
}
js = js.replace(/<\/script/gi, '<\\/script');

const fonts = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=DM+Mono:wght@400;500&family=Nunito+Sans:ital,opsz,wght@0,6..12,400;0,6..12,600;0,6..12,700;0,6..12,800;1,6..12,400;1,6..12,700&display=swap';

let html;
if (mode === 'artifact') {
  html = `<title>MYSTERIA</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${fonts}">
<style>${css}</style>
<div id="root"></div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.production.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.production.min.js"></script>
<script>${js}</script>
`;
  fs.writeFileSync(path.join(root, 'dist/mysteria-artifact.html'), html);
} else {
  html = `<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><title>MYSTERIA</title>
<link rel="stylesheet" href="${fonts}">
<style>${css}</style></head><body><div id="root"></div><script>${js}</script></body></html>`;
  fs.writeFileSync(path.join(root, 'dist/mysteria-test.html'), html);
}
console.log(mode, 'ok', (html.length / 1024).toFixed(1) + ' KB');
