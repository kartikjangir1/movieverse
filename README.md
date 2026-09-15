# 🎬 MovieVerse

MovieVerse is a movie discovery web application built with React.js and Node.js. It allows users to explore movies, search for movies, view detailed movie information, and discover trending movies and TV shows.

## ✨ Features

- 🔎 Search movies
- 🎬 Browse movies
- 🔥 Trending movies
- 📺 TV shows
- 🎞️ Movie details
- ⭐ Movie ratings
- 📅 Release dates
- 🎭 Genres
- 👥 Cast information
- 🎥 Movie trailers
- 🔄 Similar movies
- 📱 Responsive design

## 🛠️ Tech Stack

**Frontend**
- React.js
- Vite
- JavaScript
- Tailwind CSS
- HTML5
- CSS

**Backend**
- Node.js
- Express.js
- REST API
- TMDB API

**Tools & Platforms**
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
│   └── package.json
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
```

## ⚙️ Installation

### 1. Clone the Repository

    git clone https://github.com/kartikjangir1/movieverse.git

### 2. Open the Project

    cd movieverse

### 3. Install Backend Dependencies

    cd backend
    npm install

### 4. Configure Environment Variables

Create a `.env` file inside the `backend` folder.

    TMDB_API_KEY=your_tmdb_api_key

Replace `your_tmdb_api_key` with your actual TMDB API key.

### 5. Start the Backend

    npm start

The backend will run on:

    http://localhost:5000

### 6. Install Frontend Dependencies

Open a new terminal:

    cd frontend
    npm install

### 7. Start the Frontend

    npm run dev

The frontend will run on:

    http://localhost:5173

## 🔑 Environment Variables

MovieVerse uses the TMDB API to fetch movie and TV show data.

Create the following variable in `backend/.env`:

    TMDB_API_KEY=your_tmdb_api_key

**Note:** Never upload your `.env` file or expose your API key publicly on GitHub.

## 🌐 API Endpoints

    GET /api/movies
    GET /api/movies/:id
    GET /api/search
    GET /api/trending
    GET /api/tvshows
    GET /api/tvshows/:id

## 🎬 Movie Details

MovieVerse provides detailed information about movies, including:

- Movie title
- Poster
- Overview
- Rating
- Genres
- Release date
- Runtime
- Language
- Status
- Cast
- Trailer
- Similar movies

## 🔥 Trending Content

Users can explore trending movies and TV shows through the trending section.

## 🔎 Search

Users can search for movies and find relevant movie information using the search feature.

## 📱 Responsive Design

MovieVerse is designed to work across:

- Desktop
- Laptop
- Tablet
- Mobile

## 🚀 Deployment

The backend can be deployed on Render and the frontend can be deployed on Vercel.

For separate frontend and backend deployment, add the backend URL to the frontend environment variables:

    VITE_API_URL=https://your-backend-url.onrender.com

If the backend serves the frontend from the same service, `VITE_API_URL` is not required.

## 🔮 Future Improvements

- User authentication
- Watchlist
- Favorites
- Movie reviews
- Personalized recommendations
- Advanced movie filters

## 👨‍💻 Author

**Kartik Jangir**

B.Tech Computer Science Engineering

## ⭐ Support

If you like this project, please give the repository a ⭐ on GitHub.
