# 🍀 Liveliness AVS

Liveliness AVS is a service that monitors Operator availability and maintains a dynamic reputation system to ensure reliability across AVSs.

Much like Ethereum, AVSs utilize slashing to deter malicious behavior. However, unlike Ethereum, AVSs typically do not account for inactive operators by default. Liveliness AVS solves this by providing a shared network that tracks operator health and facilitates consensus on operator liveness.

⚠️ This is a Work-in-Progress (WIP) AVS and not a finalized product.

---

## Table of Contents

1. [Overview](#overview)  
2. [Architecture](#architecture)  
3. [Reputation System](#-reputation-system)  
4. [Usage](#usage)


---


## Overview
Liveliness AVS performs two primary functions:

- Detect Unhealthy Operators: Facilitates decentralized consensus on operator availability and misbehavior.

- Reputation System: Tracks and scores operator reliability over time.

Any operator can join the network, register a health-check endpoint, and begin earning a reputation. Operators are rewarded for availability and penalized for inactivity or incorrect task execution.

## Architecture

### **Operator Healthcheck Endpoint Registration**

![alt text](image.png)

Operators register their health-check endpoints to the `LivelinessRegistry` contract. This endpoint is later queried by the AVS to get health proofs. Operators can also choose not to register an endpoint, but as a result, they will not gain a reputation.


The `LivelinessRegistry` contract acts as the core registry for operator metadata, liveness scores, and penalty tracking. It manages:

- Operator registration and deregistration
- Health-check endpoint updates
- Liveliness score calculation
- Penalization after task validation

### End-to-End Flow

![alt text](image-1.png)

#### Task Performer

1. Executes health-check tasks on every block production:
2. Selects a random set of registered operators
3. Queries their health-check endpoints using the LivelinessRegistry contract
4. Publishes a task containing the health result status of queried operators

> If the Performer is inactive or submits invalid data, it may be penalized.

#### Task Attesters

A quorum of Attester nodes that:

1. Validate the task results submitted by the Performer
2. Vote on the accuracy of operator health statuses

#### Task Aggregator

- Listens for attester votes
- Aggregates BLS signatures once quorum (≥66%) is reached
- Submits the final consensus to the chain

> Updates the `LivelinessRegistry` contract with penalties.



## 🧮 Reputation System

Reputation scores are computed **dynamically** from amount of penalties an operator has. 

```
reputation = blockRegistered - (penalties * C)
```
- C = penalty coefficient (tunable)
- Scores grow linearly over time unless penalties are applied

Other AVSs can use this score to:

- Trigger slashing
- Gate access based on minimum reputation


## Usage

### Deploy LivelinessRegistry contract (follow instructions in LivelinessRegistry.s.sol)
To start, deploy the AVS Logic Hook contract `LivelinessRegistry`, which manages registration, health endpoints, and score tracking.

🛠️ LivelinessRegistry AVS Logic Hook core functions

| Function                             | Description                                                                                       |
|--------------------------------------|---------------------------------------------------------------------------------------------------|
| `register(string endpoint)`          | Registers an operator with a health-check endpoint. Only callable by a valid AVS operator.        |
| `unregister()`                       | Unregisters an operator from the registry. Only allowed if the operator is no longer in the AVS.  |
| `changeEndpoint(string endpoint)`    | Updates the operator’s registered health-check endpoint.                                          |
| `getLivelinessScore(address)`        | Returns the current liveliness score based on uptime minus penalty weight.                        |
| `afterTaskSubmission(...)`           | Hook called by the Attestation Center after quorum consensus to penalize unhealthy operators.     |


### Run the AVS

1. Install the CLI
```
npm install -g @othentic/othentic-cli
```

2. Clone the repo and switch branch
```
git clone https://github.com/Othentic-Labs/avs-examples.git
cd liveliness-avs-example
```

3. Create and populate `.env` and `.env.operator` files
 (Refer to .env.example for required fields)

4. Run script to register Operators endpoints to the livelinessRegistry 
```
./register_liveliness.sh
```
5. Start the network
```
docker-compose up --build
```
> [!NOTE]
> This might take a few minutes when building the images

docker-compose.yml
- Aggregator node
- 3 Attester nodes
- Validation Service
- Execution Service
- 1 External Attester - uses Dockerfile Operator, .env.operator
- 1 External Validation Service - uses Dockerfile Operator, .env.operator

docker-compose.aggregator.yml
- Aggregator node
- Execution Service

### Updating the Othentic node version
To update the `othentic-cli` inside the docker images to the latest version, you
need to rebuild the images using the following command:
```console
docker-compose build --no-cache
```
