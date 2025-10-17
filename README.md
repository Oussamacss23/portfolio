# ShopHub - E-Commerce Store

A full-featured e-commerce application with React frontend and Node.js backend.

## Features

- Product browsing and search
- Shopping cart functionality
- Checkout process
- Admin panel for product management
- Responsive design

## Installation

1. Install dependencies:
```bash
npm install
cd client && npm install
```

2. Run the application:
```bash
# Run backend
npm start

# Run frontend (in another terminal)
npm run client
```

The application will be available at http://localhost:3000

## Deployment to Vercel

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. Push your code to GitHub (already done!)
2. Go to [Vercel](https://vercel.com)
3. Click "Add New Project"
4. Import your GitHub repository: `Oussamacss23/portfolio`
5. Vercel will auto-detect the configuration from `vercel.json`
6. Click "Deploy"

### Option 2: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. For production deployment:
```bash
vercel --prod
```

## Environment Variables

If you need to add environment variables (like MongoDB connection), add them in:
- Vercel Dashboard → Project Settings → Environment Variables
- Or create a `.env` file locally (already gitignored)

## Tech Stack

- Frontend: React, React Router, Axios
- Backend: Node.js, Express
- Styling: Custom CSS

Visit http://localhost:3000 to view the store
Visit http://localhost:3000/admin to manage products
