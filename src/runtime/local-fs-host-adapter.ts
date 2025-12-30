import fs from 'fs';
import path from 'path';

import type { HostAdapter } from '../types/host-adapter';

export class LocalFsHostAdapter implements HostAdapter {
  private readonly rootDir: string;

  constructor(rootDir: string) {
    this.rootDir = path.resolve(rootDir);
  }

  private resolveSafe(relPath: string): string {
    const resolved = path.resolve(this.rootDir, relPath);
    const rootWithSep = this.rootDir.endsWith(path.sep) ? this.rootDir : `${this.rootDir}${path.sep}`;
    if (resolved !== this.rootDir && !resolved.startsWith(rootWithSep)) {
      throw new Error(`Path escapes rootDir: ${relPath}`);
    }
    return resolved;
  }

  async readFile(filePath: string): Promise<string> {
    const abs = this.resolveSafe(filePath);
    return fs.promises.readFile(abs, 'utf8');
  }

  async writeFile(filePath: string, content: string): Promise<void> {
    const abs = this.resolveSafe(filePath);
    await fs.promises.mkdir(path.dirname(abs), { recursive: true });
    await fs.promises.writeFile(abs, content, 'utf8');
  }

  async listFiles(dirPath: string): Promise<string[]> {
    const abs = this.resolveSafe(dirPath);
    const entries = await fs.promises.readdir(abs, { withFileTypes: true });
    return entries.filter((e) => e.isFile()).map((e) => e.name);
  }

  async log(level: 'debug' | 'info' | 'warn' | 'error', message: string, data?: unknown): Promise<void> {
    const payload = data === undefined ? '' : ` ${JSON.stringify(data)}`;
    if (level === 'error') console.error(`[${level}] ${message}${payload}`);
    else if (level === 'warn') console.warn(`[${level}] ${message}${payload}`);
    else console.log(`[${level}] ${message}${payload}`);
  }
}
