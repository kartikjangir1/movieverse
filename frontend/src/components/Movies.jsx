import React, { useState } from 'react'
import MovieDetails from './MovieDetails'

export default function Movies({ movies, loading }) {
  const [selectedMovie, setSelectedMovie] = useState(null)

  return (
    <section id="movies" className="movies">
      <h2 className="heading section-title">Movies</h2>
      <div className="movies-container">
        {loading ? (
          <div className="trending-empty">Loading movies...</div>
        ) : movies.map((movie, index) => (
          <div className="box" key={movie.id || index} onClick={() => setSelectedMovie(movie)}>
            <div className="box-img">
              <img src={movie.image} alt={movie.title} />
            </div>
            <h3>{movie.title}</h3>
            <span>{movie.info}</span>
          </div>
        ))}
      </div>

      {selectedMovie && (
        <MovieDetails
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          onSelectMovie={setSelectedMovie}
        />
      )}
    </section>
  )
}
