import React, { useState, useEffect } from 'react'
import { getOrders, addOrder, updateOrder, deleteOrder, getCustomers, getServices } from '../api.js'

const emptyForm = { customerId: '', serviceId: '', orderDate: '', totalAmount: '', statuss: 'PENDING' }

const STATUSES = ['PENDING', 'READY', 'DELIVERED']

function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [customers, setCustomers] = useState([])
  const [services, setServices] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [editId, setEditId] = useState(null)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [msg, setMsg] = useState({ text: '', type: '' })
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState(false)

  useEffect(() => { loadAll() }, [])

  const loadAll = async () => {
    try {
      setLoading(true)
      const [o, c, s] = await Promise.all([getOrders(), getCustomers(), getServices()])
      setOrders(o.data); setCustomers(c.data); setServices(s.data)
    } catch {
      setApiError(true)
      setCustomers([])
      setServices([])
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const showMsg = (text, type) => {
    setMsg({ text, type })
    setTimeout(() => setMsg({ text: '', type: '' }), 3000)
  }

  const validate = () => {
    const e = {}
    if (!form.customerId) e.customerId = 'Macmiilka dooro'
    if (!form.serviceId) e.serviceId = 'Adeegga dooro'
    if (!form.orderDate) e.orderDate = 'Taariikhda geli'
    if (!form.totalAmount) e.totalAmount = 'Wadarta geli'
    else if (isNaN(form.totalAmount) || parseFloat(form.totalAmount) <= 0) e.totalAmount = 'Waa inuu ahaado nambar togan'
    return e
  }

  const handleServiceChange = (serviceId) => {
    const svc = services.find(s => s.serviceId === parseInt(serviceId))
    setForm({ ...form, serviceId, totalAmount: svc ? svc.price.toString() : '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    
    const payload = {
  orderId: editId || undefined,
  customerId: parseInt(form.customerId),
  serviceId: parseInt(form.serviceId),
  orderDate: form.orderDate,
  totalAmount: parseFloat(form.totalAmount),
  statuss: form.statuss
}

    try {
      if (editId) {
        await updateOrder(editId, payload)
        setOrders(orders.map(o => o.orderId === editId ? { ...o, ...payload } : o))
        showMsg('✅ Dalabka waa la cusboonaysiiyay!', 'success')
        setEditId(null)
      } else {
        const res = await addOrder(payload)
        setOrders([...orders, res.data])
        showMsg('✅ Dalabka cusub waa la kudaray!', 'success')
      }
    } catch {
      showMsg('❌ Khalad ayaa dhacay, fadlan hubi backend-ka', 'danger')
    }
    setForm(emptyForm)
  }

  const handleEdit = (o) => {
    setEditId(o.orderId)
    setForm({
      customerId: o.customerId.toString(),
      serviceId: o.serviceId.toString(),
      orderDate: o.orderDate?.slice(0, 10) || '',
      totalAmount: o.totalAmount.toString(),
      statuss: o.statuss
    })
    setErrors({})
    window.scrollTo(0, 0)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Ma hubtaa inaad tirtirto dalabkan?')) return
    try { await deleteOrder(id) } catch {}
    setOrders(orders.filter(o => o.orderId !== id))
    showMsg('🗑️ Dalabka waa la tirtiiray!', 'danger')
  }

  const getCustomerName = (id) => customers.find(c => c.customerId === id)?.fullName || id
  const getServiceName = (id) => services.find(s => s.serviceId === id)?.serviceName || id

  const badgeClass = (s) => s === 'PENDING' ? 'badge-pending' : s === 'READY' ? 'badge-ready' : 'badge-delivered'

  const filtered = orders.filter(o => {
    const matchSearch = getCustomerName(o.customerId).toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus ? o.statuss === filterStatus : true
    return matchSearch && matchStatus
  })

  return (
    <div className="page-container">
      <h2 className="page-title">📋 Dalabka (Orders)</h2>

      {apiError && (
        <div className="alert alert-danger" style={{ fontSize: '0.85rem' }}>
          ⚠️ API uma xidna — fadlan hubi backend-ka (https://localhost:7291).
        </div>
      )}
      {msg.text && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

      <div className="card">
        <h3 style={{ marginBottom: 16, color: '#1a237e' }}>
          {editId ? '✏️ Tafatir Dalabka' : '➕ Kudar Dalab Cusub'}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Macmiilka</label>
              <select value={form.customerId} onChange={e => setForm({ ...form, customerId: e.target.value })}>
                <option value="">— Dooro Macmiil —</option>
                {customers.map(c => <option key={c.customerId} value={c.customerId}>{c.fullName}</option>)}
              </select>
              {errors.customerId && <div className="error-msg">{errors.customerId}</div>}
            </div>
            <div className="form-group">
              <label>Adeegga</label>
              <select value={form.serviceId} onChange={e => handleServiceChange(e.target.value)}>
                <option value="">— Dooro Adeeg —</option>
                {services.map(s => <option key={s.serviceId} value={s.serviceId}>{s.serviceName} (${s.price})</option>)}
              </select>
              {errors.serviceId && <div className="error-msg">{errors.serviceId}</div>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Taariikhda</label>
              <input type="date" value={form.orderDate} onChange={e => setForm({ ...form, orderDate: e.target.value })} />
              {errors.orderDate && <div className="error-msg">{errors.orderDate}</div>}
            </div>
            <div className="form-group">
              <label>Wadarta ($)</label>
              <input
                type="number" min="0" step="0.01" placeholder="0.00"
                value={form.totalAmount}
                onChange={e => setForm({ ...form, totalAmount: e.target.value })}
              />
              {errors.totalAmount && <div className="error-msg">{errors.totalAmount}</div>}
            </div>
          </div>
          <div className="form-group" style={{ maxWidth: 200 }}>
            <label>Xaaladda</label>
            <select value={form.statuss} onChange={e => setForm({ ...form, statuss: e.target.value })}>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" className={`btn ${editId ? 'btn-warning' : 'btn-success'}`}>
              {editId ? '💾 Keydi' : '➕ Kudar'}
            </button>
            {editId && (
              <button type="button" className="btn btn-danger" onClick={() => { setEditId(null); setForm(emptyForm); setErrors({}) }}>
                ✖ Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
          <h3 style={{ color: '#1a237e' }}>📋 Lista Dalabka ({filtered.length})</h3>
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              type="text"
              placeholder="🔍 Raadi macmiil..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ padding: '8px 12px', border: '1.5px solid #c5cae9', borderRadius: 6, width: 200, outline: 'none' }}
            />
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              style={{ padding: '8px 12px', border: '1.5px solid #c5cae9', borderRadius: 6, outline: 'none' }}
            >
              <option value="">Dhammaan</option>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {loading ? (
          <p style={{ color: '#888', textAlign: 'center', padding: 30 }}>⏳ Loading...</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>#</th><th>Macmiilka</th><th>Adeegga</th><th>Taariikhda</th><th>Wadarta</th><th>Xaaladda</th><th>Ficilada</th></tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan="7" style={{ textAlign: 'center', color: '#999', padding: 20 }}>Dalab lama helin</td></tr>
                ) : filtered.map((o, i) => (
                  <tr key={o.orderId}>
                    <td>{i + 1}</td>
                    <td>{getCustomerName(o.customerId)}</td>
                    <td>{getServiceName(o.serviceId)}</td>
                    <td>{o.orderDate?.slice(0, 10)}</td>
                    <td style={{ color: '#2e7d32', fontWeight: 700 }}>${parseFloat(o.totalAmount).toFixed(2)}</td>
                    <td><span className={`badge ${badgeClass(o.statuss)}`}>{o.statuss}</span></td>
                    <td>
                      <button className="btn btn-warning btn-sm" onClick={() => handleEdit(o)} style={{ marginRight: 6 }}>✏️</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(o.orderId)}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrdersPage
