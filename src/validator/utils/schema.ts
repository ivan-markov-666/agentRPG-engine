import fs from 'fs';
import path from 'path';

import Ajv from 'ajv';
import addFormats from 'ajv-formats';

import { add, loadData } from './io';
import type { Issue } from '../types';

const ajvInstance = new Ajv({ allErrors: true, strict: false });
addFormats(ajvInstance);

export interface SchemaOptions {
  level?: Issue['level'];
}

export function validateFileWithSchema(
  base: string,
  relFile: string,
  schemaPath: string,
  codePrefix: string,
  issues: Issue[],
  options: SchemaOptions = {},
): void {
  const { level = 'WARN' } = options;
  const filePath = path.join(base, relFile);
  if (!fs.existsSync(filePath)) return;

  const data = loadData(filePath, issues);
  if (!data) return;

  const schema = loadData(schemaPath, issues);
  if (!schema) return;

  const validate = ajvInstance.compile(schema);
  const ok = validate(data);
  if (!ok && Array.isArray(validate.errors)) {
    validate.errors.forEach((err) => {
      const msg = `${err.instancePath || '/'} ${err.message || ''}`.trim();
      add(issues, level, `${codePrefix}-SCHEMA`, relFile, msg, 'Adjust to schema');
    });
  }
}
