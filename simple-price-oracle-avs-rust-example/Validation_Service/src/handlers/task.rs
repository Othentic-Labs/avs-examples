use actix_web::{web, HttpResponse, Responder};
use serde::{Deserialize, Serialize};
use serde_json::json;
use log::{info, error};
use crate::services::validation_service;

#[derive(Deserialize)]
pub struct ValidateRequest {
    pub proofOfTask: String,
}

#[derive(Serialize)]
pub struct CustomResponse {
    pub data: serde_json::Value,
    pub message: String,
}

#[derive(Serialize)]
pub struct ErrorResponse {
    pub data: serde_json::Value,
    pub error: bool,
    pub message: String,
}

impl CustomResponse {
    pub fn new(data: serde_json::Value, message: &str) -> Self {
        CustomResponse {
            data,
            message: message.to_string(),
        }
    }
}

impl ErrorResponse {
    pub fn new(data: serde_json::Value, message: &str) -> Self {
        ErrorResponse {
            data,
            error: true, // set error flag to true
            message: message.to_string(),
        }
    }
}

// Handler for the `validate` endpoint
pub async fn validate_task(request: web::Json<ValidateRequest>) -> impl Responder {
    let proof_of_task = &request.proofOfTask;

    info!("proofOfTask: {}", proof_of_task);

    match validation_service::validate(&proof_of_task).await {
        Ok(result) => {
            info!("Vote: {}", if result { "Approve" } else { "Not Approved" });

            let response = CustomResponse::new(
                json!({ "result": result }),
                "Task validated successfully",
            );

            HttpResponse::Ok().json(response)
        }
        Err(err) => {
            error!("Validation error: {}", err);
            
            let response = ErrorResponse::new(
                json!({}),
                "Error during validation step",
            );
            
            HttpResponse::InternalServerError().json(response)
        }
    }
}
