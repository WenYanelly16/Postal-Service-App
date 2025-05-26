//models/package.ts

import pool from '../config/db.js';
import { IPackage } from '../interface/IPackage.js';
import { OneDayPackage } from './OneDayPackage.js';
import { TwoDayPackage } from './TwoDayPackage.js';

export class Package implements IPackage {
    // Public properties (camelCase)
    public packageid: string;
    public senderName: string;
    public receiverName: string;
    public senderAddress: string;
    public receiverAddress: string;
    public weight: number;
    public costPerUnitWeight: number;
    public trackingNumber: string;
    public status: string;
    public shippingMethod: string;

    constructor(data: {
        package_id: string;
        sender_name: string;
        receiver_name: string;
        sender_address: string;
        receiver_address: string;
        weight: number;
        cost_per_unit_weight: number;
        tracking_number: string;
        status?: string;
        shipping_method?: string;
    }) {
        // Convert snake_case to camelCase
        this.packageid = data.package_id;
        this.senderName = data.sender_name;
        this.receiverName = data.receiver_name;
        this.senderAddress = data.sender_address;
        this.receiverAddress = data.receiver_address;
        this.weight = data.weight;
        this.costPerUnitWeight = data.cost_per_unit_weight;
        this.trackingNumber = data.tracking_number;
        this.status = data.status || 'created';
        this.shippingMethod = data.shipping_method || 'standard';
    }

    // Method 1: Calculate Cost (base implementation)
    calculateCost(): number {
        const baseCost = this.weight * this.costPerUnitWeight;
        let methodFee = 0;

        if (this.shippingMethod === 'one-day') {
            methodFee = 15;
        } else if (this.shippingMethod === 'two-day') {
            methodFee = 10;
        }

        return baseCost + methodFee;
    }

    // Method 2: Generate Label
    generateLabel(): string {
        return `
══════════════════════════════════
           SHIPPING LABEL           
══════════════════════════════════
Tracking #: ${this.trackingNumber}

FROM:
Name: ${this.senderName}
Address: ${this.senderAddress}

TO:
Name: ${this.receiverName}
Address: ${this.receiverAddress}

══════════════════════════════════
Weight: ${this.weight}kg
Status: ${this.status}
Method: ${this.shippingMethod}
Cost: $${this.calculateCost().toFixed(2)}
══════════════════════════════════
        `.trim();
    }

    // Method 3: Print Label
    printLabel(): void {
        console.log(this.generateLabel());
    }

    // Method 4: Update Status
    updateStatus(newStatus: string): void {
        if (!Package.validateStatus(newStatus)) {
            throw new Error(`Invalid status: ${newStatus}`);
        }
        this.status = newStatus.toLowerCase();
        console.log(`Status updated for ${this.trackingNumber}: ${newStatus}`);
    }

    // Static validation
    static validStatuses: string[] = ['created', 'in-transit', 'delivered', 'returned'];

    static validateStatus(status: string): boolean {
        return this.validStatuses.includes(status.toLowerCase());
    }

    // Database methods
    static async create(data: {
        senderName: string;
        receiverName: string;
        senderAddress: string;
        receiverAddress: string;
        weight: number;
        costPerUnitWeight?: number;
        shippingMethod?: string;
    }): Promise<Package> {
        try {
            const tracking_number = Math.floor(1000000000 + Math.random() * 9000000000).toString();
            const status = 'created';

            const result = await pool.query(
                `INSERT INTO packages (
                    sender_name, receiver_name, sender_address, receiver_address,
                    weight, cost_per_unit_weight, tracking_number, status, shipping_method
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                RETURNING *`,
                [
                    data.senderName,
                    data.receiverName,
                    data.senderAddress,
                    data.receiverAddress,
                    data.weight,
                    data.costPerUnitWeight ?? 5,
                    tracking_number,
                    status,
                    data.shippingMethod ?? 'standard'
                ]
            );

            return Package.fromDB(result.rows[0]);
        } catch (error: any) {
            console.error('Database error:', {
                message: error.message,
                constraint: error.constraint,
                detail: error.detail
            });
            throw new Error(`Failed to create package: ${error.message}`);
        }
    }

    protected static fromDB(dbData: any): Package {
        const params = {
            package_id :dbData.package_id,
            sender_name: dbData.sender_name,
            receiver_name: dbData.receiver_name,
            sender_address: dbData.sender_address,
            receiver_address: dbData.receiver_address,
            weight: dbData.weight,
            cost_per_unit_weight: dbData.cost_per_unit_weight,
            tracking_number: dbData.tracking_number,
            status: dbData.status,
            shipping_method: dbData.shipping_method
        };

        switch(dbData.shipping_method) {
            case 'one-day':
                return new OneDayPackage({ ...params, flat_fee: dbData.flat_fee });
            case 'two-day':
                return new TwoDayPackage({ ...params, flat_fee: dbData.flat_fee });
            default:
                return new Package(params);
        }
    }

    static async findByTrackingNumber(trackingNumber: string): Promise<Package | null> {
        try {
            const result = await pool.query(
                'SELECT * FROM packages WHERE tracking_number = $1',
                [trackingNumber]
            );
            return result.rows[0] ? this.fromDB(result.rows[0]) : null;
        } catch (error: any) {
            throw new Error(`Failed to find package: ${error.message}`);
        }
    }

    static async findAll(): Promise<Package[]> {
        try {
            const result = await pool.query(
                'SELECT * FROM packages ORDER BY created_at DESC'
            );
            return result.rows.map(row => this.fromDB(row));
        } catch (error: any) {
            console.error('Database error in findAll:', error);
            throw error;
        }
    }

    static async updateStatus(trackingNumber: string, newStatus: string): Promise<Package> {
        if (!this.validateStatus(newStatus)) {
            throw new Error(`Invalid status: ${newStatus}`);
        }

        try {
            const result = await pool.query(
                'UPDATE packages SET status = $1 WHERE tracking_number = $2 RETURNING *',
                [newStatus.toLowerCase(), trackingNumber]
            );

            if (result.rows.length === 0) {
                throw new Error(`Package not found: ${trackingNumber}`);
            }

            return this.fromDB(result.rows[0]);
        } catch (error: any) {
            throw new Error(`Failed to update status: ${error.message}`);
        }
    }

    static async delete(trackingNumber: string): Promise<Package | null> {
        try {
            const result = await pool.query(
                'DELETE FROM packages WHERE tracking_number = $1 RETURNING *',
                [trackingNumber]
            );
            return result.rows[0] ? this.fromDB(result.rows[0]) : null;
        } catch (error: any) {
            throw new Error(`Failed to delete package: ${error.message}`);
        }
    }
}