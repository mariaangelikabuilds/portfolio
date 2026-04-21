import { useEffect, useRef } from 'react';
import { calcGlyphWeight, type Point } from './hero-logic';

interface HeroProps {
  lines: Array<Array<string>>;
}

const WEIGHT_CONFIG = { min: 400, max: 800, radius: 240 };

export default function Hero({ lines }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const cursorRef = useRef<Point>({ x: -9999, y: -9999 });
  const glyphsRef = useRef<Array<{ el: HTMLSpanElement; center: Point }>>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const glyphEls = Array.from(container.querySelectorAll<HTMLSpanElement>('[data-glyph]'));
    const computeCenters = () => {
      glyphsRef.current = glyphEls.map((el) => {
        const rect = el.getBoundingClientRect();
        return {
          el,
          center: {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
          },
        };
      });
    };

    computeCenters();

    const onPointerMove = (e: PointerEvent) => {
      cursorRef.current = { x: e.clientX, y: e.clientY };
    };

    const onResize = () => {
      computeCenters();
    };

    const tick = () => {
      const cursor = cursorRef.current;
      for (const { el, center } of glyphsRef.current) {
        const weight = calcGlyphWeight(center, cursor, WEIGHT_CONFIG);
        el.style.fontVariationSettings = `"wght" ${weight}`;
        el.style.fontWeight = String(weight);
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onResize, { passive: true });
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div ref={containerRef} className="hero-mount">
      {lines.map((line, lineIdx) => (
        <span key={lineIdx} className="hero-line-mount">
          {line.map((token, tokenIdx) => {
            if (token === ' ') return <span key={tokenIdx}>&nbsp;</span>;
            return (
              <span key={tokenIdx} className="hero-word">
                {Array.from(token).map((char, charIdx) => (
                  <span key={charIdx} data-glyph>
                    {char}
                  </span>
                ))}
              </span>
            );
          })}
        </span>
      ))}
    </div>
  );
}
