import fs from 'fs';
import path from 'path';
import { getCurrentProduct } from './productHelper';

const productName = getCurrentProduct();
const regionKey = process.env.REGION_KEY || 'IN';

const logDir = path.resolve(__dirname, '../../test-results/logs');

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

const logFileName = `${productName.replace(/\s+/g, '_')}_${regionKey}.log`;
const logFilePath = path.join(logDir, logFileName);

export const logger = {
    log: (message: string) => {
        const timestamp = new Date().toISOString();
        const fullMessage = `[${timestamp}] ${message}\n`;
        fs.appendFileSync(logFilePath, fullMessage, 'utf8');
    }
};