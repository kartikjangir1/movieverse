import React from 'react'

export default function Footer(){
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-left">
          <div className="footer-brand"><i className='bx bxs-movie'></i>MovieVerse</div>
          <div className="footer-credit">Developed by Kartik Jangir</div>
        </div>
        <div className="footer-right">
          <div className="footer-socials" aria-label="Social links">
            <a href="https://github.com/Vjuo" target="_blank" rel="noreferrer" aria-label="GitHub">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.29 9.43 7.86 10.95.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.38-3.88-1.38-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.76 2.7 1.25 3.35.95.1-.74.4-1.25.73-1.54-2.56-.29-5.25-1.28-5.25-5.71 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.18 1.19a11.1 11.1 0 0 1 5.8 0c2.21-1.5 3.18-1.19 3.18-1.19.63 1.58.23 2.75.11 3.04.74.81 1.19 1.84 1.19 3.1 0 4.44-2.69 5.42-5.26 5.71.41.36.77 1.07.77 2.16 0 1.56-.01 2.82-.01 3.2 0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"/>
              </svg>
            </a>
            <a href="https://www.linkedin.com/in/kartik-jangir-432651279" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.94 8.5A1.56 1.56 0 1 0 6.94 5.38a1.56 1.56 0 0 0 0 3.12ZM5.5 9.75h2.88V18H5.5zM10.4 9.75h2.76v1.13h.04c.38-.72 1.32-1.48 2.71-1.48 2.9 0 3.43 1.91 3.43 4.39V18h-2.88v-7.52c0-1.79-.03-4.09-2.49-4.09-2.5 0-2.88 1.95-2.88 3.95V18H10.4z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
        <div className="footer-copy">© 2025 MovieVerse. All rights reserved.</div>
    </footer>
  )
}
