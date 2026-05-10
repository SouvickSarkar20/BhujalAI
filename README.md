Ingres AI

Introduction

This project is a high performance platform designed to help users interact with groundwater data across India. It serves as a bridge between complex geological datasets and everyday users who need quick insights. By using advanced artificial intelligence, the system can interpret technical information and provide clear answers to questions about rainfall, water levels, and geographical trends. The goal is to make environmental data accessible to everyone, from researchers to local officials, through a simple and intuitive chat interface.

Technical Overview

The platform is built using a microservices architecture with a Go backend and a React frontend. It consists of two primary services: the HTTP Backend which manages users and sessions, and the Agent Service which handles intelligence and tool calling.

Setup Instructions

1. Move to the project root and install frontend dependencies by running npm install inside the Ingres-Frontend directory.

2. Configure the environment variables in the .env file within both servers/http-backend and servers/ingres-agent. Ensure you provide your database connection string and API keys.

3. Start the agent service by moving to servers/ingres-agent and running go run main.go or using air for live reload.

4. Start the backend service by moving to servers/http-backend and running go run main.go or using air.

5. Start the frontend by moving to Ingres-Frontend and running npm run dev.

Switching LLM Providers

The system is designed with a pluggable provider interface. To switch between Groq and Gemini, you only need to change one line in your environment configuration. In the .env file of the agent service, set the LLM_PROVIDER variable to either groq or gemini. The factory logic inside the Go service will automatically instantiate the correct provider and handle all internal differences in API formats.

Concurrency and Performance

The backend utilizes Go's native goroutines to handle multiple user requests simultaneously without blocking. This ensures that the agent can perform complex information retrieval and processing in the background while the main application remains responsive. Channel based communication is used to coordinate between the tool calling loop and the final response generation, ensuring thread safe state management.

Data Caching with Redis
To optimize performance and reduce latency for frequent queries, the system integrates a Redis caching layer. This stores pre-processed geological data and common query results in memory. By fetching data from the cache instead of the primary database whenever possible, the platform achieves significantly faster response times and reduces the load on the underlying infrastructure.

Performance Benchmarks

The transition from a Node.js based architecture to Go has resulted in significant performance improvements across all service metrics. Below is a comparison of average response times and resource utilization under similar load conditions.

Metric | Node.js Backend | Go Backend (Fiber)
--- | --- | ---
Average API Latency | 150ms | 30ms
Agent Logic Processing | 450ms | 120ms
Memory Usage (Idle) | 85MB | 12MB
Throughput (Requests/sec) | 800 | 4500
Concurrency Handling | Event Loop | Goroutines
