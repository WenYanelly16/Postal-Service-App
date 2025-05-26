// source/OnedayPackage.ts
import { Package } from './package.js';
import { IOneDayPackage } from '../interface/IOneDayPackage.js';

export class OneDayPackage extends Package implements IOneDayPackage {
    public flatFee: number;

    constructor(params: {
        package_id: string,
        sender_name: string;
        receiver_name: string;
        sender_address: string;
        receiver_address: string;
        weight: number;
        cost_per_unit_weight: number;
        tracking_number: string;
        status?: string;
        flat_fee?: number;
    }) {
        super({
            package_id: params.package_id,
            sender_name: params.sender_name,
            receiver_name: params.receiver_name,
            sender_address: params.sender_address,
            receiver_address: params.receiver_address,
            weight: params.weight,
            cost_per_unit_weight: params.cost_per_unit_weight,
            tracking_number: params.tracking_number,
            status: params.status,
            shipping_method: 'one-day'
        });
        this.flatFee = params.flat_fee ?? 15;
    }

    calculateCost(): number {
        // Calculate base cost plus one-day flat fee
        return (this.weight * this.costPerUnitWeight) + this.flatFee;
    }

    printLabel(): void {
        console.log(`
=== ONE-DAY PRIORITY SHIPPING ===
Sender: ${this.senderName}
Recipient: ${this.receiverName}
Tracking: ${this.trackingNumber}
Weight: ${this.weight}kg
Cost: $${this.calculateCost().toFixed(2)}
Status: ${this.status}
        `.trim());
    }

    updateStatus(newStatus: string): void {
        super.updateStatus(newStatus);
        console.log(`[PRIORITY] Tracking ${this.trackingNumber}: ${newStatus}`);
    }
}