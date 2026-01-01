import fs from 'fs';
import path from 'path';

import Ajv, { Options as AjvOptions } from 'ajv';
import addFormats from 'ajv-formats';

import { add, loadData } from './io';
import type { Issue } from '../types';

const ajvOptions: AjvOptions = {
  allErrors: true,
  strict: false,
};

const ajvInstance = new Ajv(ajvOptions);
addFormats(ajvInstance);

const loadedSchemaDirs = new Set<string>();

function preloadSchemaDir(schemaDir: string, issues: Issue[]) {
  if (loadedSchemaDirs.has(schemaDir)) return;

  let files: string[];
  try {
    files = fs.readdirSync(schemaDir);
  } catch {
    loadedSchemaDirs.add(schemaDir);
    return;
  }

  files
    .filter((f) => f.endsWith('.schema.json'))
    .forEach((fileName) => {
      const fullPath = path.join(schemaDir, fileName);
      const schema = loadData(fullPath, issues) as Record<string, unknown> | null;
      if (!schema || typeof schema !== 'object') return;

      const schemaId =
        typeof (schema as { $id?: unknown }).$id === 'string'
          ? ((schema as { $id: string }).$id)
          : null;

      try {
        ajvInstance.addSchema(schema, schemaId || fullPath);
      } catch (error) {
        if (error instanceof Error && error.message.includes('already exists')) {
          // ignore duplicates
        } else {
          throw error;
        }
      }
    });

  loadedSchemaDirs.add(schemaDir);
}

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

  const schema = loadData(schemaPath, issues) as Record<string, unknown> | null;
  if (!schema) return;

  preloadSchemaDir(path.dirname(schemaPath), issues);

  const schemaId =
    schema && typeof schema === 'object' && typeof (schema as { $id?: unknown }).$id === 'string'
      ? ((schema as { $id: string }).$id)
      : null;
  try {
    if (schemaId) {
      ajvInstance.removeSchema(schemaId);
    } else {
      ajvInstance.removeSchema(schemaPath);
    }
  } catch {
    // ignore if schema not previously added
  }

  const validate = ajvInstance.compile(schema);
  const ok = validate(data);
  if (!ok && Array.isArray(validate.errors)) {
    validate.errors.forEach((err) => {
      const msg = `${err.instancePath || '/'} ${err.message || ''}`.trim();
      add(issues, level, `${codePrefix}-SCHEMA`, relFile, msg, 'Adjust to schema');
    });
  }
}
