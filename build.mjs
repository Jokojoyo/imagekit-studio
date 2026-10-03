import { build } from 'vite';
import { readdir, copyFile } from 'node:fs/promises';
await build();
for (const file of await readdir('dist')) await copyFile('dist/' + file, file === 'dev.html' ? 'index.html' : file);
for (const file of ['.nojekyll', 'pear-study.jpg', 'pear-study.jpg.json', 'layers-poster.webp', 'layers-poster.webp.json']) await copyFile(file, 'dist/' + file);
console.log('ImageKit production files are ready.');
