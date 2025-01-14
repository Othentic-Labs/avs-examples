package handlers
import (
	"encoding/json"
	"log"
	"net/http"
	"Execution_Service/services"  
)

// ExecuteTask handles the POST request to `/task/execute`
func ExecuteTask(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		var requestBody map[string]interface{}
		log.Println("body", r.Body)

		// Attempt to decode the body if present
		if r.Body != nil && r.Body != http.NoBody {
			decoder := json.NewDecoder(r.Body)
			if err := decoder.Decode(&requestBody); err != nil {
				log.Println("Error decoding JSON body:", err)
				http.Error(w, "Invalid request body", http.StatusBadRequest)
				return
			}
		}

		// Default value for taskDefinitionId
		taskDefinitionId := 0

		// If taskDefinitionId is provided in the body, use it
		if val, ok := requestBody["taskDefinitionId"].(int); ok {
			taskDefinitionId = val
		}
		log.Printf("taskDefinitionId: %v\n", taskDefinitionId)

		// Get the price from the Oracle service
		priceData, err := services.GetPrice("ETHUSDT")
		if err != nil {
			log.Println("Error fetching price:", err)
			http.Error(w, "Failed to fetch price", http.StatusInternalServerError)
			return
		}

		// Publish data to IPFS using the DAL service
		proofOfTask := priceData.Price

		// Send the task using DAL service
		data := "hello"
		services.SendTask(proofOfTask, data, int(taskDefinitionId))
		
		// Prepare success response
		response := services.NewCustomResponse(map[string]interface{}{
			"proofOfTask":    proofOfTask,
			"data":           data,
			"taskDefinitionId": int(taskDefinitionId),
		}, "Task executed successfully")

		// Return success response
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(response)
	} else {
		// Handle invalid HTTP method
		http.Error(w, "Invalid method", http.StatusMethodNotAllowed)
	}
}
