package handlers
import (
	"encoding/json"
	"log"
	"net/http"
	"Validation_Service/services"  
)

// ValidateTask handles the POST request to `/task/validate`
func ValidateTask(w http.ResponseWriter, r *http.Request) {
	var requestBody map[string]interface{}
	var proofOfTask string
	if r.Body != nil && r.Body != http.NoBody {
		decoder := json.NewDecoder(r.Body)
		if err := decoder.Decode(&requestBody); err != nil {
			log.Println("Error decoding JSON body:", err)
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}
	}

	if val, ok := requestBody["proofOfTask"].(string); ok {
		proofOfTask = val
	}
	log.Printf("proofOfTask: %v\n", proofOfTask)


	result, err := services.Validate(proofOfTask)
	if err != nil {
		log.Printf("Validation error: %v", err)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		errorResponse := services.NewCustomResponse(map[string]interface{}{}, "Error during validation step")
		json.NewEncoder(w).Encode(errorResponse)
	}

	log.Printf("Vote: %s", func() string {
		if result {
			return "Approve"
		}
		return "Not Approved"
	}())
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	response := services.NewCustomResponse(map[string]interface{}{
		"result":    result,
	}, "Task validated successfully")
	json.NewEncoder(w).Encode(response)

}
