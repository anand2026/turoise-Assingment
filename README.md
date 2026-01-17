# 🐢 Tortoise Supplier Interface

A supplier-managed device leasing marketplace built for the Tortoise Product Manager Internship assignment.

## 📋 Problem Statement

Tortoise is a device leasing marketplace where employees can browse and lease devices. This project enables suppliers to directly manage their device listings, pricing, offers, and stock, ensuring employees always see up-to-date product information.

## ✨ Features

### Supplier Portal
- **Dashboard** - Overview with stats and rental trends
- **Device Management** - Add, edit, delete device listings
- **Pricing Control** - Update monthly rental prices
- **Offer Management** - Create percentage or flat discounts with validity dates
- **Stock Management** - Track and update inventory levels
- **Availability Toggle** - Activate/deactivate device listings

### Employee App
- **Browse Devices** - View all available devices with specs
- **See Offers** - Applied discounts shown on prices
- **Real-time Sync** - Auto-updates every 5 seconds
- **Lease Flow** - Confirm device lease with stock reduction

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Routing**: React Router DOM
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Icons**: Lucide React
- **Data Storage**: localStorage (simulating backend API)

## 📁 Project Structure

```
src/
├── core/                          # Shared components
│   └── components/
│       ├── Layout.tsx             # Main layout wrapper
│       ├── Sidebar.tsx            # Navigation sidebar
│       └── ui.tsx                 # Reusable UI components
│
├── features/
│   ├── dashboard/                 # Dashboard feature
│   │   └── presentation/pages/
│   │       └── DashboardPage.tsx  # Stats & rental trends
│   │
│   ├── devices/                   # Device management
│   │   ├── data/repositories/
│   │   │   └── MockDeviceRepository.ts  # Data layer with localStorage
│   │   ├── domain/
│   │   │   ├── entities/Device.ts       # Device & Offer interfaces
│   │   │   └── repositories/DeviceRepository.ts
│   │   └── presentation/
│   │       ├── components/DeviceForm.tsx
│   │       └── pages/
│   │           ├── DeviceListPage.tsx   # Device listing
│   │           └── DeviceEditPage.tsx   # Add/Edit device
│   │
│   ├── offers/                    # Offer management
│   │   └── presentation/pages/
│   │       └── OffersManagementPage.tsx
│   │
│   ├── stock/                     # Stock management
│   │   └── presentation/pages/
│   │       ├── StockManagementPage.tsx  # Per-device stock
│   │       └── StockOverviewPage.tsx    # All devices stock view
│   │
│   └── employee/                  # Employee-facing app
│       └── presentation/pages/
│           └── EmployeeAppView.tsx      # Marketplace view
│
├── App.tsx                        # Route configuration
├── main.tsx                       # App entry point
└── index.css                      # Global styles
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/anand2026/turoise-Assingment.git

# Navigate to project
cd turoise-Assingment

# Install dependencies
npm install

# Start development server
npm run dev
```

### Access the Application

- **Supplier Portal**: http://localhost:5173
- **Employee App**: http://localhost:5173/employee-app

## 📱 Routes

| Route | Description |
|-------|-------------|
| `/` | Dashboard with stats and trends |
| `/devices` | Device listings with management options |
| `/devices/new` | Add new device form |
| `/devices/:id/edit` | Edit existing device |
| `/devices/:id/offers` | Manage offers for a device |
| `/devices/:id/stock` | Manage stock for a device |
| `/stock` | Stock overview for all devices |
| `/employee-app` | Employee marketplace view |

## 🔄 Real-time Sync

The application simulates real-time synchronization:
- **Employee App** polls for updates every 5 seconds
- **Dashboard** auto-refreshes stats and charts every 5 seconds
- Changes made in Supplier Portal reflect immediately in Employee App

## 📊 Mock Data

The app comes pre-loaded with 3 sample devices:
- iPhone 15 Pro (with 10% off offer)
- Google Pixel 8
- Samsung Galaxy S24 Ultra (with ₹500 off offer)

## 🎯 Assignment Requirements Met

| Requirement | Implementation |
|-------------|----------------|
| Upload device listings | ✅ `/devices/new` |
| Update prices | ✅ `/devices/:id/edit` |
| Update offers | ✅ `/devices/:id/offers` |
| Update availability | ✅ Active/Inactive toggle |
| Manage stock | ✅ `/devices/:id/stock` |
| Sync to employee app | ✅ Real-time polling |

## 👤 Author

**Anand Singh**

---

Built with ❤️ for Tortoise
