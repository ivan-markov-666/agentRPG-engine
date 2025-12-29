export type UnlockPolicy = 'always' | 'faction:trusted' | 'faction:ally' | 'capability:unlocked' | string;
export interface UnlockTrigger {
    questId: string;
    policy: UnlockPolicy;
    requires?: string[];
}
//# sourceMappingURL=unlock-triggers.d.ts.map