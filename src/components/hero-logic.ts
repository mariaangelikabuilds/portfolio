export interface Point {
  x: number;
  y: number;
}

export interface WeightConfig {
  min: number;
  max: number;
  radius: number;
}

export function calcGlyphWeight(
  glyphCenter: Point,
  cursor: Point,
  config: WeightConfig
): number {
  const dx = cursor.x - glyphCenter.x;
  const dy = cursor.y - glyphCenter.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance >= config.radius) return config.min;

  const proximity = 1 - distance / config.radius;
  return Math.round(config.min + (config.max - config.min) * proximity);
}
