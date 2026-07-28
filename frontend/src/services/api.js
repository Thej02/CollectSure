import axios from 'axios';

// Axios client with baseURL configured (relies on Vite dev proxy or standard fallback)
const apiClient = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const parcelService = {
  /**
   * Raise a new parcel ticket.
   */
  raiseTicket: async (ticketData) => {
    const response = await apiClient.post('/api/parcels', ticketData);
    return response.data;
  },

  /**
   * Get all tickets (delivered + active).
   */
  getAllTickets: async () => {
    const response = await apiClient.get('/api/parcels');
    return response.data;
  },

  /**
   * Get only active tickets (Pending + OTP Generated).
   */
  getActiveTickets: async () => {
    const response = await apiClient.get('/api/parcels/active');
    return response.data;
  },

  /**
   * Get a specific ticket by ID.
   */
  getTicketById: async (id) => {
    const response = await apiClient.get(`/api/parcels/${id}`);
    return response.data;
  },

  /**
   * Search students by name or phone number.
   */
  searchStudent: async (query) => {
    const response = await apiClient.get(`/api/parcels/search`, {
      params: { name: query },
    });
    return response.data;
  },

  /**
   * Edit/Update an existing parcel ticket (only allowed if status is Pending).
   */
  editTicket: async (id, ticketData) => {
    const response = await apiClient.put(`/api/parcels/${id}`, ticketData);
    return response.data;
  },

  /**
   * Generate secure 6-digit OTP for a parcel and send via email.
   */
  generateOtp: async (id) => {
    const response = await apiClient.post(`/api/parcels/${id}/generate-otp`);
    return response.data;
  },

  /**
   * Verify the 6-digit OTP.
   */
  verifyOtp: async (id, otp) => {
    const response = await apiClient.post(`/api/parcels/${id}/verify`, { otp });
    return response.data;
  },
};

export const securityService = {
  /**
   * Authenticate security guard.
   */
  login: async (email, password) => {
    const response = await apiClient.post('/api/security/login', { email, password });
    return response.data;
  },
};

export default apiClient;
