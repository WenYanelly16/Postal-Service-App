import { Package } from "./Package";
import { ITwoDayPackage } from "../Interface/ITwoDayPackage";

export class TwoDayPackage extends Package implements ITwoDayPackage {
    flatFee: number;

    constructor(senderName: string, receiverName: string, senderAddress: string, receiverAddress: string, 
                weight: number, costPerUnitWeight: number, trackingNumber: string, flatFee: number) {
        super(senderName, receiverName, senderAddress, receiverAddress, weight, costPerUnitWeight, trackingNumber);
        this.flatFee = flatFee;
    }

    calculateCost(): number {
        return (this.weight * this.costPerUnitWeight) + this.flatFee;
    }
}

