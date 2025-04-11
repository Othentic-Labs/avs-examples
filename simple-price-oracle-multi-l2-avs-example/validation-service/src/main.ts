import * as dotenv from "dotenv";
import { configService } from "./config/validation-config.service";
import router from "./task/validate-task.controller";
import express from "express";
import cors from "cors";

dotenv.config();

function bootstrap() {
    const app = express();
    const port = configService.config.service.port;

    app.use(cors());
    app.use(express.json());

    app.use("/task", router);

    app.listen(port, () => {
        console.log(`Validation Service is running on port ${port}`);
    });
}

bootstrap();
