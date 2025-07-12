# Odoo Hackathon 2025 - Backend

A minimal Express.js backend for the Odoo Hackathon 2025 project.

## Features

- Express.js server with essential middleware
- CORS enabled for frontend communication
- Security headers with Helmet
- Request logging with Morgan
- Environment variable configuration
- Basic API endpoints
- Error handling

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Start the production server:
```bash
npm start
```

## API Endpoints

- `GET /` - Server status and info
- `GET /api/health` - Health check endpoint
- `GET /api/users` - Get all users (example)
- `POST /api/users` - Create a new user (example)

## Environment Variables

Copy `.env.example` to `.env` and configure:

- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 3001)
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:5173)

## Development

The server runs on port 3001 by default and is configured to work with the Vite frontend running on port 5173.

## Project Structure

```
backend/
├── server.js          # Main server file
├── package.json       # Dependencies and scripts
├── .env              # Environment variables
├── .gitignore        # Git ignore rules
└── README.md         # This file
```
