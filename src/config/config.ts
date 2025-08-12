import { AllData } from '../data/allData';

export const config = {
    baseUrl: {
        development_url: AllData.baseUrl.development_url,
        localhost_url: AllData.baseUrl.localhost_url,
        staging_url: AllData.baseUrl.staging_url,

        default_url: AllData.baseUrl.development_url
    }
};