import fs from 'fs';
import path from 'path';

import type { Issue } from '../types';

function pushIssue(
  issues: Issue[] | undefined,
  partial: Pick<Issue, 'code' | 'level'> & Partial<Issue>,
) {
  if (!issues) return;
  issues.push({
    code: partial.code,
    level: partial.level,
    file: partial.file,
    message: partial.message,
    fix: partial.fix,
  });
}

export function add(
  issues: Issue[] | undefined,
  level: Issue['level'],
  code: string,
  file?: string,
  message?: string,
  fix?: string,
): void {
  pushIssue(issues, { level, code, file, message, fix });
}

export function loadData(filePath: string, issues?: Issue[]): unknown {
  const ext = path.extname(filePath).toLowerCase();
  let raw: string;

  try {
    raw = fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    const err = error as Error & { code?: string };
    add(
      issues,
      'ERROR',
      'FILE-READ',
      filePath,
      'Cannot read file',
      err.message || err.code,
    );
    return null;
  }

  if (ext === '.yaml' || ext === '.yml') {
    try {
      // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
      const yaml = require('yaml') as typeof import('yaml');
      return yaml.parse(raw);
    } catch (error) {
      const err = error as Error & { code?: string };
      if (err && err.message && err.message.includes('MODULE_NOT_FOUND')) {
        add(
          issues,
          'WARN',
          'YAML-NOT-AVAILABLE',
          filePath,
          'YAML parser not installed; skipping YAML parse',
          'Install yaml npm package or convert file to JSON',
        );
      } else {
        add(issues, 'ERROR', 'YAML-PARSE', filePath, 'Invalid YAML', err.message);
      }
      return null;
    }
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    const err = error as Error;
    add(issues, 'ERROR', 'JSON-PARSE', filePath, 'Invalid JSON', err.message);
    return null;
  }
}
