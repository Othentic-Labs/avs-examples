# Use the official Rust image from Docker Hub as the base image
FROM rust:latest as builder

# Set the working directory in the container
WORKDIR /app

COPY . .

RUN cargo build --release

# Expose the application port
EXPOSE 8080

# Run the binary
CMD ["./target/debug/Validation_Service"]
