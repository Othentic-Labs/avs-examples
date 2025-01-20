use actix_web::{web, HttpResponse, Responder};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use crate::services::dal_service; // Import from services/price.rs
use crate::services::oracle_service;  // Import from services/task.rs

#[derive(Deserialize)]
pub struct ExecuteTaskPayload {
    pub taskDefinitionId: Option<i32>, // optional in case it's not included in the request body
}

#[derive(Serialize)]
struct CustomResponse {
    status: String,
    data: HashMap<String, serde_json::Value>,
}

pub async fn execute_task(payload: web::Json<ExecuteTaskPayload>) -> impl Responder {
    println!("Executing Task");

    // Default taskDefinitionId to 0 if not provided
    let task_definition_id = payload.taskDefinitionId.unwrap_or(0);
    println!("task_definition_id: {}", task_definition_id);

    match oracle_service::get_price("ETHUSDT").await {
        Ok(price_data) => {
            let proof_of_task = price_data.price;
            let data = "hello"; // placeholder data

            // Send the task
            dal_service::send_task(proof_of_task.clone(), data.to_string(), task_definition_id).await?;;

            // Prepare the response data
            let mut response_data = HashMap::new();
            response_data.insert("proofOfTask".to_string(), serde_json::json!(proof_of_task));
            response_data.insert("data".to_string(), serde_json::json!(data));
            response_data.insert("taskDefinitionId".to_string(), serde_json::json!(task_definition_id));

            // Construct the response
            let response = CustomResponse {
                status: String::from("Task executed successfully"),
                data: response_data,
            };

            HttpResponse::Ok().json(response) // Return the response as JSON
        }
        Err(err) => {
            // Error fetching price
            eprintln!("Error fetching price: {}", err);
            HttpResponse::InternalServerError().json(serde_json::json!({
                "error": "Failed to fetch price"
            }))
        }
    }
}
