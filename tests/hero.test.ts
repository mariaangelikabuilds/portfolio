import { describe, it, expect } from 'vitest';
import { calcGlyphWeight } from '../src/components/hero-logic';

describe('calcGlyphWeight', () => {
  it('returns max weight when cursor is exactly on glyph', () => {
    const glyphCenter = { x: 100, y: 100 };
    const cursor = { x: 100, y: 100 };
    const result = calcGlyphWeight(glyphCenter, cursor, { min: 400, max: 800, radius: 200 });
    expect(result).toBe(800);
  });

  it('returns min weight when cursor is beyond radius', () => {
    const glyphCenter = { x: 100, y: 100 };
    const cursor = { x: 500, y: 500 };
    const result = calcGlyphWeight(glyphCenter, cursor, { min: 400, max: 800, radius: 200 });
    expect(result).toBe(400);
  });

  it('returns linearly interpolated weight at half radius', () => {
    const glyphCenter = { x: 100, y: 100 };
    const cursor = { x: 200, y: 100 };
    const result = calcGlyphWeight(glyphCenter, cursor, { min: 400, max: 800, radius: 200 });
    expect(result).toBe(600);
  });
});
