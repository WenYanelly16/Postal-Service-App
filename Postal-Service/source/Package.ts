import { IPackage } from "./IPackage";

export abstract class Package implements IPackage {
    senderName: string;
    receiverName: string;
    senderAddress: string;
    receiverAddress: string;
    trackingNumber: string;
    status: string;
    weight: number;
    costPerUnitWeight: number;

    constructor(senderName: string, receiverName: string, senderAddress: string, receiverAddress: string, 
                weight: number, costPerUnitWeight: number, trackingNumber: string) {
        this.senderName = senderName;
        this.receiverName = receiverName;
        this.senderAddress = senderAddress;
        this.receiverAddress = receiverAddress;
        this.weight = weight;
        this.costPerUnitWeight = costPerUnitWeight;
        this.trackingNumber = trackingNumber;
        this.status = "Created";
    }

    abstract calculateCost(): number;

    printLabel(): void {
        console.log(`Tracking Number: ${this.trackingNumber}`);
        console.log(`Sender: ${this.senderName} (${this.senderAddress})`);
        console.log(`Receiver: ${this.receiverName} (${this.receiverAddress})`);
        console.log(`Weight: ${this.weight} kg`);
        console.log(`Status: ${this.status}`);
    }

    updateStatus(newStatus: string): void {
        this.status = newStatus;
        console.log(`Status updated to: ${this.status}`);
    }
}
