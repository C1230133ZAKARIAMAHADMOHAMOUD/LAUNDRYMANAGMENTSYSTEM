import React, { useState, useEffect } from 'react'
import { getServices, addService, updateService, deleteService } from '../api.js'

const emptyForm = { serviceName: '', price: '' }

function ServicesPage() {
  const [services, setServices] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [editId, setEditId] = useState(null)
  const [search, setSearch] = useState('')
  const [msg, setMsg] = useState({ text: '', type: '' })
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState(false)

  useEffect(() => { loadServices() }, [])

  const loadServices = async () => {
    try {
      setLoading(true)
      const res = await getServices()
      setServices(res.data)
    } catch {
      setApiError(true)
      setServices([])
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
    if (!form.serviceName.trim()) e.serviceName = 'Magaca adeegga waa loo baahan yahay'
    if (!form.price) e.price = 'Qiimaha waa loo baahan yahay'
    else if (isNaN(form.price) || parseFloat(form.price) <= 0) e.price = 'Qiimaha waa inuu ahaado nambar togan'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    const payload = { serviceId: editId 
      || undefined, serviceName: 
      form.serviceName, price: parseFloat(form.price) }

    try {
      if (editId) {
        await updateService(editId, payload)
        setServices(services.map(s => s.serviceId === editId ? { ...s, ...payload } : s))
        showMsg('✅ Adeegga waa la cusboonaysiiyay!', 'success')
        setEditId(null)
      } else {
        const res = await addService(payload)
        setServices([...services, res.data])
        showMsg('✅ Adeegga cusub waa la kudaray!', 'success')
      }
    } catch {
      showMsg('❌ Khalad ayaa dhacay, fadlan hubi backend-ka', 'danger')
    }
    setForm(emptyForm)
  }

  const handleEdit = (s) => {
    setEditId(s.serviceId)
    setForm({ serviceName: s.serviceName, price: s.price.toString() })
    setErrors({})
    window.scrollTo(0, 0)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Ma hubtaa inaad tirtirto adeeggan?')) return
    try { await deleteService(id) } catch {}
    setServices(services.filter(s => s.serviceId !== id))
    showMsg('🗑️ Adeegga waa la tirtiiray!', 'danger')
  }

  const filtered = services.filter(s =>
    s.serviceName.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="page-container">
      <h2 className="page-title">🧹 Adeegyada (Services)</h2>

      {apiError && (
        <div className="alert alert-danger" style={{ fontSize: '0.85rem' }}>
          ⚠️ API uma xidna — fadlan hubi backend-ka (https://localhost:7291).
        </div>
      )}

      {msg.text && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

      <div className="card">
        <h3 style={{ marginBottom: 16, color: '#1a237e' }}>
          {editId ? '✏️ Tafatir Adeegga' : '➕ Kudar Adeeg Cusub'}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Magaca Adeegga</label>
              <input
                type="text"
                placeholder="Washing, Ironing..."
                value={form.serviceName}
                onChange={e => setForm({ ...form, serviceName: e.target.value })}
              />
              {errors.serviceName && <div className="error-msg">{errors.serviceName}</div>}
            </div>
            <div className="form-group">
              <label>Qiimaha ($)</label>
              <input
                type="number"
                placeholder="0.00"
                min="0"
                step="0.01"
                value={form.price}
                onChange={e => setForm({ ...form, price: e.target.value })}
              />
              {errors.price && <div className="error-msg">{errors.price}</div>}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" className={`btn ${editId ? 'btn-warning' : 'btn-success'}`}>
              {editId ? '💾 Keydi Isbeddelka' : '➕ Kudar'}
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
          <h3 style={{ color: '#1a237e' }}>📋 Lista Adeegyada ({filtered.length})</h3>
          <div className="search-bar" style={{ margin: 0 }}>
            <input
              type="text"
              placeholder="🔍 Raadi adeeg..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        {loading ? (
          <p style={{ color: '#888', textAlign: 'center', padding: 30 }}>⏳ Loading...</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>#</th><th>Adeegga</th><th>Qiimaha</th><th>Ficilada</th></tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan="4" style={{ textAlign: 'center', color: '#999', padding: 20 }}>
                    {search ? 'Adeeg lama helin' : 'Adeeg ma jiro weli'}
                  </td></tr>
                ) : filtered.map((s, i) => (
                  <tr key={s.serviceId}>
                    <td>{i + 1}</td>
                    <td><strong>{s.serviceName}</strong></td>
                    <td style={{ color: '#2e7d32', fontWeight: 700 }}>${parseFloat(s.price).toFixed(2)}</td>
                    <td>
                      <button className="btn btn-warning btn-sm" onClick={() => handleEdit(s)} style={{ marginRight: 6 }}>✏️ Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.serviceId)}>🗑️ Delete</button>
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

export default ServicesPage
