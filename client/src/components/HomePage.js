import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Shield } from 'lucide-react';
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
              Submit Item
            </Link>
            <Link to="/items" className="btn btn-outline btn-lg">
              <Search size={20} />
              Browse Items
            </Link>
          </div>
        </div>
      </section>





      {/* Quick Actions */}
      <section className="quick-actions">
        <h2>Quick Actions</h2>
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
