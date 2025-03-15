"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwoDayPackage = void 0;
const Package_1 = require("./Package");
class TwoDayPackage extends Package_1.Package {
    constructor(senderName, receiverName, senderAddress, receiverAddress, weight, costPerUnitWeight, trackingNumber, flatFee) {
        super(senderName, receiverName, senderAddress, receiverAddress, weight, costPerUnitWeight, trackingNumber);
        this.flatFee = flatFee;
    }
    calculateCost() {
        return (this.weight * this.costPerUnitWeight) + this.flatFee;
    }
}
exports.TwoDayPackage = TwoDayPackage;
