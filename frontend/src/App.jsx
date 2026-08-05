import React, { useEffect, useState } from 'react'
import Header from './components/Header'
import Home from './components/Home'
import Movies from './components/Movies'
import Trending from './components/Trending'
import TVShows from './components/TVShows'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App(){
  const [movies, setMovies] = useState([])
  const [trending, setTrending] = useState([])
  const [tvShows, setTVShows] = useState([])

  useEffect(() => {
    fetch('/api/movies')
      .then((res) => res.json())
      .then(setMovies)
      .catch(() => setMovies([]))

    fetch('/api/trending')
      .then((res) => res.json())
      .then(setTrending)
      .catch(() => setTrending([]))

    fetch('/api/tvshows')
      .then((res) => res.json())
      .then(setTVShows)
      .catch(() => setTVShows([]))
  }, [])

  return (
    <div>
      <Header />
      <main>
        <Home />
        <Trending items={trending} />
        <Movies movies={movies} /> 
        <TVShows items={tvShows} />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
