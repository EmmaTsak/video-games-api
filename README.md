# Video Games API

A RESTful backend API for managing video-game data, users, authentication, filtering, sorting, pagination, and MongoDB aggregations.

The project was built with **Node.js, Express, MongoDB, Mongoose, JWT, and bcrypt** to demonstrate backend API design, data modelling, authentication, reusable query utilities, and centralized error handling.

## What This Project Demonstrates

- RESTful CRUD operations
- MongoDB and Mongoose data modelling
- JWT signup and login
- Password hashing with bcrypt
- Protected admin user-management routes
- Reusable filtering, sorting, field limiting, and pagination
- MongoDB aggregation pipelines
- Centralized operational error handling
- Environment-based configuration
- Development data import scripts

---

## Tech Stack

### Backend

- Node.js
- Express.js
- JavaScript
- MongoDB
- Mongoose

### Authentication

- JSON Web Tokens
- bcryptjs

### Development Tools

- dotenv
- morgan
- nodemon

---

## API Structure

```text
Client
  ↓
Express Routes
  ↓
Controllers
  ↓
Mongoose Models
  ↓
MongoDB
```

Reusable utilities support:

```text
Filtering
Sorting
Field limiting
Pagination
Error handling
Authentication
Authorization
```

---

# Features

## Game CRUD

The API supports:

- retrieving all games
- retrieving one game
- creating a game
- updating a game
- deleting a game

Game data includes fields such as:

- title
- release year
- rating
- company
- type
- description
- price
- consoles
- genre tags
- completion time
- languages
- multiplayer modes
- age rating

---

## Query Features

The reusable `APIFeatures` utility supports:

- filtering
- advanced numeric filtering
- sorting
- field limiting
- pagination
- array filtering for fields such as genre tags and consoles

Examples:

```http
GET /api/v1/games?sort=-rating
```

```http
GET /api/v1/games?price[lte]=30
```

```http
GET /api/v1/games?page=2&limit=10
```

```http
GET /api/v1/games?fields=title,rating,price
```

```http
GET /api/v1/games?genreTags=Action,Adventure
```

---

## Authentication

Users can sign up and log in through JWT-based authentication.

### Signup

```http
POST /api/v1/users/signup
```

Example body:

```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "passwordConfirm": "password123"
}
```

A successful signup returns a JWT token.

---

### Login

```http
POST /api/v1/users/login
```

Example body:

```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

A successful login returns a JWT token.

---

## Protected Admin User Routes

User-management routes use authentication and role-based authorization.

The API uses:

```js
authController.protect
```

to verify the JWT and:

```js
authController.restrictTo('admin')
```

to restrict admin-only operations.

Admin-protected routes include:

```http
GET /api/v1/users
POST /api/v1/users
GET /api/v1/users/:id
PATCH /api/v1/users/:id
DELETE /api/v1/users/:id
```

Game routes themselves are currently not protected by authentication.

---

# API Endpoints

## Games

### Get all games

```http
GET /api/v1/games
```

### Get one game

```http
GET /api/v1/games/:id
```

### Create a game

```http
POST /api/v1/games
```

### Update a game

```http
PATCH /api/v1/games/:id
```

### Delete a game

```http
DELETE /api/v1/games/:id
```

---

# Aggregation Endpoints

## Game Statistics

```http
GET /api/v1/games/stats
```

Returns aggregated information such as:

- total number of games
- average rating
- average price
- minimum price
- maximum price
- average completion time

---

## Games by Genre

```http
GET /api/v1/games/by-genre
```

Groups games by genre and returns information such as:

- genre
- game count
- average rating
- sample game titles

---

## Games by Company

```http
GET /api/v1/games/by-company
```

Groups games by company and returns:

- company
- total number of games
- average rating
- sample game titles

---

## Top 5 Rated Games

```http
GET /api/v1/games/top-5-rated-query
```

This route uses alias middleware to automatically apply:

```text
sort=-rating
limit=5
fields=title,rating,company,type,price
```

---

## Top 5 Cheapest Games

```http
GET /api/v1/games/top-5-cheap
```

Returns a limited set of the lowest-priced games through query alias middleware.

---

# Error Handling

The application uses a custom operational error class:

```text
utils/appError.js
```

Centralized error handling is implemented through:

```text
controllers/errorController.js
```

Handled cases include:

- invalid MongoDB IDs
- duplicate database values
- Mongoose validation errors
- invalid JWTs
- expired JWTs
- missing resources
- unknown application errors

Development mode provides detailed error output.

Production mode avoids exposing unnecessary internal error details.

---

# Project Structure

```text
video-games-api/
├── app.js
├── server.js
├── package.json
├── config.example.env
│
├── controllers/
│   ├── authController.js
│   ├── errorController.js
│   ├── gameController.js
│   └── userController.js
│
├── models/
│   ├── gameModel.js
│   └── userModel.js
│
├── routes/
│   ├── gameRoutes.js
│   └── userRoutes.js
│
├── utils/
│   ├── apiFeatures.js
│   ├── appError.js
│   └── catchAsync.js
│
└── dev-data/
    ├── import-dev-data.js
    └── data/
```

---

# Local Setup

## Prerequisites

Install:

- Node.js
- npm
- MongoDB access
- Git

You can use either:

- a local MongoDB instance
- MongoDB Atlas

---

## Clone the Repository

```bash
git clone https://github.com/EmmaTsak/video-games-api.git
cd video-games-api
```

---

## Install Dependencies

```bash
npm install
```

---

## Environment Configuration

The repository includes:

```text
config.example.env
```

Create:

```text
config.env
```

based on the example file.

### Windows PowerShell

```powershell
Copy-Item config.example.env config.env
```

### macOS / Linux

```bash
cp config.example.env config.env
```

Example:

```env
NODE_ENV=development
PORT=8000

DATABASE=mongodb+srv://USERNAME:<DATABASE_PASSWORD>@cluster.mongodb.net/video-games-api
DATABASE_PASSWORD=your_database_password_here

JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=90d
```

Replace the placeholder values with your local development configuration.

Do not commit real credentials or JWT secrets.

---

# Running the API

Start the development server:

```bash
npm run dev
```

or:

```bash
npm start
```

The API runs on:

```text
http://localhost:8000
```

---

# Import Development Data

Import sample data:

```bash
npm run import:dev
```

Delete the imported development data:

```bash
npm run delete:dev
```

---

# Example Requests

## Sort by rating

```http
GET /api/v1/games?sort=-rating
```

---

## Filter by price

```http
GET /api/v1/games?price[lte]=30
```

---

## Pagination

```http
GET /api/v1/games?page=2&limit=10
```

---

## Field limiting

```http
GET /api/v1/games?fields=title,rating,price
```

---

## Filter by multiple genres

```http
GET /api/v1/games?genreTags=Action,Adventure
```

---

# Example Response

```json
{
  "status": "success",
  "results": 2,
  "data": {
    "games": [
      {
        "title": "Example Game",
        "releaseYear": 2020,
        "rating": 8.7,
        "company": "Example Studio",
        "type": "RPG",
        "price": 39.99
      }
    ]
  }
}
```

---

# Authentication Flow

The basic authentication flow is:

```text
Signup / Login
      ↓
Validate credentials
      ↓
Generate JWT
      ↓
Client sends Bearer token
      ↓
protect middleware
      ↓
User loaded from database
      ↓
restrictTo checks role where required
```

A protected request should include:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

---

# Data Validation

The game model includes validation for fields such as:

- required title
- unique title
- release year range
- rating range
- required company
- required type
- required description
- non-negative price

The user model includes:

- required name
- unique email
- minimum password length
- role validation
- password hashing before saving

---

# Security Notes

The project demonstrates several backend security foundations:

- password hashing using bcrypt
- JWT-based authentication
- protected middleware
- role-based authorization
- environment-based secrets
- password exclusion from normal queries
- centralized production error handling

This project is intended as a backend learning and portfolio project rather than a production-ready authentication platform.

---

# Known Limitations

Current limitations include:

- game CRUD routes are not currently authentication-protected
- automated tests are not yet included
- API documentation is provided in the README rather than Swagger/OpenAPI
- the API is not currently deployed
- advanced production security controls are outside the current project scope
- refresh-token handling is not implemented
- rate limiting is not implemented

---

# Future Improvements

Potential next steps include:

- automated unit tests
- integration tests
- Swagger/OpenAPI documentation
- Docker support
- request rate limiting
- stronger input sanitization
- refresh-token support
- deployed API environment
- frontend dashboard
- protecting selected game-management routes
- improved authorization rules

---

# What I Learned

This project helped me practise:

- REST API architecture
- Express routing
- MongoDB data modelling
- Mongoose validation
- reusable query abstractions
- JWT authentication
- password hashing
- authorization middleware
- centralized error handling
- filtering and pagination
- aggregation pipelines
- environment configuration
- backend project structure

---

# Author

**Emmanouela Tsakalidou**

GitHub:  
https://github.com/EmmaTsak

Portfolio:  
https://emmatsak.github.io/portfolio

---

## Project Status

The core backend functionality is implemented and suitable as a portfolio demonstration of Node.js, Express, MongoDB, authentication, query features, and API design.

Further work would focus primarily on automated testing, documentation, deployment, and additional security hardening.
