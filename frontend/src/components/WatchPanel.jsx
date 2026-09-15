import React, { useRef, useState } from 'react'

export default function WatchPanel({ title, trailer, mediaLabel = 'Preview' }) {
  const [showPlayer, setShowPlayer] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const frameRef = useRef(null)

  const controlTrailer = (command) => {
    frameRef.current?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: command, args: [] }), '*')
    setIsPlaying(command === 'playVideo')
  }

  if (!trailer) {
    return (
      <div className="watch-empty">
        <span className="watch-empty-icon" aria-hidden="true">▶</span>
        <div>
          <strong>Video unavailable</strong>
          <p>No trailer or licensed full movie is available in the app yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="watch-panel">
      <div className="watch-panel-heading">
        <div>
          <span className="watch-kicker">Watch inside MovieVerse</span>
        </div>
        <span className="watch-badge">In card</span>
      </div>
      {!showPlayer ? (
        <button type="button" className="watch-button" onClick={() => { setShowPlayer(true); setIsPlaying(false) }}>
          <span aria-hidden="true">▶</span> Play {mediaLabel}
        </button>
      ) : (
        <div className="watch-frame-wrap">
          <iframe
            ref={frameRef}
            className="watch-frame"
            src={trailer}
            title={`${title} ${mediaLabel.toLowerCase()}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
          <div className="watch-controls">
            <button type="button" onClick={() => controlTrailer('playVideo')} aria-pressed={isPlaying}>Play</button>
            <button type="button" onClick={() => controlTrailer('pauseVideo')} aria-pressed={!isPlaying}>Pause</button>
            <button type="button" className="watch-close" onClick={() => { setShowPlayer(false); setIsPlaying(false) }}>Close player</button>
          </div>
        </div>
      )}
      <p className="watch-note">Video plays here. You will stay on this page.</p>
    </div>
  )
}
