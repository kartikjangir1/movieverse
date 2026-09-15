import React, { useEffect, useMemo, useState } from 'react'
import Header from './components/Header'
import Home from './components/Home'
import Movies from './components/Movies'
import Trending from './components/Trending'
import TVShows from './components/TVShows'
import Contact from './components/Contact'
import Footer from './components/Footer'
import { apiFetch } from './api'

export default function App(){
  const [movies, setMovies] = useState([])
  const [trending, setTrending] = useState([])
  const [tvShows, setTVShows] = useState([])
  const [moviesLoading, setMoviesLoading] = useState(true)
  const [trendingLoading, setTrendingLoading] = useState(true)
  const [tvShowsLoading, setTVShowsLoading] = useState(true)

  useEffect(() => {
    apiFetch('/api/movies')
      .then((res) => res.json())
      .then((data) => setMovies(Array.isArray(data) ? data : []))
      .catch(() => setMovies([]))
      .finally(() => setMoviesLoading(false))

    apiFetch('/api/trending')
      .then((res) => res.json())
      .then((data) => setTrending(Array.isArray(data) ? data : []))
      .catch(() => setTrending([]))
      .finally(() => setTrendingLoading(false))

    apiFetch('/api/tvshows')
      .then((res) => res.json())
      .then((data) => setTVShows(Array.isArray(data) ? data : []))
      .catch(() => setTVShows([]))
      .finally(() => setTVShowsLoading(false))
  }, [])

  const featuredMovie = useMemo(() => {
    const pool = [...trending, ...movies].filter(Boolean)
    if (!pool.length) return null
    return pool[Math.floor(Math.random() * pool.length)]
  }, [movies, trending])

  return (
    <div>
      <Header movies={movies} trending={trending} tvShows={tvShows} />
      <main>
        <Home featuredMovie={featuredMovie} />
        <Trending items={trending} loading={trendingLoading} />
        <Movies movies={movies} loading={moviesLoading} />
        <TVShows items={tvShows} loading={tvShowsLoading} />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
