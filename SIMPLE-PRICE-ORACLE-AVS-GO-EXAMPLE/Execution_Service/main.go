package main

import (
	"log"
	"net/http"
	"Execution_Service/services"  
	"Execution_Service/handlers" 
)

func main() {
	services.Init()
	http.HandleFunc("/task/execute", handlers.ExecuteTask)
	log.Println("Server starting on :4003")
	log.Fatal(http.ListenAndServe(":4003", nil)) // Starts the HTTP server on port 4003
}
