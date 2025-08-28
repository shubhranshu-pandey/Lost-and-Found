import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Shield, Clock, Users } from 'lucide-react';
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


    </div>
  );
};

export default HomePage;
