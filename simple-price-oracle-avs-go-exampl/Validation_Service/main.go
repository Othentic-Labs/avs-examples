package main

import (
	"log"
	"net/http"
	"Validation_Service/handlers" 
)

func main() {
	http.HandleFunc("/task/validate", handlers.ValidateTask)
	log.Println("Validation Server starting on :4002")
	log.Fatal(http.ListenAndServe(":4002", nil)) 
}
