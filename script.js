// Search functionality
document.addEventListener('DOMContentLoaded', function() {
    // Load header and footer dynamically
    loadHeader();
    loadFooter();
    
    // Initialize search functionality
    initializeSearch();
    
    // Initialize tool cards
    initializeToolCards();

    const searchBar = document.getElementById('search-bar');
    const toolCards = document.querySelectorAll('.tool-card');

    if (searchBar) {
        searchBar.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();

            toolCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const description = card.querySelector('p').textContent.toLowerCase();

                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // Initialize Google Ads
    try {
        (adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
        console.error('Error initializing ads:', e);
    }
});

// Load header dynamically
function loadHeader() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        const header = document.getElementById('main-header');
        if (header) {
            headerPlaceholder.innerHTML = header.outerHTML;
        }
    }
}

// Load footer dynamically
function loadFooter() {
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        const footer = document.getElementById('main-footer');
        if (footer) {
            footerPlaceholder.innerHTML = footer.outerHTML;
        }
    }
}

// Initialize search functionality
function initializeSearch() {
    const searchBar = document.getElementById('search-bar');
    if (searchBar) {
        searchBar.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const toolCards = document.querySelectorAll('.tool-card');
            
            toolCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const description = card.querySelector('p').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
}

// Initialize tool cards
function initializeToolCards() {
    const toolCards = document.querySelectorAll('.tool-card');
    
    toolCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        });
    });
}

// Mobile menu toggle
function toggleMobileMenu() {
    const nav = document.querySelector('nav ul');
    nav.classList.toggle('show');
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Add loading state to buttons
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function() {
        if (!this.classList.contains('loading')) {
            this.classList.add('loading');
            setTimeout(() => {
                this.classList.remove('loading');
            }, 1000);
        }
    });
});

// Format numbers with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Format currency
function formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(amount);
}

// Validate numeric input
function validateNumericInput(input) {
    input.value = input.value.replace(/[^0-9.]/g, '');
    const parts = input.value.split('.');
    if (parts.length > 2) {
        input.value = parts[0] + '.' + parts.slice(1).join('');
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Common function to handle file uploads
function handleFileUpload(inputElement, previewElement, fileInfoElement, allowedTypes) {
    const file = inputElement.files[0];
    
    if (!file) {
        tools.utils.showNotification('Please select a file.', 'error');
        return false;
    }
    
    if (!allowedTypes.includes(file.type)) {
        tools.utils.showNotification(`Please select a valid file type: ${allowedTypes.join(', ')}`, 'error');
        return false;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        if (previewElement) {
            previewElement.src = e.target.result;
        }
        
        if (fileInfoElement) {
            const fileName = document.getElementById('file-name');
            const fileSize = document.getElementById('file-size');
            const fileType = document.getElementById('file-type');
            
            if (fileName) fileName.textContent = file.name;
            if (fileSize) fileSize.textContent = tools.utils.formatFileSize(file.size);
            if (fileType) fileType.textContent = file.type;
        }
    };
    reader.readAsDataURL(file);
    
    return true;
}

// Common function to handle form submissions
function handleFormSubmit(formElement, submitButton, loadingElement, processFunction) {
    formElement.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (submitButton) submitButton.disabled = true;
        if (loadingElement) loadingElement.classList.add('show');
        
        try {
            const result = await processFunction();
            tools.utils.showNotification('Operation completed successfully!', 'success');
            return result;
        } catch (error) {
            tools.utils.showNotification(error.message || 'An error occurred. Please try again.', 'error');
        } finally {
            if (submitButton) submitButton.disabled = false;
            if (loadingElement) loadingElement.classList.remove('show');
        }
    });
}

// Common function to handle unit conversions
function handleUnitConversion(inputElement, fromUnitElement, toUnitElement, resultElement, convertFunction) {
    const updateResult = () => {
        const value = parseFloat(inputElement.value);
        const fromUnit = fromUnitElement.value;
        const toUnit = toUnitElement.value;
        
        if (isNaN(value)) {
            resultElement.textContent = '0';
            return;
        }
        
        const result = convertFunction(value, fromUnit, toUnit);
        resultElement.textContent = result;
    };
    
    inputElement.addEventListener('input', updateResult);
    fromUnitElement.addEventListener('change', updateResult);
    toUnitElement.addEventListener('change', updateResult);
    
    // Initial calculation
    updateResult();
}

// Common function to handle calculator inputs
function handleCalculatorInput(inputs, resultElement, calculateFunction) {
    const updateResult = () => {
        const values = {};
        inputs.forEach(input => {
            values[input.name] = parseFloat(input.value) || 0;
        });
        
        const result = calculateFunction(values);
        resultElement.textContent = result;
    };
    
    inputs.forEach(input => {
        input.addEventListener('input', updateResult);
    });
    
    // Initial calculation
    updateResult();
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export utility functions
window.utils = {
    formatNumber,
    formatCurrency,
    validateNumericInput,
    showNotification,
    handleFileUpload,
    debounce
}; 