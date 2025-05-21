 // Current active section
        let activeSection = 'addPackage';
        
        // Show/hide sections
        function showSection(sectionId) {
            document.querySelectorAll('.section').forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById(sectionId).classList.add('active');
            activeSection = sectionId;
            
            // Special handling for certain sections
            if (sectionId === 'viewPackages') {
                loadPackages();
            }
        }

        // Helper functions for messages
        function showMessage(element, message, isError = false) {
            element.textContent = message;
            element.className = isError ? 'message error' : 'message success';
        }

        // Form submission for new package
        document.getElementById('packageForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formMessage = document.getElementById('formMessage');
            formMessage.innerHTML = '';
            formMessage.className = 'message';

            const packageData = {
                senderName: document.getElementById('senderName').value.trim(),
                receiverName: document.getElementById('receiverName').value.trim(),
                senderAddress: document.getElementById('senderAddress').value.trim(),
                receiverAddress: document.getElementById('receiverAddress').value.trim(),
                weight: parseFloat(document.getElementById('weight').value),
                costPerUnitWeight: parseFloat(document.getElementById('costPerUnitWeight').value || '5'),
                shippingMethod: document.getElementById('shippingMethod').value
            };

            try {
                const response = await fetch('/api/packages', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(packageData)
                });

                const result = await response.json();
                
                if (!response.ok) {
                    throw new Error(result.error || 'Failed to create package');
                }

                // Success handling
                formMessage.className = 'message success';
                formMessage.innerHTML = `
                    Package created! Tracking #: ${result.tracking_number}
                    <button class="btn" onclick="copyToClipboard('${result.tracking_number}')" style="margin-left: 10px; padding: 5px 10px;">
                        Copy Tracking Number
                    </button>
                `;
                
                // Reset form
                document.getElementById('packageForm').reset();
                
                // Auto-show the packages list
                showSection('viewPackages');
                await loadPackages();

            } catch (error) {
                console.error('Error:', error);
                formMessage.className = 'message error';
                formMessage.textContent = error.message;
            }
        });

        // Helper function
        function copyToClipboard(text) {
            navigator.clipboard.writeText(text)
                .then(() => alert('Tracking number copied!'))
                .catch(err => console.error('Copy failed:', err));
        }

        // Load all packages with delete and update functionality
       async function loadPackages() {
    const packageList = document.getElementById('packageList');
    packageList.innerHTML = '<li>Loading packages...</li>';
    
    try {
        const response = await fetch('/api/packages');
        
        // First check if the response is OK
        if (!response.ok) {
            throw new Error(`Server returned ${response.status} ${response.statusText}`);
        }

        // Check if response has content
        const text = await response.text();
        if (!text) {
            throw new Error('Empty response from server');
        }

        // Try to parse JSON
        const result = JSON.parse(text);
        
        const packages = Array.isArray(result) ? result : (result.packages || []);
        
        if (packages.length === 0) {
            packageList.innerHTML = '<li class="package-item">No packages found</li>';
            return;
        }
        
        packageList.innerHTML = '';
        packages.forEach(pkg => {
            const li = document.createElement('li');
            li.className = 'package-item';
            li.innerHTML = `
                <div class="package-header">
                    <span class="package-title">${pkg.tracking_number}</span>
                    <span>Status: ${pkg.status || 'Unknown'}</span>
                </div>
                <div class="package-details">
                    <strong>From:</strong> ${pkg.sender_name}<br>
                    <strong>To:</strong> ${pkg.receiver_name}<br>
                    <strong>Weight:</strong> ${pkg.weight}kg | 
                    <strong>Method:</strong> ${pkg.shipping_method}
                </div>
                <div class="package-actions">
                    <select class="status-select" id="status-${pkg.tracking_number}">
                        <option value="created" ${pkg.status === 'created' ? 'selected' : ''}>Created</option>
                        <option value="in-transit" ${pkg.status === 'in-transit' ? 'selected' : ''}>In Transit</option>
                        <option value="delivered" ${pkg.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                        <option value="returned" ${pkg.status === 'returned' ? 'selected' : ''}>Returned</option>
                    </select>
                    <button class="btn btn-warning update-btn" 
                        onclick="updatePackageStatus('${pkg.tracking_number}')">
                        Update Status
                    </button>
                    <button class="btn btn-danger delete-btn" 
                        onclick="deletePackage('${pkg.tracking_number}')">
                        Delete Package
                    </button>
                </div>
            `;
            packageList.appendChild(li);
        });
    } catch (error) {
        console.error('Error loading packages:', error);
        packageList.innerHTML = `
            <li class="package-item" style="color: var(--danger-color);">
                Error loading packages: ${error.message}
                <button class="btn" onclick="loadPackages()" style="margin-left: 10px;">Retry</button>
            </li>
        `;
    }
}
        // Update package status
        async function updatePackageStatus(trackingNumber) {
    const statusSelect = document.getElementById(`status-${trackingNumber}`);
    const newStatus = statusSelect.value;

    try {
        const response = await fetch(`/api/packages/${trackingNumber}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        });

        //const response = await fetch(url, options);
const text = await response.text();
console.log('Response text:', text);


        // Try parsing JSON
        const result = JSON.parse(text);

        if (!response.ok) {
            throw new Error(result.error || 'Failed to update status');
        }

        alert('Package status updated successfully!');
        loadPackages();
    } catch (error) {
        console.error('Error:', error);
        alert(`Error updating status: ${error.message}`);
    }
}



        // Delete package
        async function deletePackage(trackingNumber) {
            if (!confirm('Are you sure you want to delete this package?')) {
                return;
            }
            
            try {
                const response = await fetch(`/api/packages/${trackingNumber}`, {
                    method: 'DELETE'
                });
                
                const result = await response.json();
                
                if (!response.ok) {
                    throw new Error(result.error || 'Failed to delete package');
                }
                
                alert('Package deleted successfully!');
                loadPackages();
            } catch (error) {
                console.error('Error:', error);
                alert(`Error deleting package: ${error.message}`);
            }
        }

        // Get package label
        async function getPackageLabel() {
            const trackingNumber = document.getElementById('trackingInput').value.trim();
            const labelContainer = document.getElementById('labelContainer');
            
            if (!trackingNumber) {
                alert('Please enter a tracking number');
                return;
            }

            labelContainer.style.display = 'none';
            labelContainer.innerHTML = 'Loading label...';
            
            try {
                const response = await fetch(`/api/packages/${trackingNumber}`);
                const result = await response.json();
                
                if (!response.ok) {
                    throw new Error(result.error || 'Failed to fetch package');
                }
                
                const pkg = result.package || result;
                const label = result.label || `
══════════════════════════════════
           SHIPPING LABEL           
══════════════════════════════════
Tracking #: ${pkg.tracking_number}

FROM:
${pkg.sender_name}
${pkg.sender_address}

TO:
${pkg.receiver_name}
${pkg.receiver_address}

══════════════════════════════════
Weight: ${pkg.weight}kg
Status: ${pkg.status}
Method: ${pkg.shipping_method}
══════════════════════════════════
                `;
                
                labelContainer.innerHTML = `
                    <h3>Shipping Label - ${pkg.tracking_number}</h3>
                    <pre>${label}</pre>
                `;
                labelContainer.style.display = 'block';
            } catch (error) {
                console.error('Error:', error);
                labelContainer.innerHTML = `Error: ${error.message}`;
                labelContainer.style.display = 'block';
            }
        }

        // Calculate shipping cost
        async function calculateShippingCost() {
            const weight = parseFloat(document.getElementById('calcWeight').value);
            const method = document.getElementById('calcShippingMethod').value;
            const costResult = document.getElementById('costResult');
            
            if (!weight || weight <= 0) {
                alert('Please enter a valid weight');
                return;
            }

            try {
                const response = await fetch('/api/packages/calculate-shipping', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ 
                        weight, 
                        shippingMethod: method,
                        calculateOnly: true
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to calculate cost');
                }

                const data = await response.json();
                
                let resultHTML = `
                    <div class="cost-breakdown">
                        <h3>Shipping Cost Estimate</h3>
                        <p><strong>Base Cost:</strong> $${data.cost_breakdown.base_cost} (${weight}kg × $${data.base_rate}/kg)</p>
                        <p><strong>Shipping Method:</strong> ${method.replace('-', ' ')} $${data.cost_breakdown.method_fee > 0 ? `(+$${data.cost_breakdown.method_fee})` : ''}</p>
                        <p class="cost-total"><strong>Total Cost:</strong> $${data.cost_breakdown.total}</p>
                    </div>
                `;
                
                if (data.package) {
                    resultHTML += `
                        <div class="success-message">
                            Package saved with tracking #: ${data.package.tracking_number}
                        </div>
                    `;
                }
                
                costResult.innerHTML = resultHTML;
            } catch (error) {
                console.error('Error:', error);
                costResult.innerHTML = `
                    <div class="error-message">
                        Error: ${error.message}
                    </div>
                `;
            }
        }

        // Initialize the page
        document.addEventListener('DOMContentLoaded', () => {
            showSection(activeSection);
        });