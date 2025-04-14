import { ExecutionConfig } from "./execution-config";

export class ExecutionConfigService {
    get config(): ExecutionConfig {
        return {
            service: {
                port: parseInt(process.env.PORT ?? "4003"),
            },
            oracle: {
                baseURL: process.env.ORACLE_BASE_URL ?? `https://api.binance.com/api/v3/`,
            },
            ipfs: {
                pinataApiKey: process.env.PINATA_API_KEY!,
                pinataSecretApiKey: process.env.PINATA_SECRET_API_KEY!,
            },
            rpcBaseAddress: process.env.OTHENTIC_CLIENT_RPC_ADDRESS!,
            performer: {
                privateKey: process.env.PRIVATE_KEY_PERFORMER!,
            }
        };
    }
}

export const configService = new ExecutionConfigService();
