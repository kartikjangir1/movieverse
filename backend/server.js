const express = require('express')
const cors = require('cors')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '.env') })
const moviesRouter = require('./routes/movies')

const app = express()
app.use(cors())
app.use(express.json())

const TMDB_API_KEY = (process.env.TMDB_API_KEY || '').trim()
const PLACEHOLDER_KEYS = new Set(['your_tmdb_api_key_here', 'PASTE_YOUR_TMDB_API_KEY_HERE'])
const TMDB_KEY_OK = Boolean(TMDB_API_KEY && !PLACEHOLDER_KEYS.has(TMDB_API_KEY))
const YOUTUBE_API_KEY = (process.env.YOUTUBE_API_KEY || '').trim()
const NETFLIX_CHANNEL_ID = 'UCWOA1ZGywLbqmigxE4Qlvuw'
const TMDB_HEADERS = { accept: 'application/json' }
const TMDB_BASE = 'https://api.themoviedb.org/3'
const tmdbUrl = (path) => `${TMDB_BASE}${path}${path.includes('?') ? '&' : '?'}api_key=${encodeURIComponent(TMDB_API_KEY)}`
const fetchTmdb = async (path, options = {}) => {
  let lastError
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await fetch(tmdbUrl(path), options)
    } catch (error) {
      lastError = error
    }
  }
  throw lastError
}

const findNetflixTrailer = async (title) => {
  if (!YOUTUBE_API_KEY) return ''
  const titleWords = title.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(/\s+/)
    .filter((word) => word.length > 2 && !['the', 'and', 'for', 'from', 'with'].includes(word))
  const params = new URLSearchParams({
    part: 'snippet',
    channelId: NETFLIX_CHANNEL_ID,
    q: `${title} trailer`,
    maxResults: '10',
    type: 'video',
    key: YOUTUBE_API_KEY,
  })
  try {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?${params}`)
    const data = response.ok ? await response.json() : null
    const matchingVideo = data?.items?.find((item) => {
      const videoTitle = item.snippet?.title?.toLowerCase() || ''
      return titleWords.length > 0 && titleWords.every((word) => videoTitle.includes(word))
    })
    const videoId = matchingVideo?.id?.videoId
    return videoId ? `https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0` : ''
  } catch (error) {
    return ''
  }
}

const posterUrl = (posterPath) => posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : '/assets/nowhere.webp'
const safeVote = (value) => Number.isFinite(Number(value)) ? Number(value).toFixed(1) : ''

const mapMovie = (movie) => ({
  id: String(movie.id),
  title: movie.title || movie.name || 'Untitled',
  image: posterUrl(movie.poster_path || movie.backdrop_path),
  info: `${movie.release_date?.slice(0, 4) || movie.first_air_date?.slice(0, 4) || ''} | ${safeVote(movie.vote_average || '')}`,
  summary: movie.overview || '',
  rating: safeVote(movie.vote_average || ''),
  premiered: movie.release_date || movie.first_air_date || '',
})

const mapTvShow = (show) => ({
  id: String(show.id),
  title: show.name || show.title || 'Untitled',
  image: posterUrl(show.poster_path || show.backdrop_path),
  info: `${show.first_air_date?.slice(0, 4) || ''} | ${safeVote(show.vote_average || '')}`,
  summary: show.overview || '',
  rating: safeVote(show.vote_average || ''),
  premiered: show.first_air_date || '',
})

const fallbackTrending = [
  {
    id: '1368337',
    title: 'The Odyssey',
    image: 'https://image.tmdb.org/t/p/w500/5rhTDKUhPYvpdQIijFIs5VoWsON.jpg',
    info: '2026 | 8.0',
  },
  {
    id: '969681',
    title: 'Spider-Man: Brand New Day',
    image: 'https://image.tmdb.org/t/p/w500/bjiS5ipwxb9JFy3XRRN4OAilSeX.jpg',
    info: '2026 | 7.9',
  },
  {
    id: '1137844',
    title: 'Mayday',
    image: 'https://image.tmdb.org/t/p/w500/hVXjX1jLZ1ljFSNGXpjJfbTUOa7.jpg',
    info: '2026 | 7.9',
  },
  { id: '1108427', title: 'Moana', image: 'https://image.tmdb.org/t/p/w500/gaet1xQ2nxrG0V1Ep9T20ZMNEIC.jpg', info: '2026 | 6.9' },
  { id: '1185806', title: 'PAW Patrol: The Dino Movie', image: 'https://image.tmdb.org/t/p/w500/qnin56Syy5rbG7KCaxWY7SPuy6p.jpg', info: '2026 | 7.0' },
  { id: '1302904', title: 'Practical Magic 2', image: 'https://image.tmdb.org/t/p/w500/ogwQOLbCfncjvBhFb5l0OmQH8KC.jpg', info: '2026 | 6.6' },
  { id: '1440098', title: 'Drawn Together', image: 'https://image.tmdb.org/t/p/w500/6rpvddXbaQPOi0fB2HKWbZ3uUSg.jpg', info: '2026 | 6.9' },
  { id: '1522689', title: 'Why Did I Get Married Again?', image: 'https://image.tmdb.org/t/p/w500/rwaxLuOkJ5mMvJU5juNaPcKADOW.jpg', info: '2026 | 7.1' },
  { id: '1365884', title: 'Call My Agent! The Movie', image: 'https://image.tmdb.org/t/p/w500/p4SvSFIkjCs4y0C7yAcYP9XNmP2.jpg', info: '2026 | 5.0' },
  { id: '1433367', title: 'One Night Only', image: 'https://image.tmdb.org/t/p/w500/46q8z1TbbVcF8uhRHsvt5s0h2SH.jpg', info: '2026 | 6.8' },
]

const fallbackTvShows = [
  { id: '1399', title: 'Game of Thrones', image: 'https://image.tmdb.org/t/p/w500/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg', info: '2011 | 8.4' },
  { id: '66732', title: 'Stranger Things', image: 'https://image.tmdb.org/t/p/w500/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg', info: '2016 | 8.6' },
  { id: '94605', title: 'Arcane', image: 'https://image.tmdb.org/t/p/w500/fqldf2t8ztc9aiwn3k6mlX3tvRT.jpg', info: '2021 | 8.7' },
  { id: '94954', title: 'The Penguin', image: 'https://image.tmdb.org/t/p/w500/vOWcqC4oDQws1doDWLO7d3dh5mm.jpg', info: '2024 | 8.6' },
  { id: '84958', title: 'Loki', image: 'https://image.tmdb.org/t/p/w500/voHUlGTsZJbWvGQY7rB5tFf2z5E.jpg', info: '2021 | 8.2' },
  { id: '60625', title: 'Rick and Morty', image: 'https://image.tmdb.org/t/p/w500/lo9qKqQk2WZbH8V3Yf5ZQJ7aT9R.jpg', info: '2013 | 8.7' },
  { id: '76479', title: 'The Boys', image: 'https://image.tmdb.org/t/p/w500/stTEycfG9928HYGEISBFaG1ngjM.jpg', info: '2019 | 8.5' },
  { id: '82856', title: 'The Mandalorian', image: 'https://image.tmdb.org/t/p/w500/eU1i6eHXlz4E2F4Ff9gY3f7Sx3G.jpg', info: '2019 | 8.4' },
  { id: '119051', title: 'Wednesday', image: 'https://image.tmdb.org/t/p/w500/9PFonBhy4cQy7Jz20NpMygczOkv.jpg', info: '2022 | 8.5' },
  { id: '66788', title: 'The Umbrella Academy', image: 'https://image.tmdb.org/t/p/w500/scZlQQYnDVlnpxFTxaIv2g0BWnL.jpg', info: '2019 | 7.9' },
]

app.use('/api/movies', moviesRouter)

app.get('/api/trending', async (req, res) => {
  try {
    if (!TMDB_KEY_OK) {
      return res.json(fallbackTrending)
    }

    const response = await fetch(tmdbUrl('/trending/movie/day?language=en-US&page=1'), { headers: TMDB_HEADERS })
    if (!response.ok) {
      return res.json(fallbackTrending)
    }

    const data = await response.json()
    const trending = Array.isArray(data.results) ? data.results.slice(0, 10).map(mapMovie) : []
    return res.json(trending.length ? trending : fallbackTrending)
  } catch (error) {
    return res.json(fallbackTrending)
  }
})

app.get('/api/search', async (req, res) => {
  const query = String(req.query.q || '').trim()
  if (!query) {
    return res.json({ movies: [], trending: [] })
  }

  try {
    if (!TMDB_KEY_OK) {
      return res.json({ movies: [], trending: [] })
    }

    const response = await fetch(tmdbUrl(`/search/multi?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`), { headers: TMDB_HEADERS })
    if (!response.ok) {
      return res.json({ movies: [], trending: [] })
    }

    const data = await response.json()
    const normalizedQuery = query.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim()
    const queryTerms = normalizedQuery ? normalizedQuery.split(' ').filter(Boolean) : []
    const scoreResult = (title = '') => {
      const cleanTitle = title.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim()
      if (!cleanTitle || !queryTerms.length) return 0
      let score = 0
      for (const term of queryTerms) {
        if (cleanTitle.includes(term)) score += 20
        if (cleanTitle.split(' ').includes(term)) score += 10
      }
      if (cleanTitle.startsWith(queryTerms[0])) score += 15
      return score
    }

    const results = Array.isArray(data.results)
      ? data.results
          .filter((item) => item.media_type === 'movie' || item.media_type === 'tv')
          .map((item) => {
            const mediaType = item.media_type === 'tv' ? 'tv' : 'movie'
            const mappedItem = mediaType === 'tv' ? mapTvShow(item) : mapMovie(item)
            return {
              ...mappedItem,
              mediaType,
              _score: scoreResult(item.title || item.name || ''),
            }
          })
          .filter((item) => item._score > 0)
          .sort((a, b) => b._score - a._score)
          .slice(0, 10)
      : []

    const movies = results.filter((item) => item.mediaType === 'movie').slice(0, 5)
    const trending = results.filter((item) => item.mediaType === 'tv').slice(0, 5)

    return res.json({ movies, trending })
  } catch (error) {
    return res.json({ movies: [], trending: [] })
  }
})

app.get('/api/tvshows/:id', async (req, res) => {
  const { id } = req.params
  if (!TMDB_KEY_OK || !/^\d+$/.test(id)) {
    return res.status(404).json({ error: 'TV show not found' })
  }

  try {
    const detailResponse = await fetchTmdb(`/tv/${id}?language=en-US`, { headers: TMDB_HEADERS })
    if (!detailResponse.ok) {
      return res.status(404).json({ error: 'TV show not found' })
    }

    const show = await detailResponse.json()
    const [creditsResult, videosResult, similarResult] = await Promise.allSettled([
      fetchTmdb(`/tv/${id}/credits?language=en-US`, { headers: TMDB_HEADERS }),
      fetchTmdb(`/tv/${id}/videos?language=en-US`, { headers: TMDB_HEADERS }),
      fetchTmdb(`/tv/${id}/similar?language=en-US&page=1`, { headers: TMDB_HEADERS }),
    ])
    const readResult = async (result, fallback) => result.status === 'fulfilled' && result.value.ok
      ? result.value.json()
      : fallback
    const credits = await readResult(creditsResult, { cast: [] })
    const videos = await readResult(videosResult, { results: [] })
    const similarData = await readResult(similarResult, { results: [] })
    const netflixTrailer = await findNetflixTrailer(show.name)
    const youtubeVideos = (videos.results || []).filter((video) => video.site === 'YouTube' && video.key)
    const youtubeVideo = youtubeVideos.find((video) => video.official && ['Trailer', 'Official Trailer', 'Teaser'].includes(video.type))
      || youtubeVideos.find((video) => ['Trailer', 'Official Trailer'].includes(video.type))
    const similar = Array.isArray(similarData.results)
      ? similarData.results.slice(0, 6).map(mapTvShow)
      : []

    return res.json({
      id: String(show.id),
      title: show.name,
      image: posterUrl(show.poster_path || show.backdrop_path),
      genres: show.genres?.map((genre) => genre.name) || [],
      language: show.original_language || '',
      status: show.status || '',
      premiered: show.first_air_date || '',
      runtime: show.episode_run_time?.[0] || '',
      rating: safeVote(show.vote_average || ''),
      summary: show.overview || '',
      cast: (credits.cast || []).map((member) => member.name).filter(Boolean).slice(0, 8),
      network: show.networks?.map((network) => network.name).join(', ') || '',
      schedule: show.episode_run_time?.length ? `${show.number_of_seasons || 0} seasons` : '',
      trailer: netflixTrailer || (youtubeVideo ? `https://www.youtube.com/embed/${youtubeVideo.key}?enablejsapi=1&rel=0` : ''),
      trailerSource: netflixTrailer ? 'Netflix' : 'TMDB',
      fullMovie: '',
      similar,
    })
  } catch (error) {
    return res.status(500).json({ error: 'Unable to load TV show details' })
  }
})

app.get('/api/tvshows', async (req, res) => {
  try {
    if (!TMDB_KEY_OK) {
      return res.json(fallbackTvShows)
    }

    const response = await fetch(tmdbUrl('/tv/popular?language=en-US&page=1'), { headers: TMDB_HEADERS })
    if (!response.ok) {
      return res.json(fallbackTvShows)
    }

    const data = await response.json()
    const tvShows = Array.isArray(data.results) ? data.results.slice(0, 10).map(mapTvShow) : []
    return res.json(tvShows.length ? [...tvShows, ...fallbackTvShows].slice(0, 10) : fallbackTvShows)
  } catch (error) {
    return res.json(fallbackTvShows)
  }
})

// optional: serve frontend built files if present
const frontendDist = path.join(__dirname, '..', 'frontend', 'dist')
app.use(express.static(frontendDist))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`))
