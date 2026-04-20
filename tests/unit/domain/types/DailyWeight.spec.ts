import { describe, it, expect } from 'vitest';
import { DailyWeightSchema } from '@/domain/types/DailyWeight';

describe('DailyWeightSchema', () => {
  it('should accept a valid weight entry with notes', () => {
    const valid = {
      date: new Date('2026-04-19'),
      weight: 80.5,
      notes: 'After breakfast',
    };
    expect(() => DailyWeightSchema.parse(valid)).not.toThrow();
  });

  it('should accept a valid weight entry without notes', () => {
    const noNotes = {
      date: new Date('2026-04-19'),
      weight: 80.5,
    };
    expect(() => DailyWeightSchema.parse(noNotes)).not.toThrow();
  });

  it('should accept today date', () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    expect(() => DailyWeightSchema.parse({ date: today, weight: 80.5 })).not.toThrow();
  });

  it('should reject future dates', () => {
    const future = {
      date: new Date('2099-01-01'),
      weight: 80.5,
    };
    expect(() => DailyWeightSchema.parse(future)).toThrow();
  });

  it('should reject weight of 0', () => {
    expect(() =>
      DailyWeightSchema.parse({ date: new Date('2026-04-19'), weight: 0 })
    ).toThrow();
  });

  it('should reject weight below 0.1', () => {
    expect(() =>
      DailyWeightSchema.parse({ date: new Date('2026-04-19'), weight: 0.09 })
    ).toThrow();
  });

  it('should accept minimum valid weight (0.1)', () => {
    expect(() =>
      DailyWeightSchema.parse({ date: new Date('2026-04-19'), weight: 0.1 })
    ).not.toThrow();
  });

  it('should reject weight above 500', () => {
    expect(() =>
      DailyWeightSchema.parse({ date: new Date('2026-04-19'), weight: 500.1 })
    ).toThrow();
  });

  it('should accept maximum valid weight (500)', () => {
    expect(() =>
      DailyWeightSchema.parse({ date: new Date('2026-04-19'), weight: 500 })
    ).not.toThrow();
  });

  it('should make notes optional (undefined is fine)', () => {
    const result = DailyWeightSchema.parse({
      date: new Date('2026-04-19'),
      weight: 75.3,
    });
    expect(result.notes).toBeUndefined();
  });

  it('should infer the correct TypeScript shape', () => {
    const result = DailyWeightSchema.parse({
      date: new Date('2026-04-19'),
      weight: 80.5,
      notes: 'test',
    });
    expect(result).toMatchObject({
      date: expect.any(Date),
      weight: 80.5,
      notes: 'test',
    });
  });
});
