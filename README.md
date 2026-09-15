# 🎬 MovieVerse

MovieVerse is a movie discovery web application where users can explore movies, search for movies, view detailed information, and discover trending movies and TV shows.

## ✨ Features

- 🔎 Search movies
- 🎬 Browse movies
- 🔥 Trending movies
- 📺 TV shows
- 🎞️ Movie details
- ⭐ Ratings
- 📅 Release dates
- 🎭 Genres
- 👥 Cast information
- 🎥 Movie trailers
- 🔄 Similar movies
- 📱 Responsive design

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- JavaScript
- Tailwind CSS
- HTML5
- CSS

### Backend
- Node.js
- Express.js
- REST API
- TMDB API

### Deployment & Tools
- Git
- GitHub
- Render
- Vercel

## 📂 Project Structure

```text
MovieVerse/
│
├── backend/
│   ├── routes/
│   │   └── movies.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   ├── api.js
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── README.md

⚙️ Installation
1. Clone the Repository
git clone https://github.com/kartikjangir1/movieverse.git
cd movieverse
2. Install Backend Dependencies
cd backend
npm install
3. Add Environment Variable

Create a .env file inside the backend folder:

TMDB_API_KEY=your_tmdb_api_key
4. Start Backend
npm start

Backend will run on:

http://localhost:5000
5. Install Frontend Dependencies

Open a new terminal:

cd frontend
npm install
6. Start Frontend
npm run dev

Frontend will run on:

http://localhost:5173
🔑 Environment Variables

The project uses the TMDB API for movie and TV show data.

Backend .env:

TMDB_API_KEY=your_tmdb_api_key

Note: Never upload your .env file or expose your API key on GitHub.

🌐 API Endpoints
GET /api/movies
GET /api/movies/:id
GET /api/search
GET /api/trending
GET /api/tvshows
GET /api/tvshows/:id
🎬 Movie Details

MovieVerse provides information such as:

Movie title
Poster
Overview
Rating
Genres
Release date
Runtime
Language
Cast
Trailer
Similar movies
📱 Responsive Design

MovieVerse is designed to work on:

💻 Desktop
💻 Laptop
📱 Tablet
📱 Mobile
🚀 Deployment

The backend can be deployed on Render and the frontend can be deployed on Vercel.

For separate frontend and backend deployment, add the backend URL to the frontend environment variables:

VITE_API_URL=https://your-backend-url.onrender.com
🔮 Future Improvements
User authentication
Watchlist
Favorites
Movie reviews
Personalized recommendations
Advanced filters
👨‍💻 Author

Kartik Jangir

B.Tech Computer Science Engineering

⭐ Support

If you like this project, consider giving it a ⭐ on GitHub.
