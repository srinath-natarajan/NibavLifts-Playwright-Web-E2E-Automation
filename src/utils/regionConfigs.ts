export type RegionKey = 'IN' | 'US' | 'CA_EN' | 'CA_FR';

export type RegionConfig = {
    region: string;
    country: string;
    language: string;
};

export const regionConfigs: Record<RegionKey, RegionConfig> = {
    IN: { region: 'Asia Pacific', country: 'India', language: 'English' },
    US: { region: 'North America', country: 'USA', language: 'English' },
    CA_EN: { region: 'North America', country: 'Canada', language: 'English' },
    CA_FR: { region: 'North America', country: 'Canada', language: 'Français' }
};

export function getCurrentRegionConfig(): { regionKey: RegionKey; config: RegionConfig } {
    const regionKey = (process.env.REGION_KEY || 'IN') as RegionKey;
    const config = regionConfigs[regionKey];

    if (!config) {
        throw new Error(`Invalid REGION_KEY: "${regionKey}". Must be one of: ${Object.keys(regionConfigs).join(', ')}`);
    }

    return { regionKey, config };
}

export function isNonIndian(): boolean {
    const regionKey = (process.env.REGION_KEY || '').toUpperCase();
    return ['US', 'CA_EN', 'CA_FR'].includes(regionKey);
}
