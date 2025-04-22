"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageController = void 0;
const pg_1 = require("pg");
const pool = new pg_1.Pool(); // Initialize your PostgreSQL connection pool here
class PackageController {
    // Create a new package and store it in the database
    static async addPackage(req, res) {
        const { senderName, receiverName, senderAddress, receiverAddress, weight, costPerUnitWeight, shippingMethod } = req.body;
        // Generate a tracking number for the new package
        const trackingNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
        const status = 'Created'; // Default status for new packages
        try {
            // Insert package details into the database
            const result = await pool.query(`INSERT INTO packages (sender_name, receiver_name, sender_address, receiver_address, weight, cost_per_unit_weight, tracking_number, status, shipping_method) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`, [senderName, receiverName, senderAddress, receiverAddress, weight, costPerUnitWeight, trackingNumber, status, shippingMethod]);
            const newPackage = result.rows[0]; // Get the inserted package
            res.status(201).json(newPackage); // Respond with the newly created package
        }
        catch (err) {
            console.error(err);
            res.status(500).send('Error creating package');
        }
    }
    // Get a list of all packages from the database
    static async getAllPackages(req, res) {
        try {
            const result = await pool.query('SELECT * FROM packages');
            res.status(200).json(result.rows); // Respond with all packages
        }
        catch (err) {
            console.error(err);
            res.status(500).send('Error retrieving packages');
        }
    }
    // Get a specific package by tracking number
    static async getPackage(req, res) {
        const { trackingNumber } = req.params;
        try {
            const result = await pool.query('SELECT * FROM packages WHERE tracking_number = $1', [trackingNumber]);
            if (result.rows.length === 0) {
                res.status(404).send('Package not found');
            }
            else {
                res.status(200).json(result.rows[0]); // Respond with the package
            }
        }
        catch (err) {
            console.error(err);
            res.status(500).send('Error retrieving package');
        }
    }
}
exports.PackageController = PackageController;
