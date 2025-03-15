let packages = [];

function navigateTo(sectionId) {
    document.querySelectorAll('.section').forEach(section => section.style.display = 'none');
    document.getElementById(sectionId).style.display = 'block';
}

function generateTrackingNumber() {
    return 'PKG-' + Math.floor(Math.random() * 100000);
}

function addPackage() {
    let packageData = {
        senderName: document.getElementById('senderName').value,
        receiverName: document.getElementById('receiverName').value,
        senderAddress: document.getElementById('senderAddress').value,
        receiverAddress: document.getElementById('receiverAddress').value,
        weight: parseFloat(document.getElementById('weight').value),
        shippingMethod: document.getElementById('shippingMethod').value,
        trackingNumber: generateTrackingNumber(),
        status: "Created"
    };
    packages.push(packageData);
    alert(`Package added! Tracking Number: ${packageData.trackingNumber}`);
    updatePackageList();
}

function updatePackageList() {
    let list = document.getElementById('packageList');
    list.innerHTML = "";
    packages.forEach(pkg => {
        let item = document.createElement('li');
        item.innerHTML = `
            <span class="package-item">${pkg.trackingNumber} - ${pkg.receiverName} (${pkg.status})</span>
            <button onclick="updateStatus('${pkg.trackingNumber}')">Update Status</button>
        `;
        list.appendChild(item);
    });
}

function updateStatus(trackingNumber) {
    let pkg = packages.find(p => p.trackingNumber === trackingNumber);
    if (pkg) {
        let newStatus = prompt("Enter new status (Created, Shipped, Delivered):", pkg.status);
        if (newStatus) {
            pkg.status = newStatus;
            updatePackageList();
        }
    }
}

function viewLabel() {
    let trackingNum = document.getElementById('trackingInput').value;
    let pkg = packages.find(p => p.trackingNumber === trackingNum);
    if (pkg) {
        document.getElementById('packageLabel').textContent = `
            Tracking #: ${pkg.trackingNumber}
            From: ${pkg.senderName}, ${pkg.senderAddress}
            To: ${pkg.receiverName}, ${pkg.receiverAddress}
            Weight: ${pkg.weight}kg
            Status: ${pkg.status}
        `;
    } else {
        alert('Tracking number not found.');
    }
}

function calculateCost() {
    let weight = parseFloat(document.getElementById('calcWeight').value);
    let shippingMethod = document.getElementById('calcShippingMethod').value;
    let costPerKg = 2;
    let flatFee = shippingMethod === "One-Day" ? 10 : 5;
    let totalCost = (weight * costPerKg) + flatFee;
    document.getElementById('costDisplay').textContent = `Cost: $${totalCost.toFixed(2)}`;
}