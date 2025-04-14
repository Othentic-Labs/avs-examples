import { Router, Request, Response } from "express";

import { oracleService } from "../services/oracle.service";
import { ipfsService } from "../services/ipfs.service";
import { taskService } from "../services/task.service";
import { HttpStatusCode } from "axios";

const router = Router();

router.post("/execute", async (req: Request<any, any, ExecuteRequestDto>, res: Response<ExecuteResponseDto>) => {
    let { taskDefinitionId, fakePrice, targetChainId } = req.body;

    taskDefinitionId = Number(req.body.taskDefinitionId) || 0;
    console.log(`Executing task: ${taskDefinitionId}`);

    try {
        const fakePrice = Number(req.body.fakePrice) || undefined;
        const targetChainId = Number(req.body.targetChainId) || undefined;
        let price = await oracleService.getPairMarketPrice("ETHUSDT");

        if (fakePrice) {
            price = fakePrice;
        }

        const cid = await ipfsService.publishJSONToIpfs({ price: price });
        const data = "hello";

        await taskService.sendTask(cid, data, taskDefinitionId, targetChainId);

        const response: ExecuteResponseDto = {
            message: "Task executed successfully",
            proofOfTask: cid,
            data: price,
            taskDefinitionId: taskDefinitionId.toString(),
        };

        res.status(HttpStatusCode.Ok).send(response);
    } catch (error) {
        console.error(`Error executing task: ${taskDefinitionId} `, error);
        res.status(HttpStatusCode.InternalServerError).send({ message: `Error executing task ${taskDefinitionId}` });
    }
});

export default router;
