use web3::transports::Http;
use web3::Web3;
use secp256k1::{SecretKey, Message, Secp256k1};
use std::str::FromStr;
use serde::{Deserialize, Serialize};
use std::error::Error;
use ethers::signers::{LocalWallet, Signer};
use ethers::types::{Address, U256};
use ethers::abi::{AbiEncode, Token};
use ethers::utils::keccak256;


#[derive(Debug, Deserialize, Serialize)]
struct Params {
    proof_of_task: String,
    data: String,
    task_definition_id: i32,
    performer_address: String,
    signature: String,
}

#[derive(Debug)]
struct Config {
    private_key: String,
    eth_rpc_url: String,
}

impl Config {
    fn new(private_key: String, eth_rpc_url: String) -> Self {
        Config {
            private_key,
            eth_rpc_url,
        }
    }
}

// Global Config instance
static mut CONFIG: Option<Config> = None;

// Set up global Config (can be called once at initialization)
pub fn init_config(private_key: String, eth_rpc_url: String) {
    unsafe {
        CONFIG = Some(Config::new(private_key, eth_rpc_url));
    }
}

pub async fn send_task(proof_of_task: String, data: String, task_definition_id: i32) -> Result<(), Box<dyn Error>> {
    // Access global Config
    let config = unsafe {
        CONFIG.as_ref().expect("Config is not initialized")
    };

    // Create a web3 instance
    let http = Http::new(&config.eth_rpc_url)?;
    let web3 = Web3::new(http);

    let wallet: LocalWallet = config.private_key.parse()?;
    
    // Get the Ethereum address
    let performer_address: Address = wallet.address();
    println!("Ethereum Address: {:?}", performer_address);
    let data_string = data.to_string();

    // Prepare the data using ABI encoding
    let encoded_data = (proof_of_task.to_string(), data_string.into_bytes(), performer_address, U256::from(task_definition_id))
        .encode();

    let message_hash = keccak256(&encoded_data);
    let signature = wallet.sign_message(message_hash).await?;
    let serialized_signature = format!("0x{}", hex::encode(signature.to_vec()));

    // Prepare the Params structure with necessary values
    let params = Params {
        proof_of_task,
        data: format!("0x{}", hex::encode(data.as_bytes())),
        task_definition_id,
        performer_address: performer_address.to_string(),
        signature: serialized_signature,
    };

    // Call the RPC method (sendTask)
    let result = make_rpc_request(&web3, params).await;
    
    match result {
        Ok(response) => {
            println!("Task sent successfully: {:?}", response);
        },
        Err(err) => {
            eprintln!("Error sending task: {}", err);
        },
    }

    Ok(())
}

// Placeholder function for sending the RPC request (e.g., interacting with smart contract)
async fn make_rpc_request(web3: &Web3<Http>, params: Params) -> Result<String, Box<dyn Error>> {
    // This would typically involve calling the contract method on Ethereum.
    // For now, we simulate sending the task:
    
    println!("Sending task with params: {:?}", params);

    // In practice, you'd send a transaction with:
    // web3.eth().send_transaction(...).await?;

    Ok("Task executed successfully".to_string()) // Placeholder success response
}

