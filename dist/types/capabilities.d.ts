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
export interface CapabilitiesConfig {
    version: string;
    updatedAt: string;
    toggles: CapabilityToggle[];
    thresholds: CapabilityThreshold[];
    metadata?: Record<string, unknown>;
}
//# sourceMappingURL=capabilities.d.ts.map