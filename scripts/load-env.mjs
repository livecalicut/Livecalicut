import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';

/**
 * Load .env then .env.local (local wins). Safe for Node scripts.
 */
export function loadEnv() {
  const root = process.cwd();
  for (const file of ['.env', '.env.local']) {
    const full = path.join(root, file);
    if (fs.existsSync(full)) {
      dotenv.config({ path: full, override: file === '.env.local' });
    }
  }
}
