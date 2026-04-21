import { useEffect, useState } from 'react';

interface Rule {
  id: string;
  rect: DOMRect;
}

export default function GridRulesToggle() {
  const [active, setActive] = useState(false);
  const [rules, setRules] = useState<Rule[]>([]);

  useEffect(() => {
    if (!active) {
      setRules([]);
      return;
    }

    const computeRules = () => {
      const els = document.querySelectorAll<HTMLElement>('[data-rules]');
      setRules(
        Array.from(els).map((el, i) => ({
          id: `rule-${i}`,
          rect: el.getBoundingClientRect(),
        }))
      );
    };

    computeRules();
    window.addEventListener('resize', computeRules);
    window.addEventListener('scroll', computeRules, { passive: true });

    return () => {
      window.removeEventListener('resize', computeRules);
      window.removeEventListener('scroll', computeRules);
    };
  }, [active]);

  useEffect(() => {
    const btn = document.getElementById('grid-rules-toggle');
    if (!btn) return;
    const onClick = () => setActive((v) => !v);
    btn.addEventListener('click', onClick);
    return () => btn.removeEventListener('click', onClick);
  }, []);

  if (!active) return null;

  const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;

  return (
    <div className="grid-rules-overlay" aria-hidden="true">
      {rules.map((rule) => {
        const { top, left, width, height } = rule.rect;
        return (
          <div
            key={rule.id}
            className="grid-rule-box"
            style={{
              position: 'absolute',
              top: top + scrollY,
              left,
              width,
              height,
            }}
          >
            <span className="grid-rule-label">
              {Math.round(width)}×{Math.round(height)}
            </span>
          </div>
        );
      })}
      <style>{`
        .grid-rules-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 100;
        }
        .grid-rule-box {
          border: 1px solid var(--color-cream-faint);
          outline: 1px solid rgba(245, 230, 200, 0.05);
          transition: opacity 0.3s ease-out;
        }
        .grid-rule-label {
          position: absolute;
          top: -18px;
          left: 0;
          font-family: var(--font-mono);
          font-size: 9px;
          color: var(--color-cream-dim);
          letter-spacing: 0.05em;
          background: var(--color-navy);
          padding: 1px 4px;
          border: 1px solid var(--color-cream-faint);
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
}
