import React from 'react'
import { Link } from 'react-router-dom'

function WelcomePage({ username }) {
  const today = new Date().toLocaleDateString('so-SO', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })

  const links = [
    { to: '/customers', icon: '👥', title: 'Macaamiisha', desc: 'Kudar, Edit, Delete', color: '#1a73e8' },
    { to: '/services', icon: '🧹', title: 'Adeegyada', desc: 'Washing, Ironing...', color: '#2e7d32' },
    { to: '/orders', icon: '📋', title: 'Dalabka', desc: 'Pending, Ready, Delivered', color: '#ef6c00' },
    { to: '/payments', icon: '💳', title: 'Lacag Bixinta', desc: 'EVC, Cash, Bank', color: '#6a1b9a' },
    { to: '/report', icon: '📊', title: 'Warbixin', desc: 'Shaandheyn & Filter', color: '#c62828' },
    { to: '/about', icon: 'ℹ️', title: 'Ku Saabsan', desc: 'Macluumaadka Project', color: '#00838f' },
  ]

  return (
    <div className="page-container">
      <div className="welcome-hero">
        <div className="hero-icon">🧺</div>
        <h1>WELCOME TO LAUNDRY {username}!</h1>
        <p>Laundry Management System — Maamul Dhaqso &amp; Sahlan</p>
      
      </div>

      <h2 className="section-heading">⚡ Aad u Dhaqso</h2>

      <div className="quick-links">
        {links.map(l => (
          <Link key={l.to} to={l.to} className="quick-link-card" style={{ borderTopColor: l.color }}>
            <div className="icon">{l.icon}</div>
            <h3>{l.title}</h3>
            <p style={{ fontSize: '0.82rem', color: '#777', marginTop: 4 }}>{l.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default WelcomePage
