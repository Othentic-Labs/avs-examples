# Use the official Rust image from Docker Hub as the base image
FROM rust:1.68 as builder

# Set the working directory in the container
WORKDIR /app

# Copy the Cargo.toml and Cargo.lock (if present) to avoid re-downloading dependencies on every build
COPY Cargo.toml Cargo.lock ./

# Build the dependencies first to leverage Docker's cache for faster builds
RUN cargo build --release && cargo clean

# Expose the application port
EXPOSE 8080

# Run the binary
CMD ["./app"]
