import os
import requests
from eth_account import Account
from eth_utils import encode_hex, to_bytes
from web3 import Web3
from eth_abi import encode

# Initialize environment variables
rpc_base_address = os.getenv("OTHENTIC_CLIENT_RPC_ADDRESS", "")
private_key = os.getenv("PRIVATE_KEY_PERFORMER", "")

async def send_task(proof_of_task, data, task_definition_id):
    """Sends a task request to the blockchain"""
    wallet = Account.from_key(private_key)
    performer_address = wallet.address
    
    
    data = encode_hex(to_bytes(text=data))

    types = ['string', 'address', 'uint16']
    values = [proof_of_task, performer_address, task_definition_id]
    encoded_message = encode(types, values)
    hash_message = Web3.keccak(encoded_message)

    print("encoded_message:", hash_message)

    signature = await wallet.signMessage(encoded_message)['signature'].hex()
    print("signature:", signature)
    json_rpc_body = {
        "jsonrpc": "2.0",
        "method": "sendTask",
        "params": [
            proof_of_task,
            data,
            task_definition_id,
            performer_address,
            signature
        ]
    }
    
    try:
        response = requests.post(rpc_base_address, json=json_rpc_body)
        print("API response:", response.json())
    except Exception as error:
        print("Error making API request:", error)
