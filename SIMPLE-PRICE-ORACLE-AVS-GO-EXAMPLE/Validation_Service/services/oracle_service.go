package services

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type PriceResponse struct {
	Symbol string  `json:"symbol"`
	Price  string  `json:"price"`
}

func GetPrice(pair string) (*PriceResponse, error) {
	resp, err := http.Get(fmt.Sprintf("https://api.binance.com/api/v3/ticker/price?symbol=%s", pair))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var priceResponse PriceResponse
	if err := json.NewDecoder(resp.Body).Decode(&priceResponse); err != nil {
		return nil, err
	}

	return &priceResponse, nil
}
