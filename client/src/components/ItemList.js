import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, User, MapPin, Calendar, CheckCircle } from 'lucide-react';
import axios from 'axios';
import './ItemList.css';

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    search: ''
  });
  const [claimModal, setClaimModal] = useState({ show: false, item: null });
  const [claimForm, setClaimForm] = useState({ claimantId: '', claimantName: '' });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchItems();
  }, [filters]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.type) params.append('type', filters.type);
      
      const response = await axios.get(`/api/items?${params}`);
      let filteredItems = response.data;
      
      // Apply search filter on frontend
      if (filters.search) {
        filteredItems = filteredItems.filter(item =>
          item.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          item.description.toLowerCase().includes(filters.search.toLowerCase()) ||
          item.location.toLowerCase().includes(filters.search.toLowerCase())
        );
      }
      
      setItems(filteredItems);
    } catch (error) {
      console.error('Error fetching items:', error);
      setMessage({
        type: 'error',
        text: 'Failed to fetch items. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClaim = async (e) => {
    e.preventDefault();
    
    try {
      await axios.post(`/api/items/${claimModal.item.id}/claim`, claimForm);
      
      setMessage({
        type: 'success',
        text: 'Claim request submitted successfully! A moderator will review your request and notify you of the decision.'
      });
      
      // Close modal and refresh items
      setClaimModal({ show: false, item: null });
      setClaimForm({ claimantId: '', claimantName: '' });
      fetchItems();
      
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Failed to claim item. Please try again.'
      });
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'pending_approval': { class: 'badge-pending', text: 'Pending' },
      'approved': { class: 'badge-approved', text: 'Approved' },
      'claimed': { class: 'badge-claimed', text: 'Claimed' },
      'rejected': { class: 'badge-rejected', text: 'Rejected' }
    };
    
    const statusInfo = statusMap[status] || { class: 'badge-secondary', text: status };
    return <span className={`badge ${statusInfo.class}`}>{statusInfo.text}</span>;
  };

  const getTypeIcon = (type) => {
    return type === 'lost' ? '🔍' : '📦';
  };

  if (loading) {
    return (
      <div className="text-center p-6">
        <div className="spinner"></div>
        <p>Loading items...</p>
      </div>
    );
  }

  return (
    <div className="item-list">
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Browse Items</h1>
          <p className="text-secondary">
            Browse through all lost and found items. Found something that belongs to you? Claim it!
          </p>
        </div>

        {message.text && (
          <div className={`alert alert-${message.type}`}>
            {message.type === 'success' ? <CheckCircle size={20} /> : <CheckCircle size={20} />}
            {message.text}
          </div>
        )}

        {/* Filters */}
        <div className="filters">
          <div className="grid grid-cols-4">
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="form-select"
              >
                <option value="">All</option>
                <option value="approved">Approved</option>
                <option value="claimed">Claimed</option>
                <option value="pending_approval">Pending Approval</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Type</label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="form-select"
              >
                <option value="">All Types</option>
                <option value="lost">Lost Items</option>
                <option value="found">Found Items</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Search</label>
              <div className="search-input">
                <Search size={20} />
                <input
                  type="text"
                  placeholder="Search items..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">&nbsp;</label>
                              <button
                  onClick={() => setFilters({ status: '', type: '', search: '' })}
                  className="btn btn-outline w-full"
                >
                <Filter size={16} />
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Items Grid */}
        {items.length === 0 ? (
          <div className="text-center p-6">
            <p className="text-secondary">No items found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3">
            {items.map(item => (
              <div key={item.id} className="item-card">
                <div className="item-header">
                  <div className="item-type">
                    {getTypeIcon(item.type)} {item.type}
                  </div>
                  {getStatusBadge(item.status)}
                </div>
                
                <h3 className="item-title">{item.title}</h3>
                <p className="item-description">{item.description}</p>
                
                <div className="item-details">
                  {item.location && (
                    <div className="item-detail">
                      <MapPin size={16} />
                      <span>{item.location}</span>
                    </div>
                  )}
                  
                  {item.date && (
                    <div className="item-detail">
                      <Calendar size={16} />
                      <span>{new Date(item.date).toLocaleDateString()}</span>
                    </div>
                  )}
                  
                  {item.contact && (
                    <div className="item-detail">
                      <User size={16} />
                      <span>{item.contact}</span>
                    </div>
                  )}
                </div>

                <div className="item-actions">
                  {item.status === 'approved' && (
                    <button
                      onClick={() => setClaimModal({ show: true, item })}
                      className="btn btn-success btn-sm"
                    >
                      <CheckCircle size={16} />
                      Claim Item
                    </button>
                  )}
                  
                  <button
                    onClick={() => setClaimModal({ show: true, item })}
                    className="btn btn-outline btn-sm"
                  >
                    <Eye size={16} />
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Claim Modal */}
      {claimModal.show && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Claim Item</h3>
              <button
                onClick={() => setClaimModal({ show: false, item: null })}
                className="btn btn-outline btn-sm"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleClaim}>
              <div className="form-group">
                <label className="form-label">Your Name *</label>
                <input
                  type="text"
                  value={claimForm.claimantName}
                  onChange={(e) => setClaimForm(prev => ({ ...prev, claimantName: e.target.value }))}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Your ID/Email *</label>
                <input
                  type="text"
                  value={claimForm.claimantId}
                  onChange={(e) => setClaimForm(prev => ({ ...prev, claimantId: e.target.value }))}
                  className="form-input"
                  placeholder="Email or ID for verification"
                  required
                />
              </div>
              
              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setClaimModal({ show: false, item: null })}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-success"
                >
                  Claim Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemList;
