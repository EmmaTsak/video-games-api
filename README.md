# video-games-api

A RESTful backend API for managing video games, users, authentication, filtering, sorting, pagination, and MongoDB aggregations.

This project was built with Node.js, Express, MongoDB, Mongoose, JWT authentication, and reusable API utilities. It is designed as a backend portfolio project to demonstrate REST API design, database modelling, authentication, error handling, and query features.

## Features

* RESTful CRUD operations for video games
* User signup and login
* Password hashing with bcrypt
* JWT authentication
* Role-based authorization structure
* MongoDB database with Mongoose models
* Filtering, sorting, field limiting, and pagination
* Search/query utility class for reusable API features
* Aggregation endpoints for statistics, genres, companies, and top-rated games
* Centralized error handling
* Custom operational error class
* Development data import/delete scripts
* Environment-based configuration

## Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JSON Web Tokens
* bcryptjs
* dotenv
* morgan
* nodemon

## Project Structure

```text
VideoGames_API/
│
├── app.js
├── server.js
├── package.json
├── package-lock.json
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
        ├── users.json
        └── video_games_dataset.json
```

## API Endpoints

### Games

```http
GET /api/v1/games
```

Get all games.

```http
GET /api/v1/games/:id
```

Get one game by ID.

```http
POST /api/v1/games
```

Create a new game.

```http
PATCH /api/v1/games/:id
```

Update a game.

```http
DELETE /api/v1/games/:id
```

Delete a game.

### Query Examples

```http
GET /api/v1/games?sort=-rating
```

Sort games by rating.

```http
GET /api/v1/games?price[lte]=30
```

Get games with price less than or equal to 30.

```http
GET /api/v1/games?page=2&limit=10
```

Paginate results.

```http
GET /api/v1/games?fields=title,rating,price
```

Limit returned fields.

```http
GET /api/v1/games?genreTags=Action,Adventure
```

Filter by genre tags.

### Aggregation Endpoints

```http
GET /api/v1/games/stats
```

Get overall game statistics.

```http
GET /api/v1/games/by-genre
```

Group games by genre.

```http
GET /api/v1/games/by-company
```

Group games by company.

```http
GET /api/v1/games/top-5-rated
```

Get top-rated games.

```http
GET /api/v1/games/top-5-cheap
```

Get cheapest games.

### Authentication

```http
POST /api/v1/users/signup
```

Create a new user account.

Example body:

```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "passwordConfirm": "password123"
}
```

```http
POST /api/v1/users/login
```

Log in and receive a JWT token.

Example body:

```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

## Environment Variables

Create a `config.env` file based on `config.example.env`.

```env
NODE_ENV=development
PORT=8000

DATABASE=mongodb+srv://USERNAME:<DATABASE_PASSWORD>@cluster.mongodb.net/video-games-api
DATABASE_PASSWORD=your_database_password_here

JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=90d
```

Do not commit real credentials to GitHub.

## Installation

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/video-games-api.git
cd video-games-api
```

Install dependencies:

```bash
npm install
```

Create your environment file:

```bash
cp config.example.env config.env
```

On Windows PowerShell:

```powershell
Copy-Item config.example.env config.env
```

Start the development server:

```bash
npm run dev
```

The API will run on:

```text
http://localhost:8000
```

## Import Development Data

Import sample video game data:

```bash
npm run import:dev
```

Delete sample data:

```bash
npm run delete:dev
```

## Example Response

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

## What I Learned

This project helped me practice:

* REST API architecture
* Express routing
* MongoDB data modelling
* Mongoose schema validation
* JWT authentication
* Password hashing
* Centralized error handling
* Query filtering and pagination
* Aggregation pipelines
* Environment configuration
* Backend project structure

## Future Improvements

* Add automated tests
* Add Swagger/OpenAPI documentation
* Add Docker support
* Add request rate limiting
* Add stronger input sanitization
* Add refresh tokens
* Deploy the API
* Add a small frontend dashboard
