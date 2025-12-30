"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkSchemas = checkSchemas;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const schema_1 = require("../utils/schema");
function isExplorationEnabled(base, loadJson) {
    const statePath = path_1.default.join(base, 'player-data/runtime/state.json');
    if (!fs_1.default.existsSync(statePath))
        return false;
    try {
        const loader = typeof loadJson === 'function'
            ? loadJson
            : (filePath) => JSON.parse(fs_1.default.readFileSync(filePath, 'utf8'));
        const state = loader(statePath);
        if (!state || typeof state !== 'object')
            return false;
        return Boolean(state.exploration_enabled === true ||
            (state.exploration && state.exploration.enabled === true));
    }
    catch {
        return false;
    }
}
const repoSchemasDir = path_1.default.resolve(__dirname, '..', '..', '..', 'tools', 'validator', 'schemas');
async function checkSchemas(ctx) {
    const { base, issues, loadJson } = ctx;
    const schemasDir = repoSchemasDir;
    (0, schema_1.validateFileWithSchema)(base, 'config/capabilities.json', path_1.default.join(schemasDir, 'capabilities.schema.json'), 'CAP', issues);
    (0, schema_1.validateFileWithSchema)(base, 'player-data/runtime/state.json', path_1.default.join(schemasDir, 'state.schema.json'), 'STATE', issues);
    (0, schema_1.validateFileWithSchema)(base, 'player-data/runtime/exploration-log.json', path_1.default.join(schemasDir, 'exploration-log.schema.json'), 'EXPLORATION', issues, { level: isExplorationEnabled(base, loadJson) ? 'ERROR' : 'WARN' });
}
exports.default = checkSchemas;
//# sourceMappingURL=schema.js.map