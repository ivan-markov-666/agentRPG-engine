export interface StatusEffectInstance {
    stack?: number;
    [key: string]: unknown;
}
export type StatusEffects = Record<string, StatusEffectInstance>;
export type ReputationMap = Record<string, number>;
export interface CurrencyBucket {
    amount: number;
    [key: string]: unknown;
}
export type CurrencyMap = Record<string, number | CurrencyBucket>;
export interface GenericStatTree {
    [key: string]: number | GenericStatTree;
}
export interface RangeStat {
    value: number;
    min?: number;
    max?: number;
}
export interface CoreStats {
    health?: number;
    energy?: number;
    mana?: number;
    stamina?: number;
    hunger?: number;
    thirst?: number;
    morale?: number;
    reputation?: ReputationMap;
    currency?: CurrencyMap;
    status_effects?: StatusEffects;
    date_time?: string;
    [key: string]: number | string | ReputationMap | CurrencyMap | StatusEffects | GenericStatTree | undefined;
}
export interface QuestFlagMap {
    [key: string]: boolean | number | string | undefined;
}
export interface ActiveQuestState {
    quest_id: string;
    status?: string;
    progress?: number;
    current_step_id?: string;
    flags?: QuestFlagMap;
    [key: string]: unknown;
}
export interface InventorySlots {
    used: number;
    max: number;
}
export interface InventoryItem {
    item_id: string;
    title?: string;
    qty: number;
    meta?: Record<string, unknown>;
    [key: string]: unknown;
}
export interface Inventory {
    id: string;
    name?: string;
    slots?: InventorySlots;
    items: InventoryItem[];
}
export type FlagMap = Record<string, boolean | number | string>;
export interface RuntimeState {
    current_area_id?: string;
    current_day?: number;
    current_hour?: number;
    active_quests?: ActiveQuestState[];
    stats?: CoreStats;
    flags?: FlagMap;
    inventories?: Inventory[];
    exploration_enabled?: boolean;
    exploration_log_preview?: string[];
    exploration?: {
        enabled?: boolean;
        [key: string]: unknown;
    };
    [key: string]: unknown;
}
//# sourceMappingURL=runtime-state.d.ts.map