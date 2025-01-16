package services

// CustomError struct to represent an error response
type CustomError struct {
	Error  bool        `json:"error"`
	Message string     `json:"message"`
	Data   interface{} `json:"data"`
}

// NewCustomError creates a new instance of CustomError
func NewCustomError(message string, data interface{}) CustomError {
	return CustomError{
		Error:   true,
		Message: message,
		Data:    data,
	}
}
