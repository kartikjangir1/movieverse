import React, { useRef, useState } from 'react'
import WatchPanel from './WatchPanel'
import { apiFetch } from '../api'

export default function Trending({ items, loading }){
  const sliderRef = useRef(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const [itemDetail, setItemDetail] = useState(null)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [detailError, setDetailError] = useState('')

  const scrollTrending = (distance) => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: distance, behavior: 'smooth' })
    }
  }

  const openItem = async (item) => {
    setSelectedItem(item)
    setItemDetail(null)
    setDetailError('')
    setLoadingDetail(true)

    try {
      const response = await apiFetch(`/api/movies/${item.id}`)
      if (!response.ok) {
        throw new Error('Unable to load details')
      }
      const detail = await response.json()
      setItemDetail(detail)
    } catch (error) {
      setDetailError('Could not load details. Please try again.')
    } finally {
      setLoadingDetail(false)
    }
  }

  const closeItem = () => {
    setSelectedItem(null)
    setItemDetail(null)
    setDetailError('')
  }

  const openSimilarItem = (item) => openItem(item)

  return (
    <section id="coming" className="trending">
      <div className="section-header trending-header">
        <h2 className="section-title">Trending Now</h2>
        <div className="trending-controls">
          <button type="button" className="scroll-btn" onClick={() => scrollTrending(-240)}>&lt;</button>
          <button type="button" className="scroll-btn" onClick={() => scrollTrending(240)}>&gt;</button>
        </div>
      </div>
      <div className="trending-grid" ref={sliderRef}>
        {loading ? (
          <div className="trending-empty">Loading trending movies...</div>
        ) : items && items.length > 0 ? (
          items.map((item, index) => (
            <div className="trending-card" key={index} onClick={() => openItem(item)}>
              <div className="trending-img">
                <img src={item.image} alt={item.title} />
              </div>
              <h3>{item.title}</h3>
              <span>{item.info}</span>
            </div>
          ))
        ) : (
          <div className="trending-empty">No trending shows available right now.</div>
        )}
      </div>

      {selectedItem && (
        <div className="detail-overlay" onClick={closeItem}>
          <div className="detail-card" onClick={(event) => event.stopPropagation()}>
            <div className="detail-header">
              <h3>{selectedItem.title}</h3>
              <button className="close-btn" onClick={closeItem} aria-label="Close details">×</button>
            </div>
            {loadingDetail ? (
              <div className="detail-loading">Loading details…</div>
            ) : detailError ? (
              <div className="detail-error">{detailError}</div>
            ) : itemDetail ? (
              <div className="detail-body">
                <div className="detail-image">
                  <img src={itemDetail.image} alt={itemDetail.title} />
                </div>
                <div className="detail-info">
                  <p className="detail-summary">{itemDetail.summary}</p>
                  <div className="detail-meta">
                    <p><strong>Genres:</strong> {itemDetail.genres?.join(', ') || 'N/A'}</p>
                    <p><strong>Language:</strong> {itemDetail.language || 'N/A'}</p>
                    <p><strong>Release:</strong> {itemDetail.premiered || 'N/A'}</p>
                    <p><strong>Runtime:</strong> {itemDetail.runtime || 'N/A'} min</p>
                    <p><strong>Rating:</strong> {itemDetail.rating || 'N/A'}</p>
                    <p><strong>Status:</strong> {itemDetail.status || 'N/A'}</p>
                    <p><strong>Network:</strong> {itemDetail.network || 'N/A'}</p>
                    <p><strong>Schedule:</strong> {itemDetail.schedule || 'N/A'}</p>
                  </div>
                  <div className="detail-cast">
                    <h4>Cast</h4>
                    {itemDetail.cast?.length ? (
                      <div className="cast-list">
                        {itemDetail.cast.map((member) => <span key={member}>{member}</span>)}
                      </div>
                    ) : <p>N/A</p>}
                  </div>
                  <WatchPanel title={itemDetail.title} trailer={itemDetail.trailer} mediaLabel="official trailer" />
                  {itemDetail.similar?.length > 0 && (
                    <div className="similar-section">
                      <h4>More like this</h4>
                      <div className="similar-grid">
                        {itemDetail.similar.map((similarItem) => (
                          <button type="button" className="similar-card" key={similarItem.id} onClick={() => openSimilarItem(similarItem)}>
                            <img src={similarItem.image} alt={similarItem.title} />
                            <strong>{similarItem.title}</strong>
                            <span>{similarItem.info}</span>
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
