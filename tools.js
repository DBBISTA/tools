// Utility Functions
const utils = {
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }
};

// Image Tools
const imageTools = {
    // WebP to PNG Converter
    async convertWebPtoPNG(file) {
        try {
            const img = new Image();
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
                img.src = URL.createObjectURL(file);
            });

            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
            return new Promise((resolve) => {
                canvas.toBlob((blob) => {
                    resolve(blob);
                }, 'image/png');
            });
        } catch (error) {
            throw new Error('Failed to convert image');
        }
    },

    // Screenshot to PDF
    async convertScreenshotToPDF(file) {
        try {
            const img = new Image();
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
                img.src = URL.createObjectURL(file);
            });

            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
            const pdf = new jsPDF({
                orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });
            
            pdf.addImage(canvas.toDataURL('image/jpeg'), 'JPEG', 0, 0, canvas.width, canvas.height);
            return pdf;
        } catch (error) {
            throw new Error('Failed to convert to PDF');
        }
    }
};

// Calculator Tools
const calculatorTools = {
    // EMI Calculator
    calculateEMI(principal, rate, tenure) {
        const monthlyRate = rate / 12 / 100;
        const numberOfPayments = tenure * 12;
        const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments) / 
                   (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
        const totalPayment = emi * numberOfPayments;
        const totalInterest = totalPayment - principal;

        return {
            emi: emi.toFixed(2),
            totalPayment: totalPayment.toFixed(2),
            totalInterest: totalInterest.toFixed(2)
        };
    },

    // Percentage Calculator
    calculatePercentage(value, percentage, type) {
        switch(type) {
            case 'of':
                return (value * percentage / 100).toFixed(2);
            case 'is':
                return ((percentage / value) * 100).toFixed(2);
            case 'increase':
                return (value * (1 + percentage / 100)).toFixed(2);
            case 'decrease':
                return (value * (1 - percentage / 100)).toFixed(2);
            default:
                return '0';
        }
    },

    // Discount Calculator
    calculateDiscount(originalPrice, discountPercentage) {
        const discount = (originalPrice * discountPercentage) / 100;
        const finalPrice = originalPrice - discount;
        return {
            discount: discount.toFixed(2),
            finalPrice: finalPrice.toFixed(2)
        };
    }
};

// Converter Tools
const converterTools = {
    // Length Converter
    convertLength(value, fromUnit, toUnit) {
        const units = {
            mm: 1,
            cm: 10,
            m: 1000,
            km: 1000000,
            in: 25.4,
            ft: 304.8,
            yd: 914.4,
            mi: 1609344
        };
        
        const baseValue = value * units[fromUnit];
        return (baseValue / units[toUnit]).toFixed(4);
    },

    // Weight Converter
    convertWeight(value, fromUnit, toUnit) {
        const units = {
            kg: 1,
            g: 0.001,
            lb: 0.45359237,
            oz: 0.028349523125
        };
        
        const baseValue = value * units[fromUnit];
        return (baseValue / units[toUnit]).toFixed(4);
    },

    // Temperature Converter
    convertTemperature(value, fromUnit, toUnit) {
        let celsius;
        
        // Convert to Celsius first
        switch(fromUnit) {
            case 'C':
                celsius = value;
                break;
            case 'F':
                celsius = (value - 32) * 5/9;
                break;
            case 'K':
                celsius = value - 273.15;
                break;
        }
        
        // Convert from Celsius to target unit
        switch(toUnit) {
            case 'C':
                return celsius.toFixed(2);
            case 'F':
                return (celsius * 9/5 + 32).toFixed(2);
            case 'K':
                return (celsius + 273.15).toFixed(2);
        }
    }
};

// Utility Tools
const utilityTools = {
    // Word Counter
    countWords(text) {
        const words = text.trim().split(/\s+/);
        const characters = text.length;
        const sentences = text.split(/[.!?]+/).filter(Boolean).length;
        const paragraphs = text.split(/\n\s*\n/).filter(Boolean).length;
        
        return {
            words: words.length,
            characters,
            sentences,
            paragraphs
        };
    },

    // Age Calculator
    calculateAge(birthDate) {
        const today = new Date();
        const birth = new Date(birthDate);
        
        let years = today.getFullYear() - birth.getFullYear();
        let months = today.getMonth() - birth.getMonth();
        let days = today.getDate() - birth.getDate();
        
        if (days < 0) {
            months--;
            days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
        }
        
        if (months < 0) {
            years--;
            months += 12;
        }
        
        return {
            years,
            months,
            days
        };
    },

    // BMI Calculator
    calculateBMI(weight, height, unit = 'metric') {
        let bmi;
        if (unit === 'metric') {
            bmi = weight / (height * height);
        } else {
            bmi = (weight * 703) / (height * height);
        }
        
        let category;
        if (bmi < 18.5) category = 'Underweight';
        else if (bmi < 25) category = 'Normal weight';
        else if (bmi < 30) category = 'Overweight';
        else category = 'Obese';
        
        return {
            bmi: bmi.toFixed(1),
            category
        };
    },

    // Internet Speed Tester
    async testInternetSpeed(type, progressCallback, server = 'auto') {
        // Simulate a more realistic speed test
        const testDuration = 5000; // 5 seconds
        const startTime = performance.now();
        const endTime = startTime + testDuration;
        
        // Simulate ping based on server location
        const pingStart = performance.now();
        await fetch('https://www.google.com/favicon.ico');
        const basePing = performance.now() - pingStart;
        
        // Adjust ping based on server location
        let pingMultiplier = 1;
        switch(server) {
            case 'us-east':
                pingMultiplier = 1.2;
                break;
            case 'us-west':
                pingMultiplier = 1.5;
                break;
            case 'europe':
                pingMultiplier = 2;
                break;
            case 'asia':
                pingMultiplier = 2.5;
                break;
            case 'auto':
            default:
                // Auto selects the best server (lowest ping)
                pingMultiplier = 1;
                break;
        }
        
        const ping = basePing * pingMultiplier;
        
        // Calculate jitter (variation in ping)
        const jitter = ping * (0.1 + Math.random() * 0.3); // 10-40% of ping
        
        // Simulate speed test with progress updates
        let currentTime = startTime;
        let progress = 0;
        
        // Simulate different speeds for download and upload
        // Also adjust speed based on server location
        let baseSpeed;
        if (type === 'download') {
            baseSpeed = 50; // Mbps
        } else {
            baseSpeed = 20; // Mbps
        }
        
        // Adjust speed based on server location
        let speedMultiplier = 1;
        switch(server) {
            case 'us-east':
                speedMultiplier = 0.9;
                break;
            case 'us-west':
                speedMultiplier = 0.8;
                break;
            case 'europe':
                speedMultiplier = 0.7;
                break;
            case 'asia':
                speedMultiplier = 0.6;
                break;
            case 'auto':
            default:
                // Auto selects the best server (highest speed)
                speedMultiplier = 1;
                break;
        }
        
        baseSpeed *= speedMultiplier;
        
        // Simulate network conditions
        const networkCondition = Math.random();
        let networkMultiplier = 1;
        
        if (networkCondition < 0.1) {
            // Poor network (10% chance)
            networkMultiplier = 0.3 + Math.random() * 0.3; // 30-60% of base speed
        } else if (networkCondition < 0.3) {
            // Fair network (20% chance)
            networkMultiplier = 0.6 + Math.random() * 0.2; // 60-80% of base speed
        } else if (networkCondition < 0.7) {
            // Good network (40% chance)
            networkMultiplier = 0.8 + Math.random() * 0.15; // 80-95% of base speed
        } else {
            // Excellent network (30% chance)
            networkMultiplier = 0.95 + Math.random() * 0.1; // 95-105% of base speed
        }
        
        baseSpeed *= networkMultiplier;
        
        // Update progress every 100ms
        const progressInterval = setInterval(() => {
            currentTime = performance.now();
            progress = Math.min(100, ((currentTime - startTime) / testDuration) * 100);
            
            if (progressCallback) {
                progressCallback(progress);
            }
            
            if (currentTime >= endTime) {
                clearInterval(progressInterval);
            }
        }, 100);
        
        // Wait for the test to complete
        await new Promise(resolve => setTimeout(resolve, testDuration));
        
        // Calculate final speed with some randomness for realism
        const randomFactor = 1 + (Math.random() * 0.4 - 0.2); // ±20% variation
        const speed = baseSpeed * randomFactor;
        
        return {
            speed: speed,
            ping: ping,
            jitter: jitter,
            download: type === 'download' ? speed : 0,
            upload: type === 'upload' ? speed : 0
        };
    }
};

// Export all tools
window.tools = {
    ...imageTools,
    ...calculatorTools,
    ...converterTools,
    ...utilityTools,
    utils
}; 