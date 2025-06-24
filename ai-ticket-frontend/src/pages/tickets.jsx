import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Tickets = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [createTicketData, setCreateTicketData] = useState({
    title: '',
    description: ''
  });
  const [creating, setCreating] = useState(false);

  // Fetch all tickets
  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('http://localhost:3000/api/tickets', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setTickets(response.data);
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError(err.response?.data?.message || 'Failed to fetch tickets');
      
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle create ticket
  const handleCreateTicket = async (e) => {
    e.preventDefault();
    
    if (!createTicketData.title.trim() || !createTicketData.description.trim()) {
      alert('Please fill in both title and description');
      return;
    }

    try {
      setCreating(true);
      const token = localStorage.getItem('token');

      const response = await axios.post(
        'http://localhost:3000/api/tickets',
        createTicketData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Reset form
      setCreateTicketData({ title: '', description: '' });
      
      // Refresh tickets list
      await fetchTickets();
      
      alert('Ticket created successfully!');
    } catch (err) {
      console.error('Error creating ticket:', err);
      alert(err.response?.data?.message || 'Failed to create ticket');
    } finally {
      setCreating(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Priority color mapping
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
      case 'normal':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Support Tickets</h1>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/admin')}
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
            >
              Admin Panel
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Create Ticket Form */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6">Create Ticket</h2>
          <form onSubmit={handleCreateTicket} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Ticket Title"
                value={createTicketData.title}
                onChange={(e) => setCreateTicketData(prev => ({
                  ...prev,
                  title: e.target.value
                }))}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <textarea
                placeholder="Ticket Description"
                value={createTicketData.description}
                onChange={(e) => setCreateTicketData(prev => ({
                  ...prev,
                  description: e.target.value
                }))}
                rows="4"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
                required
              />
            </div>
            <button
              type="submit"
              disabled={creating}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-medium transition-colors"
            >
              {creating ? 'Creating...' : 'Submit Ticket'}
            </button>
          </form>
        </div>

        {/* All Tickets */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-6">All Tickets</h2>
          
          {loading && (
            <div className="text-center py-8">
              <div className="text-gray-400">Loading tickets...</div>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <div className="text-red-400">{error}</div>
              <button
                onClick={fetchTickets}
                className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && tickets.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No tickets submitted yet.
            </div>
          )}

          {!loading && !error && tickets.length > 0 && (
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <div
                  key={ticket._id}
                  className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors cursor-pointer"
                  onClick={() => navigate(`/tickets/${ticket._id}`)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white truncate">
                      {ticket.title}
                    </h3>
                    <div className="flex items-center space-x-2 ml-4">
                      {ticket.aiAnalysis?.priority && (
                        <span className={`px-2 py-1 rounded-full text-xs border ${getPriorityColor(ticket.aiAnalysis.priority)}`}>
                          {ticket.aiAnalysis.priority.toUpperCase()}
                        </span>
                      )}
                      <span className="text-xs text-gray-400">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 text-sm line-clamp-2 mb-2">
                    {ticket.description}
                  </p>
                  
                  {ticket.aiAnalysis?.summary && (
                    <div className="bg-gray-800 rounded p-2 mt-2">
                      <div className="flex items-center mb-1">
                        <span className="text-xs text-blue-400 font-medium">🤖 AI Summary:</span>
                      </div>
                      <p className="text-xs text-gray-300">
                        {ticket.aiAnalysis.summary}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-600">
                    <span className="text-xs text-gray-400">
                      ID: {ticket._id.slice(-8)}
                    </span>
                    <span className="text-xs text-blue-400 hover:text-blue-300">
                      View Details →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tickets;