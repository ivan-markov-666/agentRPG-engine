import type { Issue } from '../types';
export declare function add(issues: Issue[] | undefined, level: Issue['level'], code: string, file?: string, message?: string, fix?: string): void;
export declare function loadData(filePath: string, issues?: Issue[]): unknown;
//# sourceMappingURL=io.d.ts.map