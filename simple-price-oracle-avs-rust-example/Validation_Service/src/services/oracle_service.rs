use reqwest::Error;
use serde::Deserialize;

#[derive(Deserialize)]
pub struct PriceResponse {
    pub symbol: String,
    pub price: String,
}

pub async fn get_price(pair: &str) -> Result<PriceResponse, Error> {
    let url = format!("https://api.binance.com/api/v3/ticker/price?symbol={}", pair);
    
    // Send the GET request and await the response
    let response = reqwest::get(&url).await?;

    // Deserialize the JSON response into the PriceResponse struct
    let price_response: PriceResponse = response.json().await?;

    Ok(price_response)
}
