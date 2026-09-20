const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes/apiRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve Frontend Static Assets (frontend priority)
app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.static(path.join(__dirname, '../public')));

// Mount Modular API Routes
app.use('/api', apiRoutes);

// System Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: "UP",
    system: "Vernds AI Enterprise Modular Engine",
    architecture: "Modular (Backend / Database / Frontend)",
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` Vernds AI Enterprise Server running on http://localhost:${PORT}`);
  console.log(` Modular Architecture: Backend / Database / Frontend ACTIVE `);
  console.log(`=======================================================`);
});
