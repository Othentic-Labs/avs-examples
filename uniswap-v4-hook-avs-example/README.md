# Uniswap V4 Hook AVS Example

This repository demonstrates how to implement a Dynamic Fees AMM using the Othentic Stack and Uniswap V4 Hooks.

---

## Table of Contents

1. [Overview](#overview)
2. [Project Structure](#project-structure)
3. [Architecture](#architecture)
4. [Prerequisites](#prerequisites)
5. [Installation](#installation)
6. [Usage](#usage)

---

## Overview

This repository showcases how to utilize Uniswap V4 hooks with Othentic Stack to create dynamic fee AVS that address the inefficiencies of static fee models in swap contracts. It calculates the optimal fee based on Market Volatility(low volatility = lower fees, high volatility = higher fees)

### Features

- **Containerised deployment:** Simplifies deployment and scaling.
- **Prometheus and Grafana integration:** Enables real-time monitoring and observability.

## Project Structure

```mdx
📂 simple-price-oracle-avs-example
├── 📂 Execution_Service         # Implements Fee Generation logic - Express JS Backend
│   ├── 📂 config/
│   │   └── app.config.js        # An Express.js app setup with dotenv, and a task controller route for handling `/task` endpoints.
│   ├── 📂 src/
│   │   └── dal.service.js       # A module that interacts with Pinata for IPFS uploads
│   │   ├── oracle.service.js    # A utility module to fetch the volatility of the cryptocurrency pair from the Binance API
│   │   ├── task.controller.js   # An Express.js router handling a `/execute` POST endpoint
│   │   ├── 📂 utils             # Defines two custom classes, CustomResponse and CustomError, for standardizing API responses
│   ├── Dockerfile               # A Dockerfile that sets up a Node.js (22.6) environment, exposes port 8080, and runs the application via index.js
|   ├── index.js                 # A Node.js server entry point that initializes the DAL service, loads the app configuration, and starts the server on the specified port
│   └── package.json             # Node.js dependencies and scripts
│
├── 📂 Validation_Service         # Implements task validation logic - Express JS Backend
│   ├── 📂 config/
│   │   └── app.config.js         # An Express.js app setup with a task controller route for handling `/task` endpoints.
│   ├── 📂 src/
│   │   └── dal.service.js        # A module that interacts with Pinata for IPFS uploads
│   │   ├── oracle.service.js     # A utility module to fetch the current volatility of a cryptocurrency pair from the Binance API
│   │   ├── task.controller.js    # An Express.js router handling a `/validate` POST endpoint
│   │   ├── validator.service.js  # A validation module that checks if a task result from IPFS matches the ETH/USDT price within a 5% margin.
│   │   ├── 📂 utils              # Defines two custom classes, CustomResponse and CustomError, for standardizing API responses.
│   ├── Dockerfile                # A Dockerfile that sets up a Node.js (22.6) environment, exposes port 8080, and runs the application via index.js.
|   ├── index.js                  # A Node.js server entry point that initializes the DAL service, loads the app configuration, and starts the server on the specified port.
│   └── package.json              # Node.js dependencies and scripts
│
├── 📂 Contracts                  # AVS Logic and Uniswap V4 Hooks contract

├── 📂 grafana                    # Grafana monitoring configuration
├── docker-compose.yml            # Docker setup for Operator Nodes (Performer, Attesters, Aggregator), Execution Service, Validation Service, and monitoring tools
├── .env.example                  # An example .env file containing configuration details and contract addresses
├── README.md                     # Project documentation
└── prometheus.yaml               # Prometheus configuration for logs
```

## Architecture
![image](https://github.com/user-attachments/assets/18e09f6b-ecee-4041-9cbd-722d59d22d1f)


The Performer node executes tasks using the Task Execution Service and sends the results to the p2p network.

Attester Nodes validate task execution through the Validation Service. Based on the Validation Service's response, attesters sign the tasks. In this AVS:

Task Execution logic:
- Fetch the ETH/USDT volatility.
- Calculate swap fee
- Store the result in IPFS.
- Share the IPFS CID as proof.

Validation Service logic:
- Retrieve the fee from IPFS using the CID.
- Calculate the expected ETH/USDT fee.
- Validate by comparing the actual and expected prices within 5% margin.
---

## Prerequisites

- Node.js (v 22.6.0 )
- Foundry
- [Yarn](https://yarnpkg.com/)
- [Docker](https://docs.docker.com/engine/install/)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Othentic-Labs/avs-examples.git
   cd avs-examples/uniswap-v4-hook-avs-example
   ```

2. Install Othentic CLI:

   ```bash
   npm i -g @othentic/othentic-cli
   ```

## Usage
1. Create a .env file and include the deployed contract addresses and private keys for the operators. If you are unfamiliar with AVS, Checkout the [Quickstart guide](https://docs.othentic.xyz/main/avs-framework/quick-start).

2. Deploy the DynamicFeesAvsHook Contract: To use hooks, deploy an instance of the `DynamicFeesAvsHook contract` by navigating to the `contracts` directory. 

```bash
# Either source .env or replace variables in command
cd contracts/
forge install
forge script script/DynamicFeesAvsHookDeploy.s.sol:DynamicFeesAvsHookDeploy \
 --rpc-url $L2_RPC \
 --private-key $PRIVATE_KEY \
 --broadcast -vvvv \
 --verify \
 --etherscan-api-key $L2_ETHERSCAN_API_KEY \
 --chain $L2_CHAIN \
 --verifier-url $L2_VERIFIER_URL \
 --sig="run(address,address)" \
 $ATTESTATION_CENTER_ADDRESS $POOL_MANAGER_ADDRESS
 ```

3. Once the contract is deployed, return to the root of the repository and start the Docker Compose configuration:
```bash
docker-compose up --build
```
> [!NOTE]
> Building the images might take a few minutes

## Usage

Follow the steps in the official documentation's [Quickstart](https://docs.othentic.xyz/main/avs-framework/quick-start#steps) Guide for setup and deployment.

Happy Building! 🚀

