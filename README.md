# Pioneer Labs Backend Project

This is a simple backend built with Node.js with Express.js framework to build robust api's and MongoDB. It provides endpoints for user registration, user login, and fetching data from public APIs. Additionally, it includes an endpoint to fetch Ethereum balance for a given address.

## Prerequisites

- Node.js installed on your machine

- MongoDB database (either locally installed or using a service like MongoDB Atlas)

- Infura API key for accessing the Ethereum mainnet (for fetching Ethereum balance)

## Installation
```

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:

Create a `.env` file in the root directory and add the following variables:

MONGO_URI=<your_mongodb_uri>

INFURA_KEY=<your_infura_api_key>

Replace `<your_mongodb_uri>` with your MongoDB connection string and `<your_infura_api_key>` with your Infura API key.

## Usage

1. Start the server:

```bash
npm start
```

2. Register a new user:

Send a POST request to `/api/auth/register` with the following JSON body:

```json
{
  "username": "your_username",
  "email": "your_email@example.com",
  "password": "your_password"
}
```

1. Login with the registered user:

Send a POST request to /api/auth/login with the following JSON body:

```json
{
  "email": "your_email@example.com",
  "password": "your_password"
}
```

This will return a JWT token which you can use for accessing protected routes.

Fetch data from public APIs:

Send a GET request to /api/getdata with query parameters limit and category. Include the JWT token in the Authorization header for authentication.

```bash
GET /api/getdata?limit=10&category=Animals
Authorization: Bearer <your_jwt_token>
```

Fetch Ethereum balance:

Send a GET request to /ethbalance/{address} with the Ethereum address for which you want to fetch the balance.

Example request:

```bash
GET /ethbalance/0x1234567890abcdef1234567890abcdef12345678
```

## Contributing

Contributions are welcome! Feel free to open issues or pull requests for any improvements or new features.

```bash
Make sure to replace placeholders like `<repository_url>`, `<your_mongodb_uri>`, and `<your_infura_api_key>` with actual values specific to your project.
```