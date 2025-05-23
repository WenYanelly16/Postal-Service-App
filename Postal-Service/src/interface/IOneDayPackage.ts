//interface/IoneDayPackage.ts
import { IPackage } from './IPackage.js';

export interface IOneDayPackage extends IPackage {
    /**
     * Flat fee added to one-day shipping (default: $15)
     */
    flatFee: number;
    
    /**
     * Calculates total cost with priority fee
     */
    calculateCost(): number;
    
    /**
     * Displays formatted shipping label with urgency indicator
     */
    printLabel(): void;
    
    /**
     * Updates status with priority tracking
     * @param newStatus - Updated delivery status
     */
    updateStatus(newStatus: string): void;
}