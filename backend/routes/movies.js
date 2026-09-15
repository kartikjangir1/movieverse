const express = require('express')
const router = express.Router()
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })

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

const mapVideoTrailer = (videos = []) => {
  const youtubeVideos = Array.isArray(videos)
    ? videos.filter((video) => video.site === 'YouTube' && video.key)
    : []
  const validTrailer = youtubeVideos.find((video) => video.official && ['Trailer', 'Official Trailer', 'Teaser'].includes(video.type))
    || youtubeVideos.find((video) => ['Trailer', 'Official Trailer'].includes(video.type))

  if (validTrailer?.key) {
    return `https://www.youtube.com/embed/${validTrailer.key}?enablejsapi=1&rel=0`
  }
  return ''
}

const fallbackMovies = [
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
  {
    id: '1433367',
    title: 'One Night Only',
    image: 'https://image.tmdb.org/t/p/w500/46q8z1TbbVcF8uhRHsvt5s0h2SH.jpg',
    info: '2026 | 6.8',
  },
  { id: '1108427', title: 'Moana', image: 'https://image.tmdb.org/t/p/w500/gaet1xQ2nxrG0V1Ep9T20ZMNEIC.jpg', info: '2026 | 6.9' },
  { id: '1185806', title: 'PAW Patrol: The Dino Movie', image: 'https://image.tmdb.org/t/p/w500/qnin56Syy5rbG7KCaxWY7SPuy6p.jpg', info: '2026 | 7.0' },
  { id: '1302904', title: 'Practical Magic 2', image: 'https://image.tmdb.org/t/p/w500/ogwQOLbCfncjvBhFb5l0OmQH8KC.jpg', info: '2026 | 6.6' },
  { id: '1440098', title: 'Drawn Together', image: 'https://image.tmdb.org/t/p/w500/6rpvddXbaQPOi0fB2HKWbZ3uUSg.jpg', info: '2026 | 6.9' },
  { id: '1522689', title: 'Why Did I Get Married Again?', image: 'https://image.tmdb.org/t/p/w500/rwaxLuOkJ5mMvJU5juNaPcKADOW.jpg', info: '2026 | 7.1' },
  { id: '1365884', title: 'Call My Agent! The Movie', image: 'https://image.tmdb.org/t/p/w500/p4SvSFIkjCs4y0C7yAcYP9XNmP2.jpg', info: '2026 | 5.0' },
]

router.get('/', async (req, res) => {
  try {
    if (!TMDB_KEY_OK) {
      return res.json(fallbackMovies)
    }

    const tmdbResponse = await fetch(tmdbUrl('/discover/movie?language=en-US&sort_by=popularity.desc&page=1'), { headers: TMDB_HEADERS })
    if (!tmdbResponse.ok) {
      return res.json(fallbackMovies)
    }

    const tmdbData = await tmdbResponse.json()
    const movies = Array.isArray(tmdbData.results) ? tmdbData.results.slice(0, 8).map((movie) => ({
      id: String(movie.id),
      title: movie.title,
      image: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/assets/nowhere.webp',
      info: `${movie.release_date?.slice(0, 4) || ''} | ${movie.vote_average || ''}`,
      summary: movie.overview || '',
      rating: String(movie.vote_average || ''),
      premiered: movie.release_date || '',
    })) : []

    return res.json(movies.length ? [...movies, ...fallbackMovies].slice(0, 10) : fallbackMovies)
  } catch (error) {
    return res.json(fallbackMovies)
  }
})

router.get('/:id', async (req, res) => {
  const { id } = req.params
  if (TMDB_KEY_OK && /^\d+$/.test(id)) {
    try {
      const detailResponse = await fetchTmdb(`/movie/${id}?language=en-US`, { headers: TMDB_HEADERS })
      if (!detailResponse.ok) {
        return res.status(404).json({ error: 'Movie not found' })
      }

      const movie = await detailResponse.json()
      const creditsResponse = await fetchTmdb(`/movie/${id}/credits?language=en-US`, { headers: TMDB_HEADERS })
      const credits = creditsResponse.ok ? await creditsResponse.json() : { cast: [] }
      const cast = Array.isArray(credits.cast) ? credits.cast.map((member) => member.name).filter(Boolean).slice(0, 8) : []

      const videosResponse = await fetchTmdb(`/movie/${id}/videos?language=en-US`, { headers: TMDB_HEADERS })
      const videos = videosResponse.ok ? await videosResponse.json() : { results: [] }
      const netflixTrailer = await findNetflixTrailer(movie.title)
      const similarResponse = await fetchTmdb(`/movie/${id}/similar?language=en-US&page=1`, { headers: TMDB_HEADERS })
      const similarData = similarResponse.ok ? await similarResponse.json() : { results: [] }
      const similar = Array.isArray(similarData.results)
        ? similarData.results.slice(0, 6).map((similarMovie) => ({
            id: String(similarMovie.id),
            title: similarMovie.title,
            image: similarMovie.poster_path ? `https://image.tmdb.org/t/p/w342${similarMovie.poster_path}` : '/assets/nowhere.webp',
            info: `${similarMovie.release_date?.slice(0, 4) || ''} | ${similarMovie.vote_average || ''}`,
          }))
        : []

      return res.json({
        id: String(movie.id),
        title: movie.title,
        image: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/assets/nowhere.webp',
        genres: (movie.genres || []).map((genre) => genre.name),
        language: movie.original_language || '',
        status: movie.status || '',
        premiered: movie.release_date || '',
        runtime: movie.runtime || '',
        rating: String(movie.vote_average || ''),
        summary: movie.overview || '',
        cast,
        network: (movie.production_companies || []).map((company) => company.name).join(', ') || '',
        schedule: '',
        trailer: netflixTrailer || mapVideoTrailer(videos.results || []),
        trailerSource: netflixTrailer ? 'Netflix' : 'TMDB',
        fullMovie: '',
        similar,
      })
    } catch (error) {
      return res.status(500).json({ error: 'Unable to load movie details' })
    }
  }

  return res.status(404).json({ error: 'Movie not found' })
})

module.exports = router
