package services

import (
	"log"
	"Execution_Service/config"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/rpc"
	"github.com/ethereum/go-ethereum/common"
	"encoding/hex"
)

func Init() {
	config.Init()
}

type Params struct {
    proofOfTask    string
    data     string
	taskDefinitionId int
    performerAddress string
	signature string
}

func SendTask(proofOfTask string, data string, taskDefinitionId int) {
	// Logic to send tasks to the Ethereum network
	privateKey := config.PrivateKey
	wallet, err := crypto.HexToECDSA(privateKey)
	if err != nil {
		log.Fatal(err)
	}

	performerAddress := crypto.PubkeyToAddress(wallet.PublicKey).Hex()

	typeString, err := abi.NewType("string", "", nil)
    typeAddress, err := abi.NewType("address", "", nil)
	typeUint16, err := abi.NewType("uint16", "", nil)
   
    arguments := abi.Arguments{
        {Type: typeString},
        {Type: typeString},
        {Type: typeAddress},
        {Type: typeUint16},
    }

    dataPacked, err := arguments.Pack(proofOfTask, hex.EncodeToString([]byte(data)), common.HexToAddress(performerAddress), uint16(taskDefinitionId))
	if err != nil {
		log.Println("error occured while encoding")
		log.Fatal(err)
	}
    
	messageHash := crypto.Keccak256Hash(dataPacked)
	
	sig, err := crypto.Sign(messageHash.Bytes(), wallet)
	if err != nil {
		log.Fatal(err)
	}
	v := sig[64] + 27 // Ethereum adds 27 to v
	serializedSignature := append(sig[:64], v) // Replace the last byte with the adjusted v

	signatureHex := "0x" + hex.EncodeToString(serializedSignature)

	// Send task to Ethereum
	client, err := rpc.Dial(config.OTHENTIC_CLIENT_RPC_ADDRESS)
	if err != nil {
		log.Fatal(err)
	}

	params := Params{
        proofOfTask:    proofOfTask,
        data: "0x" + hex.EncodeToString([]byte(data)),
        taskDefinitionId: taskDefinitionId,
		performerAddress: performerAddress,
		signature: signatureHex,
    }

	response := makeRPCRequest(client, params)
	log.Println("API response:", response)
}

func makeRPCRequest(client *rpc.Client, params Params) interface{} {
	// Example of sending an RPC request (you need to implement the request sending logic)
	var result interface{}

	err := client.Call(&result, "sendTask", params.proofOfTask, params.data, params.taskDefinitionId, params.performerAddress, params.signature)
	if err != nil {
		log.Fatal(err)
	}
	return result
}
