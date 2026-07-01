import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import LoginPage from './pages/LoginPage.jsx'
import WelcomePage from './pages/WelcomePage.jsx'
import CustomersPage from './pages/CustomersPage.jsx'
import ServicesPage from './pages/ServicesPage.jsx'
import OrdersPage from './pages/OrdersPage.jsx'
import PaymentsPage from './pages/PaymentsPage.jsx'
import ReportPage from './pages/ReportPage.jsx'
import AboutPage from './pages/AboutPage.jsx'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')

  const handleLogin = (user) => {
    setIsLoggedIn(true)
    setUsername(user)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUsername('')
  }

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />
  }

  return (
    <BrowserRouter>
      <Navbar username={username} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<WelcomePage username={username} />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/payments" element={<PaymentsPage />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
