import React, { useEffect, useState } from 'react'
import WatchPanel from './WatchPanel'
import { apiFetch } from '../api'

export default function MovieDetails({ movie, onClose, onSelectMovie }) {
  const [movieDetail, setMovieDetail] = useState(null)
  const [loadingDetail, setLoadingDetail] = useState(true)
  const [detailError, setDetailError] = useState('')

  useEffect(() => {
    let active = true
    setMovieDetail(null)
    setDetailError('')
    setLoadingDetail(true)

    apiFetch(`/api/movies/${movie.id}`)
      .then((response) => {
        if (!response.ok) throw new Error('Unable to load details')
        return response.json()
      })
      .then((detail) => {
        if (active) setMovieDetail(detail)
      })
      .catch(() => {
        if (active) setDetailError('Could not load movie details. Please try again.')
      })
      .finally(() => {
        if (active) setLoadingDetail(false)
      })

    return () => { active = false }
  }, [movie.id])

  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-card" onClick={(event) => event.stopPropagation()}>
        <div className="detail-header">
          <h3>{movie.title}</h3>
          <button className="close-btn" onClick={onClose} aria-label="Close details">×</button>
        </div>
        {loadingDetail ? <div className="detail-loading">Loading details…</div> : detailError ? <div className="detail-error">{detailError}</div> : movieDetail ? (
          <div className="detail-body">
            <div className="detail-image"><img src={movieDetail.image} alt={movieDetail.title} /></div>
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
                {movieDetail.cast?.length ? <div className="cast-list">{movieDetail.cast.map((member) => <span key={member}>{member}</span>)}</div> : <p>N/A</p>}
              </div>
              <WatchPanel title={movieDetail.title} trailer={movieDetail.trailer} mediaLabel="official trailer" />
              {movieDetail.similar?.length > 0 && <div className="similar-section"><h4>More like this</h4><div className="similar-grid">{movieDetail.similar.map((similarMovie) => <button type="button" className="similar-card" key={similarMovie.id} onClick={() => onSelectMovie?.(similarMovie)}><img src={similarMovie.image} alt={similarMovie.title} /><strong>{similarMovie.title}</strong><span>{similarMovie.info}</span></button>)}</div></div>}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
