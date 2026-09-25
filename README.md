# SAASHA - B2B Wholesale E-Commerce Platform

SAASHA is a specialized B2B wholesale e-commerce platform designed for wholesale suppliers to sell bulk inventory directly to retail shopkeepers.

## 🚀 Key Features

- **Multi-Admin Operations Desk**: Multiple warehouse admins can log in under the `ADMIN` role to manage stock, update inventory, add products, and approve/process shopkeeper orders.
- **Wholesale Price & Retail MRP Transparency**: Products show wholesale box/carton unit pricing alongside retail MRP, with automatically calculated retail profit margins (% and ₹ value).
- **MOQ (Minimum Order Quantity) Enforcement**: Strict minimum quantity bounds on bulk product orders.
- **Mobile-First & Ultra-Responsive**: Designed with a fixed bottom app navigation bar, touch-friendly controls, and adaptable layouts across all mobile smartphone screen sizes and resolutions.
- **Instant Search & Category Filtering**: Quick text lookup by name, SKU, or category with multi-criteria sorting.
- **Shopkeeper Order Tracking**: Retail shopkeepers can track order statuses (Pending Admin Approval → Approved → Warehouse Processing → Shipped → Delivered).

---

## 🛠️ Tech Stack

- **Backend**: Python 3.11/3.13, FastAPI, SQLAlchemy, JWT Authentication, Pydantic, SQLite database.
- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons.
- **Containerization**: Docker & Docker Compose (`docker-compose.yml`).

---

## 🔑 Demo Accounts (Pre-Seeded)

| Role | Email | Password | Details |
|------|-------|----------|---------|
| **Admin #1** | `admin@saasha.com` | `admin123` | Main Warehouse Admin |
| **Admin #2** | `admin2@saasha.com` | `admin123` | Logistics & Stock Admin (Multi-Admin Demo) |
| **Shopkeeper** | `shopkeeper@saasha.com` | `shop123` | Rahul Express Mart (Retailer) |

---

## 💻 How to Run Locally

### Option 1: Quick Docker Run (Recommended)
Make sure Docker Desktop is installed and running, then execute:
```bash
docker-compose up --build
```
- Frontend app: [http://localhost:3000](http://localhost:3000)
- Backend API & Interactive Docs: [http://localhost:8000/api/docs](http://localhost:8000/api/docs)

---

### Option 2: Running Without Docker

#### 1. Start Python FastAPI Backend
```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

#### 2. Start Next.js Frontend
In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 📦 Repository Info & GitHub Integration

GitHub Repository: `https://github.com/shiyas-dx/saasha.git`
