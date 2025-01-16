package services

import (
	"Execution_Service/config"
	"math/big"
	"encoding/hex"
	"crypto/ecdsa"
	"github.com/ethereum/go-ethereum/common/hexutil"
	"log"

	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
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
	privateKey, err := crypto.HexToECDSA(config.PrivateKey)
	if err != nil {
		log.Println(err)
	}
	publicKey, ok := privateKey.Public().(*ecdsa.PublicKey)
	if !ok {
		log.Println("cannot assert type: publicKey is not of type *ecdsa.PublicKey")
	}
	performerAddress := crypto.PubkeyToAddress(*publicKey).Hex()

	arguments := abi.Arguments{
		{Type: abi.Type{T: abi.StringTy}},
		{Type: abi.Type{T: abi.BytesTy}},
		{Type: abi.Type{T: abi.AddressTy}},
		{Type: abi.Type{T: abi.UintTy}},
	}

	dataPacked, err := arguments.Pack(
		proofOfTask,
		[]byte(data),
		common.HexToAddress(performerAddress),
		big.NewInt(int64(taskDefinitionId)),
	)
	if err != nil {
		log.Println("error occured while encoding")
		log.Println(err)
	}
	messageHash := crypto.Keccak256Hash(dataPacked)

	sig, err := crypto.Sign(messageHash.Bytes(), privateKey)
	if err != nil {
		log.Println("error occured while signing")
		log.Println(err)
	}
	sig[64] += 27
	serializedSignature := hexutil.Encode(sig)
	log.Println(serializedSignature)

	client, err := rpc.Dial(config.OTHENTIC_CLIENT_RPC_ADDRESS)
	if err != nil {
		log.Println(err)
	}

	params := Params{
		proofOfTask:      proofOfTask,
		data:             "0x" + hex.EncodeToString([]byte(data)),
		taskDefinitionId: taskDefinitionId,
		performerAddress: performerAddress,
		signature:        serializedSignature,
	}

	response := makeRPCRequest(client, params)
	log.Println("API response:", response)
}

func makeRPCRequest(client *rpc.Client, params Params) interface{} {
	var result interface{}

	err := client.Call(&result, "sendTask", params.proofOfTask, params.data, params.taskDefinitionId, params.performerAddress, params.signature)
	if err != nil {
		log.Println(err)
	}
	return result
}
