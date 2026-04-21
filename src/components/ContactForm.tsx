import { useEffect, useRef, useState, type FormEvent } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement | string,
        opts: { sitekey: string; theme?: 'light' | 'dark' | 'auto'; callback?: (token: string) => void }
      ) => string;
      reset: (widgetId?: string) => void;
    };
  }
}

type Status = 'idle' | 'submitting' | 'success' | 'error';

interface Props {
  siteKey: string;
}

export default function ContactForm({ siteKey }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const tokenRef = useRef<string>('');
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string>('');

  useEffect(() => {
    if (!siteKey) return;

    const renderWidget = () => {
      if (!widgetRef.current || !window.turnstile) return;
      widgetIdRef.current = window.turnstile.render(widgetRef.current, {
        sitekey: siteKey,
        theme: 'dark',
        callback: (token: string) => {
          tokenRef.current = token;
        },
      });
    };

    if (window.turnstile) {
      renderWidget();
      return;
    }

    const interval = setInterval(() => {
      if (window.turnstile) {
        renderWidget();
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [siteKey]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    if (!tokenRef.current) {
      setStatus('error');
      setErrorMsg('Please complete the verification.');
      return;
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, turnstileToken: tokenRef.current }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? `Request failed with ${res.status}`);
      }

      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.');
      if (window.turnstile && widgetIdRef.current) {
        window.turnstile.reset(widgetIdRef.current);
      }
    }
  };

  if (status === 'success') {
    return <p className="contact-success">Sent. You'll get a reply within a day.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <label>
        <span>Name</span>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </label>
      <label>
        <span>Email</span>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>
      <label>
        <span>Message</span>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} required rows={5} />
      </label>

      <div ref={widgetRef} className="turnstile-mount"></div>

      {errorMsg && <p className="contact-error">{errorMsg}</p>}

      <button type="submit" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Sending…' : 'Send'}
      </button>

      <style>{`
        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .contact-form label {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .contact-form label span {
          font-family: var(--font-body);
          font-size: 12px;
          color: var(--color-cream-dim);
        }
        .contact-form input,
        .contact-form textarea {
          background: transparent;
          border: 1px solid var(--color-cream-faint);
          color: var(--color-cream);
          font-family: var(--font-body);
          font-size: 14px;
          padding: 10px 12px;
          border-radius: 2px;
        }
        .contact-form input:focus,
        .contact-form textarea:focus {
          outline: none;
          border-color: var(--color-cream);
        }
        .contact-form button {
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 600;
          color: var(--color-cream);
          background: transparent;
          border: 1px solid var(--color-cream);
          padding: 12px 20px;
          cursor: pointer;
          width: fit-content;
        }
        .contact-form button:disabled {
          opacity: 0.5;
        }
        .contact-error {
          color: #ff8888;
          font-size: 13px;
        }
        .contact-success {
          font-family: var(--font-body);
          font-size: 15px;
          color: var(--color-cream);
        }
        .turnstile-mount {
          min-height: 65px;
        }
      `}</style>
    </form>
  );
}
