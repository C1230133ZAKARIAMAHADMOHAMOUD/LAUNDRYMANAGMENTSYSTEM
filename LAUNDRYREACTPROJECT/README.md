# 🧺 Laundry Management System - React Frontend

## Sidee Loo Shidaa (Setup)

### 1. Install Packages
```bash
cd laundry-app
npm install
```

### 2. Badal API URL-ka
Fur faylka: `src/api.js`
Badal `BASE_URL` si uu u waafaqo API-gaaga:
```js
const BASE_URL = 'http://localhost:5000/api'
// ama
const BASE_URL = 'http://localhost:7000/api'
```

### 3. Bilow App-ka
```bash
npm run dev
```
Kadib fur: http://localhost:3000

## 🔐 Login
- Username: `admin`
- Password: `1234`

## 📄 Bogagga (8 Pages)
| Bog | Hawsha |
|-----|--------|
| Login | Xaqiijinta |
| Home | Soo dhawaynta |
| Customers | CRUD macaamiisha |
| Services | CRUD adeegyada |
| Orders | CRUD dalabka |
| Payments | CRUD lacag bixinta |
| Report | Warbixin & filter |
| About | Macluumaadka project |

## ⚠️ Demo Mode
Haddii API-ga aysan shaqaynin, app-ku wuxuu isticmaalaa demo data
si aad u aragto nidaamka shaqadaaba. Markii aad xiddo API-gaaga,
demo data ayaa laga bedelaa data dhabta ah.

## 🗄️ Database
Nidaamku wuxuu u baahan yahay 4 tables:
- CUSTOMERS
- SERVICES  
- ORDERS
- PAYMENTS
