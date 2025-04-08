"use strict";
const app = require("./configs/app.config")
const PORT = process.env.port || process.env.PORT || 4003
const dalService = require("./src/dal.service");
const healthcheckService = require("./src/healthcheck.service");
const taskService = require("./src/task.service");
const util = require("./src/liveliness/util");

dalService.init();
healthcheckService.init();
taskService.init();
util.suppressEthersJsonRpcProviderError();
util.setupDebugConsole();
app.listen(PORT, () => console.log("Server started on port:", PORT))

taskService.performTaskOnEpoch();