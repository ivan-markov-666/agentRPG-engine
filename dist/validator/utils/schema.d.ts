import type { Issue } from '../types';
export interface SchemaOptions {
    level?: Issue['level'];
}
export declare function validateFileWithSchema(base: string, relFile: string, schemaPath: string, codePrefix: string, issues: Issue[], options?: SchemaOptions): void;
//# sourceMappingURL=schema.d.ts.map