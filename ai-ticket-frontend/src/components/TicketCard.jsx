import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { BugReport, Payment, AccountBox, Support, PriorityHigh } from '@mui/icons-material';

const TicketCard = ({ ticket, onClick }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'error';
      case 'High': return 'warning';
      case 'Medium': return 'info';
      case 'Low': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return 'default';
      case 'In Progress': return 'primary';
      case 'Resolved': return 'success';
      case 'Closed': return 'secondary';
      default: return 'default';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Technical': return <BugReport />;
      case 'Billing': return <Payment />;
      case 'Account': return <AccountBox />;
      default: return <Support />;
    }
  };

  return (
    <Card
      sx={{
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {getTypeIcon(ticket.ticketType)}
            <Typography variant="h6" component="h3" noWrap>
              {ticket.title}
            </Typography>
          </Box>
          <Chip
            label={ticket.priority}
            color={getPriorityColor(ticket.priority)}
            size="small"
            icon={<PriorityHigh />}
          />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {ticket.description.length > 100
            ? `${ticket.description.substring(0, 100)}...`
            : ticket.description}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
          <Chip label={ticket.status} color={getStatusColor(ticket.status)} variant="outlined" size="small" />
          <Chip label={ticket.ticketType} variant="outlined" size="small" />
          {ticket.requiredSkills && ticket.requiredSkills.map((skill, index) => (
            <Chip key={index} label={skill} variant="outlined" size="small" color="secondary" />
          ))}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Created: {new Date(ticket.createdAt).toLocaleDateString()}
          </Typography>
          {ticket.assignedTo && (
            <Typography variant="caption" color="text.secondary">
              Assigned to: {ticket.assignedTo.name}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default TicketCard;
