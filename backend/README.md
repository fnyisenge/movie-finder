MovieFinder

MovieFinder is a web application designed to help users quickly discover movies without wasting time searching across multiple platforms. It provides clean, organized results and filtering options, making it easier for users to decide what to watch.

Features

Search movies by title
Filter by release year
Sort results (popularity, rating, newest, oldest)
Secure API integration (API key hidden on backend)
Rate limiting (20 requests/minute)
Error handling for invalid inputs and API failures

Tech Stack

Node.js / Express
HTML, CSS, JavaScript
Nginx (reverse proxy & load balancer)
PM2

Local Setup

git clone https://github.com/fnyisenge/movie-finder.git
cd backend
npm install

Created a .env file:

Run the app:

npm run dev

# or

node app.js

Access:

http://localhost:3002

API Endpoint

GET /api/movies

Query parameters:

query (required)
year (optional)
sort (popularity, rating, newest, oldest)

Deployment

Web01 & Web02

Installed Node.js, Nginx, and Git
Cloned the repository and installed dependencies
Created .env file with API key
Ran the app using PM2
Configured Nginx as a reverse proxy to the Node.js app

Load Balancer (Lb01)

Configured Nginx with an upstream block pointing to Web01 and Web02
Set up proxy to distribute traffic between both servers
Restarted Nginx to apply changes

Testing

The application was accessed through the load balancer IP.
Multiple refresh requests confirmed that traffic is distributed between Web01 and Web02, ensuring scalability and reliability.

Data Source

Movie data is provided by TMDB:
https://www.themoviedb.org

This product uses the TMDB API but is not endorsed or certified by TMDB.

Notes

API keys are stored securely in .env
.env is excluded from version control
All code is original