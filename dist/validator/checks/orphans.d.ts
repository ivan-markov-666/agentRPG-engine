import type { Issue } from '../types';
interface CheckContext {
    base: string;
    issues: Issue[];
}
export declare function checkOrphans(ctx: CheckContext): Promise<void>;
export default checkOrphans;
//# sourceMappingURL=orphans.d.ts.map