import { isNonIndian } from '../utils/regionConfigs';
export const supportedProducts = ['Series III', 'Series III Max', 'Series IV', 'Series IV Max', 'Series V', 'Series V Max'];

let cachedProduct: string | null = null;

function getFilteredProducts(): string[] {
    const nonIndian = isNonIndian(); 
    return nonIndian ? supportedProducts.filter((p) => !p.includes('Series V')) : supportedProducts;
}

export function getCurrentProduct(): string {
    if (cachedProduct) return cachedProduct;

    const envProduct = process.env.PRODUCT_NAME?.trim();
    const validProducts = getFilteredProducts();

    cachedProduct =
        envProduct && validProducts.includes(envProduct) ? envProduct : validProducts[Math.floor(Math.random() * validProducts.length)];

    return cachedProduct;
}
