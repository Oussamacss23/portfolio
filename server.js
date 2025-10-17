const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// MongoDB Connection (using in-memory data for now)
// Uncomment below to use MongoDB
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

// In-memory database for demo purposes
let products = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    price: 49.99,
    originalPrice: 79.99,
    discount: 38,
    rating: 4.5,
    reviews: 1234,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    category: 'Electronics',
    description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
    stock: 50,
    sold: 2500
  },
  {
    id: '2',
    name: 'Smart Watch Pro',
    price: 199.99,
    originalPrice: 299.99,
    discount: 33,
    rating: 4.7,
    reviews: 856,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    category: 'Electronics',
    description: 'Advanced smartwatch with health tracking, GPS, and water resistance.',
    stock: 30,
    sold: 1800
  },
  {
    id: '3',
    name: 'Portable Power Bank 20000mAh',
    price: 29.99,
    originalPrice: 49.99,
    discount: 40,
    rating: 4.6,
    reviews: 2341,
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500',
    category: 'Electronics',
    description: 'High-capacity power bank with fast charging for all your devices.',
    stock: 100,
    sold: 5600
  },
  {
    id: '4',
    name: 'Mechanical Gaming Keyboard',
    price: 89.99,
    originalPrice: 129.99,
    discount: 31,
    rating: 4.8,
    reviews: 678,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500',
    category: 'Electronics',
    description: 'RGB mechanical keyboard with customizable keys and macro support.',
    stock: 45,
    sold: 890
  },
  {
    id: '5',
    name: 'Wireless Mouse',
    price: 24.99,
    originalPrice: 39.99,
    discount: 38,
    rating: 4.4,
    reviews: 1567,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
    category: 'Electronics',
    description: 'Ergonomic wireless mouse with precision tracking and long battery life.',
    stock: 80,
    sold: 3200
  },
  {
    id: '6',
    name: 'USB-C Hub Adapter',
    price: 34.99,
    originalPrice: 54.99,
    discount: 36,
    rating: 4.5,
    reviews: 923,
    image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500',
    category: 'Electronics',
    description: '7-in-1 USB-C hub with HDMI, USB 3.0, SD card reader, and more.',
    stock: 60,
    sold: 1450
  },
  {
    id: '7',
    name: 'Laptop Stand Aluminum',
    price: 39.99,
    originalPrice: 59.99,
    discount: 33,
    rating: 4.7,
    reviews: 445,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
    category: 'Accessories',
    description: 'Adjustable aluminum laptop stand for better ergonomics and cooling.',
    stock: 70,
    sold: 980
  },
  {
    id: '8',
    name: 'Webcam 1080p HD',
    price: 59.99,
    originalPrice: 89.99,
    discount: 33,
    rating: 4.6,
    reviews: 1123,
    image: 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=500',
    category: 'Electronics',
    description: 'Full HD webcam with auto-focus and built-in microphone.',
    stock: 40,
    sold: 2100
  }
];

let orders = [];
let nextProductId = 9;
let nextOrderId = 1;

// API Routes

// Get all products
app.get('/api/products', (req, res) => {
  const { category, search, sort } = req.query;
  let filteredProducts = [...products];

  // Filter by category
  if (category && category !== 'all') {
    filteredProducts = filteredProducts.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  // Search
  if (search) {
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Sort
  if (sort === 'price-low') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-high') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    filteredProducts.sort((a, b) => b.rating - a.rating);
  }

  res.json(filteredProducts);
});

// Get single product
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

// Create product (Admin)
app.post('/api/products', (req, res) => {
  const newProduct = {
    id: String(nextProductId++),
    name: req.body.name,
    price: parseFloat(req.body.price),
    originalPrice: parseFloat(req.body.originalPrice || req.body.price),
    discount: req.body.discount || 0,
    rating: req.body.rating || 0,
    reviews: req.body.reviews || 0,
    image: req.body.image || 'https://via.placeholder.com/500',
    category: req.body.category || 'General',
    description: req.body.description || '',
    stock: parseInt(req.body.stock) || 0,
    sold: req.body.sold || 0
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// Update product (Admin)
app.put('/api/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index !== -1) {
    products[index] = {
      ...products[index],
      ...req.body,
      id: req.params.id
    };
    res.json(products[index]);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

// Delete product (Admin)
app.delete('/api/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index !== -1) {
    products.splice(index, 1);
    res.json({ message: 'Product deleted successfully' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

// Create order
app.post('/api/orders', (req, res) => {
  const newOrder = {
    id: String(nextOrderId++),
    items: req.body.items,
    total: req.body.total,
    customerInfo: req.body.customerInfo,
    status: 'pending',
    createdAt: new Date()
  };
  orders.push(newOrder);
  res.status(201).json(newOrder);
});

// Get all orders (Admin)
app.get('/api/orders', (req, res) => {
  res.json(orders);
});

// Get categories
app.get('/api/categories', (req, res) => {
  const categories = [...new Set(products.map(p => p.category))];
  res.json(categories);
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
