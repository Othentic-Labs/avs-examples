import { ethers, Wallet, JsonRpcProvider } from "ethers";
import { configService } from "../config/execution-config.service";

export class TaskService {
    private readonly privateKey: string;
    private readonly rpcBaseAddress: string;

    constructor() {
        const { privateKey } = configService.config.performer;
        const { rpcBaseAddress } = configService.config;
        this.privateKey = privateKey;
        this.rpcBaseAddress = rpcBaseAddress;
    }

    async sendTask(proofOfTask: string, data: string, taskDefinitionId: number, targetChainId?: number): Promise<void> {
        const wallet: Wallet = new ethers.Wallet(this.privateKey);
        const performerAddress: string = wallet.address;

        const hexData: string = ethers.hexlify(ethers.toUtf8Bytes(data));
        const message: string = ethers.AbiCoder.defaultAbiCoder().encode(
            ["string", "bytes", "address", "uint16"],
            [proofOfTask, hexData, performerAddress, taskDefinitionId]
        );

        const messageHash: string = ethers.keccak256(message);
        const sig: string = wallet.signingKey.sign(messageHash).serialized;

        const provider: JsonRpcProvider = new ethers.JsonRpcProvider(this.rpcBaseAddress);
        const params: any[] = [
            proofOfTask,
            hexData,
            taskDefinitionId,
            performerAddress,
            sig,
        ];
    
        if (targetChainId) {
            params.push("ecdsa");
            params.push(targetChainId);
        }
    
        const jsonRpcBody = {
            jsonrpc: "2.0",
            method: "sendTask",
            params,
        };

        try {
            const response = await provider.send(jsonRpcBody.method, jsonRpcBody.params);
            console.log(`Response for chainId ${targetChainId}:`, response);
        } catch (error) {
            console.error(`Error on chainId ${targetChainId}:`, error);
        }
    }
}

export const taskService = new TaskService(); 