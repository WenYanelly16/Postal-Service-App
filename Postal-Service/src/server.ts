//server.ts
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import packageRoutes from './routes/packageRoutes.js'; // Ensure packageRoutes.ts exports with `.js` if using ESModules

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 2022;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// EJS Configuration
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/', packageRoutes);

// Debug route registration
console.log('Registered routes:');
app._router.stack.forEach((layer: any) => {
  if (layer.route) {
    console.log(`${layer.route.path} - ${Object.keys(layer.route.methods)[0]}`);
  }
});

// Error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${PORT}`);
}).on('error', (err: Error) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
