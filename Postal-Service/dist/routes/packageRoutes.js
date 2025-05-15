// routes/packageRoutes.js

import { Router } from 'express';
import  {PackageController}  from '../controllers/packageController.js';
import { Package } from '../models/package.js';


const router = Router();

// View Route (HTML)
router.get('/', async (req, res) => {
  try {
    const packages = await Package.findAll();
    res.render('index', { packages });
  } catch (err) {
    res.status(500).render('error', { 
      title: 'Server Error',
      message: 'Failed to load packages',
      error: err 
    });
  }
});


// API Routes (JSON)
router.post('/api/packages', PackageController.createPackage);
router.get('/api/packages', PackageController.getAllPackages);
router.get('/api/packages/:trackingNumber', PackageController.getPackage);
router.patch('/api/packages/:trackingNumber/status', PackageController.updatePackageStatus);
router.delete('/api/packages/:trackingNumber', PackageController.deletePackage);
router.post('/api/packages/calculate-shipping', PackageController.calculateShippingCost);

export default router;