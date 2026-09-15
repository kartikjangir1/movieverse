import React from 'react'

export default function Home({ featuredMovie }) {
  const heroImage = featuredMovie?.image || '/assets/justice.jpg'
  const heroTitle = featuredMovie?.title || 'Featured Movie'

  return (
    <section
      id="home"
      className="hero"
      style={{
        backgroundImage: `url('${heroImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        height: 'clamp(380px, 52vw, 620px)',
      }}
    >
      <div className="hero-inner">
        <h2>Recently Released</h2>
        <h1>{heroTitle}</h1>
        <div className="hero-actions">
          <button className="btn" aria-label="Play trailer">
            <i className="bx bx-play"></i>
          </button>
        </div>
      </div>
    </section>
  )
}
