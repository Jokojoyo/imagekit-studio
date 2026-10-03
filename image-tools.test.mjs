import test from 'node:test';
import assert from 'node:assert/strict';
import { cropRect, dimensionsError, downloadName, fileType, fitImagePlane } from './image-tools.js';
test('3D planes fit their bounds without stretching square, landscape or portrait images', () => {
  for (const [w, h] of [[1086,1448], [1200,1200], [1920,1080], [4000,300], [120,4000]]) {
    const fitted = fitImagePlane(w, h, 5.3, 6.65);
    assert.ok(fitted.width <= 5.3 && fitted.height <= 6.65);
    assert.ok(Math.abs(fitted.width / fitted.height - w / h) < 1e-10);
  }
});
test('crop geometry stays inside both portrait and landscape sources at every supported ratio', () => {
  for (const [w, h] of [[1086, 1448], [4000, 1000], [80, 4000]]) for (const a of [1, .8, 16 / 9, 9 / 16]) for (const z of [1, 1.65, 4]) for (const p of [0, 50, 100]) {
    const c = cropRect(w, h, a, z, p, 100 - p);
    assert.ok(c.x >= 0 && c.y >= 0);
    assert.ok(c.x + c.width <= w + .00001 && c.y + c.height <= h + .00001);
    assert.ok(Math.abs(c.width / c.height - a) < .00001);
  }
});
test('crop pan endpoints and original frame have exact meaning', () => {
  assert.deepEqual(cropRect(800, 600, 4 / 3), {
    x: 0,
    y: 0,
    width: 800,
    height: 600
  });
  assert.deepEqual(cropRect(800, 600, 1, 2, 100, 0), {
    x: 500,
    y: 0,
    width: 300,
    height: 300
  });
  assert.throws(() => cropRect(0, 600, 1));
});
test('export dimensions reject invalid, excessive and fractional canvases', () => {
  for (const [w, h] of [['', 2], [-1, 2], [1.5, 4], [Infinity, 1], [4097, 100], [4096, 4096]]) assert.ok(dimensionsError(w, h));
  assert.equal(dimensionsError(4000, 4000), '');
  assert.equal(dimensionsError(1, 1), '');
});
test('download extension follows actual format and names cannot contain path separators', () => {
  assert.equal(downloadName('portrait.jpg', 'webp'), 'portrait.webp');
  assert.equal(downloadName('../my:image.png', 'png'), '..-my-image.png');
  assert.equal(downloadName('', 'jpeg'), 'image.jpg');
  assert.throws(() => downloadName('test', 'pdf'));
});
test('signature validation rejects disguised files and recognizes supported formats', () => {
  assert.equal(fileType(new Uint8Array([255, 216, 255, 0])), 'jpeg');
  assert.equal(fileType(new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])), 'png');
  assert.equal(fileType(new TextEncoder().encode('RIFF1234WEBP')), 'webp');
  assert.equal(fileType(new TextEncoder().encode('<svg></svg>')), null);
});
