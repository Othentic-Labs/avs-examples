import PinataClient, { PinataPinResponse } from "@pinata/sdk";
import { configService } from "../config/execution-config.service";
import { IpfsPinataConfig } from "../config/execution-config";

export class IpfsService {
    private readonly ipfsConfig: IpfsPinataConfig;

    constructor() {
        this.ipfsConfig = configService.config.ipfs;
    }

    async publishJSONToIpfs(data: object): Promise<string> {
        let proofOfTask = "";
        const { pinataApiKey, pinataSecretApiKey } = this.ipfsConfig;

        try {
            const pinata = new PinataClient(pinataApiKey, pinataSecretApiKey);
            const response: PinataPinResponse = await pinata.pinJSONToIPFS(data);
            proofOfTask = response.IpfsHash;
            console.log(`proofOfTask: ${proofOfTask}`);
        } catch (error) {
            console.error("Error making API request to pinataSDK:", error);
        }

        return proofOfTask;
    }
}

export const ipfsService = new IpfsService();
