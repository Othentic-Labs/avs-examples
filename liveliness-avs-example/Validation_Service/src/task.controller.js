"use strict";
const { Router } = require("express")
const CustomError = require("./utils/validateError");
const CustomResponse = require("./utils/validateResponse");
const validatorService = require("./validator.service");

const router = Router()

router.post("/validate", async (req, res) => {
  var proofOfTask = req.body.proofOfTask;
  var data = req.body.data;
  console.debug(`Validate task: proof of task: ${proofOfTask}`);
  console.debug(`Validate task: data: ${data}`);
  try {
    const result = await validatorService.validate(proofOfTask, data);
    console.log('Vote:', result ? 'Approve' : 'Not Approved');
    return res.status(200).send(new CustomResponse(result));
  } catch (error) {
    console.log(error)
    return res.status(500).send(new CustomError("Something went wrong", {}));
  }
})

module.exports = router
