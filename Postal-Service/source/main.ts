import { OneDayPackage } from "./OneDayPackage";
import { TwoDayPackage } from "./TwoDayPackage";
import { IPackage } from "./IPackage";

const packages: IPackage[] = [];

function generateTrackingNumber(): string {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}

export function addPackage(): void {
    const senderName = (document.getElementById('senderName') as HTMLInputElement).value;
    const receiverName = (document.getElementById('receiverName') as HTMLInputElement).value;
    const senderAddress = (document.getElementById('senderAddress') as HTMLInputElement).value;
    const receiverAddress = (document.getElementById('receiverAddress') as HTMLInputElement).value;
    const weight = parseFloat((document.getElementById('weight') as HTMLInputElement).value);
    const shippingMethod = (document.getElementById('shippingMethod') as HTMLSelectElement).value;

    const trackingNumber = generateTrackingNumber();
    let newPackage: IPackage;

    if (shippingMethod === "One-Day") {
        newPackage = new OneDayPackage(senderName, receiverName, senderAddress, receiverAddress, weight, 2, trackingNumber, 10);
    } else {
        newPackage = new TwoDayPackage(senderName, receiverName, senderAddress, receiverAddress, weight, 2, trackingNumber, 5);
    }

    packages.push(newPackage);
    alert(`Package added! Tracking Number: ${trackingNumber}`);
    updatePackageList();
}

export function updatePackageList(): void {
    const list = document.getElementById('packageList') as HTMLUListElement;
    list.innerHTML = "";
    packages.forEach(pkg => {
        const item = document.createElement('li');
        item.innerHTML = `<span class="package-item" onclick="updateStatus('${pkg.trackingNumber}')">${pkg.trackingNumber} - ${pkg.receiverName} (${pkg.status})</span>`;
        list.appendChild(item);
    });
}

export function viewLabel(): void {
    const trackingNum = (document.getElementById('trackingInput') as HTMLInputElement).value;
    const pkg = packages.find(p => p.trackingNumber === trackingNum);
    
    const labelElement = document.getElementById('packageLabel') as HTMLPreElement;
    labelElement.textContent = pkg
        ? `Tracking #: ${pkg.trackingNumber}\nFrom: ${pkg.senderName}, ${pkg.senderAddress}\nTo: ${pkg.receiverName}, ${pkg.receiverAddress}\nWeight: ${pkg.weight}kg\nStatus: ${pkg.status}`
        : "Tracking number not found.";
}

export function calculateCost(): void {
    const trackingNum = (document.getElementById('calcTrackingNumber') as HTMLInputElement).value;
    const pkg = packages.find(p => p.trackingNumber === trackingNum);
    
    const costDisplay = document.getElementById('costDisplay') as HTMLParagraphElement;
    costDisplay.textContent = pkg
        ? `Total Cost: $${pkg.calculateCost().toFixed(2)}`
        : "Tracking number not found.";
}

export function updateStatus(trackingNumber: string): void {
    const pkg = packages.find(p => p.trackingNumber === trackingNumber);
    if (pkg) {
        const newStatus = prompt("Enter new status (Created, Shipped, Delivered):", pkg.status);
        if (newStatus) {
            pkg.updateStatus(newStatus);
            updatePackageList();
        }
    }
}

// Attach event listeners
document.addEventListener("DOMContentLoaded", () => {
    (document.getElementById("addPackageBtn") as HTMLButtonElement).addEventListener("click", addPackage);
    (document.getElementById("viewLabelBtn") as HTMLButtonElement).addEventListener("click", viewLabel);
    (document.getElementById("calculateCostBtn") as HTMLButtonElement).addEventListener("click", calculateCost);
});
