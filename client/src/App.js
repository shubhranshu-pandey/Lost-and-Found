import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Search, Plus, Shield, Home, Users, LogOut } from 'lucide-react';
import HomePage from './components/HomePage';
import SubmitItem from './components/SubmitItem';
import ModeratorDashboard from './components/ModeratorDashboard';
import ItemList from './components/ItemList';
import Login from './components/Login';
import './App.css';

function App() {
  const [userRole, setUserRole] = useState('user');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  const handleLogin = (role) => {
    setUserRole(role);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setUserRole('user');
    setIsAuthenticated(false);
  };

  const toggleRole = () => {
    if (userRole === 'moderator') {
      handleLogout();
    } else {
      setUserRole('moderator');
      // Navigate to login page
      window.location.href = '/login';
    }
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
              
              {userRole === 'moderator' && isAuthenticated && (
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
              {userRole === 'moderator' && isAuthenticated ? (
                <div className="auth-buttons">
                  <span className="user-info">
                    <Shield size={16} />
                    Moderator
                  </span>
                  <button 
                    onClick={handleLogout}
                    className="btn btn-danger btn-sm"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              ) : (
                <button 
                  onClick={toggleRole}
                  className="btn btn-outline btn-sm"
                >
                  <Users size={16} />
                  Login as Moderator
                </button>
              )}
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
              path="/login" 
              element={
                userRole === 'moderator' && isAuthenticated ? (
                  <Navigate to="/moderator" replace />
                ) : (
                  <Login onLogin={handleLogin} />
                )
              } 
            />
            <Route 
              path="/moderator" 
              element={
                userRole === 'moderator' && isAuthenticated ? (
                  <ModeratorDashboard />
                ) : (
                  <Navigate to="/login" replace />
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
            <p>This is a project/Assignment for Infinite Locus by Group 13</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
