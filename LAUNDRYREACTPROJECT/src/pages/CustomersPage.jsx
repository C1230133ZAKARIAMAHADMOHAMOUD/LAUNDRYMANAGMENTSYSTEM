import React, { useState, useEffect } from 'react'
import { getCustomers, addCustomer, updateCustomer, deleteCustomer } from '../api.js'

const emptyForm = {
  fullName: '',
  phone: '',
  address: ''
}

function CustomersPage() {
  const [customers, setCustomers] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [editId, setEditId] = useState(null)
  const [search, setSearch] = useState('')
  const [msg, setMsg] = useState({ text: '', type: '' })
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState(false)

  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = async () => {
    try {
      setLoading(true)
      setApiError(false)
      const res = await getCustomers()
      setCustomers(res.data)
    } catch {
      setApiError(true)
      setCustomers([])
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

    if (!form.fullName.trim())
      e.fullName = 'Magaca waa loo baahan yahay'

    if (!form.phone.trim())
      e.phone = 'Telefoonka waa loo baahan yahay'
    else if (!/^[0-9+]{7,15}$/.test(form.phone.trim()))
      e.phone = 'Lambarka telefoonka waa inuu saxnaado'

    if (!form.address.trim())
      e.address = 'Cinwaanka waa loo baahan yahay'

    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const errs = validate()

    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setErrors({})

    try {
      
      if (editId) {
  await updateCustomer(editId, { ...form, customerId: editId })

  setCustomers(
    customers.map(c =>
      c.customerId === editId
        ? { ...c, ...form }
        : c
    )
  )

        showMsg('✅ Macmiilka waa la cusboonaysiiyay!', 'success')
        setEditId(null)
      } else {
        const res = await addCustomer(form)
        setCustomers([...customers, res.data])
        showMsg('✅ Macmiilka cusub waa la kudaray!', 'success')
      }

      setForm(emptyForm)

    } catch {
      showMsg('❌ Khalad ayaa dhacay, fadlan hubi backend-ka', 'danger')
    }
  }

  const handleEdit = (c) => {
    setEditId(c.customerId)

    setForm({
      fullName: c.fullName,
      phone: c.phone,
      address: c.address
    })

    setErrors({})
    window.scrollTo(0, 0)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Ma hubtaa inaad tirtirto macmiilkan?'))
      return

    try {
      await deleteCustomer(id)
    } catch {}

    setCustomers(customers.filter(c => c.customerId !== id))
    showMsg('🗑️ Macmiilka waa la tirtiiray!', 'danger')
  }

  const handleCancel = () => {
    setEditId(null)
    setForm(emptyForm)
    setErrors({})
  }

  const filtered = customers.filter(c =>
    c.fullName.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    c.address.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="page-container">

      <h2 className="page-title">👥 Macaamiisha (Customers)</h2>

      {apiError && (
        <div className="alert alert-danger" style={{ fontSize: '0.85rem' }}>
          ⚠️ API uma xidna — fadlan hubi backend-ka.
        </div>
      )}

      {msg.text && (
        <div className={`alert alert-${msg.type}`}>
          {msg.text}
        </div>
      )}

      <div className="card">

        <h3 style={{ marginBottom: 16, color: '#1a237e' }}>
          {editId ? '✏️ Tafatir Macmiilka' : '➕ Kudar Macmiil Cusub'}
        </h3>

        <form onSubmit={handleSubmit}>

          <div className="form-row">

            <div className="form-group">
              <label>Magaca Buuxa</label>

              <input
                type="text"
                placeholder="Geli magaca..."
                value={form.fullName}
                onChange={(e) =>
                  setForm({ ...form, fullName: e.target.value })
                }
              />

              {errors.fullName &&
                <div className="error-msg">{errors.fullName}</div>}
            </div>

            <div className="form-group">
              <label>Telefoon</label>

              <input
                type="text"
                placeholder="0615..."
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
              />

              {errors.phone &&
                <div className="error-msg">{errors.phone}</div>}
            </div>

          </div>

          <div className="form-group">

            <label>Cinwaan</label>

            <input
              type="text"
              placeholder="Magaalada / Xaafadda..."
              value={form.address}
              onChange={(e) =>
                setForm({ ...form, address: e.target.value })
              }
            />

            {errors.address &&
              <div className="error-msg">{errors.address}</div>}

          </div>

          <div style={{ display: 'flex', gap: 10 }}>

            <button
              type="submit"
              className={`btn ${editId ? 'btn-warning' : 'btn-success'}`}
            >
              {editId ? '💾 Keydi Isbeddelka' : '➕ Kudar'}
            </button>

            {editId && (
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleCancel}
              >
                ✖ Cancel
              </button>
            )}

          </div>

        </form>

      </div>

      <div className="card">

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 14
        }}>

          <h3 style={{ color: '#1a237e' }}>
            📋 Lista Macaamiisha ({filtered.length})
          </h3>

          <div className="search-bar" style={{ margin: 0 }}>
            <input
              type="text"
              placeholder="🔍 Raadi macmiil..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

        </div>

        {loading ? (
          <p style={{ textAlign: 'center', padding: 30 }}>
            ⏳ Loading...
          </p>
        ) : (

          <div className="table-wrapper">

            <table>

              <thead>
                <tr>
                  <th>#</th>
                  <th>Magaca</th>
                  <th>Telefoon</th>
                  <th>Cinwaan</th>
                  <th>Ficilada</th>
                </tr>
              </thead>

              <tbody>

                {filtered.length === 0 ? (

                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center' }}>
                      {search
                        ? 'Macmiil lama helin'
                        : 'Macaamiil ma jiraan weli'}
                    </td>
                  </tr>

                ) : (

                  filtered.map((c, i) => (

                    <tr key={c.customerId}>

                      <td>{i + 1}</td>

                      <td>
                        <strong>{c.fullName}</strong>
                      </td>

                      <td>{c.phone}</td>

                      <td>{c.address}</td>

                      <td>

                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => handleEdit(c)}
                          style={{ marginRight: 6 }}
                        >
                          ✏️ Edit
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(c.customerId)}
                        >
                          🗑️ Delete
                        </button>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  )
}

export default CustomersPage