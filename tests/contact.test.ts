import { describe, it, expect } from 'vitest';
import { contactSchema } from '../src/pages/api/contact-schema';

describe('contactSchema', () => {
  it('accepts a valid payload', () => {
    const payload = {
      name: 'Jane',
      email: 'jane@example.com',
      message: 'Hello',
      turnstileToken: 'abc',
    };
    expect(() => contactSchema.parse(payload)).not.toThrow();
  });

  it('rejects missing email', () => {
    const payload = { name: 'Jane', message: 'Hi', turnstileToken: 'abc' };
    expect(() => contactSchema.parse(payload)).toThrow();
  });

  it('rejects invalid email', () => {
    const payload = {
      name: 'Jane',
      email: 'not-an-email',
      message: 'Hi',
      turnstileToken: 'abc',
    };
    expect(() => contactSchema.parse(payload)).toThrow();
  });

  it('rejects empty message', () => {
    const payload = { name: 'Jane', email: 'jane@example.com', message: '', turnstileToken: 'abc' };
    expect(() => contactSchema.parse(payload)).toThrow();
  });
});
