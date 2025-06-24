import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const TicketDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  // Fetch ticket details
  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get(`http://localhost:3000/api/tickets/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        setTicket(response.data);
        
        // If ticket has AI analysis, set it
        if (response.data.aiAnalysis) {
          setAiAnalysis(response.data.aiAnalysis);
        } else {
          // If no AI analysis exists, trigger one
          await triggerAiAnalysis();
        }
      } catch (err) {
        console.error('Error fetching ticket:', err);
        setError(err.response?.data?.message || 'Failed to fetch ticket');
        
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTicket();
    }
  }, [id, navigate]);

  // Trigger AI analysis
  const triggerAiAnalysis = async () => {
    try {
      setAnalysisLoading(true);
      const token = localStorage.getItem('token');

      const response = await axios.post(
        `http://localhost:3000/api/tickets/${id}/analyze`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.aiAnalysis) {
        setAiAnalysis(response.data.aiAnalysis);
        // Update the ticket state with new analysis
        setTicket(prev => ({
          ...prev,
          aiAnalysis: response.data.aiAnalysis
        }));
      }
    } catch (err) {
      console.error('Error getting AI analysis:', err);
      setError('Failed to get AI analysis');
    } finally {
      setAnalysisLoading(false);
    }
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

  // Status color mapping
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'open':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'closed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading ticket details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-400 text-xl">{error}</div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Ticket not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
          >
            ← Back to Tickets
          </button>
          <h1 className="text-3xl font-bold">Ticket Details</h1>
        </div>

        {/* Ticket Information */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-gray-400 text-sm">Ticket ID</label>
              <p className="text-white font-mono">{ticket._id}</p>
            </div>
            <div>
              <label className="text-gray-400 text-sm">Created</label>
              <p className="text-white">
                {new Date(ticket.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <label className="text-gray-400 text-sm">Status</label>
              <span className={`inline-block px-3 py-1 rounded-full text-sm border ${getStatusColor(ticket.status)}`}>
                {ticket.status || 'Open'}
              </span>
            </div>
            <div>
              <label className="text-gray-400 text-sm">Created By</label>
              <p className="text-white">{ticket.createdBy?.email || 'Unknown'}</p>
            </div>
          </div>

          <div className="mb-4">
            <label className="text-gray-400 text-sm">Title</label>
            <h2 className="text-2xl font-semibold text-white">{ticket.title}</h2>
          </div>

          <div>
            <label className="text-gray-400 text-sm">Description</label>
            <p className="text-white whitespace-pre-wrap bg-gray-700 p-4 rounded-lg">
              {ticket.description}
            </p>
          </div>
        </div>

        {/* AI Analysis Section */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold flex items-center">
              🤖 AI Analysis
            </h3>
            {!aiAnalysis && !analysisLoading && (
              <button
                onClick={triggerAiAnalysis}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
              >
                Generate Analysis
              </button>
            )}
          </div>

          {analysisLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="text-blue-400">
                🔄 Analyzing ticket with AI...
              </div>
            </div>
          )}

          {aiAnalysis && (
            <div className="space-y-4">
              {/* Summary */}
              <div>
                <label className="text-gray-400 text-sm font-medium">Summary</label>
                <p className="text-white bg-gray-700 p-3 rounded-lg">
                  {aiAnalysis.summary}
                </p>
              </div>

              {/* Priority */}
              <div>
                <label className="text-gray-400 text-sm font-medium">AI Recommended Priority</label>
                <div className="mt-1">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm border ${getPriorityColor(aiAnalysis.priority)}`}>
                    {aiAnalysis.priority?.toUpperCase() || 'NORMAL'}
                  </span>
                </div>
              </div>

              {/* Helpful Notes */}
              {aiAnalysis.helpfulNotes && (
                <div>
                  <label className="text-gray-400 text-sm font-medium">AI Notes</label>
                  <p className="text-white bg-gray-700 p-3 rounded-lg">
                    {aiAnalysis.helpfulNotes}
                  </p>
                </div>
              )}

              {/* Related Skills */}
              {aiAnalysis.relatedSkills && aiAnalysis.relatedSkills.length > 0 && (
                <div>
                  <label className="text-gray-400 text-sm font-medium">Related Skills</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {aiAnalysis.relatedSkills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-600 text-white px-2 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Analysis Timestamp */}
              <div className="text-xs text-gray-500 pt-2 border-t border-gray-700">
                Analysis generated: {new Date().toLocaleString()}
              </div>
            </div>
          )}

          {!aiAnalysis && !analysisLoading && (
            <div className="text-center py-8 text-gray-400">
              No AI analysis available. Click "Generate Analysis" to get AI insights for this ticket.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketDetailsPage;