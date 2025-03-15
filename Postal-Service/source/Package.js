"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Package = void 0;
class Package {
    constructor(senderName, receiverName, senderAddress, receiverAddress, weight, costPerUnitWeight, trackingNumber) {
        this.senderName = senderName;
        this.receiverName = receiverName;
        this.senderAddress = senderAddress;
        this.receiverAddress = receiverAddress;
        this.weight = weight;
        this.costPerUnitWeight = costPerUnitWeight;
        this.trackingNumber = trackingNumber;
        this.status = "Created";
    }
    printLabel() {
        console.log(`Tracking Number: ${this.trackingNumber}`);
        console.log(`Sender: ${this.senderName} (${this.senderAddress})`);
        console.log(`Receiver: ${this.receiverName} (${this.receiverAddress})`);
        console.log(`Weight: ${this.weight} kg`);
        console.log(`Status: ${this.status}`);
    }
    updateStatus(newStatus) {
        this.status = newStatus;
        console.log(`Status updated to: ${this.status}`);
    }
}
exports.Package = Package;
