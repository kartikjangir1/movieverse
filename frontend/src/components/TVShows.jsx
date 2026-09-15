import React, { useRef, useState } from 'react'
import WatchPanel from './WatchPanel'

export default function TVShows({ items, loading }) {
  const sliderRef = useRef(null)
  const [selectedShow, setSelectedShow] = useState(null)
  const [showDetail, setShowDetail] = useState(null)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [detailError, setDetailError] = useState('')

  const scrollTVShows = (distance) => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: distance, behavior: 'smooth' })
    }
  }

  const openShow = async (item) => {
    setSelectedShow(item)
    setShowDetail(null)
    setDetailError('')
    setLoadingDetail(true)

    try {
      const response = await fetch(`/api/tvshows/${item.id}`)
      if (!response.ok) {
        throw new Error('Unable to load show details')
      }
      const detail = await response.json()
      setShowDetail(detail)
    } catch (error) {
      setDetailError('Could not load show details. Please try again.')
    } finally {
      setLoadingDetail(false)
    }
  }

  const closeShow = () => {
    setSelectedShow(null)
    setShowDetail(null)
    setDetailError('')
  }

  const openSimilarShow = (show) => openShow(show)

  return (
    <section id="tvshows" className="trending">
      <div className="section-header trending-header">
        <h2 className="section-title">TV Shows</h2>
        <div className="trending-controls">
          <button type="button" className="scroll-btn" onClick={() => scrollTVShows(-240)}>&lt;</button>
          <button type="button" className="scroll-btn" onClick={() => scrollTVShows(240)}>&gt;</button>
        </div>
      </div>
      <div className="trending-grid" ref={sliderRef}>
        {loading ? (
          <div className="trending-empty">Loading TV shows...</div>
        ) : items && items.length > 0 ? (
          items.map((item, index) => (
            <div className="trending-card" key={index} onClick={() => openShow(item)}>
              <div className="trending-img">
                <img src={item.image} alt={item.title} />
              </div>
              <h3>{item.title}</h3>
              <span>{item.info}</span>
            </div>
          ))
        ) : (
          <div className="trending-empty">No TV shows available yet.</div>
        )}
      </div>

      {selectedShow && (
        <div className="detail-overlay" onClick={closeShow}>
          <div className="detail-card" onClick={(event) => event.stopPropagation()}>
            <div className="detail-header">
              <h3>{selectedShow.title}</h3>
              <button className="close-btn" onClick={closeShow} aria-label="Close details">×</button>
            </div>
            {loadingDetail ? (
              <div className="detail-loading">Loading details…</div>
            ) : detailError ? (
              <div className="detail-error">{detailError}</div>
            ) : showDetail ? (
              <div className="detail-body">
                <div className="detail-image">
                  <img src={showDetail.image} alt={showDetail.title} />
                </div>
                <div className="detail-info">
                  <p className="detail-summary">{showDetail.summary}</p>
                  <div className="detail-meta">
                    <p><strong>Genres:</strong> {showDetail.genres?.join(', ') || 'N/A'}</p>
                    <p><strong>Language:</strong> {showDetail.language || 'N/A'}</p>
                    <p><strong>Release:</strong> {showDetail.premiered || 'N/A'}</p>
                    <p><strong>Runtime:</strong> {showDetail.runtime || 'N/A'} min</p>
                    <p><strong>Rating:</strong> {showDetail.rating || 'N/A'}</p>
                    <p><strong>Status:</strong> {showDetail.status || 'N/A'}</p>
                    <p><strong>Network:</strong> {showDetail.network || 'N/A'}</p>
                    <p><strong>Schedule:</strong> {showDetail.schedule || 'N/A'}</p>
                  </div>
                  <div className="detail-cast">
                    <h4>Cast</h4>
                    {showDetail.cast?.length ? (
                      <div className="cast-list">
                        {showDetail.cast.map((member) => <span key={member}>{member}</span>)}
                      </div>
                    ) : <p>N/A</p>}
                  </div>
                  <WatchPanel title={showDetail.title} trailer={showDetail.trailer} mediaLabel="official trailer" />
                  {showDetail.similar?.length > 0 && (
                    <div className="similar-section">
                      <h4>More like this</h4>
                      <div className="similar-grid">
                        {showDetail.similar.map((similarShow) => (
                          <button type="button" className="similar-card" key={similarShow.id} onClick={() => openSimilarShow(similarShow)}>
                            <img src={similarShow.image} alt={similarShow.title} />
                            <strong>{similarShow.title}</strong>
                            <span>{similarShow.info}</span>
                          </button>
                        ))}
                      </div>
                    </div>
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
