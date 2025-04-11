import { HttpClient } from "../utils/http-client/http-client";
import { configService } from "../config/execution-config.service";

export interface PairMarketPriceResponse {
    symbol: string;
    price: string;
}

export class OracleService {
    private httpClient: HttpClient;

    constructor() {
        this.httpClient = new HttpClient({
            baseURL: configService.config.oracle.baseURL,
        });
    }

    async getPairMarketPrice(pair: string): Promise<number> {
        try {
            const response = await this.httpClient.get<PairMarketPriceResponse>({
                url: `ticker/price?symbol=${pair}`,
            });
            return Number(response.price);
        } catch (error) {
            console.error(`Error fetching market price for ${pair}:`, error);
            throw error;
        }
    }
}

export const oracleService = new OracleService();
