import { describe, expect, it } from 'vitest';
import { PesoPipe } from './peso.pipe';

describe('PesoPipe', () => {
  const pipe = new PesoPipe();

  it('prefixes the peso sign', () => {
    expect(pipe.transform(190)).toBe('\u20b1190');
  });

  it('groups thousands', () => {
    expect(pipe.transform(1250)).toBe('\u20b11,250');
  });

  it('renders zero rather than falling back', () => {
    expect(pipe.transform(0)).toBe('\u20b10');
  });

  it('never shows centavos', () => {
    expect(pipe.transform(190.4)).toBe('\u20b1190');
    expect(pipe.transform(190.6)).toBe('\u20b1191');
  });

  it('degrades gracefully on missing or invalid input', () => {
    expect(pipe.transform(null)).toBe('—');
    expect(pipe.transform(undefined)).toBe('—');
    expect(pipe.transform(Number.NaN)).toBe('—');
    expect(pipe.transform(Number.POSITIVE_INFINITY)).toBe('—');
  });
});
