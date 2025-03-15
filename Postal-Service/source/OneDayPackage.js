"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OneDayPackage = void 0;
const Package_1 = require("./Package");
class OneDayPackage extends Package_1.Package {
    constructor(senderName, receiverName, senderAddress, receiverAddress, weight, costPerUnitWeight, trackingNumber, flatFee) {
        super(senderName, receiverName, senderAddress, receiverAddress, weight, costPerUnitWeight, trackingNumber);
        this.flatFee = flatFee;
    }
    calculateCost() {
        return (this.weight * this.costPerUnitWeight) + this.flatFee;
    }
}
exports.OneDayPackage = OneDayPackage;
