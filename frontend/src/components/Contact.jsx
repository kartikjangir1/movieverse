import React from 'react'

export default function Contact(){
  return (
    <section id="newsletter" className="contact">
      <div className="section-header">
        <h2 className="section-title">Contact Us</h2>
      </div>
      <form className="contact-form" action="https://api.web3forms.com/submit" method="POST">
        <input type="hidden" name="access_key" value="e6e26d5d-9390-49c5-9deb-1a0e9d61ad4d" />
        <input type="text" name="first_name" placeholder="Enter Name" required />
        <input type="email" name="email" placeholder="Enter Email" required />
        <textarea name="message" rows="5" placeholder="Message" required></textarea>
        <button className="btn" type="submit">Send</button>
      </form>
    </section>
  )
}
