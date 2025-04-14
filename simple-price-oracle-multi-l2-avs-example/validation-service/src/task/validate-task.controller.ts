import { Router, Request, Response } from "express";
import { HttpStatusCode } from "axios";
import { validatorService } from "../services/validator.service";
import { ValidateRequestDto, ValidateResponseDto } from "./validate-task.types";

const router = Router();

router.post("/validate", async (req: Request<any, any, ValidateRequestDto>, res: Response<ValidateResponseDto>) => {
    let { proofOfTask } = req.body;
    console.log(`Validate task. proof of task: ${proofOfTask}`);

    try {
        const result = await validatorService.validate(proofOfTask);
        console.log("Vote:", result ? "Approve" : "Not Approved");
        res.status(HttpStatusCode.Ok).send({ data: result });
    } catch (error) {}
});

export default router;
