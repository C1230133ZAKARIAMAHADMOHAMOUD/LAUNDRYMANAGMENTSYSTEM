import React from 'react'
import { NavLink } from 'react-router-dom'

function Navbar({ username, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        🧺LAUNDRY MANAGMENT SYSTEM
      </div>

      <div className="navbar-links">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>🏠 HOME</NavLink>
        <NavLink to="/customers" className={({ isActive }) => isActive ? 'active' : ''}>👥 CUSTOMERS</NavLink>
        <NavLink to="/services" className={({ isActive }) => isActive ? 'active' : ''}>🧹 SERVICES</NavLink>
        <NavLink to="/orders" className={({ isActive }) => isActive ? 'active' : ''}>📋 ORDERS</NavLink>
        <NavLink to="/payments" className={({ isActive }) => isActive ? 'active' : ''}>💳 PAYMENTS</NavLink>
        <NavLink to="/report" className={({ isActive }) => isActive ? 'active' : ''}>📊 REPORTS</NavLink>
        <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>ℹ️ ABOUT</NavLink>
        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginLeft: 8 }}>
          
        </span>
        <button className="logout-btn" onClick={onLogout}>Logout</button>
      </div>
    </nav>
  )
}

export default Navbar
