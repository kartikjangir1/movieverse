# MovieVerse

A React and Express application that uses TMDB to search movies and TV shows and display ratings, genres, cast, release dates, trailers, and more.

## Tech Stack

- React.js
- Node.js
- Express.js
- Vite
- TMDB API

## Features

- Search Movies
- Movie Details
- Responsive Design
- REST API Integration

## Trailer setup

For Netflix's official YouTube channel trailers, add a YouTube Data API v3 key to `backend/.env`:

```env
YOUTUBE_API_KEY=your_youtube_data_api_key
```

The backend searches only the Netflix channel and embeds the result inside the MovieVerse card. If the key is missing or no Netflix trailer matches, it falls back to an official TMDB trailer. The app never redirects to YouTube.
