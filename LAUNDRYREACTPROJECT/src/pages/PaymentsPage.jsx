import React, { useState, useEffect } from 'react'
import { getPayments, addPayment, updatePayment, deletePayment, getOrders } from '../api.js'

const emptyForm = { orderId: '', amount: '', paymentDate: '', paymentMethod: 'CASH' }
const METHODS = ['CASH', 'EVC PLUS', 'SALAAM BANK', 'PREMIER BANK']

function PaymentsPage() {
  const [payments, setPayments] = useState([])
  const [orders, setOrders] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [editId, setEditId] = useState(null)
  const [search, setSearch] = useState('')
  const [msg, setMsg] = useState({ text: '', type: '' })
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState(false)

  useEffect(() => { loadAll() }, [])

  const loadAll = async () => {
    try {
      setLoading(true)
      const [p, o] = await Promise.all([getPayments(), getOrders()])
      setPayments(p.data); setOrders(o.data)
    } catch {
      setApiError(true)
      setOrders([])
      setPayments([])
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
   if (!form.orderId) e.orderId = 'Select an order'
if (!form.amount) e.amount = 'Enter the payment amount'
else if (isNaN(form.amount) || parseFloat(form.amount) <= 0)
  e.amount = 'Amount must be a positive number'
if (!form.paymentDate) e.paymentDate = 'Select the payment date'
    return e
  }

  const handleOrderChange = (orderId) => {
    const ord = orders.find(o => o.orderId === parseInt(orderId))
    setForm({ ...form, orderId, amount: ord ? ord.totalAmount.toString() : '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    const payload = {
      orderId: parseInt(form.orderId),
      amount: parseFloat(form.amount),
      paymentDate: form.paymentDate,
      paymentMethod: form.paymentMethod
    }

    try {
      if (editId) {
        await updatePayment(editId, payload)
        setPayments(payments.map(p => p.paymentId === editId ? { ...p, ...payload } : p))
        showMsg('✅ Payment updated successfully!', 'success')
        setEditId(null)
      } else {
        const res = await addPayment(payload)
        setPayments([...payments, res.data])
        showMsg('✅ New payment added successfully!', 'success')
        
      }
    } catch {
      showMsg('❌ An error occurred. Please check the backend.', 'danger')
    }
    setForm(emptyForm)
  }

  const handleEdit = (p) => {
    setEditId(p.paymentId)
    setForm({
      orderId: p.orderId.toString(),
      amount: p.amount.toString(),
      paymentDate: p.paymentDate?.slice(0, 10) || '',
      paymentMethod: p.paymentMethod
    })
    setErrors({})
    window.scrollTo(0, 0)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this payment?')) return
    try { await deletePayment(id) } catch {}
    setPayments(payments.filter(p => p.paymentId !== id))
    showMsg('🗑️ Payment deleted successfully!', 'danger')
  }

  const filtered = payments.filter(p =>
    p.paymentMethod.toLowerCase().includes(search.toLowerCase()) ||
    p.orderId.toString().includes(search)
  )

  const totalPaid = filtered.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)

  return (
    <div className="page-container">
     <h2 className="page-title">💳 Payments</h2>

      {apiError && (
        <div className="alert alert-danger" style={{ fontSize: '0.85rem' }}>
         ⚠️ API is not connected — please check the backend (https://localhost:7291).
        </div>
      )}
      {msg.text && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', maxWidth: 400 }}>
        <div className="stat-card">
          <div className="stat-number">{payments.length}</div>
         <div className="stat-label">Total Payments</div>
        </div>
        <div className="stat-card green">
          <div className="stat-number">${totalPaid.toFixed(2)}</div>
          <div className="stat-label">Total Amount Paid</div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: 16, color: '#1a237e' }}>
          {editId ? '✏️ Tafatir Lacag Bixinta' : '➕ Kudar Lacag Bixin Cusub'}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Dalabka (Order ID)</label>
              <select value={form.orderId} onChange={e => handleOrderChange(e.target.value)}>
                <option value="">— Dooro Dalab —</option>
                {orders.map(o => <option key={o.orderId} value={o.orderId}>Order #{o.orderId} (${o.totalAmount})</option>)}
              </select>
              {errors.orderId && <div className="error-msg">{errors.orderId}</div>}
            </div>
            <div className="form-group">
              <label>Lacagta ($)</label>
              <input
                type="number" min="0" step="0.01" placeholder="0.00"
                value={form.amount}
                onChange={e => setForm({ ...form, amount: e.target.value })}
              />
              {errors.amount && <div className="error-msg">{errors.amount}</div>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Taariikhda</label>
              <input type="date" value={form.paymentDate} onChange={e => setForm({ ...form, paymentDate: e.target.value })} />
              {errors.paymentDate && <div className="error-msg">{errors.paymentDate}</div>}
            </div>
            <div className="form-group">
              <label>Habka Lacag Bixinta</label>
              <select value={form.paymentMethod} onChange={e => setForm({ ...form, paymentMethod: e.target.value })}>
                {METHODS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h3 style={{ color: '#1a237e' }}>💳 Lista Lacag Bixinta ({filtered.length})</h3>
          <input
            type="text"
            placeholder="🔍 Raadi..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ padding: '8px 12px', border: '1.5px solid #c5cae9', borderRadius: 6, outline: 'none', width: 220 }}
          />
        </div>

        {loading ? (
          <p style={{ color: '#888', textAlign: 'center', padding: 30 }}>⏳ Loading...</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>#</th><th>Order ID</th><th>Lacagta</th><th>Taariikhda</th><th>Habka</th><th>Ficilada</th></tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center', color: '#999', padding: 20 }}>Lacag bixin lama helin</td></tr>
                ) : filtered.map((p, i) => (
                  <tr key={p.paymentId}>
                    <td>{i + 1}</td>
                    <td>Order #{p.orderId}</td>
                    <td style={{ color: '#2e7d32', fontWeight: 700 }}>${parseFloat(p.amount).toFixed(2)}</td>
                    <td>{p.paymentDate?.slice(0, 10)}</td>
                    <td>
                      <span style={{
                        background: p.paymentMethod === 'CASH' ? '#e8f5e9' : p.paymentMethod === 'EVC PLUS' ? '#fff3e0' : '#e3f2fd',
                        color: p.paymentMethod === 'CASH' ? '#2e7d32' : p.paymentMethod === 'EVC PLUS' ? '#e65100' : '#1565c0',
                        padding: '3px 10px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 600
                      }}>
                        {p.paymentMethod}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-warning btn-sm" onClick={() => handleEdit(p)} style={{ marginRight: 6 }}>✏️</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.paymentId)}>🗑️</button>
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

export default PaymentsPage
