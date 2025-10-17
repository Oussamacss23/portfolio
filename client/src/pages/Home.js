import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaStar, FaShoppingCart, FaFire } from 'react-icons/fa';
import axios from 'axios';
import './Home.css';

function Home({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [searchParams, sortBy]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const category = searchParams.get('category') || '';
      const search = searchParams.get('search') || '';
      const response = await axios.get('/api/products', {
        params: { category, search, sort: sortBy }
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    addToCart(product);
    // Show feedback
    const btn = e.currentTarget;
    const originalText = btn.innerHTML;
    btn.innerHTML = '✓ Added!';
    btn.style.background = 'var(--success)';
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.background = '';
    }, 1500);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="home">
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="container">
          <div className="hero-content">
            <h1>Amazing Deals Every Day!</h1>
            <p>Discover thousands of products at unbeatable prices</p>
            <button className="btn btn-large btn-primary">
              <FaFire /> Shop Hot Deals
            </button>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="products-section">
        <div className="container">
          <div className="section-header">
            <h2>
              {searchParams.get('search') 
                ? `Search results for "${searchParams.get('search')}"` 
                : searchParams.get('category') && searchParams.get('category') !== 'all'
                ? `${searchParams.get('category').charAt(0).toUpperCase() + searchParams.get('category').slice(1)}`
                : 'All Products'}
            </h2>
            <div className="sort-controls">
              <label>Sort by:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="">Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="no-products">
              <p>No products found. Try a different search or category.</p>
            </div>
          ) : (
            <div className="products-grid">
              {products.map(product => (
                <Link to={`/product/${product.id}`} key={product.id} className="product-card">
                  <div className="product-image">
                    <img src={product.image} alt={product.name} />
                    {product.discount > 0 && (
                      <span className="discount-badge">-{product.discount}%</span>
                    )}
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <div className="product-rating">
                      <div className="stars">
                        <FaStar className="star-filled" />
                        <span>{product.rating}</span>
                      </div>
                      <span className="reviews">({product.reviews})</span>
                    </div>
                    <div className="product-price">
                      <span className="current-price">${product.price.toFixed(2)}</span>
                      {product.originalPrice > product.price && (
                        <span className="original-price">${product.originalPrice.toFixed(2)}</span>
                      )}
                    </div>
                    <div className="product-meta">
                      <span className="sold-count">{product.sold}+ sold</span>
                      {product.stock < 20 && product.stock > 0 && (
                        <span className="low-stock">Only {product.stock} left!</span>
                      )}
                    </div>
                    <button 
                      className="btn btn-primary add-to-cart-btn"
                      onClick={(e) => handleAddToCart(product, e)}
                    >
                      <FaShoppingCart /> Add to Cart
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>Free Shipping</h3>
              <p>On orders over $50</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💳</div>
              <h3>Secure Payment</h3>
              <p>100% secure transactions</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">↩️</div>
              <h3>Easy Returns</h3>
              <p>30-day return policy</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>Best Quality</h3>
              <p>Top-rated products</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
