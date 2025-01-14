package services

// CustomResponse struct to represent a successful response
type CustomResponse struct {
	Data   interface{} `json:"data"`
	Error  bool        `json:"error"`
	Message string     `json:"message"`
}

// NewCustomResponse creates a new instance of CustomResponse
func NewCustomResponse(data interface{}, message string) CustomResponse {
	return CustomResponse{
		Data:    data,
		Error:   false,
		Message: message,
	}
}
