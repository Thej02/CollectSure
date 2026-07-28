import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { parcelService } from '../services/api';
import useToast from '../hooks/useToast';
import Spinner from '../components/Spinner';
import './StudentPortal.css';

export default function StudentPortal() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentTicket, setCurrentTicket] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form Fields State
  const [formData, setFormData] = useState({
    studentName: '',
    phoneNumber: '',
    email: '',
    year: '',
    hostelBlock: '',
    parcelBrand: '',
    parcelDescription: '',
  });

  // Client Validation Errors
  const [errors, setErrors] = useState({});

  // Load current ticket from localStorage on mount
  useEffect(() => {
    const savedTicketId = localStorage.getItem('cs_ticket_id');
    if (savedTicketId) {
      fetchTicketDetails(savedTicketId);
    }
  }, []);

  const fetchTicketDetails = async (id) => {
    setLoading(true);
    try {
      const ticket = await parcelService.getTicketById(id);
      setCurrentTicket(ticket);
      // Pre-fill form in case they want to edit
      setFormData({
        studentName: ticket.studentName,
        phoneNumber: ticket.phoneNumber,
        email: ticket.email,
        year: ticket.year,
        hostelBlock: ticket.hostelBlock,
        parcelBrand: ticket.parcelBrand,
        parcelDescription: ticket.parcelDescription,
      });
    } catch (err) {
      console.error(err);
      showToast('Could not load current ticket. It might have been deleted.', 'error');
      localStorage.removeItem('cs_ticket_id');
    } finally {
      setLoading(false);
    }
  };

  // Client Form Validation
  const validateForm = () => {
    const tempErrors = {};
    if (!formData.studentName.trim()) tempErrors.studentName = 'Full Name is required.';
    
    if (!formData.phoneNumber.trim()) {
      tempErrors.phoneNumber = 'Phone Number is required.';
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      tempErrors.phoneNumber = 'Phone Number must contain exactly 10 digits.';
    }

    if (!formData.email.trim()) {
      tempErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      tempErrors.email = 'Email must be valid.';
    }

    if (!formData.year) tempErrors.year = 'Year is required.';
    if (!formData.hostelBlock.trim()) tempErrors.hostelBlock = 'Hostel Block is required.';
    if (!formData.parcelBrand.trim()) tempErrors.parcelBrand = 'Parcel Brand is required.';
    if (!formData.parcelDescription.trim()) tempErrors.parcelDescription = 'Parcel Description is required.';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error when typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Please correct form validation errors.', 'error');
      return;
    }

    setLoading(true);
    try {
      if (isEditing && currentTicket) {
        // Edit flow
        const updated = await parcelService.editTicket(currentTicket.id, formData);
        setCurrentTicket(updated);
        setIsEditing(false);
        showToast('Parcel ticket updated successfully!', 'success');
      } else {
        // Create flow
        const ticket = await parcelService.raiseTicket(formData);
        setCurrentTicket(ticket);
        localStorage.setItem('cs_ticket_id', ticket.id);
        showToast('Parcel ticket created successfully!', 'success');
      }
    } catch (err) {
      console.error(err);
      const backendErrors = err.response?.data;
      if (backendErrors && typeof backendErrors === 'object' && !backendErrors.message) {
        // Validation messages from backend
        setErrors(backendErrors);
        showToast('Validation failed on server.', 'error');
      } else {
        showToast(err.response?.data?.message || 'Failed to submit parcel ticket. Try again.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  // Find ticket by phone or email
  const handleSearchTicket = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      showToast('Please enter a search query.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const tickets = await parcelService.searchStudent(searchQuery);
      if (tickets.length > 0) {
        // Take the latest ticket matching search
        const match = tickets[0];
        setCurrentTicket(match);
        localStorage.setItem('cs_ticket_id', match.id);
        setFormData({
          studentName: match.studentName,
          phoneNumber: match.phoneNumber,
          email: match.email,
          year: match.year,
          hostelBlock: match.hostelBlock,
          parcelBrand: match.parcelBrand,
          parcelDescription: match.parcelDescription,
        });
        showToast('Ticket found and loaded.', 'success');
        setSearchQuery('');
      } else {
        showToast('No tickets found matching your query.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to find ticket. Check query.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    localStorage.removeItem('cs_ticket_id');
    setCurrentTicket(null);
    setIsEditing(false);
    setFormData({
      studentName: '',
      phoneNumber: '',
      email: '',
      year: '',
      hostelBlock: '',
      parcelBrand: '',
      parcelDescription: '',
    });
    setErrors({});
  };

  return (
    <div className="portal-container">
      {/* Header */}
      <div className="portal-header">
        <button className="btn btn-secondary" onClick={() => navigate('/')}>
          ← Back to Home
        </button>
        <h1>Student Portal</h1>
      </div>

      {loading && <Spinner />}

      {!loading && currentTicket ? (
        /* Ticket Status & Current Card View */
        <div className="ticket-view-container grid grid-cols-2">
          {/* Left Card: Ticket Details */}
          <div className="card ticket-details-card">
            <div className="card-badge-header">
              <h3>Current Parcel Ticket</h3>
              <button 
                className="btn btn-secondary btn-sm" 
                onClick={handleCreateNew}
              >
                Raise New Ticket
              </button>
            </div>
            
            {isEditing ? (
              /* Inline Edit Mode */
              <form onSubmit={handleSubmit} className="edit-ticket-form">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleChange}
                    className="form-control"
                  />
                  {errors.studentName && <p className="form-error">{errors.studentName}</p>}
                </div>

                <div className="grid grid-cols-2">
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="text"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="form-control"
                    />
                    {errors.phoneNumber && <p className="form-error">{errors.phoneNumber}</p>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-control"
                    />
                    {errors.email && <p className="form-error">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2">
                  <div className="form-group">
                    <label className="form-label">Year</label>
                    <select
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      className="form-control"
                    >
                      <option value="">Select Year</option>
                      <option value="1st">1st Year</option>
                      <option value="2nd">2nd Year</option>
                      <option value="3rd">3rd Year</option>
                      <option value="4th">4th Year</option>
                    </select>
                    {errors.year && <p className="form-error">{errors.year}</p>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Hostel Block</label>
                    <input
                      type="text"
                      name="hostelBlock"
                      value={formData.hostelBlock}
                      onChange={handleChange}
                      placeholder="e.g. Block C"
                      className="form-control"
                    />
                    {errors.hostelBlock && <p className="form-error">{errors.hostelBlock}</p>}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Parcel Brand</label>
                  <input
                    type="text"
                    name="parcelBrand"
                    value={formData.parcelBrand}
                    onChange={handleChange}
                    placeholder="e.g. Amazon, Flipkart, Myntra"
                    className="form-control"
                  />
                  {errors.parcelBrand && <p className="form-error">{errors.parcelBrand}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label">Parcel Description</label>
                  <textarea
                    name="parcelDescription"
                    value={formData.parcelDescription}
                    onChange={handleChange}
                    rows="3"
                    className="form-control"
                  ></textarea>
                  {errors.parcelDescription && <p className="form-error">{errors.parcelDescription}</p>}
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">Save Changes</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
              </form>
            ) : (
              /* Static View Mode */
              <div className="ticket-details">
                <div className="detail-row">
                  <span className="detail-label">Ticket ID:</span>
                  <span className="detail-value">#{currentTicket.id}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Student Name:</span>
                  <span className="detail-value">{currentTicket.studentName}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Phone & Email:</span>
                  <span className="detail-value">{currentTicket.phoneNumber} | {currentTicket.email}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Year & Block:</span>
                  <span className="detail-value">{currentTicket.year} Year | {currentTicket.hostelBlock}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Parcel Brand:</span>
                  <span className="detail-value">{currentTicket.parcelBrand}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Description:</span>
                  <span className="detail-value">{currentTicket.parcelDescription}</span>
                </div>
                {currentTicket.deliveryTime && (
                  <div className="detail-row">
                    <span className="detail-label">Delivered At:</span>
                    <span className="detail-value">
                      {new Date(currentTicket.deliveryTime).toLocaleString()}
                    </span>
                  </div>
                )}
                
                {/* Edit Button - Only if status is 'Pending' */}
                {currentTicket.status === 'Pending' && (
                  <button 
                    className="btn btn-secondary edit-btn" 
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Ticket Info
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right Card: Ticket Status Card */}
          <div className="card status-card">
            <h3>Delivery Status</h3>
            <div className="status-timeline">
              {/* Step 1: Ticket Raised */}
              <div className="timeline-item completed">
                <div className="timeline-icon">✓</div>
                <div className="timeline-content">
                  <h4>Ticket Raised</h4>
                  <p>Your ticket is successfully stored in the system database.</p>
                </div>
              </div>

              {/* Step 2: OTP Generated */}
              <div className={`timeline-item ${currentTicket.status !== 'Pending' ? 'completed' : 'active'}`}>
                <div className="timeline-icon">
                  {currentTicket.status !== 'Pending' ? '✓' : '2'}
                </div>
                <div className="timeline-content">
                  <h4>OTP Verification Sent</h4>
                  <p>OTP is generated when your package reaches the hostel security gate. It will be emailed to you.</p>
                </div>
              </div>

              {/* Step 3: Delivered */}
              <div className={`timeline-item ${currentTicket.status === 'Delivered' ? 'completed' : ''}`}>
                <div className="timeline-icon">
                  {currentTicket.status === 'Delivered' ? '✓' : '3'}
                </div>
                <div className="timeline-content">
                  <h4>Delivered Successfully</h4>
                  <p>Verifying the secure OTP will finalize the hand-over.</p>
                </div>
              </div>
            </div>

            <div className="status-badge-container">
              <span className="status-label">Current Status:</span>
              <span className={`badge ${
                currentTicket.status === 'Pending' ? 'badge-pending' :
                currentTicket.status === 'OTP Generated' ? 'badge-otp' : 'badge-delivered'
              }`}>
                {currentTicket.status}
              </span>
            </div>
            
            {currentTicket.status === 'OTP Generated' && (
              <div className="email-alert-box">
                <span className="alert-icon">✉</span>
                <p>A secure 6-digit OTP has been sent to your registered Gmail address. Please provide it to the guard at the hostel gate to collect your parcel.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Raise Ticket Form View */
        <div className="form-search-container grid grid-cols-2">
          {/* Left Column: Create Ticket Form */}
          <div className="card">
            <h2 className="card-title-main">Raise a Parcel Ticket</h2>
            <p className="card-desc">Enter your expectation details below. Status will remain "Pending" until your parcel physically arrives at the security gate.</p>
            
            <form onSubmit={handleSubmit} className="ticket-form">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="form-control"
                />
                {errors.studentName && <p className="form-error">{errors.studentName}</p>}
              </div>

              <div className="grid grid-cols-2">
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="10-digit number"
                    className="form-control"
                  />
                  {errors.phoneNumber && <p className="form-error">{errors.phoneNumber}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="student@gmail.com"
                    className="form-control"
                  />
                  {errors.email && <p className="form-error">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2">
                <div className="form-group">
                  <label className="form-label">Year of Study</label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="">Select Year</option>
                    <option value="1st">1st Year</option>
                    <option value="2nd">2nd Year</option>
                    <option value="3rd">3rd Year</option>
                    <option value="4th">4th Year</option>
                  </select>
                  {errors.year && <p className="form-error">{errors.year}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label">Hostel Block</label>
                  <input
                    type="text"
                    name="hostelBlock"
                    value={formData.hostelBlock}
                    onChange={handleChange}
                    placeholder="e.g. Block A"
                    className="form-control"
                  />
                  {errors.hostelBlock && <p className="form-error">{errors.hostelBlock}</p>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Parcel Brand / Courier</label>
                <input
                  type="text"
                  name="parcelBrand"
                  value={formData.parcelBrand}
                  onChange={handleChange}
                  placeholder="e.g. Amazon, Flipkart, DHL"
                  className="form-control"
                />
                {errors.parcelBrand && <p className="form-error">{errors.parcelBrand}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Parcel Description</label>
                <textarea
                  name="parcelDescription"
                  value={formData.parcelDescription}
                  onChange={handleChange}
                  placeholder="Briefly describe package (e.g. Blue Shoes Box, Black Backpack)"
                  rows="3"
                  className="form-control"
                ></textarea>
                {errors.parcelDescription && <p className="form-error">{errors.parcelDescription}</p>}
              </div>

              <button type="submit" className="btn btn-primary btn-block">
                Submit Parcel Ticket
              </button>
            </form>
          </div>

          {/* Right Column: Search/Retrieve Ticket */}
          <div className="card find-ticket-card">
            <h3>Retrieve Existing Ticket</h3>
            <p>Did you close your browser or change devices? Enter your registered Phone Number or Gmail address to retrieve your active ticket status.</p>
            
            <form onSubmit={handleSearchTicket} className="search-ticket-form">
              <div className="form-group">
                <label className="form-label">Phone or Email</label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter Phone Number or Email"
                  className="form-control"
                />
              </div>
              <button type="submit" className="btn btn-secondary">
                Search Ticket
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
