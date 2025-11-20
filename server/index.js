require('dotenv').config();
const express = require('express');
const cors = require('cors');
const careerRoutes = require('./routes/careerRoutes');
const courseRoutes = require('./routes/courseRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const transcriptRoutes = require('./routes/transcriptRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/career', careerRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/transcript', transcriptRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'UW Course Recommender API is running' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', message: err.message });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
