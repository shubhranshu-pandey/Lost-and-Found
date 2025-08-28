import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Save, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';

const SubmitItem = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: 'lost',
    title: '',
    description: '',
    location: '',
    date: '',
    contact: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const type = searchParams.get('type');
    if (type && ['lost', 'found'].includes(type)) {
      setFormData(prev => ({ ...prev, type }));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await axios.post('/api/items', formData);
      
      setMessage({
        type: 'success',
        text: `Item submitted successfully! Your submission is now pending moderator approval.`
      });

      // Reset form
      setFormData({
        type: 'lost',
        title: '',
        description: '',
        location: '',
        date: '',
        contact: ''
      });

      // Redirect to items page after 3 seconds
      setTimeout(() => {
        navigate('/items');
      }, 3000);

    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Failed to submit item. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.title.trim() && formData.description.trim();

  return (
    <div className="submit-item">
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">
            {formData.type === 'lost' ? 'Report Lost Item' : 'Report Found Item'}
          </h1>
          <p className="text-secondary">
            {formData.type === 'lost' 
              ? 'Help us find your lost item by providing detailed information.'
              : 'Help return a found item to its rightful owner.'
            }
          </p>
        </div>

        {message.text && (
          <div className={`alert alert-${message.type}`}>
            {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2">
            <div className="form-group">
              <label htmlFor="type" className="form-label">Item Type *</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="lost">Lost Item</option>
                <option value="found">Found Item</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="date" className="form-label">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="form-input"
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="title" className="form-label">Item Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-input"
              placeholder={formData.type === 'lost' ? 'e.g., Lost iPhone 13' : 'e.g., Found Black Wallet'}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-textarea"
              placeholder={formData.type === 'lost' 
                ? 'Describe your lost item in detail (color, brand, model, distinguishing features, etc.)'
                : 'Describe the found item in detail (color, brand, model, distinguishing features, etc.)'
              }
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="location" className="form-label">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="form-input"
              placeholder={formData.type === 'lost' 
                ? 'Where did you last see it? (e.g., Coffee Shop, Park, Office)'
                : 'Where did you find it? (e.g., Coffee Shop, Park, Office)'
              }
            />
          </div>

          <div className="form-group">
            <label htmlFor="contact" className="form-label">Contact Information</label>
            <input
              type="text"
              id="contact"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              className="form-input"
              placeholder="How can people reach you? (e.g., email@example.com, phone number)"
            />
            <small className="text-secondary">
              This information will only be shared with approved claimants.
            </small>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={!isFormValid || loading}
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Submit Item
                </>
              )}
            </button>
          </div>
        </form>

        <div className="submission-info">
          <h3>What happens next?</h3>
          <ol>
            <li>Your submission will be reviewed by our moderators</li>
            <li>Once approved, it will appear in our public listings</li>
            <li>People can contact you through the provided contact information</li>
            <li>You'll be notified when someone claims your item</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default SubmitItem;
