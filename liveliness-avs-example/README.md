# 🍀 Liveliness AVS

This repository demonstrates how to implement Operator Liveliness AVS using the Othentic Stack.

---

## Table of Contents

1. [Overview](#overview)
2. [Project Structure](#project-structure)
3. [Architecture](#usage)
4. [Prerequisites](#prerequisites)
5. [Installation](#installation)
6. [Usage](#usage)

---

## Overview
This repository runs the AVS 

Run the AVS
Deploy AVS Logic Hook to manage operator validation API endpoints, and track the liveliness score. It ensures that operators are registered, penalized for misconduct. It implements following functions.
- register - Registers an operator with an endpoint.
- unregister
- getLivelinessScore - Computes the liveliness score of an operator
 


## Project Structure

```mdx
📂 simple-price-oracle-avs-go-example
├── 📂 Execution_Service         # Implements Task execution logic - Backend
│   ├── 📂 config/
│   │   └── config.go            # To initialize environment variables and configurations.
│   ├── 📂 handlers/
│   │   └── task_handler.go      # Handler for executing a task by processing a POST request.
│   ├── 📂 services/
│   │   └── dal_service.go       # A service to call `sendTask` RPC call.
│   │   ├── oracle_service.go    # A utility module to fetch the current price of a cryptocurrency pair from the Binance API
│   ├── Dockerfile               # Dockerfile for building and running a Go app on port 8080.
│   ├── go.mod                   # Defines the `Execution_Service` module and required dependencies.
|   └── main.go                  # A Go program using the Gin framework to initialize services, set up a POST endpoint `/task/execute`
│
├── 📂 Validation_Service         # Implements task validation logic - Backend
│   ├── 📂 config/
│   │   └── config.go            # To initialize environment variables and configurations.
│   ├── 📂 handlers/
│   │   └── task_handler.go      # Handler for validating a task by processing a POST request.
│   ├── 📂 services/
│   │   ├── validation_service.go # Task verification logic
│   │   ├── oracle_service.go    # A utility module to fetch the current price of a cryptocurrency pair from the Binance API
│   ├── Dockerfile               # Dockerfile for building and running a Go app on port 8080.
│   ├── go.mod                   # Defines the `Validation_Service` module and required dependencies.
|   └── main.go                  # A Go program using the Gin framework to initialize services, set up a POST endpoint `/task/validate`
│
├── docker-compose.yml            # Docker setup for Operator Nodes (Performer, Attesters, Aggregator), Execution Service, Validation Service, and monitoring tools
├── .env.example                  # An example .env file containing configuration details and contract addresses
└── README.md                     # Project documentation
```

## Architecture



## ▶️ Usage
We provide a sample docker-compose configuration which sets up the following
services:

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


1. To set up the environment, create a `.env`and `.env.operator` files with the contracts and operator keys
configurations (see the `.env.example`), then run:
```console
docker-compose up --build
```
2. run script to register operators to livelinessRegistry `registere_liveliness.sh`
```console
registere_liveliness
```

> [!NOTE]
> This might take a few minutes when building the images

### Updating the Othentic node version
To update the `othentic-cli` inside the docker images to the latest version, you
need to rebuild the images using the following command:
```console
docker-compose build --no-cache
```

