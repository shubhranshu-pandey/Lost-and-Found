import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Shield, CheckCircle, Clock, Users } from 'lucide-react';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Lost Something? Found Something?
          </h1>
          <p className="hero-subtitle">
            Our Lost & Found Portal helps reunite people with their belongings through a secure, 
            moderated system. Submit items, browse listings, and claim what's yours.
          </p>
          <div className="hero-actions">
            <Link to="/submit" className="btn btn-primary btn-lg">
              <Plus size={20} />
              Submit Item
            </Link>
            <Link to="/items" className="btn btn-outline btn-lg">
              <Search size={20} />
              Browse Items
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2 className="section-title">How It Works</h2>
        <div className="grid grid-cols-3">
          <div className="feature-card">
            <div className="feature-icon">
              <Plus size={32} />
            </div>
            <h3>Submit</h3>
            <p>Report lost or found items with detailed descriptions and contact information.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <Shield size={32} />
            </div>
            <h3>Moderate</h3>
            <p>Our moderators review and approve submissions to ensure quality and safety.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <CheckCircle size={32} />
            </div>
            <h3>Connect</h3>
            <p>Browse approved items and claim what belongs to you with secure verification.</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="grid grid-cols-4">
          <div className="stat-card">
            <div className="stat-icon">
              <Clock size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Availability</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <Shield size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-number">100%</div>
              <div className="stat-label">Moderated</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <Users size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-number">Secure</div>
              <div className="stat-label">Community</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <CheckCircle size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-number">Fast</div>
              <div className="stat-label">Reunification</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions">
        <h2 className="section-title">Quick Actions</h2>
        <div className="grid grid-cols-2">
          <div className="action-card">
            <h3>Report a Lost Item</h3>
            <p>Can't find something? Let our community help you locate it.</p>
            <Link to="/submit?type=lost" className="btn btn-primary">
              Report Lost Item
            </Link>
          </div>
          
          <div className="action-card">
            <h3>Report a Found Item</h3>
            <p>Found something that doesn't belong to you? Help return it.</p>
            <Link to="/submit?type=found" className="btn btn-success">
              Report Found Item
            </Link>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="info">
        <div className="card">
          <h3>Important Information</h3>
          <ul className="info-list">
            <li>All submissions are reviewed by moderators before being made public</li>
            <li>Provide accurate descriptions and contact information</li>
            <li>Be honest about the condition and location of items</li>
            <li>Respect privacy and only share necessary contact details</li>
            <li>Report suspicious or inappropriate content immediately</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
