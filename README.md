# Custom URL Shortener API

A simple API that allows users to shorten long URLs, track analytics, and group URLs under specific topics. The API also includes Google Sign-In authentication, rate limiting, and detailed analytics features.

## Features

- User authentication via Google Sign-In
- Create short URLs from long URLs with optional custom aliases
- Group short URLs under categories like "acquisition", "activation", and "retention"
- Rate limiting for URL creation
- Analytics tracking for short URLs (clicks, device types, operating systems)
- Dockerized for easy deployment

# Project Configuration

This project requires the following environment variables to be configured. Replace the placeholders with your specific values.

## Application Configuration
- `PORT`: `<your_port>`  
  Specify the port on which the application will run.

- `BASE`: `<your_base_url>`  
  The base URL of the application.

## MongoDB Configuration
- `MONGO_URL`: `mongodb+srv://<your_username>:<your_password>@<your_cluster>.mongodb.net/?retryWrites=true&w=majority&appName=<your_app_name>`  
  MongoDB connection string with your username, password, and cluster information.

## Google OAuth Configuration
- `GOOGLE_CLIENT_ID`: `<your_google_client_id>`  
  Your Google OAuth client ID.

- `GOOGLE_CLIENT_SECRET`: `<your_google_client_secret>`  
  Your Google OAuth client secret.

- `GOOGLE_CALLBACK_URL`: `<your_google_callback_url>`  
  The callback URL for Google OAuth.

## Redis Configuration
- `REDIS_PASSWORD`: `<your_redis_password>`  
  Password for the Redis server.

- `REDIS_HOST`: `<your_redis_host>`  
  Host address of the Redis server.

- `REDIS_PORT`: `<your_redis_port>`  
  Port number for the Redis server.

## Security Configuration
- `JWT_SECRET`: `<your_jwt_secret>`  
  Secret key for JSON Web Token (JWT) authentication.

- `SESSION_SECRET`: `<your_session_secret>`  
  Secret key for session management.
# Project Setup and Configuration

Follow the steps below to set up and run the project in both development and production environments.

## Clone the Repository
1. Clone the repository to your local machine:
```bash
   git clone <repository_url>
```
3.Navigate to the project directory:
```bash
cd <project_directory>
```

## Install the required dependencies using npm

```bash
npm install
```

## Run in Development Mode
To run the project in development mode, use the following command:
```bash
npm run start:dev
```
# Run in Production Mode
To run the project in production mode, use the following command:
```bash
Copy code
npm run start:prod
## Deployed Link
```
You can access the deployed application at:
https://shorturl-1-iesr.onrender.com/
