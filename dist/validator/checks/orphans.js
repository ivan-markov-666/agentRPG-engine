"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkOrphans = checkOrphans;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const io_1 = require("../utils/io");
async function checkOrphans(ctx) {
    const { base, issues } = ctx;
    const statePath = path_1.default.join(base, 'player-data/runtime/state.json');
    if (!fs_1.default.existsSync(statePath))
        return;
    const state = (0, io_1.loadData)(statePath, issues);
    if (!state)
        return;
    const active = state.active_quests || [];
    active.forEach((quest) => {
        if (!quest?.quest_id)
            return;
        const questFile = path_1.default.join(base, 'scenario/quests', `${quest.quest_id}.md`);
        if (!fs_1.default.existsSync(questFile)) {
            (0, io_1.add)(issues, 'ERROR', 'QUEST-ORPHAN', `scenario/quests/${quest.quest_id}.md`, 'Active quest file missing', 'Create quest file or remove from active list');
        }
    });
    if (state.current_area_id) {
        const areaFile = path_1.default.join(base, 'scenario/areas', `${state.current_area_id}.md`);
        if (!fs_1.default.existsSync(areaFile)) {
            (0, io_1.add)(issues, 'ERROR', 'AREA-ORPHAN', `scenario/areas/${state.current_area_id}.md`, 'Current area file missing', 'Create area file or change current_area_id');
        }
    }
}
exports.default = checkOrphans;
//# sourceMappingURL=orphans.js.map