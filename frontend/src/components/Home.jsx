import React from 'react'

const heroData = {
  image: '/assets/justice.jpg',
  heading: 'Featured Movie',
  titleLines: ['Justice League', 'Far from Home'],
}

export default function Home(){
  return (
    <section
      id="home"
      className="hero"
      style={{
        backgroundImage: `url('${heroData.image}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="hero-inner">
        <h2>{heroData.heading}</h2>
        <h1>
          {heroData.titleLines.map((line, index) => (
            <React.Fragment key={index}>
              {line}
              {index < heroData.titleLines.length - 1 && <br />}
            </React.Fragment>
          ))}
        </h1>
        <div className="hero-actions">
          <button className="btn" aria-label="Play trailer">
            <i className="bx bx-play"></i>
          </button>
        </div>
      </div>
    </section>
  )
}
