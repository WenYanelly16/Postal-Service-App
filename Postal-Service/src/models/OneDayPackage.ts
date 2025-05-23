// source/OnedayPackage.ts
import { Package } from './package.js';
import { IOneDayPackage } from '../interface/IOneDayPackage.js';

export class OneDayPackage extends Package implements IOneDayPackage {
    // Public properties matching IPackage (camelCase)
    public senderName: string;
    public receiverName: string;
    public senderAddress: string;
    public receiverAddress: string;
    public trackingNumber: string;
    public status: string;
    public weight: number;
    public costPerUnitWeight: number;
    public flatFee: number;

    constructor({
        sender_name,
        receiver_name,
        sender_address,
        receiver_address,
        weight,
        cost_per_unit_weight,
        tracking_number,
        status = 'Processing',
        flatFee = 15
    }: {
        sender_name: string;
        receiver_name: string;
        sender_address: string;
        receiver_address: string;
        weight: number;
        cost_per_unit_weight: number;
        tracking_number: string;
        status?: string;
        flatFee?: number;
    }) {
        // Convert snake_case to camelCase for the interface
        super({
            sender_name,
            receiver_name,
            sender_address,
            receiver_address,
            weight,
            cost_per_unit_weight,
            tracking_number,
            status,
            shipping_method: 'one-day'
        });

        // Map to camelCase properties
        this.senderName = sender_name;
        this.receiverName = receiver_name;
        this.senderAddress = sender_address;
        this.receiverAddress = receiver_address;
        this.trackingNumber = tracking_number;
        this.costPerUnitWeight = cost_per_unit_weight;
        this.weight = weight;
        this.status = status;
        this.flatFee = flatFee;
    }

    calculateCost(): number {
        return (this.weight * this.costPerUnitWeight) + this.flatFee;
    }

    printLabel(): void {
        console.log(`=== ONE-DAY PRIORITY SHIPPING ===
Sender: ${this.senderName}
Recipient: ${this.receiverName}
Tracking: ${this.trackingNumber}
Weight: ${this.weight}kg
Cost: $${this.calculateCost().toFixed(2)}
Status: ${this.status}`);
    }

    updateStatus(newStatus: string): void {
        this.status = newStatus;
        console.log(`Priority status updated: ${this.trackingNumber} -> ${newStatus}`);
    }

    // Additional method to get DB-compatible data
    getDBData() {
        return {
            sender_name: this.senderName,
            receiver_name: this.receiverName,
            sender_address: this.senderAddress,
            receiver_address: this.receiverAddress,
            weight: this.weight,
            cost_per_unit_weight: this.costPerUnitWeight,
            tracking_number: this.trackingNumber,
            status: this.status,
            shipping_method: 'one-day',
            flat_fee: this.flatFee
        };
    }
}