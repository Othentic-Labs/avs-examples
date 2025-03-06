from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import logging
from typing import Optional
import sys
import os
sys.path.append(os.path.abspath(os.path.dirname(__file__)))


from services.oracle_service import get_price # type: ignore
from services.dal_service import send_task  # type: ignore

app = FastAPI()

# Configure logging
logging.basicConfig(level=logging.INFO)


# Request model
class TaskRequest(BaseModel):
    taskDefinitionId: Optional[int] = 0

# Response Models
class CustomResponse(BaseModel):
    proofOfTask: str
    data: str
    taskDefinitionId: int


@app.post("/task/execute")
async def execute_task(request: TaskRequest):
    logging.info("Executing task")

    try:
        task_definition_id = request.taskDefinitionId or 0
        logging.info(f"taskDefinitionId: {task_definition_id}")

        result = get_price("ETHUSDT")
        data = "hello"
        await send_task(result['price'], data, task_definition_id)

        return {"proofOfTask": result['price'], "data": data, "taskDefinitionId": task_definition_id}
    
    except Exception as e:
        logging.error(e)
        raise HTTPException(status_code=500, detail="Something went wrong")
