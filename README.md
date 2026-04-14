# Dream House Builder

A full-stack web application for browsing and booking dream houses, built with Node.js/Express backend and vanilla JavaScript frontend.

## Features

- Browse 12 house, villa, and bungalow listings
- Filter by property type
- Book properties with buyer details
- Real-time booking confirmation
- MongoDB integration for persistent storage

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Frontend**: HTML, CSS, Vanilla JavaScript
- **Middleware**: CORS, Dotenv

## Installation

### Prerequisites
- Node.js and npm
- MongoDB (running locally on port 27017)

### Setup

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd dream-house-final
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```
   MONGO_URI=mongodb://localhost:27017/buyer
   PORT=5000
   ```

4. Start MongoDB (if not running)

5. Run the server:
   ```bash
   npm start
   ```
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

6. Open `dream-house/frontend/index.html` in a browser

## Project Structure

```
.
├── server.js              # Express server configuration
├── buyer.js              # Mongoose schema for bookings
├── db.js                 # MongoDB connection
├── package.json          # Dependencies
├── .env                  # Environment variables (not in git)
├── .env.example          # Example env file
├── index.html            # Root home page
└── dream-house/
    └── frontend/
        └── index.html    # Main application page
```

## API Endpoints

- `GET /api/houses` - Get all house listings
- `GET /api/houses/:id` - Get single house details
- `POST /api/bookings` - Create a new booking
- `GET /api/bookings` - Get all bookings (admin)
- `GET /api/bookings/:id` - Get booking details
- `PATCH /api/bookings/:id/status` - Update booking status
- `DELETE /api/bookings/:id` - Cancel booking

## Development

Use `npm run dev` to run with nodemon for automatic restart on file changes.

## License

ISC
