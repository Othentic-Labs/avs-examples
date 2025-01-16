package config

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

var (
	PinataApiKey                string
	PinataSecretApiKey          string
	OTHENTIC_CLIENT_RPC_ADDRESS string
	PrivateKey                  string
)

func Init() {
	err := godotenv.Load()
	if err != nil {
		log.Println("Error loading .env file")
	}

	PinataApiKey = os.Getenv("PINATA_API_KEY")
	PinataSecretApiKey = os.Getenv("PINATA_SECRET_API_KEY")
	OTHENTIC_CLIENT_RPC_ADDRESS = os.Getenv("OTHENTIC_CLIENT_RPC_ADDRESS")
	PrivateKey = os.Getenv("PRIVATE_KEY_PERFORMER")

	if PinataApiKey == "" || PinataSecretApiKey == "" || OTHENTIC_CLIENT_RPC_ADDRESS == "" || PrivateKey == "" {
		log.Fatal("Environment variables are not set properly")
	}

	gin.SetMode(gin.ReleaseMode)
}
