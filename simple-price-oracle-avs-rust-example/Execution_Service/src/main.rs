use std::env;
use actix_web::{web, App, HttpServer, Responder};
mod services;

mod handlers {
    pub mod task;
}

// Simulate DAL service initialization
fn init_dal_service() {
    println!("DAL service initialized.");
}

// Define a simple health-check endpoint
async fn health_check() -> impl Responder {
    "Server is running"
}

// Main function
#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Load environment variables (if using dotenv)
    dotenv::dotenv().ok();

    // Get the port from environment variables or default to 4003
    let port: u16 = env::var("PORT")
        .unwrap_or_else(|_| "4003".to_string())
        .parse()
        .expect("PORT must be a valid number");

    // Initialize DAL service
    init_dal_service();

    // Start the server
    println!("Server started on port: {}", port);
    HttpServer::new(|| {
        App::new()
        .route("/task/execute", web::post().to(handlers::task::execute_task))
    })
    .bind(("0.0.0.0", port))?
    .run()
    .await
}





// fn main() {
//     println!("Hello, world!");
// }
