export interface ValidationConfig {
    service: {
        port: number;
    };
    oracle: {
        baseURL: string;
    };
    ipfs: {
        host: string;
    };
    validation: {
        allowedPriceDeviation: number;
    };
}

export interface IpfsPinataConfig {
    pinataApiKey: string;
    pinataSecretApiKey: string;
    rpcBaseAddress: string;
    privateKey: string;
}
