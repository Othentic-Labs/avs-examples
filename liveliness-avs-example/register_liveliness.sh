#!/bin/bash

SCRIPT=$(realpath "$0")
SCRIPTPATH=$(dirname "$SCRIPT")

cd $SCRIPTPATH

source .env

VALIDATION_ENDPOINT1=http://10.8.0.2:8545
VALIDATION_ENDPOINT2=http://10.8.0.3:8545
VALIDATION_ENDPOINT3=http://10.8.0.4:8545

cd contracts
source .env

forge script SignInLivelinessRegistry --rpc-url $L2_RPC --private-key $PRIVATE_KEY_ATTESTER1 --broadcast -vvvv --sig="run(address,string)" $ATTESTATION_CENTER_ADDRESS $VALIDATION_ENDPOINT1
forge script SignInLivelinessRegistry --rpc-url $L2_RPC --private-key $PRIVATE_KEY_ATTESTER2 --broadcast -vvvv --sig="run(address,string)" $ATTESTATION_CENTER_ADDRESS $VALIDATION_ENDPOINT2
forge script SignInLivelinessRegistry --rpc-url $L2_RPC --private-key $PRIVATE_KEY_ATTESTER3 --broadcast -vvvv --sig="run(address,string)" $ATTESTATION_CENTER_ADDRESS $VALIDATION_ENDPOINT3
