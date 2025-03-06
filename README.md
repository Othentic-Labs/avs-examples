## [Quickstart Examples](https://docs.othentic.xyz/main/avs-framework/quick-start)
A collection of examples designed to provide hands-on experience for integrating the Othentic Stack:

[Simple Price Oracle AVS Example JS](https://github.com/Othentic-Labs/simple-price-oracle-avs-example)

A quickstart repository demonstrating an Oracle AVS implementation in JavaScript. It uses IPFS to store proof-of-task data, providing a simple yet powerful example for developers new to Othentic Stack.


[Simple Price Oracle AVS Example Go](https://github.com/Othentic-Labs/avs-examples/tree/main/simple-price-oracle-avs-go-example)

This example demonstrates how to implement a simple price oracle AVS in Go.


[Simple Price Oracle AVS Example Rust](https://github.com/Othentic-Labs/avs-examples/tree/main/simple-price-oracle-avs-rust-example)

This example demonstrates how to implement a simple price oracle AVS in Rust.


[PRNG AVS](https://github.com/Othentic-Labs/PRNG-avs-example)

This example demonstrates all the advanced features of the CLI including leader election mechanism, Hooks Implementation, Custom Task Triggers and more.


[Uniswap V4 Hook AVS Example](https://github.com/Othentic-Labs/avs-examples/tree/main/uniswap-v4-hook-avs-example)

This example demonstrates how to utilize Uniswap V4 hooks to create dynamic fee AVS that addresses the inefficiencies of static fee models in swap contracts.


## Additional Examples
The following examples are not official samples nor actively maintained, and some may be outdated.

[Parallel EVM Transactions](https://github.com/Othentic-Labs/Parallel-EVM)

The project addresses the challenge of parallel transaction execution by intelligently batching mempool transactions based on independent state accesses. Utilizing Eigenlayer AVS, it introduces a novel approach to parallelizing the EVM through a state access batching algorithm that identifies transactions that can be processed simultaneously.


### ⚡ Defi

[Uniswap v4 orderbook](https://github.com/Othentic-Labs/Uniswap-orderbook) 

This project implements a decentralized orderbook system that processes orders off-chain while settling trades on-chain. It leverages EigenLayer's AVS infrastructure for secure off-chain computation and integrates with Uniswap V4 Hooks to offer improved trading between the orderbook and AMMs.


[AI Powered Prediction Markets](https://github.com/Othentic-Labs/Prediction-markets)

This project builds a decentralized prediction market using AVS with dual AI agents, Gaia and Hyperbolic, for deterministic event resolution. It integrates Uniswap v4 Hooks for binary betting, AVS for price and sentiment analysis.


### 🤖 AI & Machine Learning

[Distributed GPU](https://github.com/Othentic-Labs/Distributed-GPU)

The project implements task execution on remote GPUs through a simple REST API. By leveraging GPU optimizations and graph-based computation, it reduces system requirements for AVS operations. The implementation relies on Eigenlayer’s consensus system and introduces the Manhattan distance metric to handle non-deterministic GPU computations, ensuring near-equal tensor outputs across nodes.

[Deepfake detection](https://github.com/Othentic-Labs/Deepfake-detection)

This project uses deepfake detection techniques to verify camera authenticity for legal applications, ensuring reliable and tamper-proof footage. 


[AI Model benchmarking](https://github.com/Othentic-Labs/Model-benchmarking)

This project provides hospitals, with reliable benchmarks for biotech AI models, ensuring transparency in healthcare AI. Using AVS, it validates model performance claims and assess how well they generalize across different patient groups. Hospitals can submit AI models for benchmarking, compare results on the leaderboard, and make informed decisions about model adoption.

### 🖥 Hardware & Security

[GPU hardware validation system](https://github.com/Othentic-Labs/GPU-auth-agent)

The project validates GPU authenticity through PCI ID verification, VBIOS integrity checks, and secure boot validation. Built on modifications of Coinbase’s CDP Agentkit, it extends their work while integrating voice capabilities inspired by langchain-ai/react-voice-agent. This implementation enhances GPU-based computation security and efficiency within the EigenTensor AVS framework.


### 🔒 Privacy

[FHE Image processing](https://github.com/nschaievitch/eigen-games-25)

This project leverages FHE (Fully Homomorphic Encryption) to enable privacy-preserving image processing. Users can encrypt their images, submit encrypted tasks, and receive processed results without exposing their data to any third party. Built using Zama’s TFHE-rs library and Rust, this solution ensures trustless verification while addressing the trade-off between computational efficiency and privacy. 


[Prediction Market Oderbook](https://github.com/Othentic-Labs/prediction-market-orderbook)

This project leverages homomorphic encryption to generate a privacy-preserving proof of bids, ensuring secure and confidential participation in prediction markets, while Uniswap’s AMM efficiently fills market orders.


---

[Simple Price Oracle Example with EigenDA](https://github.com/Othentic-Labs/price-oracle-example-eigenda)  

This example showcases how to utilize **EigenDA** for storing proof-of-task data, providing a scalable and efficient data availability solution for AVSs.


[DNS Registry AVS](https://github.com/Othentic-Labs/dnsRegistry-avs/) 

Demonstrates how to implement a decentralized DNS registry using AVS. It focuses on integrating domain management functionality with Othentic Stack.


[Lumina Intent AVS](https://github.com/Othentic-Labs/lumina-intent-avs/)

An example of intent-based transaction management using Lumina and AVS. It highlights how to handle user intents within decentralized systems.


[AVS-ML](https://github.com/Othentic-Labs/avs-ml/)

Illustrates how machine learning models can be incorporated into Othentic’s AVS framework. This repo is ideal for developers looking to blend ML and decentralized solutions.


[Access Control AVS](https://github.com/Othentic-Labs/access-control-avs/)

Focuses on decentralized access control using AVS. It provides examples of permission management within applications powered by Othentic Stack.


[Liveliness AVS](https://github.com/Othentic-Labs/Liveliness-AVS/) 

Showcases an AVS implementation to ensure system liveliness and availability checks, critical for maintaining robust decentralized services.

---

This `avs-examples/` directory is a work in progress, and the list of examples is continually growing. If you have an idea for a new example that isn't listed yet, feel free to start a discussion thread to propose it.

