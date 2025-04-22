"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Package = void 0;
const db_1 = __importDefault(require("../config/db")); // Assuming your DB connection is here
class Package {
    constructor(senderName, receiverName, senderAddress, receiverAddress, weight, costPerUnitWeight, trackingNumber, status = 'Created') {
        this.senderName = senderName;
        this.receiverName = receiverName;
        this.senderAddress = senderAddress;
        this.receiverAddress = receiverAddress;
        this.trackingNumber = trackingNumber;
        this.status = status;
        this.weight = weight;
        this.costPerUnitWeight = costPerUnitWeight;
    }
    calculateCost() {
        return this.weight * this.costPerUnitWeight;
    }
    updateStatus(newStatus) {
        this.status = newStatus;
    }
    printLabel() {
        console.log(`Tracking #: ${this.trackingNumber}`);
        console.log(`From: ${this.senderName}, ${this.senderAddress}`);
        console.log(`To: ${this.receiverName}, ${this.receiverAddress}`);
        console.log(`Weight: ${this.weight}kg`);
        console.log(`Status: ${this.status}`);
    }
    // Database Methods
    static async createPackage(pkg) {
        const { senderName, receiverName, senderAddress, receiverAddress, weight, costPerUnitWeight, trackingNumber, status } = pkg;
        const query = `
            INSERT INTO packages (sender_name, receiver_name, sender_address, receiver_address, weight, cost_per_unit_weight, tracking_number, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
        `;
        const values = [senderName, receiverName, senderAddress, receiverAddress, weight, costPerUnitWeight, trackingNumber, status];
        const res = await db_1.default.query(query, values);
        return new Package(res.rows[0].sender_name, res.rows[0].receiver_name, res.rows[0].sender_address, res.rows[0].receiver_address, res.rows[0].weight, res.rows[0].cost_per_unit_weight, res.rows[0].tracking_number, res.rows[0].status);
    }
    static async getPackageByTrackingNumber(trackingNumber) {
        const query = `
            SELECT * FROM packages WHERE tracking_number = $1;
        `;
        const res = await db_1.default.query(query, [trackingNumber]);
        if (res.rows.length > 0) {
            const pkg = res.rows[0];
            return new Package(pkg.sender_name, pkg.receiver_name, pkg.sender_address, pkg.receiver_address, pkg.weight, pkg.cost_per_unit_weight, pkg.tracking_number, pkg.status);
        }
        return null;
    }
    static async updatePackageStatus(trackingNumber, newStatus) {
        const query = `
            UPDATE packages SET status = $1 WHERE tracking_number = $2 RETURNING *;
        `;
        const res = await db_1.default.query(query, [newStatus, trackingNumber]);
        return res.rows.length > 0;
    }
    static async getAllPackages() {
        const query = `SELECT * FROM packages;`;
        const res = await db_1.default.query(query);
        return res.rows.map((pkg) => new Package(pkg.sender_name, pkg.receiver_name, pkg.sender_address, pkg.receiver_address, pkg.weight, pkg.cost_per_unit_weight, pkg.tracking_number, pkg.status));
    }
}
exports.Package = Package;
