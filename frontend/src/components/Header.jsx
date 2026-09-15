import React, { useState, useEffect } from 'react'
import WatchPanel from './WatchPanel'
import { apiFetch } from '../api'

const normalizeText = (value = '') => String(value)
  .toLowerCase()
  .replace(/[^a-z0-9\s]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()

const scoreSearchMatch = (itemTitle = '', query = '') => {
  const title = normalizeText(itemTitle)
  const searchTerms = normalizeText(query).split(' ').filter(Boolean)

  if (!title || !searchTerms.length) return 0
  if (title === query) return 1000

  let score = 0
  const titleWords = title.split(' ')

  for (const term of searchTerms) {
    if (title.includes(term)) score += 40
    if (titleWords.includes(term)) score += 20
  }

  if (title.startsWith(searchTerms[0])) score += 25
  return score
}

const getMediaType = (item, movieList = [], tvList = []) => {
  if (item?.mediaType) return item.mediaType
  if (item?.type) return item.type
  if (item?.first_air_date || item?.name || item?.network || item?.schedule) {
    return 'tv'
  }
  if (movieList.some((movie) => String(movie.id) === String(item?.id))) return 'movie'
  if (tvList.some((show) => String(show.id) === String(item?.id))) return 'tv'
  return 'movie'
}

const getLocalSearchResults = (query, movies = [], trending = [], tvShows = []) => {
  const searchText = normalizeText(query)
  if (!searchText) return { movies: [], trending: [] }

  const allMatches = [...movies, ...trending, ...tvShows]
    .map((item) => ({
      ...item,
      mediaType: getMediaType(item, movies, tvShows),
      _score: scoreSearchMatch(item.title || item.name || '', searchText),
    }))
    .filter((item) => item._score > 0)
    .sort((a, b) => b._score - a._score)
    .slice(0, 8)

  return {
    movies: allMatches.filter((item) => getMediaType(item, movies, tvShows) === 'movie').slice(0, 4),
    trending: allMatches.filter((item) => getMediaType(item, movies, tvShows) === 'tv').slice(0, 4),
  }
}

export default function Header({ movies = [], trending = [], tvShows = [] }){
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
    const mediaType = getMediaType(item, movies, tvShows)
    setSelectedItem(item)
    setItemDetail(null)
    setDetailError('')
    setLoadingDetail(true)

    try {
      const candidates = []
      if (mediaType === 'tv' || item?.first_air_date || item?.name || item?.network || item?.schedule) {
        candidates.push(`/api/tvshows/${item.id}`)
      }
      if (mediaType === 'movie' || item?.release_date || item?.premiered || !candidates.length) {
        candidates.push(`/api/movies/${item.id}`)
      }
      if (!candidates.length) {
        candidates.push(`/api/tvshows/${item.id}`, `/api/movies/${item.id}`)
      }

      let detail = null
      for (const endpoint of candidates) {
        const response = await apiFetch(endpoint)
        if (response.ok) {
          detail = await response.json()
          break
        }
        if (response.status !== 404) {
          throw new Error('Unable to load details')
        }
      }

      if (!detail) {
        throw new Error('Unable to load details')
      }

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

  const openSimilarMovie = (movie) => openSearchDetail({ ...movie, mediaType: getMediaType(movie, movies, tvShows) })

  useEffect(() => {
    if (!searchOpen || !query.trim()) {
      setResults({ movies: [], trending: [] })
      setLoading(false)
      return
    }

    const localResults = getLocalSearchResults(query, movies, trending, tvShows)
    setResults(localResults)

    const controller = new AbortController()
    const timeout = setTimeout(() => {
      setLoading(true)
      setError('')
      apiFetch(`/api/search?q=${encodeURIComponent(query)}`, { signal: controller.signal })
        .then((res) => {
          if (!res.ok) throw new Error('Search request failed')
          return res.json()
        })
        .then((data) => {
          const remoteResults = {
            movies: Array.isArray(data.movies) ? data.movies : [],
            trending: Array.isArray(data.trending) ? data.trending : [],
          }

          const mergedResults = {
            movies: remoteResults.movies.length ? remoteResults.movies : localResults.movies,
            trending: remoteResults.trending.length ? remoteResults.trending : localResults.trending,
          }

          setResults(mergedResults)
          setLoading(false)
        })
        .catch((err) => {
          if (err.name !== 'AbortError') {
            setError('Unable to fetch search results.')
            setResults(localResults)
            setLoading(false)
          }
        })
    }, 200)

    return () => {
      clearTimeout(timeout)
      controller.abort()
    }
  }, [query, searchOpen, movies, trending, tvShows])

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
        <div className="header-actions">
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
                        {itemDetail.similar.map((similarMovie) => (
                          <button type="button" className="similar-card" key={similarMovie.id} onClick={() => openSimilarMovie(similarMovie)}>
                            <img src={similarMovie.image} alt={similarMovie.title} />
                            <strong>{similarMovie.title}</strong>
                            <span>{similarMovie.info}</span>
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
    </>
  )
}
