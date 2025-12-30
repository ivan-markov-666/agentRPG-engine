import type { Issue } from './types';
export interface ValidatorContext {
    base: string;
    loadJson: (filePath: string) => unknown;
    issues: Issue[];
}
export type BasicContext = Pick<ValidatorContext, 'base' | 'issues'> & Partial<Pick<ValidatorContext, 'loadJson'>>;
//# sourceMappingURL=context.d.ts.map