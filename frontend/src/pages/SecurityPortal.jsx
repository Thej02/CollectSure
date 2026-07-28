import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { parcelService, securityService } from '../services/api';
import useToast from '../hooks/useToast';
import Spinner from '../components/Spinner';
import './SecurityPortal.css';

export default function SecurityPortal() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [guardEmail, setGuardEmail] = useState('');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');

  // Dashboard Data State
  const [tickets, setTickets] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({ pending: 0, otpGenerated: 0, delivered: 0 });

  // OTP Verification Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');

  // Check login state on mount
  useEffect(() => {
    const savedEmail = sessionStorage.getItem('cs_guard_email');
    if (savedEmail) {
      setIsLoggedIn(true);
      setGuardEmail(savedEmail);
      loadDashboardData();
    }
  }, []);

  // Load dashboard ticket list and statistics
  const loadDashboardData = async (query = '') => {
    setLoading(true);
    try {
      let data = [];
      if (query.trim()) {
        data = await parcelService.searchStudent(query);
      } else {
        data = await parcelService.getAllTickets();
      }

      setTickets(data);

      // Compute statistics based on fetched data
      const pendingCount = data.filter((t) => t.status === 'Pending').length;
      const otpCount = data.filter((t) => t.status === 'OTP Generated').length;
      const deliveredCount = data.filter((t) => t.status === 'Delivered').length;
      
      setStats({
        pending: pendingCount,
        otpGenerated: otpCount,
        delivered: deliveredCount,
      });
    } catch (err) {
      console.error(err);
      showToast('Failed to load dashboard parcel tickets.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Trigger search
  const handleSearch = (e) => {
    e.preventDefault();
    loadDashboardData(searchQuery);
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    // Instant search/filter on clear or empty
    if (!val.trim()) {
      loadDashboardData('');
    }
  };

  // Login handler
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');

    if (!loginForm.email.trim() || !loginForm.password.trim()) {
      setLoginError('Both email and password are required.');
      return;
    }

    setLoading(true);
    try {
      const response = await securityService.login(loginForm.email, loginForm.password);
      if (response.status === 'success') {
        sessionStorage.setItem('cs_guard_email', response.email);
        setIsLoggedIn(true);
        setGuardEmail(response.email);
        showToast('Logged in successfully!', 'success');
        loadDashboardData();
      }
    } catch (err) {
      console.error(err);
      setLoginError(err.response?.data?.message || 'Login failed. Invalid credentials or restricted access.');
      showToast('Authentication failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('cs_guard_email');
    setIsLoggedIn(false);
    setGuardEmail('');
    setLoginForm({ email: '', password: '' });
    showToast('Logged out successfully.', 'info');
  };

  // Action: Generate OTP
  const handleGenerateOtp = async (ticketId) => {
    setLoading(true);
    try {
      await parcelService.generateOtp(ticketId);
      showToast('Secure 6-digit OTP generated and sent to student email!', 'success');
      loadDashboardData(searchQuery);
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Failed to generate OTP.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Action: Open verification modal
  const openVerifyModal = (ticket) => {
    setSelectedTicket(ticket);
    setOtpInput('');
    setOtpError('');
    setIsModalOpen(true);
  };

  // Action: Verify OTP Submission
  const handleVerifyOtpSubmit = async (e) => {
    e.preventDefault();
    setOtpError('');

    if (!/^\d{6}$/.test(otpInput)) {
      setOtpError('OTP must contain exactly 6 digits.');
      return;
    }

    setLoading(true);
    try {
      const response = await parcelService.verifyOtp(selectedTicket.id, otpInput);
      if (response.status === 'success') {
        showToast('Parcel Delivered Successfully!', 'success');
        setIsModalOpen(false);
        setSelectedTicket(null);
        loadDashboardData(searchQuery);
      }
    } catch (err) {
      console.error(err);
      // Display specific failure messages gracefully
      setOtpError(err.response?.data?.message || 'Invalid OTP. Verification failed.');
      showToast('OTP verification failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="security-container">
      {/* Header bar */}
      <div className="security-header">
        <div className="header-left">
          <button className="btn btn-secondary btn-back" onClick={() => navigate('/')}>
            ← Exit Portal
          </button>
          <h1>Hostel Security Guard Portal</h1>
        </div>
        {isLoggedIn && (
          <div className="guard-info">
            <span className="guard-email">Active Guard: <strong>{guardEmail}</strong></span>
            <button className="btn btn-secondary btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>

      {loading && <Spinner />}

      {/* LOGIN PAGE */}
      {!isLoggedIn && !loading && (
        <div className="login-card-container">
          <div className="card login-card">
            <h2>Authorized Guard Access</h2>
            <p>Access is restricted. Enter your pre-approved Gmail credentials to manage hostel parcel verifications.</p>
            
            {loginError && <div className="login-error-alert">{loginError}</div>}
            
            <form onSubmit={handleLoginSubmit} className="login-form">
              <div className="form-group">
                <label className="form-label">Gmail Address</label>
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  placeholder="name@gmail.com"
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  placeholder="••••••••"
                  className="form-control"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary btn-block">
                Authenticate Secure Login
              </button>
            </form>

            <div className="login-hints">
              <p>💡 <strong>Demo Seeding Credentials:</strong></p>
              <p>Email: <code>security@gmail.com</code> | Password: <code>admin123</code></p>
            </div>
          </div>
        </div>
      )}

      {/* SECURITY DASHBOARD */}
      {isLoggedIn && !loading && (
        <div className="dashboard-content">
          {/* Dashboard Metrics / Stats */}
          <div className="stats-row grid grid-cols-2" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <div className="card stat-card pending">
              <span className="stat-label">Pending Arrival</span>
              <span className="stat-value">{stats.pending}</span>
            </div>
            <div className="card stat-card otp-sent">
              <span className="stat-label">OTPs Dispatched</span>
              <span className="stat-value">{stats.otpGenerated}</span>
            </div>
            <div className="card stat-card delivered">
              <span className="stat-label">Packages Handed Over</span>
              <span className="stat-value">{stats.delivered}</span>
            </div>
          </div>

          {/* Search bar and title */}
          <div className="table-header-controls">
            <h2>Active Parcel Verification Queue</h2>
            <form onSubmit={handleSearch} className="search-bar-form">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search student name or phone number..."
                className="form-control search-input"
              />
              <button type="submit" className="btn btn-primary">
                Search
              </button>
            </form>
          </div>

          {/* Main Tickets Table */}
          <div className="table-container">
            {tickets.length === 0 ? (
              <div className="empty-table-state">
                <p>No parcels matching this filter are in the verification queue.</p>
              </div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Student Name</th>
                    <th>Contact Info</th>
                    <th>Year & Block</th>
                    <th>Brand</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket) => (
                    <tr key={ticket.id}>
                      <td>#{ticket.id}</td>
                      <td>
                        <strong>{ticket.studentName}</strong>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.85rem' }}>{ticket.phoneNumber}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{ticket.email}</div>
                      </td>
                      <td>{ticket.year} Yr | {ticket.hostelBlock}</td>
                      <td>
                        <span className="brand-tag">{ticket.parcelBrand}</span>
                      </td>
                      <td>
                        <div className="desc-truncate" title={ticket.parcelDescription}>
                          {ticket.parcelDescription}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${
                          ticket.status === 'Pending' ? 'badge-pending' :
                          ticket.status === 'OTP Generated' ? 'badge-otp' : 'badge-delivered'
                        }`}>
                          {ticket.status}
                        </span>
                      </td>
                      <td>
                        {ticket.status === 'Pending' && (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleGenerateOtp(ticket.id)}
                          >
                            Generate OTP
                          </button>
                        )}
                        {ticket.status === 'OTP Generated' && (
                          <button
                            className="btn btn-secondary btn-sm btn-verify"
                            onClick={() => openVerifyModal(ticket)}
                          >
                            Verify OTP
                          </button>
                        )}
                        {ticket.status === 'Delivered' && (
                          <span style={{ fontSize: '0.85rem', color: 'var(--success-color)', fontWeight: '600' }}>
                            ✓ Handover Complete
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* OTP VERIFICATION MODAL */}
      {isModalOpen && selectedTicket && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Verify Parcel Pickup</h2>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="student-modal-summary">
                <p>Verify delivery for <strong>{selectedTicket.studentName}</strong></p>
                <p>Courier: <strong>{selectedTicket.parcelBrand}</strong> ({selectedTicket.parcelDescription})</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                  A secure code was mailed to <strong>{selectedTicket.email}</strong>
                </p>
              </div>

              {otpError && <div className="otp-error-alert">{otpError}</div>}

              <form onSubmit={handleVerifyOtpSubmit} className="otp-form">
                <div className="form-group">
                  <label className="form-label">Enter 6-Digit OTP</label>
                  <input
                    type="text"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, '').substring(0, 6))}
                    placeholder="000000"
                    className="form-control otp-digit-input"
                    autoFocus
                    required
                  />
                </div>

                <div className="modal-actions">
                  <button type="submit" className="btn btn-primary">
                    Verify & Release
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
