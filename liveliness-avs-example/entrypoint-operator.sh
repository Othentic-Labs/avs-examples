#!/bin/bash

# entry point script 
# avs-webapi, node, register

# docker needs to be ran with .env.operator file

# node
if [ "$1" = "node" ]; then
    othentic-cli node attester "/ip4/${OTHENTIC_BOOTSTRAP_IP}/tcp/9876/p2p/${OTHENTIC_BOOTSTRAP_ID}" --avs-webapi "http://${VALIDATION_SERVICE}" --json-rpc
fi

# avs-webapi
if [ "$1" = "avs-webapi" ]; then
    cd Validation_Service
    node index.js
fi

# needs to be ran interactively and deleted immediately
# second argument is endpoint
# TODO: add a confirmation check for the endpoint
if [ "$1" = "register-operator" ]; then
    othentic-cli operator register
fi

# second argument is endpoint
if [ "$1" = "register-endpoint" ]; then
    cd contracts
    forge script SignInLivelinessRegistry \
        --rpc-url $L2_RPC \
        --private-key $PRIVATE_KEY \
        --broadcast -vvvv --sig="run(address,string)" \
        $ATTESTATION_CENTER_ADDRESS $2
fi