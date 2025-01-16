## Simple Price Oracle AVS GO Example

This repository demonstrates how to implement a simple price oracle AVS in Go using the Othentic Stack.

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

The Simple Price Oracle AVS Example demonstrates how to deploy a minimal AVS using Othentic Stack.

### Features

- **Containerised deployment:** Simplifies deployment and scaling.

## Project Structure

```mdx
📂 simple-price-oracle-avs-example
├── Execution_Service  # Implements task execution logic
├── Validation_Service # Implements task validation logic
├── docker-compose.yml # Docker setup for Operator Nodes (Performer, Attesters, Aggregator), Execution Service, Validation Service, and monitoring tools
└── README.md          # Project documentation
```

## Architecture

![Price oracle sample](https://github.com/user-attachments/assets/03d544eb-d9c3-44a7-9712-531220c94f7e)

The Performer node executes tasks using the Task Execution Service and sends the results to the p2p network.

Attester Nodes validate task execution through the Validation Service. Based on the Validation Service's response, attesters sign the tasks. In this AVS:

Task Execution logic:
- Fetch the ETHUSDT price.
- Share the price as proof.

Validation Service logic:
- Get the expected ETHUSDT price.
- Validate by comparing the actual and expected prices within an acceptable margin.
---

## Prerequisites

- Go (v 1.23 )
- Foundry
- [Docker](https://docs.docker.com/engine/install/)

## Installation

1. Clone the repository:

   ```bash
   git clone git clone https://github.com/Othentic-Labs/avs-examples.git
   cd avs-examples/SIMPLE-PRICE-ORACLE-AVS-GO-EXAMPLE
   ```

2. Install Othentic CLI:

   ```bash
   npm i -g @othentic/othentic-cli
   ```

## Usage

Follow the steps in the official documentation's [Quickstart](https://docs.othentic.xyz/main/avs-framework/quick-start#steps) Guide for setup and deployment.

If you already have all the information required to run the AVS, simply copy the .env file into your project directory and then run:
```bash
docker-compose up --build
```

### Next
Modify the different configurations, tailor the task execution logic as per your use case, and run the AVS.

Happy Building! 🚀

