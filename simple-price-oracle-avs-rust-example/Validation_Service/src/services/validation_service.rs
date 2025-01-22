use reqwest::Error;
use std::str::FromStr;
use crate::services::oracle_service;

pub async fn validate(proof_of_task: &str) -> Result<bool, String> {
    // Convert the proofOfTask string into a float
    let task_result = match f64::from_str(proof_of_task) {
        Ok(val) => val,
        Err(_) => return Err("Invalid proofOfTask value".to_string()),
    };

    // Fetch price details from the Oracle service
    match oracle_service::get_price("ETHUSDT").await {
        Ok(oracle_data) => {
            // Parse price from the oracle response
            let price_float = match f64::from_str(&oracle_data.price) {
                Ok(val) => val,
                Err(_) => return Err("Invalid price data from Oracle".to_string()),
            };

            // Define upper and lower bounds
            let upper_bound = price_float * 1.05;
            let lower_bound = price_float * 0.95;

            // Approve or reject based on price bounds
            let is_approved = task_result <= upper_bound && task_result >= lower_bound;
            Ok(is_approved)
        }
        Err(e) => Err(format!("Error fetching price data: {}", e)),
    }
}