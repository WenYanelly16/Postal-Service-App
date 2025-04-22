const express = require('express') as unknown as typeof import('express');

import  { Application } from 'express';
import * as dotenv from 'dotenv';
import packageRoutes from './routes/routes';

dotenv.config();

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '3000');

app.use(express.json());

// Routes
app.use('/api', packageRoutes);

// Root
app.get('/', (_req, res) => {
  res.send('Postal Service API is running...');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
