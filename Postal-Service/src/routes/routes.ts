// routes/packageRoutes.ts
import { Router } from 'express';
import { PackageController } from '../controllers/packageController.js';

const router = Router();

// Create a new package
router.post('/packages', PackageController.addPackage);

// List all packages
router.get('/packages', PackageController.getAllPackages);

// Get a single package by tracking number
router.get('/packages/:trackingNumber', PackageController.getPackage);

export default router;

