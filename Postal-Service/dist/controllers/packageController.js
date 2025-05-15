//controllers/packageController.js
import { Package } from '../models/package.js';
import { OneDayPackage } from '../models/OneDayPackage.js';
import { TwoDayPackage } from '../models/TwoDayPackage.js';

export class PackageController {


  static async createPackage(req, res) {
    try {
        const { 
            senderName, 
            receiverName,
            senderAddress,
            receiverAddress,
            weight,
            costPerUnitWeight,
            shippingMethod
        } = req.body;

        // Validate required fields
        if (!senderName || !receiverName || !weight) {
            return res.status(400).json({ 
                error: 'Missing required fields',
                required: ['senderName', 'receiverName', 'weight']
            });
        }

        // Create package in database
        const newPackage = await Package.create({
            senderName,
            receiverName,
            senderAddress,
            receiverAddress,
            weight: parseFloat(weight),
            costPerUnitWeight: parseFloat(costPerUnitWeight || '5'),
            shippingMethod: shippingMethod || 'standard'
        });

        return res.status(201).json({
            success: true,
            tracking_number: newPackage.tracking_number,
            package: newPackage
        });

    } catch (error) {
        console.error('Error creating package:', error);
        return res.status(500).json({ 
            error: 'Failed to create package',
            details: error.message
        });
    }
}
static async getAllPackages(req, res) {
  try {
    const packages = await Package.findAll();  // your method to get all packages
    res.json({ success: true, packages });
  } catch (error) {
    console.error('Error fetching all packages:', error);
    res.status(500).json({ error: 'Failed to fetch packages', details: error.message });
  }
}


    static async getPackage(req, res) {
        try {
            const { trackingNumber } = req.params;
            
            if (!trackingNumber) {
                return res.status(400).json({ error: 'Tracking number is required' });
            }

            const pkg = await Package.findByTrackingNumber(trackingNumber);
            
            if (!pkg) {
                return res.status(404).json({ 
                    error: 'Package not found',
                    tracking_number: trackingNumber
                });
            }

            res.json({
                success: true,
                package: pkg,
                label: pkg.generateLabel()
            });
        } catch (error) {
            console.error('Error fetching package:', error);
            res.status(500).json({ 
                error: 'Failed to fetch package',
                details: error.message
            });
        }
    }

    static async updatePackageStatus(req, res) {
        try {
            const { trackingNumber } = req.params;
            const { status } = req.body;

            if (!trackingNumber || !status) {
                return res.status(400).json({ 
                    error: 'Tracking number and status are required' 
                });
            }

           const updatedPackage = await Package.updateStatus(trackingNumber, status);

if (!updatedPackage) {
    return res.status(404).json({ 
        error: 'Package not found or update failed',
        tracking_number: trackingNumber
    });
}
            
            res.json({
                success: true,
                message: 'Package status updated',
                package: updatedPackage
            });
        } catch (error) {
            console.error('Error updating package status:', error);
            res.status(500).json({ 
                error: 'Failed to update package status',
                details: error.message
            });
        }
    }

    static async deletePackage(req, res) {
        try {
            const { trackingNumber } = req.params;
            
            if (!trackingNumber) {
                return res.status(400).json({ error: 'Tracking number is required' });
            }

            const deletedPackage = await Package.delete(trackingNumber);
            
            if (!deletedPackage) {
                return res.status(404).json({ 
                    error: 'Package not found',
                    tracking_number: trackingNumber
                });
            }

            res.json({
                success: true,
                message: 'Package deleted successfully',
                package: deletedPackage
            });
        } catch (error) {
            console.error('Error deleting package:', error);
            res.status(500).json({ 
                error: 'Failed to delete package',
                details: error.message
            });
        }
    }

    static async calculateShippingCost(req, res) {
        try {
            const { 
                senderName = 'Calculation Temp',
                receiverName = 'Calculation Temp',
                senderAddress = 'N/A',
                receiverAddress = 'N/A',
                weight,
                shippingMethod,
                calculateOnly = false
            } = req.body;

            if (!weight || !shippingMethod) {
                return res.status(400).json({ 
                    error: 'Weight and shipping method are required' 
                });
            }

            // Create a temporary package (not saved to DB)
            const tempPackage = new Package({
                sender_name: senderName,
                receiver_name: receiverName,
                sender_address: senderAddress,
                receiver_address: receiverAddress,
                weight: parseFloat(weight),
                cost_per_unit_weight: 5, // Base rate $5/kg
                shipping_method: shippingMethod,
                tracking_number: 'TEMP-' + Math.random().toString(36).substr(2, 9)
            });

            const cost = tempPackage.calculateCost();

            // Only save to DB if calculateOnly flag is false
            let savedPackage = null;
            if (!calculateOnly) {
                savedPackage = await Package.create({
                    senderName,
                    receiverName,
                    senderAddress,
                    receiverAddress,
                    weight: parseFloat(weight),
                    costPerUnitWeight: 5,
                    shippingMethod
                });
            }

            res.json({
                success: true,
                weight,
                shipping_method: shippingMethod,
                base_rate: 5,
                cost: cost.toFixed(2),
                cost_breakdown: {
                    base_cost: (tempPackage.weight * 5).toFixed(2),
                    method_fee: (cost - (tempPackage.weight * 5)).toFixed(2),
                    total: cost.toFixed(2)
                },
                package: savedPackage ? {
                    tracking_number: savedPackage.tracking_number,
                    id: savedPackage.package_id
                } : null
            });
        } catch (error) {
            console.error('Error calculating shipping cost:', error);
            res.status(500).json({ 
                error: 'Failed to calculate shipping cost',
                details: error.message
            });
        }
    }
}