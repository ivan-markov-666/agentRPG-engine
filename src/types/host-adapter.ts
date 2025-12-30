export interface HostAdapter {
  readFile(path: string): Promise<string>;
  writeFile(path: string, content: string): Promise<void>;
  listFiles(path: string): Promise<string[]>;
  log(level: 'debug' | 'info' | 'warn' | 'error', message: string, data?: unknown): Promise<void>;
}
