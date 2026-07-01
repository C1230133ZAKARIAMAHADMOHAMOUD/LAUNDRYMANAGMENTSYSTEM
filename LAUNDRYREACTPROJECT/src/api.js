import axios from 'axios'

// ⚠️ HUBSO PORT-KAAGA (7291 ama mid kale)
const BASE_URL = 'https://localhost:7291/api'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' }
})

/* =======================
   LOGIN / USERS
======================= */
export const loginUser = (data) => api.post('/users/login', data)

export const getUsers = () => api.get('/users')
export const addUser = (data) => api.post('/users', data)
export const updateUser = (id, data) => api.put(`/users/${id}`, data)
export const deleteUser = (id) => api.delete(`/users/${id}`)

/* =======================
   CUSTOMERS
======================= */

export const getCustomers = () => api.get('/customers')
export const addCustomer = (data) => api.post('/customers', data)
export const updateCustomer = (id, data) => api.put(`/customers/${id}`, data)
export const deleteCustomer = (id) => api.delete(`/customers/${id}`)

/* =======================
   SERVICES
======================= */

export const getServices = () => api.get('/services')
export const addService = (data) => api.post('/services', data)
export const updateService = (id, data) => api.put(`/services/${id}`, data)
export const deleteService = (id) => api.delete(`/services/${id}`)

/* =======================
   ORDERS
======================= */

export const getOrders = () => api.get('/orders')
export const addOrder = (data) => api.post('/orders', data)
export const updateOrder = (id, data) => api.put(`/orders/${id}`, data)
export const deleteOrder = (id) => api.delete(`/orders/${id}`)

/* =======================
   PAYMENTS
======================= */

export const getPayments = () => api.get('/payments')
export const addPayment = (data) => api.post('/payments', data)
export const updatePayment = (id, data) => api.put(`/payments/${id}`, data)
export const deletePayment = (id) => api.delete(`/payments/${id}`)