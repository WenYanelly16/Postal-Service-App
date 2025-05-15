//server.ts
import express from 'express';
import dotenv from 'dotenv';
import packageRoutes from './routes/routes.js'; // Note .js extension

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3000');

app.use(express.json());
app.use('/api', packageRoutes);

app.get('/', (_req, res) => {
  res.send('Postal Service API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});