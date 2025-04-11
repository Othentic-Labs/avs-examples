import { ValidationConfig } from "./validation-config";

export class ValidationConfigService {
    get config(): ValidationConfig {
        return {
            service: {
                port: parseInt(process.env.PORT ?? "4002"),
            },
            oracle: {
                baseURL: process.env.ORACLE_BASE_URL ?? `https://api.binance.com/api/v3/`,
            },
            ipfs: {
                host: process.env.IPFS_HOST ?? "",
            },
            validation: {
                allowedPriceDeviation: parseFloat(process.env.ALLOWED_PRICE_DEVIATION ?? "0.05"), // 5%
            },
        };
    }
}

export const configService = new ValidationConfigService();
