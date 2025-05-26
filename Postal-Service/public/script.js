 // Current active section
        let activeSection = 'add';
        
        // Show/hide sections
        function showSection(sectionId) {
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            document.getElementById(sectionId).classList.add('active');
            document.querySelector(`.tab-btn[onclick="showSection('${sectionId}')"]`).classList.add('active');
            activeSection = sectionId;
            
            // Special handling for certain sections
            if (sectionId === 'view') {
                loadPackages();
            }
        }

        // Helper functions for messages
        function showMessage(element, message, isError = false) {
            const icon = isError ? '<i class="fas fa-exclamation-circle"></i>' : '<i class="fas fa-check-circle"></i>';
            element.innerHTML = icon + ' ' + message;
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
                    <i class="fas fa-check-circle"></i> Package created! Tracking #: ${result.tracking_number}
                    <button class="btn btn-secondary" onclick="copyToClipboard('${result.tracking_number}')" style="margin-top: 10px;">
                        <i class="fas fa-copy"></i> Copy Tracking Number
                    </button>
                `;
                
                // Reset form
                document.getElementById('packageForm').reset();
                
                // Auto-show the packages list
                showSection('view');
                await loadPackages();

            } catch (error) {
                console.error('Error:', error);
                showMessage(formMessage, error.message, true);
            }
        });

        // Helper function
        function copyToClipboard(text) {
            navigator.clipboard.writeText(text)
                .then(() => alert('Tracking number copied to clipboard!'))
                .catch(err => console.error('Copy failed:', err));
        }

        // Load all packages with delete and update functionality
        async function loadPackages() {
            const packageList = document.getElementById('packageList');
            packageList.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 30px; color: var(--text-light);"><i class="fas fa-spinner fa-spin"></i> Loading your packages...</div>';
            
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
                    packageList.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 30px; color: var(--text-light);"><i class="fas fa-box-open"></i> No packages found. Create your first shipment!</div>';
                    return;
                }
                
                packageList.innerHTML = '';
                packages.forEach(pkg => {
                    let statusIcon = '';
                    let statusClass = '';
                    
                    switch(pkg.status) {
                        case 'created':
                            statusIcon = '<i class="fas fa-edit"></i>';
                            statusClass = 'status-created';
                            break;
                        case 'in-transit':
                            statusIcon = '<i class="fas fa-truck"></i>';
                            statusClass = 'status-in-transit';
                            break;
                        case 'delivered':
                            statusIcon = '<i class="fas fa-check-circle"></i>';
                            statusClass = 'status-delivered';
                            break;
                        case 'returned':
                            statusIcon = '<i class="fas fa-undo"></i>';
                            statusClass = 'status-returned';
                            break;
                        default:
                            statusIcon = '<i class="fas fa-question-circle"></i>';
                            statusClass = 'status-created';
                    }
                    
                    const packageCard = document.createElement('div');
                    packageCard.className = 'package-card';
                    packageCard.innerHTML = `
                        <div class="package-header">
                            <span class="tracking-number"><i class="fas fa-barcode"></i> ${pkg.tracking_number}</span>
                            <span class="package-status ${statusClass}">${statusIcon} ${pkg.status || 'Unknown'}</span>
                        </div>
                        <div class="package-details">
                            <p><i class="fas fa-user"></i> <strong>From:</strong> ${pkg.sender_name}</p>
                            <p><i class="fas fa-user"></i> <strong>To:</strong> ${pkg.receiver_name}</p>
                            <p><i class="fas fa-weight-hanging"></i> <strong>Weight:</strong> ${pkg.weight} kg</p>
                            <p><i class="fas fa-shipping-fast"></i> <strong>Method:</strong> ${pkg.shipping_method || 'Standard'}</p>
                        </div>
                        <div class="form-group">
                            <label>Update Status</label>
                            <select class="status-select" id="status-${pkg.tracking_number}">
                                <option value="created" ${pkg.status === 'created' ? 'selected' : ''}><i class="fas fa-edit"></i> Created</option>
                                <option value="in-transit" ${pkg.status === 'in-transit' ? 'selected' : ''}><i class="fas fa-truck"></i> In Transit</option>
                                <option value="delivered" ${pkg.status === 'delivered' ? 'selected' : ''}><i class="fas fa-check-circle"></i> Delivered</option>
                                <option value="returned" ${pkg.status === 'returned' ? 'selected' : ''}><i class="fas fa-undo"></i> Returned</option>
                            </select>
                        </div>
                        <div class="package-actions">
                            <button class="action-btn update-btn"
                                onclick="updatePackageStatus('${pkg.tracking_number}')">
                                <i class="fas fa-sync-alt"></i> Update Status
                            </button>
                            <button class="action-btn delete-btn"
                                onclick="deletePackage('${pkg.tracking_number}')">
                                <i class="fas fa-trash-alt"></i> Delete
                            </button>
                        </div>
                    `;
                    packageList.appendChild(packageCard);
                });
            } catch (error) {
                console.error('Error loading packages:', error);
                packageList.innerHTML = `
                    <div class="message error" style="grid-column: 1/-1;">
                        <i class="fas fa-exclamation-triangle"></i> Error loading packages: ${error.message}
                        <button class="btn" onclick="loadPackages()" style="margin-top: 15px;">
                            <i class="fas fa-redo"></i> Try Again
                        </button>
                    </div>
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
            if (!confirm('Are you sure you want to permanently delete this package?')) {
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
            labelContainer.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading label...';
            
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
                    <h3 style="margin-bottom: 15px; color: var(--lavender-primary);">
                        <i class="fas fa-tag"></i> Shipping Label - ${pkg.tracking_number}
                    </h3>
                    <pre>${label}</pre>
                    <button class="btn btn-secondary" onclick="window.print()" style="margin-top: 15px;">
                        <i class="fas fa-print"></i> Print Label
                    </button>
                `;
                labelContainer.style.display = 'block';
            } catch (error) {
                console.error('Error:', error);
                labelContainer.innerHTML = `
                    <div class="message error">
                        <i class="fas fa-exclamation-triangle"></i> Error: ${error.message}
                    </div>
                `;
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

            if (!method) {
                alert('Please select a shipping method');
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
                        <h3 style="margin-bottom: 15px; color: var(--lavender-primary);">
                            <i class="fas fa-receipt"></i> Shipping Cost Estimate
                        </h3>
                        <p><i class="fas fa-weight-hanging"></i> <strong>Base Cost:</strong> $${data.cost_breakdown.base_cost} (${weight}kg × $${data.base_rate}/kg)</p>
                        <p><i class="fas fa-shipping-fast"></i> <strong>Shipping Method:</strong> ${method.replace('-', ' ')} $${data.cost_breakdown.method_fee > 0 ? `(+$${data.cost_breakdown.method_fee})` : ''}</p>
                        <p class="cost-total"><i class="fas fa-dollar-sign"></i> <strong>Total Cost:</strong> $${data.cost_breakdown.total}</p>
                    </div>
                `;
                
                if (data.package) {
                    resultHTML += `
                        <div class="message success" style="margin-top: 15px;">
                            <i class="fas fa-check-circle"></i> Package saved with tracking #: ${data.package.tracking_number}
                        </div>
                    `;
                }
                
                costResult.innerHTML = resultHTML;
            } catch (error) {
                console.error('Error:', error);
                costResult.innerHTML = `
                    <div class="message error">
                        <i class="fas fa-exclamation-triangle"></i> Error: ${error.message}
                    </div>
                `;
            }
        }

        // Initialize the page
        document.addEventListener('DOMContentLoaded', () => {
            showSection(activeSection);
        });
    