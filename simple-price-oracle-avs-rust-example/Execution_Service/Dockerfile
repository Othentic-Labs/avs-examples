FROM lukemathwalker/cargo-chef:latest as chef
WORKDIR /app

FROM chef AS planner
COPY ./Cargo.toml ./Cargo.lock ./
COPY ./src ./src
RUN cargo chef prepare

FROM chef AS builder
COPY --from=planner /app/recipe.json .
RUN cargo chef cook --release
COPY . .
RUN cargo build --release
RUN mv ./target/release/Execution_Service ./app

FROM debian:stable-slim AS runtime
RUN apt-get update && apt-get install -y \
    libssl3 \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=builder /app /usr/local/bin/
ENTRYPOINT ["/usr/local/bin/app"]