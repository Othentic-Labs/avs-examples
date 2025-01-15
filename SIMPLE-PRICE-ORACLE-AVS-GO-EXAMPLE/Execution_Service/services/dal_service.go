package services

import (
	"Execution_Service/config"
	"encoding/hex"
	"log"

	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/rlp"
	"github.com/ethereum/go-ethereum/rpc"
)

func Init() {
	config.Init()
}

type Params struct {
	proofOfTask      string
	data             string
	taskDefinitionId int
	performerAddress string
	signature        string
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
	typeBytes, err := abi.NewType("bytes", "", nil)
	typeAddress, err := abi.NewType("address", "", nil)
	typeUint16, err := abi.NewType("uint16", "", nil)

	log.Println("values", proofOfTask, []byte(data), uint16(taskDefinitionId))
	arguments := abi.Arguments{
		{Type: typeString},
		{Type: typeBytes},
		{Type: typeAddress},
		{Type: typeUint16},
	}
	dataBytes := []byte(data)

	dataPacked, err := arguments.Pack(proofOfTask, dataBytes, common.HexToAddress(performerAddress), uint16(taskDefinitionId))
	if err != nil {
		log.Println("error occured while encoding")
		log.Fatal(err)
	}

	messageHash := crypto.Keccak256Hash(dataPacked)

	sig, err := crypto.Sign(messageHash.Bytes(), wallet)
	if err != nil {
		log.Fatal(err)
	}
	serializedSignature, err := rlp.EncodeToBytes(sig)
	serializedSignatureHex := "0x" + hex.EncodeToString(serializedSignature)

	if err != nil {
		log.Fatal(err)
	}

	log.Println(serializedSignature)

	client, err := rpc.Dial(config.OTHENTIC_CLIENT_RPC_ADDRESS)
	if err != nil {
		log.Fatal(err)
	}

	params := Params{
		proofOfTask:      proofOfTask,
		data:             "0x" + hex.EncodeToString([]byte(data)),
		taskDefinitionId: taskDefinitionId,
		performerAddress: performerAddress,
		signature:        serializedSignatureHex,
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
