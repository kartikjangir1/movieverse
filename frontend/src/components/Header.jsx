import React, { useState, useEffect } from 'react'

export default function Header(){
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState({ movies: [], trending: [] })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const [itemDetail, setItemDetail] = useState(null)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [detailError, setDetailError] = useState('')

  const toggleSearch = () => {
    setSearchOpen((prev) => !prev)
    if (searchOpen) {
      setQuery('')
      setResults({ movies: [], trending: [] })
      setError('')
      setSelectedItem(null)
      setItemDetail(null)
      setDetailError('')
    }
  }

  const openSearchDetail = async (item) => {
    setSelectedItem(item)
    setItemDetail(null)
    setDetailError('')
    setLoadingDetail(true)

    try {
      const response = await fetch(`/api/movies/${item.id}`)
      if (!response.ok) {
        throw new Error('Unable to load details')
      }
      const detail = await response.json()
      setItemDetail(detail)
    } catch (err) {
      setDetailError('Could not load details. Please try again.')
    } finally {
      setLoadingDetail(false)
    }
  }

  const closeSearchDetail = () => {
    setSelectedItem(null)
    setItemDetail(null)
    setDetailError('')
  }

  useEffect(() => {
    if (!searchOpen || !query.trim()) {
      setResults({ movies: [], trending: [] })
      setLoading(false)
      return
    }

    const controller = new AbortController()
    const timeout = setTimeout(() => {
      setLoading(true)
      setError('')
      fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal: controller.signal })
        .then((res) => {
          if (!res.ok) throw new Error('Search request failed')
          return res.json()
        })
        .then((data) => {
          setResults({ movies: data.movies || [], trending: data.trending || [] })
          setLoading(false)
        })
        .catch((err) => {
          if (err.name !== 'AbortError') {
            setError('Unable to fetch search results.')
            setLoading(false)
          }
        })
    }, 300)

    return () => {
      clearTimeout(timeout)
      controller.abort()
    }
  }, [query, searchOpen])

  return (
    <>
      <header className="site-header">
        <div className="logo"><i className='bx bxs-movie'></i> MovieVerse</div>
        <button className={`menu-toggle ${open ? 'open' : ''}`} onClick={() => setOpen(!open)} aria-label="Toggle menu">☰</button>
        <nav className={`nav ${open ? 'active' : ''}`} onClick={() => setOpen(false)}>
          <a href="#home">Home</a>
          <a href="#movies">Movies</a>
          <a href="#tvshows">TV Shows</a>
          <a href="#coming">Trending</a>
          <a href="#newsletter">Contact</a>
        </nav>
        <div className="search">
          <button type="button" className="btn search-toggle" onClick={toggleSearch}>Search</button>
        </div>
      </header>
      {searchOpen && (
        <div className="search-overlay" onClick={toggleSearch} role="dialog" aria-modal="true">
          <div className="search-panel" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="close-search" onClick={toggleSearch} aria-label="Close search">×</button>
            <input
              type="search"
              className="search-input"
              placeholder="Search movies or trending titles..."
              aria-label="Search movies and trending titles"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            <div className="search-results">
              {!query.trim() ? (
                <p className="search-placeholder">Type a movie or trending title to see results.</p>
              ) : loading ? (
                <p className="search-placeholder">Searching...</p>
              ) : error ? (
                <p className="search-placeholder">{error}</p>
              ) : (
                <>
                  <div className="result-group">
                    <h3>Movies</h3>
                    <div className="result-list">
                      {results.movies.length > 0 ? (
                        results.movies.map((movie, idx) => (
                          <div className="result-card" key={`movie-${idx}`} onClick={() => openSearchDetail(movie)}>
                            <div className="result-img">
                              <img src={movie.image} alt={movie.title} />
                            </div>
                            <div>
                              <h4>{movie.title}</h4>
                              <p>{movie.info}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="no-results">No movies found.</p>
                      )}
                    </div>
                  </div>
                  <div className="result-group">
                    <h3>Trending</h3>
                    <div className="result-list">
                      {results.trending.length > 0 ? (
                        results.trending.map((item, idx) => (
                          <div className="result-card" key={`trend-${idx}`} onClick={() => openSearchDetail(item)}>
                            <div className="result-img">
                              <img src={item.image} alt={item.title} />
                            </div>
                            <div>
                              <h4>{item.title}</h4>
                              <p>{item.info}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="no-results">No trending items found.</p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      {selectedItem && (
        <div className="detail-overlay" onClick={closeSearchDetail}>
          <div className="detail-card" onClick={(e) => e.stopPropagation()}>
            <div className="detail-header">
              <h3>{selectedItem.title}</h3>
              <button className="close-btn" onClick={closeSearchDetail} aria-label="Close details">×</button>
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
                    <p>{itemDetail.cast?.length ? itemDetail.cast.join(', ') : 'N/A'}</p>
                  </div>
                  {itemDetail.officialSite && (
                    <p className="detail-link">
                      <a href={itemDetail.officialSite} target="_blank" rel="noreferrer">View official page</a>
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
    </>
  )
}
