import type { Issue } from '../types';
interface CheckContext {
    base: string;
    issues: Issue[];
}
export declare function checkRequiredFiles(ctx: CheckContext): Promise<void>;
export default checkRequiredFiles;
//# sourceMappingURL=files.d.ts.map