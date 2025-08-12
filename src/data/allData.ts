import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

interface LoginData {
    baseUrl: {
        development_url: string;
        localhost_url: string;
        staging_url: string;
    };
}

export const AllData: LoginData = {
    baseUrl: {
        development_url: process.env.DEV_URL?.trim() || '',
        staging_url: process.env.STAGING_URL?.trim() || '',
        localhost_url: process.env.LOCAL_URL?.trim() || '',
    },
};