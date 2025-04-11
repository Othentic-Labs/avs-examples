# Simple Price Oracle Multi L2 AVS

1.
Multi L2 feature is released in CLI v1.10. 
check for othentic-cli version , make sure its 1.10 or above

2. Refer quick start guide to deploy AVS contracts, Make sure to add all the L2 chain names that you want to deploy on as per the supported chains. In this I will use amoy and base-sepolia

othentic-cli network deploy \
    --l1-chain holesky \
    --l2-chain amoy,base-sepolia \
    --rewards-token 0x94373a4919B3240D86eA41593D5eBa789FEF3848 \
    --l1-initial-deposit 1000000000000000000 \
    --l2-initial-deposit 2000000000000000000 \
    --name test-avs-name10

3/ Update the chain names in docker compose file accordingly