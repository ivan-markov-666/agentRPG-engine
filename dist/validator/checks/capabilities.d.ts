import type { Issue } from '../types';
interface CheckContext {
    base: string;
    issues: Issue[];
}
export declare function checkCapabilities(ctx: CheckContext): Promise<void>;
export default checkCapabilities;
//# sourceMappingURL=capabilities.d.ts.map