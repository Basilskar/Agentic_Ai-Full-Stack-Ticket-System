const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./utils/database');
const errorHandler = require('./middleware/errorHandler');
const { inngest, processTicket, serve } = require('./utils/inngest');

// Routes
const authRoutes = require('./routes/auth');
const ticketRoutes = require('./routes/tickets');
const userRoutes = require('./routes/users');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/users', userRoutes);

// Serve Inngest
app.use('/api/inngest', serve({ client: inngest, functions: [processTicket] }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use(errorHandler);

const renderURL = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
console.log(`Inngest endpoint: ${renderURL}/api/inngest`);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


module.exports = app;
