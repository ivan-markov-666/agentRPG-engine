"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateFileWithSchema = validateFileWithSchema;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const ajv_1 = __importDefault(require("ajv"));
const ajv_formats_1 = __importDefault(require("ajv-formats"));
const io_1 = require("./io");
const ajvInstance = new ajv_1.default({ allErrors: true, strict: false });
(0, ajv_formats_1.default)(ajvInstance);
function validateFileWithSchema(base, relFile, schemaPath, codePrefix, issues, options = {}) {
    const { level = 'WARN' } = options;
    const filePath = path_1.default.join(base, relFile);
    if (!fs_1.default.existsSync(filePath))
        return;
    const data = (0, io_1.loadData)(filePath, issues);
    if (!data)
        return;
    const schema = (0, io_1.loadData)(schemaPath, issues);
    if (!schema)
        return;
    const validate = ajvInstance.compile(schema);
    const ok = validate(data);
    if (!ok && Array.isArray(validate.errors)) {
        validate.errors.forEach((err) => {
            const msg = `${err.instancePath || '/'} ${err.message || ''}`.trim();
            (0, io_1.add)(issues, level, `${codePrefix}-SCHEMA`, relFile, msg, 'Adjust to schema');
        });
    }
}
//# sourceMappingURL=schema.js.map