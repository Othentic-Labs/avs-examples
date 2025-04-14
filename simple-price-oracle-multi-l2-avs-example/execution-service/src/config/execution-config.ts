export interface ExecutionConfig {
    service: {
        port: number;
    };
    oracle: {
        baseURL: string;
    };
    ipfs: IpfsPinataConfig;
    rpcBaseAddress: string;
    performer: IPerformerConfig;
}

export interface IPerformerConfig {
    privateKey: string;
}

export interface IpfsPinataConfig {
    pinataApiKey: string;
    pinataSecretApiKey: string;
}
