//interface/IPackage.ts

export interface IPackage {
    senderName: string;
    receiverName: string;
    senderAddress: string;
    receiverAddress: string;
    weight: number;
    costPerUnitWeight: number;
    trackingNumber: string;
    status: string;
    shippingMethod: string;
    calculateCost(): number;
    printLabel(): void;
    updateStatus(newStatus: string): void;
}