const express = require('express')
const cors = require('cors')
const path = require('path')
const moviesRouter = require('./routes/movies')

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/movies', moviesRouter)

const mapShow = (show) => ({
  id: show.id,
  title: show.name,
  image: show.image?.medium || show.image?.original || '/assets/nowhere.webp',
  info: [show.type, show.language, show.genres?.join(', ')].filter(Boolean).join(' | '),
})

app.get('/api/trending', async (req, res) => {
  try {
    const response = await fetch('https://api.tvmaze.com/shows?page=1')
    const data = await response.json()
    const trending = Array.isArray(data) ? data.slice(0, 10).map(mapShow) : []
    res.json(trending)
  } catch (error) {
    res.status(500).json({ error: 'Unable to load trending shows' })
  }
})

app.get('/api/search', async (req, res) => {
  const query = String(req.query.q || '').trim()
  if (!query) {
    return res.json({ movies: [], trending: [] })
  }

  try {
    const response = await fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`)
    const data = await response.json()
    const results = Array.isArray(data) ? data.map((item) => mapShow(item.show)) : []
    res.json({ movies: results, trending: [] })
  } catch (error) {
    res.status(500).json({ error: 'Unable to search shows' })
  }
})

app.get('/api/tvshows', async (req, res) => {
  try {
    const response = await fetch('https://api.tvmaze.com/shows?page=2')
    const data = await response.json()
    const tvShows = Array.isArray(data) ? data.slice(0, 10).map(mapShow) : []
    res.json(tvShows)
  } catch (error) {
    res.status(500).json({ error: 'Unable to load TV shows' })
  }
})

// optional: serve frontend built files if present
const frontendDist = path.join(__dirname, '..', 'frontend', 'dist')
app.use(express.static(frontendDist))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`))
