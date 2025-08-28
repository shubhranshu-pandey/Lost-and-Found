import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, XCircle, Clock, BarChart3, Eye } from 'lucide-react';
import axios from 'axios';
import './ModeratorDashboard.css';

const ModeratorDashboard = () => {
  const [pendingItems, setPendingItems] = useState([]);
  const [pendingClaims, setPendingClaims] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeTab, setActiveTab] = useState('items'); // 'items' or 'claims'

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pendingResponse, claimsResponse, statsResponse] = await Promise.all([
        axios.get('/api/moderator/pending'),
        axios.get('/api/moderator/claims'),
        axios.get('/api/moderator/stats')
      ]);
      
      setPendingItems(pendingResponse.data);
      setPendingClaims(claimsResponse.data);
      setStats(statsResponse.data);
    } catch (error) {
      console.error('Error fetching moderator data:', error);
      setMessage({
        type: 'error',
        text: 'Failed to fetch data. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (itemId, newStatus) => {
    try {
      await axios.patch(`/api/items/${itemId}/status`, {
        status: newStatus,
        moderatorId: 'mod-001'
      });
      
      setMessage({
        type: 'success',
        text: `Item ${newStatus} successfully!`
      });
      
      // Refresh data
      fetchData();
      
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Failed to update item status.'
      });
    }
  };

  const handleClaimAction = async (claimId, action) => {
    try {
      await axios.patch(`/api/moderator/claims/${claimId}`, {
        action: action,
        moderatorId: 'mod-001'
      });
      
      setMessage({
        type: 'success',
        text: `Claim ${action}d successfully!`
      });
      
      // Refresh data
      fetchData();
      
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Failed to update claim status.'
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
        <p>Loading moderator dashboard...</p>
      </div>
    );
  }

  return (
    <div className="moderator-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="dashboard-title">
              <Shield size={32} />
              Moderator Dashboard
            </h1>
            <p className="text-secondary">
              Review and moderate submitted items. Ensure quality and safety of all listings.
            </p>
          </div>
        </div>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
          {message.text}
        </div>
      )}

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon pending">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.pending_approval || 0}</div>
            <div className="stat-label">Pending Items</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon pending">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.pending_claims || 0}</div>
            <div className="stat-label">Pending Claims</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon approved">
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.approved || 0}</div>
            <div className="stat-label">Approved Items</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon claimed">
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.claimed || 0}</div>
            <div className="stat-label">Claimed Items</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'items' ? 'active' : ''}`}
          onClick={() => setActiveTab('items')}
        >
          <Clock size={20} />
          Pending Items ({pendingItems.length})
        </button>
        <button
          className={`tab ${activeTab === 'claims' ? 'active' : ''}`}
          onClick={() => setActiveTab('claims')}
        >
          <Shield size={20} />
          Pending Claims ({pendingClaims.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'items' && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <Clock size={24} />
              Pending Items ({pendingItems.length})
            </h2>
            <p className="text-secondary">
              Review these items and decide whether to approve or reject them.
            </p>
          </div>

          {pendingItems.length === 0 ? (
            <div className="text-center p-6">
              <CheckCircle size={48} className="text-success mb-4" />
              <h3>All Caught Up!</h3>
              <p className="text-secondary">No items are currently pending approval.</p>
            </div>
          ) : (
            <div className="pending-items">
              {pendingItems.map(item => (
                <div key={item.id} className="pending-item">
                  <div className="item-main">
                    <div className="item-header">
                      <div className="item-type">
                        {getTypeIcon(item.type)} {item.type}
                      </div>
                      <div className="item-date">
                        {new Date(item.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <h3 className="item-title">{item.title}</h3>
                    <p className="item-description">{item.description}</p>
                    
                    <div className="item-details">
                      {item.location && (
                        <div className="item-detail">
                          <span className="detail-label">Location:</span>
                          <span>{item.location}</span>
                        </div>
                      )}
                      
                      {item.date && (
                        <div className="item-detail">
                          <span className="detail-label">Date:</span>
                          <span>{new Date(item.date).toLocaleDateString()}</span>
                        </div>
                      )}
                      
                      {item.contact && (
                        <div className="item-detail">
                          <span className="detail-label">Contact:</span>
                          <span>{item.contact}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="item-actions">
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="btn btn-outline btn-sm"
                    >
                      <Eye size={16} />
                      View Details
                    </button>
                    
                    <button
                      onClick={() => handleStatusUpdate(item.id, 'approved')}
                      className="btn btn-success btn-sm"
                    >
                      <CheckCircle size={16} />
                      Approve
                    </button>
                    
                    <button
                      onClick={() => handleStatusUpdate(item.id, 'rejected')}
                      className="btn btn-danger btn-sm"
                    >
                      <XCircle size={16} />
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'claims' && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <Shield size={24} />
              Pending Claims ({pendingClaims.length})
            </h2>
            <p className="text-secondary">
              Review claim requests and decide whether to approve or reject them.
            </p>
          </div>

          {pendingClaims.length === 0 ? (
            <div className="text-center p-6">
              <CheckCircle size={48} className="text-success mb-4" />
              <h3>No Pending Claims!</h3>
              <p className="text-secondary">No claim requests are currently pending review.</p>
            </div>
          ) : (
            <div className="pending-items">
              {pendingClaims.map(claim => (
                <div key={claim.id} className="pending-item">
                  <div className="item-main">
                    <div className="item-header">
                      <div className="item-type">
                        {getTypeIcon(claim.type)} {claim.type} - CLAIM REQUEST
                      </div>
                      <div className="item-date">
                        {new Date(claim.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <h3 className="item-title">{claim.title}</h3>
                    <p className="item-description">{claim.description}</p>
                    
                    <div className="item-details">
                      <div className="item-detail">
                        <span className="detail-label">Claimant:</span>
                        <span>{claim.claimant_name}</span>
                      </div>
                      <div className="item-detail">
                        <span className="detail-label">Claimant ID:</span>
                        <span>{claim.claimant_id}</span>
                      </div>
                      {claim.location && (
                        <div className="item-detail">
                          <span className="detail-label">Location:</span>
                          <span>{claim.location}</span>
                        </div>
                      )}
                      {claim.date && (
                        <div className="item-detail">
                          <span className="detail-label">Date:</span>
                          <span>{new Date(claim.date).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="item-actions">
                    <button
                      onClick={() => handleClaimAction(claim.id, 'approve')}
                      className="btn btn-success btn-sm"
                    >
                      <CheckCircle size={16} />
                      Approve Claim
                    </button>
                    
                    <button
                      onClick={() => handleClaimAction(claim.id, 'reject')}
                      className="btn btn-danger btn-sm"
                    >
                      <XCircle size={16} />
                      Reject Claim
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Item Detail Modal */}
      {selectedItem && (
        <div className="modal-overlay">
          <div className="modal modal-large">
            <div className="modal-header">
              <h3>Item Details</h3>
              <button
                onClick={() => setSelectedItem(null)}
                className="btn btn-outline btn-sm"
              >
                ×
              </button>
            </div>
            
            <div className="item-detail-content">
              <div className="detail-section">
                <h4>Basic Information</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Type:</span>
                    <span>{getTypeIcon(selectedItem.type)} {selectedItem.type}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Title:</span>
                    <span>{selectedItem.title}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Status:</span>
                    {getStatusBadge(selectedItem.status)}
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Submitted:</span>
                    <span>{new Date(selectedItem.created_at).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="detail-section">
                <h4>Description</h4>
                <p>{selectedItem.description}</p>
              </div>
              
              {selectedItem.location && (
                <div className="detail-section">
                  <h4>Location</h4>
                  <p>{selectedItem.location}</p>
                </div>
              )}
              
              {selectedItem.date && (
                <div className="detail-section">
                  <h4>Date</h4>
                  <p>{new Date(selectedItem.date).toLocaleDateString()}</p>
                </div>
              )}
              
              {selectedItem.contact && (
                <div className="detail-section">
                  <h4>Contact Information</h4>
                  <p>{selectedItem.contact}</p>
                </div>
              )}
            </div>
            
            <div className="modal-actions">
              <button
                onClick={() => setSelectedItem(null)}
                className="btn btn-outline"
              >
                Close
              </button>
              
              <button
                onClick={() => {
                  handleStatusUpdate(selectedItem.id, 'approved');
                  setSelectedItem(null);
                }}
                className="btn btn-success"
              >
                <CheckCircle size={16} />
                Approve
              </button>
              
              <button
                onClick={() => {
                  handleStatusUpdate(selectedItem.id, 'rejected');
                  setSelectedItem(null);
                }}
                className="btn btn-danger"
              >
                <XCircle size={16} />
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModeratorDashboard;
