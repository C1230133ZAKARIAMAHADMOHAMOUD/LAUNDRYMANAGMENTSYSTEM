import React, { useState, useEffect } from 'react'
import { getOrders, getCustomers, getServices } from '../api.js'

function ReportPage() {
  const [orders, setOrders] = useState([])
  const [customers, setCustomers] = useState([])
  const [services, setServices] = useState([])
  const [filterStatus, setFilterStatus] = useState('')
  const [filterFrom, setFilterFrom] = useState('')
  const [filterTo, setFilterTo] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadAll() }, [])

  const loadAll = async () => {
    try {
      setLoading(true)
      const [o, c, s] = await Promise.all([getOrders(), getCustomers(), getServices()])
      setOrders(o.data); setCustomers(c.data); setServices(s.data)
    } catch {
      setCustomers([])
      setServices([])
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const getCustomerName = (id) => customers.find(c => c.customerId === id)?.fullName || '-'
  const getServiceName = (id) => services.find(s => s.serviceId === id)?.serviceName || '-'
  const badgeClass = (s) => s === 'PENDING' ? 'badge-pending' : s === 'READY' ? 'badge-ready' : 'badge-delivered'

  const filtered = orders.filter(o => {
    if (filterStatus && o.statuss !== filterStatus) return false
    if (filterFrom && o.orderDate < filterFrom) return false
    if (filterTo && o.orderDate > filterTo) return false
    return true
  })

  const totalRevenue = filtered.reduce((s, o) => s + parseFloat(o.totalAmount || 0), 0)
  const pending = filtered.filter(o => o.statuss === 'PENDING').length
  const ready = filtered.filter(o => o.statuss === 'READY').length
  const delivered = filtered.filter(o => o.statuss === 'DELIVERED').length

  const handleReset = () => {
    setFilterStatus(''); setFilterFrom(''); setFilterTo('')
  }

  return (
    <div className="page-container">
      <h2 className="page-title">📊 Warbixinta (Report)</h2>

      <div className="card">
        <h3 style={{ marginBottom: 16, color: '#1a237e' }}>🔍 Shaandheyn (Filter)</h3>
        <div className="form-row" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <div className="form-group">
            <label>Xaaladda</label>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="">Dhammaan</option>
              <option value="PENDING">PENDING</option>
              <option value="READY">READY</option>
              <option value="DELIVERED">DELIVERED</option>
            </select>
          </div>
          <div className="form-group">
            <label>Laga bilaabo</label>
            <input type="date" value={filterFrom} onChange={e => setFilterFrom(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Ilaa</label>
            <input type="date" value={filterTo} onChange={e => setFilterTo(e.target.value)} />
          </div>
        </div>
        <button className="btn btn-primary" onClick={handleReset}>🔄 Dib u Celi</button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{filtered.length}</div>
          <div className="stat-label">Dalabka Guud</div>
        </div>
        <div className="stat-card green">
          <div className="stat-number">${totalRevenue.toFixed(2)}</div>
          <div className="stat-label">Dakhliga Guud</div>
        </div>
        <div className="stat-card orange">
          <div className="stat-number">{pending}</div>
          <div className="stat-label">PENDING</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" style={{ color: '#1565c0' }}>{ready}</div>
          <div className="stat-label">READY</div>
        </div>
        <div className="stat-card green">
          <div className="stat-number">{delivered}</div>
          <div className="stat-label">DELIVERED</div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: 14, color: '#1a237e' }}>
          📋 Natiijada: {filtered.length} dalab
        </h3>
        {loading ? (
          <p style={{ color: '#888', textAlign: 'center', padding: 30 }}>⏳ Loading...</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Macmiilka</th>
                  <th>Adeegga</th>
                  <th>Taariikhda</th>
                  <th>Wadarta</th>
                  <th>Xaaladda</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center', color: '#999', padding: 24 }}>
                    Dalab lama helin — Beddel filter-ka
                  </td></tr>
                ) : filtered.map((o, i) => (
                  <tr key={o.orderId}>
                    <td>{i + 1}</td>
                    <td>{getCustomerName(o.customerId)}</td>
                    <td>{getServiceName(o.serviceId)}</td>
                    <td>{o.orderDate?.slice(0, 10)}</td>
                    <td style={{ color: '#2e7d32', fontWeight: 700 }}>${parseFloat(o.totalAmount).toFixed(2)}</td>
                    <td><span className={`badge ${badgeClass(o.statuss)}`}>{o.statuss}</span></td>
                  </tr>
                ))}
                {filtered.length > 0 && (
                  <tr style={{ background: '#f5f7ff' }}>
                    <td colSpan="4" style={{ textAlign: 'right', fontWeight: 700, paddingRight: 14 }}>WADARTA:</td>
                    <td style={{ color: '#2e7d32', fontWeight: 700 }}>${totalRevenue.toFixed(2)}</td>
                    <td></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReportPage
