// hacky af but it works
// ethers continously logs if it can't connect to the network
function suppressEthersJsonRpcProviderError() {
  const previousConsoleLog = console.log;
  console.log = (message, ...optionalParameters) => { 
    if (message.toString().startsWith("JsonRpcProvider failed to detect network and cannot start up;")) {
      return;
    }
    
    previousConsoleLog(message, ...optionalParameters);
  }
  
  const previousConsoleError = console.error;
  console.error = (message, ...optionalParameters) => {
    if (message.toString().startsWith("JsonRpcProvider failed to detect network and cannot start up;")) {
      return;
    }
    
    previousConsoleError(message, ...optionalParameters);
  }
}

// console.debug isn't actually a debug level log, it's an alias
// to console.log. This function replaces console.debug with a dummy function
// to supress debug logs.
function setupDebugConsole() {
  const previousConsoleDebug = console.debug;
  if (process.env.DEBUG == 1) {
    console.log("debug mode enabled");
    console.debug = (message, ...optionalParameters) => {
      previousConsoleDebug(message, ...optionalParameters);
    }
  } else {
    console.debug = () => {};
  }
}

module.exports = {
  suppressEthersJsonRpcProviderError,
  setupDebugConsole,
};