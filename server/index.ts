// Minimal server setup for client-only HealthifyMe clone
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;

// Serve static files from the built client
app.use(express.static(join(__dirname, '../dist/public')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'HealthifyMe client-only demo server' });
});

// Catch all handler for client-side routing
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../dist/public/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 HealthifyMe demo server running on port ${PORT}`);
  console.log(`📱 Open http://localhost:${PORT} to view the app`);
});