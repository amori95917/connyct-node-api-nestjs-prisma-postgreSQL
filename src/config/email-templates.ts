import { existsSync, mkdirSync } from 'fs';
const dir = 'dist/src/modules/email/templates/partials';

if (!existsSync(dir)) {
  mkdirSync(dir, { recursive: true });
}
