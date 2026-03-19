# HalleyX Dashboard

A full-stack **Customer Order Management & Analytics Platform** built with Vue 3, Node.js, Express, and MongoDB.

---

## Features

- **Custom Dashboard Builder** — Drag and drop widgets (Charts, KPIs, Tables) onto a 12-column canvas grid
- **Customer Order Management** — Full CRUD with validation, search, and status tracking
- **5 Chart Types** — Bar, Line, Area, Scatter, Pie charts powered by Chart.js
- **KPI Cards** — Configurable metrics with Sum / Average / Count aggregation
- **Date Range Filtering** — Filter all data by Today, Last 7 / 30 / 90 days or All time
- **Responsive Design** — Works on Desktop (12-col), Tablet (8-col), and Mobile (4-col)
- **Widget Settings Panel** — Per-widget configuration for axes, colors, columns, filters, pagination

---

## Tech Stack

| Layer     | Technology          |
|-----------|---------------------|
| Frontend  | Vue 3, Vite         |
| Charts    | Chart.js            |
| Backend   | Node.js, Express    |
| Database  | MongoDB, Mongoose   |
| HTTP      | Axios               |

---

## Project Structure

```
halleyx-dashboard-project/
├── frontend/
│   ├── src/
│   │   ├── views/
│   │   │   ├── HomeView.vue
│   │   │   ├── AboutView.vue
│   │   │   ├── Dashboard.vue
│   │   │   ├── DashboardConfig.vue
│   │   │   ├── CustomerOrders.vue
│   │   │   └── NotFound.vue
│   │   ├── components/
│   │   │   └── Layout.vue
│   │   └── router/
│   │       └── index.js
│   └── package.json
└── backend/
    ├── server.js
    ├── seed.js
    └── package.json
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local) or MongoDB Atlas account

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/halleyx-dashboard.git
cd halleyx-dashboard
```

### 2. Setup Backend
```bash
cd backend
npm install
node server.js
```
Backend runs on `http://localhost:5000`

### 3. Seed sample data (optional)
```bash
cd backend
node seed.js
```

### 4. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`

---

## API Endpoints

| Method | Endpoint          | Description        |
|--------|-------------------|--------------------|
| GET    | /orders           | Get all orders     |
| POST   | /orders           | Create new order   |
| PUT    | /orders/:id       | Update order       |
| DELETE | /orders/:id       | Delete order       |

---

## Pages

| Route               | Page                    |
|---------------------|-------------------------|
| `/`                 | Home page               |
| `/dashboard`        | Live dashboard          |
| `/dashboard-config` | Dashboard builder       |
| `/orders`           | Customer orders         |
| `/about`            | About page              |
| `/*`                | 404 Not found           |

---

## Deployment

- **Frontend** → [Vercel](https://vercel.com)
- **Backend** → [Render](https://render.com)
- **Database** → [MongoDB Atlas](https://cloud.mongodb.com)

---

## License

MIT