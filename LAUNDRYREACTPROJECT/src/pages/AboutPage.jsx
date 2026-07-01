import React from 'react'

function AboutPage() {
  return (
    <div className="page-container">
      <h2 className="page-title">ℹ️ About</h2>

      <div className="card">
        <div className="about-section">
          <h3>🧺 Laundry Management System</h3>
          <p>
            This system is designed to manage laundry operations efficiently. It helps you
            easily manage customers, services, orders, and payments in one place.
          </p>
        </div>

        <div className="about-section">
          <h3>🎓 Project Information</h3>
          <div style={{ background: '#f5f7ff', padding: 16, borderRadius: 8 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {[
                  ['Project', 'React + ASP.NET Core Web API'],
                  ['Database', 'SQL Server — LAUNDRYMANAGMENTDB'],
                  ['Frontend', 'React 18 + React Router'],
                  ['Backend', 'ASP.NET Core Web API'],
                  ['Database Connection', 'ADO.NET'],
                  ['Course', 'Advanced C# / Full Stack'],
                ].map(([k, v]) => (
                  <tr key={k}>
                    <td
                      style={{
                        padding: '8px 12px',
                        fontWeight: 600,
                        color: '#555',
                        width: '40%',
                      }}
                    >
                      {k}
                    </td>
                    <td
                      style={{
                        padding: '8px 12px',
                        color: '#1a237e',
                      }}
                    >
                      {v}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="about-section">
          <h3>👤 Student</h3>
          <div className="team-card">
            <div className="avatar">Z</div>
            <div>
              <div style={{ fontWeight: 700 }}>ZAKARIA MAHAD MOHAMOUD</div>
              <div style={{ color: '#888', fontSize: '0.85rem' }}>
                0615074954 · Mogadishu
              </div>
            </div>
          </div>
        </div>

        <div className="about-section">
          <h3>📋 System Pages</h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 10,
            }}
          >
            {[
              ['🔐', 'Login Page', 'Admin authentication'],
              ['🏠', 'Home Page', 'Welcome dashboard'],
              ['👥', 'Customers', 'Customer CRUD operations'],
              ['🧹', 'Services', 'Service CRUD operations'],
              ['📋', 'Orders', 'Order CRUD operations'],
              ['💳', 'Payments', 'Payment CRUD operations'],
              ['📊', 'Reports', 'Reports & filtering'],
              ['ℹ️', 'About', 'Project information'],
            ].map(([icon, name, desc]) => (
              <div
                key={name}
                style={{
                  padding: '10px 14px',
                  background: '#f5f7ff',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <span style={{ fontSize: '1.3rem' }}>{icon}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                    {name}
                  </div>
                  <div style={{ color: '#888', fontSize: '0.8rem' }}>
                    {desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="about-section">
          <h3>🗄️ Database Tables</h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 10,
            }}
          >
            {[
              {
                name: 'CUSTOMERS',
                cols: 'CustomerID, FullName, Phone, Address',
              },
              {
                name: 'SERVICES',
                cols: 'ServiceID, ServiceName, Price',
              },
              {
                name: 'ORDERS',
                cols: 'OrderID, CustomerID, ServiceID, Date, Amount, Status',
              },
              {
                name: 'PAYMENTS',
                cols: 'PaymentID, OrderID, Amount, Date, Method',
              },
            ].map((t) => (
              <div
                key={t.name}
                style={{
                  padding: '12px 16px',
                  border: '1.5px solid #c5cae9',
                  borderRadius: 8,
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    color: '#1a237e',
                    marginBottom: 4,
                  }}
                >
                  📊 {t.name}
                </div>
                <div
                  style={{
                    fontSize: '0.8rem',
                    color: '#777',
                  }}
                >
                  {t.cols}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage