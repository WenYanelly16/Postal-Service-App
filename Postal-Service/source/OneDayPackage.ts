import { Package } from "./Package";
import { IOneDayPackage } from "../Interface/IOneDayPackage";

export class OneDayPackage extends Package implements IOneDayPackage {
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

