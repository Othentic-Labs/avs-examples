use serde::{Deserialize, Serialize};
use std::error::Error;
use ethers::signers::{LocalWallet, Signer};
use ethers::types::{Address, U256};
use ethers::abi::AbiEncode;
use ethers::utils::keccak256;
use reqwest::Client;
use serde_json::json;

#[derive(Debug, Deserialize, Serialize)]
struct Params {
    proof_of_task: String,
    data: String,
    task_definition_id: i32,
    performer_address: Address,
    signature: String,
}

#[derive(Debug, Deserialize)]
struct JsonRpcResponse {
    jsonrpc: String,
    result: Option<serde_json::Value>,
    error: Option<JsonRpcError>,
    id: u64,
}

#[derive(Debug, Deserialize)]
struct JsonRpcError {
    code: i64,
    message: String,
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

    let wallet: LocalWallet = config.private_key.parse()?;
    
    // Get the Ethereum address
    let performer_address = wallet.address();
    println!("Ethereum Address: {:?}", performer_address);
    
    // Prepare the data using ABI encoding
    let encoded_data = (proof_of_task.clone(), data.clone().into_bytes(), performer_address, U256::from(task_definition_id))
        .encode();

    let message_hash = keccak256(&encoded_data);
    let signature = wallet.sign_message(message_hash).await?;
    
    let serialized_signature = format!("0x{}", hex::encode(signature.to_vec()));

    // Prepare the Params structure with necessary values
    let params = Params {
        proof_of_task,
        data: format!("0x{}", hex::encode(data.as_bytes())),
        task_definition_id,
        performer_address: performer_address,
        signature: serialized_signature,
    };

    // Call the RPC method (sendTask)
    make_rpc_request(&config.eth_rpc_url, params).await?;
    
    Ok(()) 
}

// Function for sending the RPC request
async fn make_rpc_request(rpc_url: &String, params: Params) -> Result<String, Box<dyn Error>> {
    let client = Client::new();
    
    println!("Sending task with params: {:?}", params);

    let body = json!({
        "jsonrpc": "2.0",
        "method": "sendTask",
        "params": [
            params.proof_of_task,
            params.data,
            params.task_definition_id,
            params.performer_address,
            params.signature
        ],
        "id": 1
    });

    let response = client.post(rpc_url)
        .json(&body)
        .send()
        .await?;

    // Deserialize the response
    let rpc_response: JsonRpcResponse = response.json().await?;

    // Handle the response
    if let Some(result) = rpc_response.result {
        Ok(format!("Task executed successfully with result {:?}", result)) 
    } else if let Some(error) = rpc_response.error {
        Err(format!("RPC Error {}: {}", error.code, error.message).into())
    } else {
        Err("Unknown RPC response".into())
    }
}
