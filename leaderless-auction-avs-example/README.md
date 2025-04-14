# Leaderless Auction AVS Example

This repository demonstrates how to implement a leaderless auction mechanism in AVS using Othentic Stack. This AVS leverages custom messaging between operators to communicate the bidding messages.

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)
5. [Usage](#usage)

---

## Overview

The Leaderless Auction AVS Example showcases how to implement a leaderless auction using Othentic Stack. The approach is inspired by recent work on distributed coordination in auctions, particularly [Paradigm's thoughts on leaderless auctions](https://www.paradigm.xyz/2024/02/leaderless-auctions).


### Features

- **Leaderless coordination** — All nodes independently compute and agree on the result.
- **Commit-reveal flow** — Protects bids from front-running while enabling verifiability.
- **Custom messaging** — Tasks are propagated via custom messaging.

## Architecture


### 🔁 Auction Lifecycle

**Auction Initiation:** 
When a task needs to be performed, an auction begins with a unique auction ID and timestamp.

**Commit Phase:**
Each node independently decides how much they're willing to "bid" for the right to perform the task
Operator Nodes create a commitment by hashing their bid amount plus a random salt value. Only this hash (commitment) is published to the network, keeping actual bid values secret.

**Reveal Phase:**
After a set duration, nodes reveal their original bids and salt values
All nodes can verify each commitment by recalculating hash(bid + salt) and comparing it to the previously published commitment.

**Winner Determination:**
Every node independently analyzes all valid bids and identifies the highest bidder. The highest bidder wins the right to perform the task
No central authority needs to announce the winner - each node reaches the same conclusion independently.

**Task Execution:**
The winning node performs the specified task (like fetching price data).


| Phase         | Message Type           | Description                                                                 |
|---------------|------------------------|-----------------------------------------------------------------------------|
| Start         | `auction/start`        | Triggers auction with an ID and timestamp                                  |
| Commit Phase  | `auction/bid_commit`   | Nodes commit a hash of their bid + salt                                    |
| Reveal Phase  | `auction/bid_reveal`   | Nodes reveal original bid + salt, All nodes independently determine the winner|
| Execute       | Internal HTTP `/task/execute` | If current node wins, it performs the task and publishes results to IPFS |

### 🧩 Commit-Reveal Mechanism

```js
const commitment = keccak256(toUtf8Bytes(bid + salt));
```

- Commit: Each node generates a salt + bid, hashes it, and publishes only the commitment.
- Reveal: After `COMMIT_DURATION` has passed, each node independently enters the reveal phase and publishes its original bid and salt.
- Verify: Once  `REVEAL_DURATION` is over, all nodes independently verify the revealed values by checking if hash(bid + salt) matches the original commitment, and then determine the winner.


### 🏆 Winner Determination
Each node:

- Tracks all revealed bids.
- Validates each bid using its commitment.
- Picks the highest valid bid.
- If the node itself is the winner:

Sends a task to the internal /task/execute endpoint to fetch price data and push it to IPFS.


### [Custom Messaging](https://docs.othentic.xyz/main/avs-framework/othentic-cli/p2p-config/custom-p2p-messaging)
All messages are hex-encoded JSON and published via the sendCustomMessage RPC method.

Example payload:

```
{
  "jsonrpc": "2.0",
  "method": "sendCustomMessage",
  "params": ["0x7b22746f706963223a2261756374696f6e2f7374617274222c2261756374696f6e4964223a31327d"],
  "id": 1
}
```

The Performer node executes tasks using the Task Execution Service and sends the results to the p2p network.

Attester Nodes validate task execution through the Validation Service. Based on the Validation Service's response, attesters sign the tasks. 

## Prerequisites

- Node.js (v 22.6.0 )
- Foundry
- [Yarn](https://yarnpkg.com/)
- [Docker](https://docs.docker.com/engine/install/)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Othentic-Labs/simple-price-oracle-avs-example.git
   cd simple-price-oracle-avs-example
   ```

2. Install Othentic CLI:

   ```bash
   npm i -g @othentic/othentic-cli
   ```

## Usage

- Follow the steps in the official documentation's [Quickstart](https://docs.othentic.xyz/main/avs-framework/quick-start#steps) Guide for setup and deployment.
- Call auction start:
```
curl -X POST http://localhost:4003/task/elect
```


### Next
Modify the different configurations, tailor the task execution logic as per your use case, and run the AVS.

Happy Building! 🚀

