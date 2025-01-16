package handlers

import (
	"Execution_Service/services"
	"encoding/json"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func ExecuteTask(c *gin.Context) {
	log.Println("Executing Task")

	if c.Request.Method == http.MethodPost {
		taskDefinitionId := 0
		if c.Request.Body != http.NoBody {
			var requestBody map[string]interface{}
			if json.NewDecoder(c.Request.Body).Decode(&requestBody) == nil {
				if val, ok := requestBody["taskDefinitionId"].(int); ok {
					taskDefinitionId = val
				}
			}
		}

		log.Printf("taskDefinitionId: %v\n", taskDefinitionId)

		priceData, err := services.GetPrice("ETHUSDT")
		if err != nil {
			log.Println("Error fetching price:", err)
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to fetch price",
			})
			return
		}

		proofOfTask := priceData.Price
		data := "hello"
		services.SendTask(proofOfTask, data, taskDefinitionId)

		response := services.NewCustomResponse(map[string]interface{}{
			"proofOfTask":      proofOfTask,
			"data":             data,
			"taskDefinitionId": int(taskDefinitionId),
		}, "Task executed successfully")
		c.JSON(http.StatusOK, response)
	} else {
		c.JSON(http.StatusMethodNotAllowed, gin.H{
			"error": "Invalid method",
		})
	}
}
