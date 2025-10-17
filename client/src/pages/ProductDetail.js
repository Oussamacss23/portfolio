import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaShoppingCart, FaMinus, FaPlus, FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import './ProductDetail.css';

function ProductDetail({ addToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2>Product not found</h2>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="product-detail">
      <div className="container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>

        <div className="product-detail-content">
          <div className="product-detail-image">
            <img src={product.image} alt={product.name} />
            {product.discount > 0 && (
              <span className="discount-badge">-{product.discount}%</span>
            )}
          </div>

          <div className="product-detail-info">
            <h1 className="product-title">{product.name}</h1>
            
            <div className="product-rating-section">
              <div className="rating-stars">
                {[...Array(5)].map((_, i) => (
                  <FaStar 
                    key={i} 
                    className={i < Math.floor(product.rating) ? 'star-filled' : 'star-empty'}
                  />
                ))}
                <span className="rating-number">{product.rating}</span>
              </div>
              <span className="reviews-count">{product.reviews} Reviews</span>
              <span className="sold-count">{product.sold}+ Sold</span>
            </div>

            <div className="price-section">
              <div className="current-price">${product.price.toFixed(2)}</div>
              {product.originalPrice > product.price && (
                <>
                  <div className="original-price">${product.originalPrice.toFixed(2)}</div>
                  <div className="savings">
                    Save ${(product.originalPrice - product.price).toFixed(2)}
                  </div>
                </>
              )}
            </div>

            <div className="stock-info">
              {product.stock > 20 ? (
                <span className="in-stock">In Stock</span>
              ) : product.stock > 0 ? (
                <span className="low-stock">Only {product.stock} left - Order soon!</span>
              ) : (
                <span className="out-of-stock">Out of Stock</span>
              )}
            </div>

            <div className="description-section">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>

            <div className="product-details-list">
              <div className="detail-item">
                <span className="detail-label">Category:</span>
                <span className="detail-value">{product.category}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Availability:</span>
                <span className="detail-value">{product.stock} units</span>
              </div>
            </div>

            <div className="quantity-section">
              <label>Quantity:</label>
              <div className="quantity-controls">
                <button 
                  className="quantity-btn" 
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                >
                  <FaMinus />
                </button>
                <input 
                  type="number" 
                  value={quantity} 
                  readOnly
                  className="quantity-input"
                />
                <button 
                  className="quantity-btn" 
                  onClick={incrementQuantity}
                  disabled={quantity >= product.stock}
                >
                  <FaPlus />
                </button>
              </div>
            </div>

            <div className="action-buttons">
              <button 
                className="btn btn-primary btn-large"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <FaShoppingCart /> Add to Cart
              </button>
              <button className="btn btn-secondary btn-large">
                Buy Now
              </button>
            </div>

            <div className="guarantee-section">
              <div className="guarantee-item">
                <span className="guarantee-icon">✓</span>
                <span>Free Shipping on orders over $50</span>
              </div>
              <div className="guarantee-item">
                <span className="guarantee-icon">✓</span>
                <span>30-Day Money Back Guarantee</span>
              </div>
              <div className="guarantee-item">
                <span className="guarantee-icon">✓</span>
                <span>Secure Payment</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
