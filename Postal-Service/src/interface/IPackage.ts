//interface/IPackage.ts

export interface IPackage {
    senderName: string;
    receiverName: string;
    senderAddress: string;
    receiverAddress: string;
    trackingNumber: string;
    status: string;
    weight: number;
    costPerUnitWeight: number;

    calculateCost(): number;
    printLabel(): void;
    updateStatus(newStatus: string): void;
}
