import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import './Admin.css';

function Admin({ products, fetchProducts }) {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    originalPrice: '',
    discount: '',
    category: '',
    description: '',
    image: '',
    stock: '',
    rating: '0',
    reviews: '0',
    sold: '0'
  });

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      originalPrice: '',
      discount: '',
      category: '',
      description: '',
      image: '',
      stock: '',
      rating: '0',
      reviews: '0',
      sold: '0'
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      price: product.price.toString(),
      originalPrice: product.originalPrice.toString(),
      discount: product.discount.toString(),
      category: product.category,
      description: product.description,
      image: product.image,
      stock: product.stock.toString(),
      rating: product.rating.toString(),
      reviews: product.reviews.toString(),
      sold: product.sold.toString()
    });
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/api/products/${id}`);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingProduct) {
        await axios.put(`/api/products/${editingProduct.id}`, formData);
      } else {
        await axios.post('/api/products', formData);
      }
      fetchProducts();
      resetForm();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? <><FaTimes /> Cancel</> : <><FaPlus /> Add New Product</>}
          </button>
        </div>

        {showForm && (
          <div className="admin-form-container">
            <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-grid">
                <div className="input-group">
                  <label>Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Category *</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="e.g., Electronics, Fashion"
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Original Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleChange}
                  />
                </div>

                <div className="input-group">
                  <label>Discount (%)</label>
                  <input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleChange}
                    min="0"
                    max="100"
                  />
                </div>

                <div className="input-group">
                  <label>Stock *</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Rating (0-5)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    min="0"
                    max="5"
                  />
                </div>

                <div className="input-group">
                  <label>Reviews Count</label>
                  <input
                    type="number"
                    name="reviews"
                    value={formData.reviews}
                    onChange={handleChange}
                  />
                </div>

                <div className="input-group">
                  <label>Units Sold</label>
                  <input
                    type="number"
                    name="sold"
                    value={formData.sold}
                    onChange={handleChange}
                  />
                </div>

                <div className="input-group full-width">
                  <label>Image URL *</label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                </div>

                <div className="input-group full-width">
                  <label>Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-success">
                  <FaSave /> {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  <FaTimes /> Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="products-table-container">
          <h2>Products ({products.length})</h2>
          <div className="products-table">
            <table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Rating</th>
                  <th>Sold</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <td>
                      <img src={product.image} alt={product.name} className="table-image" />
                    </td>
                    <td className="product-name-cell">{product.name}</td>
                    <td>{product.category}</td>
                    <td className="price-cell">${product.price.toFixed(2)}</td>
                    <td>
                      <span className={`stock-badge ${product.stock < 20 ? 'low' : 'high'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td>{product.rating} ⭐</td>
                    <td>{product.sold}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn-icon btn-edit"
                          onClick={() => handleEdit(product)}
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="btn-icon btn-delete"
                          onClick={() => handleDelete(product.id)}
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
