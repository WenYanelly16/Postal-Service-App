//server.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import packageRoutes from './routes/packageRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// EJS Configuration
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Routes
app.use('/', packageRoutes);

// Debug route registration
console.log('Registered routes:');
app._router.stack.forEach(layer => {
  if (layer.route) {
    console.log(`${layer.route.path} - ${Object.keys(layer.route.methods)[0]}`);
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = 2022;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});