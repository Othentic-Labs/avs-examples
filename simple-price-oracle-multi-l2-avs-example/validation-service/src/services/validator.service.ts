import { ipfsService } from "./ipfs.service";
import { oracleService } from "./oracle.service";
import { configService } from "../config/validation-config.service";

export class ValidatorService {
    public async validate(proofOfTask: string): Promise<boolean> {
        try {
            const taskResult = await ipfsService.getPriceFromIpfs(proofOfTask);
            const allowedPriceDeviation = configService.config.validation.allowedPriceDeviation;

            // Validate the task result
            const price = await oracleService.getPairMarketPrice("ETHUSDT");

            const upperBound = price * (1 + allowedPriceDeviation);
            const lowerBound = price * (1 - allowedPriceDeviation);

            console.log(`Price check: ${price}, upper bound: ${upperBound}, lower bound: ${lowerBound}`);
            return taskResult.price <= upperBound && taskResult.price >= lowerBound;
        } catch (error) {
            console.error(`Error validating task: ${proofOfTask}`, error);
            return false;
        }
    }
}

export const validatorService = new ValidatorService();
