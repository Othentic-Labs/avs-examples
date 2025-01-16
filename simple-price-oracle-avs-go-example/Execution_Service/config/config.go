package config

import (
	"os"
	"log"
	"github.com/joho/godotenv"
	"github.com/gin-gonic/gin"
)

var (
	PinataApiKey         string
	PinataSecretApiKey   string
	OTHENTIC_CLIENT_RPC_ADDRESS       string
	PrivateKey           string
)

func Init() {
	err := godotenv.Load()
    if err != nil {
        log.Fatalf("Error loading .env file")
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