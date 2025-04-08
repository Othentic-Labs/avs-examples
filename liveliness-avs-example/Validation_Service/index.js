"use strict";
const app = require("./configs/app.config")
const PORT = process.env.port || process.env.PORT || 4002
const dalService = require("./src/dal.service");
const validatorService = require("./src/validator.service");
const util = require("./src/liveliness/util");

dalService.init();
validatorService.init();
// this line might cause problem in docker builds, can be removed safely if needed
util.suppressEthersJsonRpcProviderError();
util.setupDebugConsole();
app.listen(PORT, () => console.log("Server started on port:", PORT))