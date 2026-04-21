import { useState } from 'react';

export default function HeroCopyToggle() {
  const [shipped, setShipped] = useState(true);

  return (
    <div className="hero-toggle-demo">
      <div className="hero-toggle-preview">
        {shipped ? (
          <div className="preview-shipped">
            <p>Design Engineer.</p>
            <p>The site you're reading is the portfolio.</p>
          </div>
        ) : (
          <div className="preview-rejected">
            <p>I design it.</p>
            <p>I build it.</p>
            <p>I ship it.</p>
          </div>
        )}
      </div>
      <div className="hero-toggle-controls">
        <button
          onClick={() => setShipped(false)}
          className={!shipped ? 'active' : ''}
          aria-pressed={!shipped}
        >
          Rejected draft
        </button>
        <button
          onClick={() => setShipped(true)}
          className={shipped ? 'active' : ''}
          aria-pressed={shipped}
        >
          Shipped version
        </button>
      </div>
      <style>{`
        .hero-toggle-demo {
          border: 1px solid var(--color-cream-faint);
          border-radius: 4px;
          padding: 32px 28px;
          background: rgba(245, 230, 200, 0.03);
        }
        .hero-toggle-preview {
          min-height: 140px;
          margin-bottom: 20px;
          transition: opacity 0.35s ease-out;
        }
        .preview-shipped p,
        .preview-rejected p {
          font-family: var(--font-display);
          font-size: 26px;
          line-height: 1.1;
          letter-spacing: -0.02em;
          color: var(--color-cream);
        }
        .preview-rejected p {
          text-decoration: line-through;
          color: var(--color-cream-dim);
        }
        .hero-toggle-controls {
          display: flex;
          gap: 8px;
        }
        .hero-toggle-controls button {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--color-cream-dim);
          background: transparent;
          border: 1px solid var(--color-cream-faint);
          padding: 8px 14px;
          cursor: pointer;
          transition: color 0.15s, border-color 0.15s;
        }
        .hero-toggle-controls button.active {
          color: var(--color-cream);
          border-color: var(--color-cream);
        }
      `}</style>
    </div>
  );
}
