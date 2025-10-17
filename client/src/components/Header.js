import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaSearch, FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';
import './Header.css';

function Header({ cartItemsCount }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${searchQuery}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="header">
      <div className="header-top">
        <div className="container">
          <div className="header-top-content">
            <span>Welcome to ShopHub - Your Best Shopping Experience!</span>
            <Link to="/admin" className="admin-link">Admin Panel</Link>
          </div>
        </div>
      </div>
      
      <div className="header-main">
        <div className="container">
          <div className="header-content">
            <Link to="/" className="logo">
              <h1>ShopHub</h1>
            </Link>

            <form className="search-bar" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="search-btn">
                <FaSearch />
              </button>
            </form>

            <div className="header-actions">
              <Link to="/cart" className="cart-icon">
                <FaShoppingCart />
                {cartItemsCount > 0 && (
                  <span className="cart-badge">{cartItemsCount}</span>
                )}
              </Link>
              <div className="user-icon">
                <FaUserCircle />
              </div>
              <button 
                className="mobile-menu-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <FaTimes /> : <FaBars />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <nav className={`header-nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="container">
          <ul className="nav-links">
            <li><Link to="/?category=all" onClick={() => setMobileMenuOpen(false)}>All Products</Link></li>
            <li><Link to="/?category=electronics" onClick={() => setMobileMenuOpen(false)}>Electronics</Link></li>
            <li><Link to="/?category=accessories" onClick={() => setMobileMenuOpen(false)}>Accessories</Link></li>
            <li><Link to="/?category=fashion" onClick={() => setMobileMenuOpen(false)}>Fashion</Link></li>
            <li><Link to="/?category=home" onClick={() => setMobileMenuOpen(false)}>Home & Garden</Link></li>
            <li><Link to="/?category=sports" onClick={() => setMobileMenuOpen(false)}>Sports</Link></li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default Header;
