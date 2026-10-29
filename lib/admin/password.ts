// lib/admin/password.ts
// Password rules for staff accounts set by an admin. Shared by the admin UI and APIs.
import { z } from 'zod';

export const staffPasswordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(72, 'Password must be at most 72 characters')
  .regex(/[a-z]/, 'Password needs a lowercase letter')
  .regex(/[A-Z]/, 'Password needs an uppercase letter')
  .regex(/[0-9]/, 'Password needs a number');

/** First rule the password breaks, or null when it is acceptable. */
export function passwordProblem(password: string): string | null {
  const result = staffPasswordSchema.safeParse(password);
  return result.success ? null : result.error.issues[0].message;
}

const LOWER = 'abcdefghijkmnpqrstuvwxyz';
const UPPER = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
const DIGITS = '23456789';
const SYMBOLS = '!@#$%*?';

/** 14-character password with every character class, without look-alike characters. */
export function generatePassword(length = 14): string {
  const all = LOWER + UPPER + DIGITS + SYMBOLS;
  const random = new Uint32Array(length + 4);
  crypto.getRandomValues(random);
  const pick = (set: string, i: number) => set[random[i] % set.length];

  const chars = [pick(LOWER, 0), pick(UPPER, 1), pick(DIGITS, 2), pick(SYMBOLS, 3)];
  for (let i = 4; i < length; i++) chars.push(pick(all, i));

  // Fisher–Yates so the guaranteed classes are not always first
  for (let i = chars.length - 1; i > 0; i--) {
    const j = random[length + (i % 4)] % (i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join('');
}
