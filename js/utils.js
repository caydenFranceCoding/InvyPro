/**
 * utils.js
 * Utility functions for the inventory management application.
 */

const InventoryUtils = (() => {
    /**
     * Format a number as currency
     * @param {Number} value - The value to format
     * @param {String} currencySymbol - The currency symbol to use (default: $)
     * @returns {String} Formatted currency string
     */
    const formatCurrency = (value, currencySymbol = '$') => {
        return `${currencySymbol}${parseFloat(value).toFixed(2)}`;
    };

    /**
     * Format a date as YYYY-MM-DD
     * @param {Date} date - The date to format
     * @returns {String} Formatted date string
     */
    const formatDate = (date) => {
        if (!(date instanceof Date)) {
            date = new Date(date);
        }

        return date.toISOString().slice(0, 10);
    };

    /**
     * Get the current date in YYYY-MM-DD format
     * @returns {String} Current date
     */
    const getCurrentDate = () => {
        return formatDate(new Date());
    };

    /**
     * Validate that a string is not empty
     * @param {String} value - The string to validate
     * @returns {Boolean} Whether the string is valid
     */
    const isValidString = (value) => {
        return typeof value === 'string' && value.trim().length > 0;
    };

    /**
     * Validate that a number is positive
     * @param {Number} value - The number to validate
     * @returns {Boolean} Whether the number is valid
     */
    const isValidNumber = (value) => {
        const num = parseFloat(value);
        return !isNaN(num) && num >= 0;
    };

    /**
     * Download data as a file
     * @param {String} content - The content to download
     * @param {String} fileName - The file name
     * @param {String} mimeType - The MIME type
     */
    const downloadFile = (content, fileName, mimeType = 'text/plain') => {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();

        // Clean up
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
    };

    /**
     * Check if local storage is available
     * @returns {Boolean} Whether local storage is available
     */
    const isLocalStorageAvailable = () => {
        try {
            const testKey = '__test__';
            localStorage.setItem(testKey, testKey);
            localStorage.removeItem(testKey);
            return true;
        } catch (e) {
            return false;
        }
    };

    /**
     * Debounce a function to prevent multiple rapid calls
     * @param {Function} func - The function to debounce
     * @param {Number} wait - The debounce wait time in milliseconds
     * @returns {Function} Debounced function
     */
    const debounce = (func, wait = 300) => {
        let timeout;

        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };

            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    /**
     * Generate a unique ID
     * @returns {String} Unique ID
     */
    const generateUniqueId = () => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    };

    /**
     * Deep clone an object (for objects without circular references)
     * @param {Object} obj - The object to clone
     * @returns {Object} A deep copy of the object
     */
    const deepClone = (obj) => {
        return JSON.parse(JSON.stringify(obj));
    };

    /**
     * Calculate percentage change between two numbers
     * @param {Number} oldValue - The original value
     * @param {Number} newValue - The new value
     * @returns {Number} Percentage change
     */
    const calculatePercentageChange = (oldValue, newValue) => {
        if (oldValue === 0) return newValue === 0 ? 0 : 100;
        return ((newValue - oldValue) / Math.abs(oldValue)) * 100;
    };

    /**
     * Format a number with thousand separators
     * @param {Number} number - The number to format
     * @returns {String} Formatted number
     */
    const formatNumber = (number) => {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    /**
     * Check if the device is a mobile device
     * @returns {Boolean} Whether the device is mobile
     */
    const isMobileDevice = () => {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };

    /**
     * Validate an email address
     * @param {String} email - The email to validate
     * @returns {Boolean} Whether the email is valid
     */
    const isValidEmail = (email) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    /**
     * Truncate a string to a specified length
     * @param {String} str - The string to truncate
     * @param {Number} length - The maximum length
     * @param {String} ending - The ending to append (default: '...')
     * @returns {String} Truncated string
     */
    const truncateString = (str, length, ending = '...') => {
        if (str.length > length) {
            return str.substring(0, length - ending.length) + ending;
        }
        return str;
    };

    /**
     * Format a file size for display
     * @param {Number} bytes - The file size in bytes
     * @param {Number} decimals - Number of decimals to show (default: 2)
     * @returns {String} Formatted file size
     */
    const formatFileSize = (bytes, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    /**
     * Get the time elapsed since a given date
     * @param {Date|String} date - The date to calculate from
     * @returns {String} Elapsed time text
     */
    const timeAgo = (date) => {
        if (!(date instanceof Date)) {
            date = new Date(date);
        }

        const seconds = Math.floor((new Date() - date) / 1000);

        let interval = Math.floor(seconds / 31536000);
        if (interval > 1) return interval + ' years ago';
        if (interval === 1) return '1 year ago';

        interval = Math.floor(seconds / 2592000);
        if (interval > 1) return interval + ' months ago';
        if (interval === 1) return '1 month ago';

        interval = Math.floor(seconds / 86400);
        if (interval > 1) return interval + ' days ago';
        if (interval === 1) return '1 day ago';

        interval = Math.floor(seconds / 3600);
        if (interval > 1) return interval + ' hours ago';
        if (interval === 1) return '1 hour ago';

        interval = Math.floor(seconds / 60);
        if (interval > 1) return interval + ' minutes ago';
        if (interval === 1) return '1 minute ago';

        if (seconds < 10) return 'just now';

        return Math.floor(seconds) + ' seconds ago';
    };

    /**
     * Get a random item from an array
     * @param {Array} array - The array to pick from
     * @returns {*} Random array item
     */
    const getRandomArrayItem = (array) => {
        return array[Math.floor(Math.random() * array.length)];
    };

    /**
     * Shuffle an array (Fisher-Yates algorithm)
     * @param {Array} array - The array to shuffle
     * @returns {Array} Shuffled array
     */
    const shuffleArray = (array) => {
        const result = [...array];

        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }

        return result;
    };

    // Toast notification system
    const ToastSystem = (() => {
        let container;
        const defaultDuration = 3000; // 3 seconds

        // Initialize the toast container
        const init = () => {
            // Create container if it doesn't exist
            if (!container) {
                container = document.createElement('div');
                container.className = 'toast-container';
                document.body.appendChild(container);
            }
        };

        // Create a toast notification
        const createToast = (options) => {
            const { type = 'info', title, message, duration = defaultDuration } = options;

            // Initialize if needed
            init();

            // Create toast element
            const toast = document.createElement('div');
            toast.className = `toast toast-${type}`;

            // Set icon based on type
            let iconClass = '';
            switch (type) {
                case 'success':
                    iconClass = 'fas fa-check-circle';
                    break;
                case 'error':
                    iconClass = 'fas fa-exclamation-circle';
                    break;
                case 'warning':
                    iconClass = 'fas fa-exclamation-triangle';
                    break;
                case 'info':
                default:
                    iconClass = 'fas fa-info-circle';
                    break;
            }

            // Construct toast HTML
            toast.innerHTML = `
                <div class="toast-icon">
                    <i class="${iconClass}"></i>
                </div>
                <div class="toast-content">
                    ${title ? `<div class="toast-title">${title}</div>` : ''}
                    ${message ? `<div class="toast-message">${message}</div>` : ''}
                </div>
                <button class="toast-close">
                    <i class="fas fa-times"></i>
                </button>
            `;

            // Add to container
            container.appendChild(toast);

            // Add event listener to close button
            const closeBtn = toast.querySelector('.toast-close');
            closeBtn.addEventListener('click', () => {
                removeToast(toast);
            });

            // Show toast
            setTimeout(() => {
                toast.classList.add('show');
            }, 10);

            // Auto remove after duration
            if (duration > 0) {
                setTimeout(() => {
                    removeToast(toast);
                }, duration);
            }

            return toast;
        };

        // Remove a toast notification
        const removeToast = (toast) => {
            toast.classList.remove('show');
            toast.classList.add('hide');

            // Remove from DOM after animation
            setTimeout(() => {
                if (toast.parentNode === container) {
                    container.removeChild(toast);
                }
            }, 300);
        };

        // Public methods
        return {
            init,

            // Show an info toast
            info(message, title = 'Information', duration = defaultDuration) {
                return createToast({
                    type: 'info',
                    title,
                    message,
                    duration
                });
            },

            // Show a success toast
            success(message, title = 'Success', duration = defaultDuration) {
                return createToast({
                    type: 'success',
                    title,
                    message,
                    duration
                });
            },

            // Show a warning toast
            warning(message, title = 'Warning', duration = defaultDuration) {
                return createToast({
                    type: 'warning',
                    title,
                    message,
                    duration
                });
            },

            // Show an error toast
            error(message, title = 'Error', duration = defaultDuration) {
                return createToast({
                    type: 'error',
                    title,
                    message,
                    duration
                });
            }
        };
    })();

    // Dark Mode Management System
    const DarkModeManager = (() => {
        // Check if dark mode is preferred or previously set
        const isDarkPreferred = () => {
            // Check local storage first
            const storedPreference = localStorage.getItem('darkMode');
            if (storedPreference !== null) {
                return storedPreference === 'true';
            }

            // Otherwise check system preference
            return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        };

        // Toggle dark mode
        const toggleDarkMode = () => {
            const isDark = document.documentElement.classList.toggle('dark-mode');
            localStorage.setItem('darkMode', isDark.toString());
            updateToggleButton(isDark);

            // Update any charts if they exist
            updateChartsForDarkMode(isDark);

            return isDark;
        };

        // Set dark mode state
        const setDarkMode = (isDark) => {
            if (isDark) {
                document.documentElement.classList.add('dark-mode');
            } else {
                document.documentElement.classList.remove('dark-mode');
            }
            localStorage.setItem('darkMode', isDark.toString());
            updateToggleButton(isDark);

            // Update any charts if they exist
            updateChartsForDarkMode(isDark);
        };

        // Create toggle button
        const createToggleButton = () => {
            const button = document.createElement('button');
            button.className = 'dark-mode-toggle';
            button.id = 'dark-mode-toggle';
            button.setAttribute('aria-label', 'Toggle Dark Mode');
            button.innerHTML = isDarkPreferred() ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';

            button.addEventListener('click', () => {
                const isDark = toggleDarkMode();

                // Show toast notification
                if (ToastSystem) {
                    ToastSystem.info(
                        `Dark mode ${isDark ? 'enabled' : 'disabled'}`,
                        'Appearance',
                        2000
                    );
                }
            });

            document.body.appendChild(button);
            return button;
        };

        // Update toggle button icon
        const updateToggleButton = (isDark) => {
            const button = document.getElementById('dark-mode-toggle');
            if (button) {
                button.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            }
        };

        // Listen for system preference changes
        const listenForPreferenceChanges = () => {
            if (window.matchMedia) {
                window.matchMedia('(prefers-color-scheme: dark)')
                    .addEventListener('change', (e) => {
                        // Only update if user hasn't set a preference
                        if (localStorage.getItem('darkMode') === null) {
                            setDarkMode(e.matches);
                        }
                    });
            }
        };

        // Update charts for dark mode
        const updateChartsForDarkMode = (isDark) => {
            // Check if Chart.js is available
            if (typeof Chart === 'undefined') return;

            // Update global chart defaults
            Chart.defaults.color = isDark ? '#e2e8f0' : '#475569';
            Chart.defaults.borderColor = isDark ? '#475569' : '#e2e8f0';

            // Update any existing charts
            const charts = [
                window.categoryChart,
                window.valueChart,
                window.lowStockChart
            ];

            charts.forEach(chart => {
                if (chart) {
                    chart.update();
                }
            });
        };

        // Initialize dark mode
        const init = () => {
            // Apply dark mode if preferred
            const isDark = isDarkPreferred();
            setDarkMode(isDark);

            // Create toggle button
            createToggleButton();

            // Listen for system preference changes
            listenForPreferenceChanges();
        };

        // Public methods
        return {
            init,
            toggleDarkMode,
            setDarkMode,
            isDarkPreferred
        };
    })();

    // CSV Utilities
    const CSVUtils = (() => {
        // Convert array of objects to CSV string
        const objectsToCSV = (data) => {
            if (!data || !data.length) return '';

            const headers = Object.keys(data[0]);
            const headerRow = headers.join(',');

            const rows = data.map(item => {
                return headers.map(header => {
                    // Handle values with commas by wrapping in quotes
                    let value = item[header];
                    if (value === null || value === undefined) value = '';

                    // Convert to string and escape quotes
                    value = String(value).replace(/"/g, '""');

                    // Wrap in quotes if contains comma, newline or quotes
                    if (value.includes(',') || value.includes('\n') || value.includes('"')) {
                        value = `"${value}"`;
                    }

                    return value;
                }).join(',');
            });

            return [headerRow, ...rows].join('\n');
        };

        // Parse CSV string to array of objects
        const CSVToObjects = (csv) => {
            if (!csv) return [];

            const lines = csv.split('\n');
            const headers = lines[0].split(',').map(header => header.trim());

            const result = [];

            for (let i = 1; i < lines.length; i++) {
                if (!lines[i].trim()) continue;

                const values = parseCSVLine(lines[i]);

                if (values.length !== headers.length) {
                    console.warn(`Line ${i} has ${values.length} values, but headers has ${headers.length} values.`);
                    continue;
                }

                const obj = {};
                headers.forEach((header, index) => {
                    obj[header] = values[index];
                });

                result.push(obj);
            }

            return result;
        };

        // Parse a single CSV line, handling quoted values
        const parseCSVLine = (line) => {
            const result = [];
            let current = '';
            let inQuotes = false;

            for (let i = 0; i < line.length; i++) {
                const char = line[i];

                if (char === '"') {
                    // Check if this is an escaped quote
                    if (i + 1 < line.length && line[i + 1] === '"') {
                        current += '"';
                        i++; // Skip the next quote
                    } else {
                        inQuotes = !inQuotes;
                    }
                } else if (char === ',' && !inQuotes) {
                    result.push(current);
                    current = '';
                } else {
                    current += char;
                }
            }

            // Add the last value
            result.push(current);

            return result;
        };

        return {
            objectsToCSV,
            CSVToObjects,
            parseCSVLine
        };
    })();

    // Public methods
    return {
        formatCurrency,
        formatDate,
        getCurrentDate,
        isValidString,
        isValidNumber,
        downloadFile,
        isLocalStorageAvailable,
        debounce,
        generateUniqueId,
        deepClone,
        calculatePercentageChange,
        formatNumber,
        isMobileDevice,
        isValidEmail,
        truncateString,
        formatFileSize,
        timeAgo,
        getRandomArrayItem,
        shuffleArray,
        Toast: ToastSystem,
        DarkMode: DarkModeManager,
        CSV: CSVUtils
    };
})();

// Initialize toast system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    InventoryUtils.Toast.init();
    InventoryUtils.DarkMode.init();
});