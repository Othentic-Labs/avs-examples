package services

import (
	"strconv"
)

func Validate(proofOfTask string) (bool, error)  {
	// Fetch price details from Oracle service
	taskResult, err := strconv.ParseFloat(proofOfTask, 64)
	oracleData, err := GetPrice("ETHUSDT")
	if err != nil {
		return false, err
	}
	priceFloat, err := strconv.ParseFloat(oracleData.Price, 64)

	// Define upper and lower bounds
	upperBound := priceFloat * 1.05
	lowerBound := priceFloat * 0.95

	// Approve or reject based on price bounds
	isApproved := taskResult <= upperBound && taskResult >= lowerBound
	return isApproved, nil
}