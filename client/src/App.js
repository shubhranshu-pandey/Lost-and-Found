import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Search, Plus, Shield, Home, Users } from 'lucide-react';
import HomePage from './components/HomePage';
import SubmitItem from './components/SubmitItem';
import ModeratorDashboard from './components/ModeratorDashboard';
import ItemList from './components/ItemList';
import './App.css';

function App() {
  const [userRole, setUserRole] = useState('user'); // 'user' or 'moderator'
  const location = useLocation();

  const toggleRole = () => {
    setUserRole(userRole === 'user' ? 'moderator' : 'user');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="App">
      {/* Navigation Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="header-left">
              <Link to="/" className="logo">
                🔍 Lost & Found Portal
              </Link>
            </div>
            
            <nav className="nav">
              <Link 
                to="/" 
                className={`nav-link ${isActive('/') ? 'active' : ''}`}
              >
                <Home size={20} />
                Home
              </Link>
              
              <Link 
                to="/submit" 
                className={`nav-link ${isActive('/submit') ? 'active' : ''}`}
              >
                <Plus size={20} />
                Submit Item
              </Link>
              
              <Link 
                to="/items" 
                className={`nav-link ${isActive('/items') ? 'active' : ''}`}
              >
                <Search size={20} />
                Browse Items
              </Link>
              
              {userRole === 'moderator' && (
                <Link 
                  to="/moderator" 
                  className={`nav-link ${isActive('/moderator') ? 'active' : ''}`}
                >
                  <Shield size={20} />
                  Moderator
                </Link>
              )}
            </nav>

            <div className="header-right">
              <button 
                onClick={toggleRole}
                className={`btn btn-sm ${userRole === 'moderator' ? 'btn-warning' : 'btn-outline'}`}
              >
                <Users size={16} />
                {userRole === 'moderator' ? 'Moderator' : 'User'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main">
        <div className="container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/submit" element={<SubmitItem />} />
            <Route path="/items" element={<ItemList />} />
            <Route 
              path="/moderator" 
              element={
                userRole === 'moderator' ? (
                  <ModeratorDashboard />
                ) : (
                  <div className="text-center p-6">
                    <h2>Access Denied</h2>
                    <p>You need moderator privileges to access this page.</p>
                  </div>
                )
              } 
            />
          </Routes>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <p>&copy; 2024 Lost & Found Portal. All rights reserved.</p>
            <p>Built with ❤️ for helping people find their lost items</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
