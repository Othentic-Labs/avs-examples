## Quickstart

A curated list of AVS implementations to help you get started with the [Othentic Stack](https://docs.othentic.xyz). These examples span across multiple programming languages and demonstrate both basic and advanced features.

> 📚 [View Quickstart Guide →](https://docs.othentic.xyz/main/avs-framework/quick-start)

### Language-Specific Examples

| Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;                                                       | Description |
|---------------------------------------------------------------------------------------------------------------------------------------------------|-------------|
| [Oracle (JS)](https://github.com/Othentic-Labs/simple-price-oracle-avs-example)                                                                 | A quickstart repository demonstrating an Oracle AVS implementation in JavaScript. It uses IPFS to store proof-of-task data, providing a simple yet powerful example for developers new to the Othentic Stack. |
| [Oracle (Go)](https://github.com/Othentic-Labs/simple-price-oracle-avs-go-example)                                        | A Go-based Oracle AVS showcasing Othentic integration with clean concurrency and validation logic. |
| [Oracle (Rust)](https://github.com/Othentic-Labs/simple-price-oracle-avs-rust-example)                                    | A Rust-based implementation of a simple Oracle AVS with strong type safety and performance. |

### Advanced Examples

| Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Description |
|------------------------------------------------------------------------------------------------------------------------------------------------------|-------------|
| [Multi Chain AVS (TS)](https://github.com/Othentic-Labs/multi-l2-price-oracle-avs-example) | Deploys AVS across **[multiple L2 chains](https://docs.othentic.xyz/main/avs-framework/explainers/multi-l2s)**, showcasing task submission and attestation, in a multi-chain context. |
| [PRNG](https://github.com/Othentic-Labs/PRNG-avs-example) | Showcases advanced CLI features like **[leader election](https://docs.othentic.xyz/main/avs-framework/othentic-consensus/leader-election)**, **[custom task triggers](https://docs.othentic.xyz/main/avs-framework/othentic-consensus/task-and-task-definitions#triggering-a-task)**, and **[hook execution](https://docs.othentic.xyz/main/avs-framework/smart-contracts/hooks/task-logic)**. Great for exploring full-stack AVS capabilities. |
| [Uniswap V4 Hook](https://github.com/Othentic-Labs/uniswap-v4-hook-avs-example) | Uses Uniswap V4 **hooks** to dynamically adjust swap fees based on real-time market data—solves inefficiencies of static fee models. |
| [Leaderless Auction](https://github.com/Othentic-Labs/leaderless-auction-avs-example) | Implements a leaderless mechanism using an **auction-based protocol**. Instead of electing a leader, nodes participate in a commit-reveal scheme where they bid for task execution rights. |
| [Liveness](https://github.com/Othentic-Labs/liveness-avs-example) | An AVS that monitors operator **uptime and responsiveness** across the network. It introduces a **reputation system** and provides a mechanism for detecting and penalizing inactive operators. |
| [MCP AVS Example](https://github.com/Othentic-Labs/avs-mcp-example) | Demonstrates **Model Context Protocol (MCP)** support in AVSs. This example enables agent-compatible task execution, making AVS accessible via AI agents |

## Additional Examples
The following examples are not official samples nor actively maintained, and some may be outdated.

[Parallel EVM Transactions](https://github.com/Othentic-Labs/Parallel-EVM)

The project addresses the challenge of parallel transaction execution by intelligently batching mempool transactions based on independent state accesses. Utilizing Eigenlayer AVS, it introduces a novel approach to parallelizing the EVM through a state access batching algorithm that identifies transactions that can be processed simultaneously.


### ⚡ Defi

[Uniswap v4 Orderbook](https://github.com/Othentic-Labs/Uniswap-orderbook) 

This project implements a decentralized orderbook system that processes orders off-chain while settling trades on-chain. It leverages EigenLayer's AVS infrastructure for secure off-chain computation and integrates with Uniswap V4 Hooks to offer improved trading between the orderbook and AMMs.


[AI Powered Prediction Markets](https://github.com/Othentic-Labs/Prediction-markets)

This project builds a decentralized prediction market using AVS with dual AI agents, Gaia and Hyperbolic, for deterministic event resolution. It integrates Uniswap v4 Hooks for binary betting, AVS for price and sentiment analysis.


### 🤖 AI & Machine Learning

[Distributed GPU](https://github.com/Othentic-Labs/Distributed-GPU)

The project implements task execution on remote GPUs through a simple REST API. By leveraging GPU optimizations and graph-based computation, it reduces system requirements for AVS operations. The implementation relies on Eigenlayer’s consensus system and introduces the Manhattan distance metric to handle non-deterministic GPU computations, ensuring near-equal tensor outputs across nodes.

[Deepfake Detection](https://github.com/Othentic-Labs/Deepfake-detection)

This project uses deepfake detection techniques to verify camera authenticity for legal applications, ensuring reliable and tamper-proof footage. 


[AI Model Benchmarking](https://github.com/Othentic-Labs/Model-benchmarking)

This project provides hospitals, with reliable benchmarks for biotech AI models, ensuring transparency in healthcare AI. Using AVS, it validates model performance claims and assess how well they generalize across different patient groups. Hospitals can submit AI models for benchmarking, compare results on the leaderboard, and make informed decisions about model adoption.

### 🖥 Hardware & Security

[GPU Hardware Validation System](https://github.com/Othentic-Labs/GPU-auth-agent)

The project validates GPU authenticity through PCI ID verification, VBIOS integrity checks, and secure boot validation. Built on modifications of Coinbase’s CDP Agentkit, it extends their work while integrating voice capabilities inspired by langchain-ai/react-voice-agent. This implementation enhances GPU-based computation security and efficiency within the EigenTensor AVS framework.


### 🔒 Privacy

[FHE Image Processing](https://github.com/Othentic-Labs/Secure-image-processing)

This project leverages FHE (Fully Homomorphic Encryption) to enable privacy-preserving image processing. Users can encrypt their images, submit encrypted tasks, and receive processed results without exposing their data to any third party. Built using Zama’s TFHE-rs library and Rust, this solution ensures trustless verification while addressing the trade-off between computational efficiency and privacy. 


[Prediction Market Orderbook](https://github.com/Othentic-Labs/prediction-market-orderbook)

This project leverages homomorphic encryption to generate a privacy-preserving proof of bids, ensuring secure and confidential participation in prediction markets, while Uniswap’s AMM efficiently fills market orders.


---

[Simple Price Oracle Example with EigenDA](https://github.com/Othentic-Labs/price-oracle-example-eigenda)  

This example showcases how to utilize **EigenDA** for storing proof-of-task data, providing a scalable and efficient data availability solution for AVSs.


[DNS Registry](https://github.com/Othentic-Labs/dnsRegistry-avs/) 

Demonstrates how to implement a decentralized DNS registry using AVS. It focuses on integrating domain management functionality with Othentic Stack.


[Lumina Intent](https://github.com/Othentic-Labs/lumina-intent-avs/)

An example of intent-based transaction management using Lumina and AVS. It highlights how to handle user intents within decentralized systems.


[AVS-ML](https://github.com/Othentic-Labs/avs-ml/)

Illustrates how machine learning models can be incorporated into Othentic’s AVS framework. This repo is ideal for developers looking to blend ML and decentralized solutions.


[Access Control](https://github.com/Othentic-Labs/access-control-avs/)

Focuses on decentralized access control using AVS. It provides examples of permission management within applications powered by Othentic Stack.

---

This `avs-examples/` directory is a work in progress, and the list of examples is continually growing. If you have an idea for a new example that isn't listed yet, feel free to start a discussion thread to propose it.

