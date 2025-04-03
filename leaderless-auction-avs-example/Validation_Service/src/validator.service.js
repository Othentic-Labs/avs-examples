require('dotenv').config();
const dalService = require("./dal.service");
const oracleService = require("./oracle.service");

async function validate(proofOfTask) {

  try {
      const taskResult = await dalService.getIPfsTask(proofOfTask);
      var data = await oracleService.getPrice("ETHUSDT");
      const upperBound = data.price * 1.05;
      const lowerBound = data.price * 0.95;
      let isApproved = true;
      if (taskResult.price > upperBound || taskResult.price < lowerBound) {
        isApproved = false;
      }
      return isApproved;
    } catch (err) {
      console.error(err?.message);
      return false;
    }
  }
  
  module.exports = {
    validate,
  }