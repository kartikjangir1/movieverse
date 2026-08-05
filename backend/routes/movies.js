const express = require('express')
const router = express.Router()

const mapShow = (show) => ({
  id: show.id,
  title: show.name,
  image: show.image?.medium || show.image?.original || '/assets/nowhere.webp',
  info: [show.type, show.language, show.genres?.join(', ')].filter(Boolean).join(' | '),
})

const bollywoodMovies = [
  {
    id: 'bollywood-1',
    title: '3 Idiots',
    image: 'https://m.media-amazon.com/images/M/MV5BODk4N2E4NjYtNjBiMi00MjhhLWI0MTItZmI5MWQ5ZGMzN2Y0XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg',
    info: 'Comedy | Hindi | 2009',
    summary: 'Two friends from an Indian engineering college struggle with the pressure of a rigid system and a strict professor. A hilarious and emotional ride about creativity, friendship, and following your passion.',
    premiered: '2009-12-25',
    rating: '8.4',
    cast: ['Aamir Khan', 'Kareena Kapoor', 'R. Madhavan', 'Sharman Joshi'],
    runtime: 170,
    officialSite: 'https://en.wikipedia.org/wiki/3_Idiots',
  },
  {
    id: 'bollywood-2',
    title: 'Dangal',
    image: 'https://m.media-amazon.com/images/M/MV5BODU3NjMwNjczOV5BMl5BanBnXkFtZTgwNzA5OTk3MzE@._V1_.jpg',
    info: 'Sports | Hindi | 2016',
    summary: 'Former wrestler Mahavir Singh Phogat trains his daughters to become world-class wrestlers, defying social norms and family pressure. A true story of grit, sacrifice, and empowerment.',
    premiered: '2016-12-23',
    rating: '8.4',
    cast: ['Aamir Khan', 'Sakshi Tanwar', 'Fatima Sana Shaikh', 'Sanya Malhotra'],
    runtime: 161,
    officialSite: 'https://en.wikipedia.org/wiki/Dangal_(film)',
  },
  {
    id: 'bollywood-3',
    title: 'Gully Boy',
    image: 'https://m.media-amazon.com/images/M/MV5BOWY1Y2MwNDItNTE3Zi00MzBhLWI2ZGUtMDE2NDE2ZDAwYjYzXkEyXkFqcGdeQXVyNjUwNzk3NDc@._V1_.jpg',
    info: 'Music | Hindi | 2019',
    summary: 'A young rapper from Mumbai rises from the slums to stardom while battling family pressure and social constraints. Inspired by the underground rap scene in India.',
    premiered: '2019-02-14',
    rating: '8.0',
    cast: ['Ranveer Singh', 'Alia Bhatt', 'Siddhant Chaturvedi'],
    runtime: 153,
    officialSite: 'https://en.wikipedia.org/wiki/Gully_Boy',
  },
  {
    id: 'bollywood-4',
    title: 'Queen',
    image: 'https://m.media-amazon.com/images/M/MV5BMTkwOTAyOTY5MV5BMl5BanBnXkFtZTgwOTc1NDUxNzE@._V1_.jpg',
    info: 'Drama | Hindi | 2014',
    summary: 'A newlywed woman embarks on a solo honeymoon after her husband cancels the wedding, discovering her independence and courage across Europe.',
    premiered: '2014-03-07',
    rating: '8.2',
    cast: ['Kangana Ranaut', 'Rajkummar Rao', 'Lisa Haydon'],
    runtime: 146,
    officialSite: 'https://en.wikipedia.org/wiki/Queen_(2014_film)',
  },
]

router.get('/', async (req, res) => {
  try {
    const response = await fetch('https://api.tvmaze.com/shows?page=0')
    const data = await response.json()
    const movies = Array.isArray(data) ? data.slice(0, 8).map(mapShow) : []
    res.json([...bollywoodMovies, ...movies])
  } catch (error) {
    res.status(500).json({ error: 'Unable to load movies' })
  }
})

const mapDetail = (show, cast = []) => ({
  id: show.id,
  title: show.name,
  image: show.image?.original || show.image?.medium || '/assets/nowhere.webp',
  genres: show.genres || [],
  language: show.language || '',
  status: show.status || '',
  premiered: show.premiered || '',
  runtime: show.runtime || show.averageRuntime || '',
  rating: show.rating?.average || '',
  officialSite: show.officialSite || show.url || '',
  summary: show.summary ? show.summary.replace(/<[^>]+>/g, '') : '',
  cast: cast.map((member) => member.person?.name).filter(Boolean).slice(0, 8),
  network: show.network?.name || show.webChannel?.name || '',
  schedule: show.schedule ? `${show.schedule.days.join(', ')} at ${show.schedule.time}` : '',
})

router.get('/:id', async (req, res) => {
  const { id } = req.params
  const bollywoodDetail = bollywoodMovies.find((movie) => movie.id === id)
  if (bollywoodDetail) {
    return res.json({
      ...bollywoodDetail,
      genres: bollywoodDetail.info.split('|').map((part) => part.trim()).slice(0, -1),
      status: 'Released',
      network: 'Bollywood',
      schedule: '',
    })
  }

  try {
    const response = await fetch(`https://api.tvmaze.com/shows/${id}?embed=cast`)
    if (!response.ok) {
      return res.status(404).json({ error: 'Show not found' })
    }
    const show = await response.json()
    const details = mapDetail(show, show._embedded?.cast || [])
    res.json(details)
  } catch (error) {
    res.status(500).json({ error: 'Unable to load show details' })
  }
})

module.exports = router
