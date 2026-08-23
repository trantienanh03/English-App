import assert from 'node:assert/strict';
import test from 'node:test';
import { getContainedBoxLayout, sortBoxesForHitTesting } from '../src/components/scanner/bounding-box-math';

test('centers and scales a very wide image with contain semantics', () => {
  const layout = getContainedBoxLayout(300, 300, 2000, 500, { x1: 0, y1: 0, x2: 2000, y2: 500 });
  assert.deepEqual(layout, { left: 0, top: 112.5, width: 300, height: 75 });
});

test('centers and scales a very tall image with contain semantics', () => {
  const layout = getContainedBoxLayout(300, 300, 500, 2000, { x1: 0, y1: 0, x2: 500, y2: 2000 });
  assert.deepEqual(layout, { left: 112.5, top: 0, width: 75, height: 300 });
});

test('clamps unusual detector coordinates to the source image', () => {
  const layout = getContainedBoxLayout(200, 100, 200, 100, { x1: -20, y1: -10, x2: 300, y2: 150 });
  assert.deepEqual(layout, { left: 0, top: 0, width: 200, height: 100 });
});

test('orders overlapping boxes deterministically with the smallest rendered last', () => {
  const ordered = sortBoxesForHitTesting([
    { id: 'small', confidence: 0.9, box: { x1: 20, y1: 20, x2: 40, y2: 40 } },
    { id: 'large', confidence: 0.8, box: { x1: 0, y1: 0, x2: 100, y2: 100 } },
  ]);
  assert.deepEqual(ordered.map(item => item.id), ['large', 'small']);
});
