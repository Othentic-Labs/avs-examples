package main

import (
	"log"
	"github.com/gin-gonic/gin"
	"Execution_Service/services"  
	"Execution_Service/handlers" 
)

func main() {
	services.Init()
	router := gin.Default()
	router.POST("/task/execute", handlers.ExecuteTask)
	log.Println("Server starting on :4003")

	if err := router.Run(":4003"); err != nil {
		log.Fatal(err)
	}
}
