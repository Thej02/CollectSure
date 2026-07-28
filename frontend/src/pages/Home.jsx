import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'; // Let's create page-specific styles for premium aesthetics

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <span className="badge-promo">Hostel Parcel Security System</span>
          <h1>Never Lose Another Parcel.</h1>
          <p className="hero-subtitle">
            CollectSure is a secure OTP-verified parcel collection system designed to prevent parcel theft, wrong pickups, and undocumented handovers in college hostels.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/student')}>
              Student Portal
            </button>
            <button className="btn btn-secondary btn-lg" onClick={() => navigate('/security')}>
              Security Portal
            </button>
          </div>
        </div>
        <div className="hero-art">
          <div className="floating-card active-card">
            <div className="card-header">
              <span className="dot dot-green"></span>
              <span className="card-title">OTP Verified Delivery</span>
            </div>
            <div className="card-body">
              <p>Verify parcel collection instantly.</p>
              <div className="mock-otp">● ● ● ● ● ●</div>
            </div>
          </div>
          <div className="floating-card secondary-card">
            <div className="card-header">
              <span className="dot dot-blue"></span>
              <span className="card-title">Pending Tickets</span>
            </div>
            <div className="card-body">
              <p>Amazon - Block B</p>
              <span className="badge badge-pending">Pending</span>
            </div>
          </div>
        </div>
      </section>

      {/* About/Features Section */}
      <section className="about-section">
        <h2 className="section-title">The Secure Workflow</h2>
        <p className="section-desc">How CollectSure ensures safe parcel collection in 3 simple steps</p>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">1</div>
            <h3>Raise a Ticket</h3>
            <p>Students file a ticket on arrival expectation, entering parcel description, brand, and their contact information.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">2</div>
            <h3>Verify at Gate</h3>
            <p>When the parcel arrives, security generates a secure 6-digit OTP sent directly to the student's registered Gmail.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">3</div>
            <h3>OTP Handshake</h3>
            <p>The student states the OTP to the security guard, who verifies it in the app to mark the parcel as successfully delivered.</p>
          </div>
        </div>
      </section>

      {/* Problem Solver Section */}
      <section className="problem-solver">
        <div className="solver-grid">
          <div className="solver-left">
            <h2>Why CollectSure?</h2>
            <p>Conventional hostels store packages on open tables at security gates, exposing them to vulnerabilities:</p>
            <ul className="vulnerability-list">
              <li>❌ Wrong parcel collection by other students</li>
              <li>❌ Parcel theft and unauthorized pickups</li>
              <li>❌ No digital logs or proof of delivery</li>
            </ul>
          </div>
          <div className="solver-right">
            <div className="benefit-item">
              <h4>🔒 Encrypted OTP Delivery</h4>
              <p>OTPs are never shown on screen, only delivered via registered student emails.</p>
            </div>
            <div className="benefit-item">
              <h4>⚡ Instant Status Updates</h4>
              <p>Both students and security see live ticket status changes: Pending → OTP Generated → Delivered.</p>
            </div>
            <div className="benefit-item">
              <h4>📝 Digital Trail</h4>
              <p>Logs exact delivery time, providing proof of collection and resolving disputes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <p>© 2026 CollectSure Secure Hostel Systems. Built for modern campus safety.</p>
      </footer>
    </div>
  );
}
