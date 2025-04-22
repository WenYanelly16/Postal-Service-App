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

class OneDayPackage extends Package {
    constructor(senderName, receiverName, senderAddress, receiverAddress, weight, costPerUnitWeight, trackingNumber, flatFee) {
        super(senderName, receiverName, senderAddress, receiverAddress, weight, costPerUnitWeight, trackingNumber);
        this.flatFee = flatFee;
    }

    calculateCost() {
        return (this.weight * this.costPerUnitWeight) + this.flatFee;
    }
}

class TwoDayPackage extends Package {
    constructor(senderName, receiverName, senderAddress, receiverAddress, weight, costPerUnitWeight, trackingNumber, flatFee) {
        super(senderName, receiverName, senderAddress, receiverAddress, weight, costPerUnitWeight, trackingNumber);
        this.flatFee = flatFee;
    }

    calculateCost() {
        return (this.weight * this.costPerUnitWeight) + this.flatFee;
    }
}

// Example usage (browser console or DOM interaction)
document.addEventListener("DOMContentLoaded", () => {
    const pkg = new OneDayPackage(
        "Alice", "Bob", "123 Main St", "456 Elm St", 2.5, 10, "TRACK123", 15
    );

    pkg.printLabel();
    console.log("Cost: $" + pkg.calculateCost());
});
