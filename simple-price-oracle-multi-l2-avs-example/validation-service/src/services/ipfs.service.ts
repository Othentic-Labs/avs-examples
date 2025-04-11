import { configService } from "../config/validation-config.service";
import { HttpClient } from "../utils/http-client/http-client";

export interface IpfsPriceResponse {
    symbol: string;
    price: string;
}

export interface IpfsPriceData {
    symbol: string;
    price: number;
}

export class IpfsService {
    private ifpsClient: HttpClient;

    constructor() {
        this.ifpsClient = new HttpClient({
            baseURL: configService.config.ipfs.host,
        });
    }

    async getPriceFromIpfs(cid: string): Promise<IpfsPriceData> {
        const ipfsPriceResponse = await this.ifpsClient.get<IpfsPriceResponse>({ url: cid });
        return {
            symbol: ipfsPriceResponse.symbol,
            price: parseFloat(ipfsPriceResponse.price),
        };
    }
}

export const ipfsService = new IpfsService();
