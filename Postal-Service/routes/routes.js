"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes/packageRoutes.ts
const express_1 = require("express");
const packageController_1 = require("../controllers/packageController");
const router = (0, express_1.Router)();
// Create a new package
router.post('/packages', packageController_1.PackageController.addPackage);
// List all packages
router.get('/packages', packageController_1.PackageController.getAllPackages);
// Get a single package by tracking number
router.get('/packages/:trackingNumber', packageController_1.PackageController.getPackage);
exports.default = router;
