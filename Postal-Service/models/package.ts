import { Pool } from 'pg';
import { IPackage } from '../Interface/IPackage';
import pool from '../config/db'; // Assuming your DB connection is here

export class Package implements IPackage {
    senderName: string;
    receiverName: string;
    senderAddress: string;
    receiverAddress: string;
    trackingNumber: string;
    status: string;
    weight: number;
    costPerUnitWeight: number;

    constructor(
        senderName: string, receiverName: string, senderAddress: string, receiverAddress: string,
        weight: number, costPerUnitWeight: number, trackingNumber: string, status: string = 'Created'
    ) {
        this.senderName = senderName;
        this.receiverName = receiverName;
        this.senderAddress = senderAddress;
        this.receiverAddress = receiverAddress;
        this.trackingNumber = trackingNumber;
        this.status = status;
        this.weight = weight;
        this.costPerUnitWeight = costPerUnitWeight;
    }

    calculateCost(): number {
        return this.weight * this.costPerUnitWeight;
    }

    updateStatus(newStatus: string): void {
        this.status = newStatus;
    }

    printLabel(): void {
        console.log(`Tracking #: ${this.trackingNumber}`);
        console.log(`From: ${this.senderName}, ${this.senderAddress}`);
        console.log(`To: ${this.receiverName}, ${this.receiverAddress}`);
        console.log(`Weight: ${this.weight}kg`);
        console.log(`Status: ${this.status}`);
    }

    // Database Methods
    static async createPackage(pkg: Package): Promise<Package> {
        const { senderName, receiverName, senderAddress, receiverAddress, weight, costPerUnitWeight, trackingNumber, status } = pkg;
        const query = `
            INSERT INTO packages (sender_name, receiver_name, sender_address, receiver_address, weight, cost_per_unit_weight, tracking_number, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
        `;
        const values = [senderName, receiverName, senderAddress, receiverAddress, weight, costPerUnitWeight, trackingNumber, status];
        const res = await pool.query(query, values);
        return new Package(
            res.rows[0].sender_name, res.rows[0].receiver_name, res.rows[0].sender_address,
            res.rows[0].receiver_address, res.rows[0].weight, res.rows[0].cost_per_unit_weight,
            res.rows[0].tracking_number, res.rows[0].status
        );
    }

    static async getPackageByTrackingNumber(trackingNumber: string): Promise<Package | null> {
        const query = `
            SELECT * FROM packages WHERE tracking_number = $1;
        `;
        const res = await pool.query(query, [trackingNumber]);
        if (res.rows.length > 0) {
            const pkg = res.rows[0];
            return new Package(
                pkg.sender_name, pkg.receiver_name, pkg.sender_address,
                pkg.receiver_address, pkg.weight, pkg.cost_per_unit_weight,
                pkg.tracking_number, pkg.status
            );
        }
        return null;
    }

    static async updatePackageStatus(trackingNumber: string, newStatus: string): Promise<boolean> {
        const query = `
            UPDATE packages SET status = $1 WHERE tracking_number = $2 RETURNING *;
        `;
        const res = await pool.query(query, [newStatus, trackingNumber]);
        return res.rows.length > 0;
    }

    static async getAllPackages(): Promise<Package[]> {
        const query = `SELECT * FROM packages;`;
        const res = await pool.query(query);
        return res.rows.map((pkg: any) => new Package(
            pkg.sender_name, pkg.receiver_name, pkg.sender_address,
            pkg.receiver_address, pkg.weight, pkg.cost_per_unit_weight,
            pkg.tracking_number, pkg.status
        ));
    }
}
