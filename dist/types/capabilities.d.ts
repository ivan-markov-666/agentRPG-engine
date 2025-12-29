export interface CapabilityToggle {
    id: string;
    label: string;
    defaultEnabled: boolean;
    description?: string;
}
export interface CapabilityThreshold {
    code: string;
    warn: number;
    error: number;
}
export interface CapabilityRangeBase {
    enabled?: boolean;
    desc?: string;
    min?: number;
    max?: number;
    range?: [number, number];
    note?: string;
    [key: string]: unknown;
}
export interface StatCapabilityRange extends CapabilityRangeBase {
    min: number;
    max: number;
}
export interface ReputationCapabilityRange extends CapabilityRangeBase {
    range: [-100, 100];
}
export interface CurrencyCapabilityRange extends CapabilityRangeBase {
    min: number;
    max?: number;
}
export type CapabilityRange = CapabilityRangeBase | StatCapabilityRange | ReputationCapabilityRange | CurrencyCapabilityRange;
export type CapabilityRanges = Record<string, CapabilityRange>;
export interface CapabilitiesConfig {
    version: string;
    updatedAt: string;
    toggles: CapabilityToggle[];
    thresholds: CapabilityThreshold[];
    ranges?: CapabilityRanges;
    metadata?: Record<string, unknown>;
}
//# sourceMappingURL=capabilities.d.ts.map