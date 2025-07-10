const API_BASE_URL = 'https://agentic-ticket-system.vercel.app/api';

const apiService = {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      },
      ...options
    };
    const response = await fetch(url, config);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Something went wrong');
    return data;
  },

  // Auth methods
  async signup(userData) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },

  // Ticket methods
  async createTicket(ticketData) {
    return this.request('/tickets', {
      method: 'POST',
      body: JSON.stringify(ticketData)
    });
  },

  async getTickets() {
    return this.request('/tickets');
  },

  async getTicket(id) {
    return this.request(`/tickets/${id}`);
  },

  // Admin methods
  async getUsers() {
    return this.request('/users'); // Fixed: Changed from '/auth/users'
  },

  async updateUser(userData) {
    return this.request('/users/update', { // Fixed: Changed from '/auth/update-user'
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }
};

export default apiService;
