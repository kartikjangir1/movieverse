import React, { useState } from 'react'

export default function Movies({movies}){
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [movieDetail, setMovieDetail] = useState(null)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [detailError, setDetailError] = useState('')

  const openMovie = async (movie) => {
    setSelectedMovie(movie)
    setMovieDetail(null)
    setDetailError('')
    setLoadingDetail(true)

    try {
      const response = await fetch(`/api/movies/${movie.id}`)
      if (!response.ok) {
        throw new Error('Unable to load details')
      }
      const detail = await response.json()
      setMovieDetail(detail)
    } catch (error) {
      setDetailError('Could not load movie details. Please try again.')
    } finally {
      setLoadingDetail(false)
    }
  }

  const closeMovie = () => {
    setSelectedMovie(null)
    setMovieDetail(null)
    setDetailError('')
  }

  return (
    <section id="movies" className="movies">
      <h2 className="heading section-title">Movies</h2>
      <div className="movies-container">
        {movies.slice(4).map((m, i) => (
          <div className="box" key={i} onClick={() => openMovie(m)}>
            <div className="box-img">
              <img src={m.image} alt={m.title} />
            </div>
            <h3>{m.title}</h3>
            <span>{m.info}</span>
          </div>
        ))}
      </div>

      {selectedMovie && (
        <div className="detail-overlay" onClick={closeMovie}>
          <div className="detail-card" onClick={(event) => event.stopPropagation()}>
            <div className="detail-header">
              <h3>{selectedMovie.title}</h3>
              <button className="close-btn" onClick={closeMovie} aria-label="Close details">×</button>
            </div>
            {loadingDetail ? (
              <div className="detail-loading">Loading details…</div>
            ) : detailError ? (
              <div className="detail-error">{detailError}</div>
            ) : movieDetail ? (
              <div className="detail-body">
                <div className="detail-image">
                  <img src={movieDetail.image} alt={movieDetail.title} />
                </div>
                <div className="detail-info">
                  <p className="detail-summary">{movieDetail.summary}</p>
                  <div className="detail-meta">
                    <p><strong>Genres:</strong> {movieDetail.genres?.join(', ') || 'N/A'}</p>
                    <p><strong>Language:</strong> {movieDetail.language || 'N/A'}</p>
                    <p><strong>Release:</strong> {movieDetail.premiered || 'N/A'}</p>
                    <p><strong>Runtime:</strong> {movieDetail.runtime || 'N/A'} min</p>
                    <p><strong>Rating:</strong> {movieDetail.rating || 'N/A'}</p>
                    <p><strong>Status:</strong> {movieDetail.status || 'N/A'}</p>
                    <p><strong>Network:</strong> {movieDetail.network || 'N/A'}</p>
                    <p><strong>Schedule:</strong> {movieDetail.schedule || 'N/A'}</p>
                  </div>
                  <div className="detail-cast">
                    <h4>Cast</h4>
                    <p>{movieDetail.cast?.length ? movieDetail.cast.join(', ') : 'N/A'}</p>
                  </div>
                  {movieDetail.officialSite && (
                    <p className="detail-link">
                      <a href={movieDetail.officialSite} target="_blank" rel="noreferrer">View official page</a>
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="detail-loading">Loading details…</div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
