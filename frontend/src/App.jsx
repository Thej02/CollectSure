import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import StudentPortal from './pages/StudentPortal';
import SecurityPortal from './pages/SecurityPortal';
import { ToastProvider } from './components/ToastContext';

function App() {
  return (
    <ToastProvider>
      <Router>
        <div className="app-container">
          {/* Navigation Bar */}
          <nav className="navbar">
            <Link to="/" className="nav-brand">
              🛡️ CollectSure
            </Link>
            <div className="nav-links">
              <Link to="/student" className="btn btn-secondary">
                Student Portal
              </Link>
              <Link to="/security" className="btn btn-primary">
                Security Portal
              </Link>
            </div>
          </nav>

          {/* Main Routing Container */}
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/student" element={<StudentPortal />} />
              <Route path="/security" element={<SecurityPortal />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;
