/**
 * CyberGuard - Password Security Checker
 * Using Have I Been Pwned API with k-anonymity
 */

// Calculate SHA-1 hash of a string
async function sha1(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    
    // Convert ArrayBuffer to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return hashHex.toUpperCase(); // Return uppercase for consistency with HIBP API
}

// Format message with variables - duplicated from lang.js to ensure availability
function formatMessage(template, data) {
    return template.replace(/\{(\w+)\}/g, (match, key) => {
        return data[key] !== undefined ? data[key] : match;
    });
}

// Check password against HIBP API
async function checkPassword(password) {
    // Make sure currentLang is accessible
    if (typeof currentLang === 'undefined') {
        currentLang = 'en'; // Fallback to English
    }
    
    if (!password) {
        return { 
            safe: true, 
            count: 0, 
            message: messages && messages[currentLang] ? messages[currentLang].pwdEmptyMessage : "Please enter a password to check."
        };
    }
    
    try {
        // Calculate SHA-1 hash of the password
        const hash = await sha1(password);
        
        // Extract the first 5 characters (prefix) and the rest (suffix)
        const prefix = hash.substring(0, 5);
        const suffix = hash.substring(5);
        
        // Call the HIBP API with just the prefix (k-anonymity)
        const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        // Get the response text (list of hash suffixes and counts)
        const data = await response.text();
        
        // Split into lines and check if our suffix is in the list
        // Handle both CRLF (\r\n) and LF (\n) line endings
        const lines = data.includes('\r\n') ? data.split('\r\n') : data.split('\n');
        let foundCount = 0;
        
        for (const line of lines) {
            if (!line.trim()) continue; // Skip empty lines
            
            const parts = line.split(':');
            if (parts.length !== 2) continue; // Skip malformed lines
            
            const [hashSuffix, count] = parts;
            
            if (hashSuffix.toUpperCase() === suffix) {
                foundCount = parseInt(count, 10);
                break;
            }
        }
        
        // Return the result
        if (foundCount > 0) {
            const msgTemplate = messages && messages[currentLang] ? 
                messages[currentLang].pwdCompromisedMessage : 
                "⚠️ This password has been found in {count} data breaches. It's STRONGLY recommended not to use it.";
            
            return { 
                safe: false, 
                count: foundCount,
                message: formatMessage(msgTemplate, { count: foundCount.toLocaleString() })
            };
        } else {
            return { 
                safe: true, 
                count: 0,
                message: messages && messages[currentLang] ? 
                    messages[currentLang].pwdSafeMessage : 
                    "✅ This password hasn't been found in known data breaches. Make sure it's also strong and unique."
            };
        }
        
    } catch (error) {
        console.error('Error checking password:', error);
        return { 
            error: true, 
            message: messages && messages[currentLang] ? 
                messages[currentLang].pwdErrorMessage : 
                "An error occurred while checking the password. Please try again later."
        };
    }
}

// Display the password check result
function displayPasswordResult(result) {
    const resultElement = document.getElementById('pwdResult');
    
    if (!resultElement) {
        console.error('Password result element not found');
        return;
    }
    
    console.log('Displaying password result:', result);
    
    // Set appropriate styles based on result
    if (result.error) {
        resultElement.className = 'mt-6 p-4 rounded-md bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
    } else if (result.safe) {
        resultElement.className = 'mt-6 p-4 rounded-md bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
    } else {
        resultElement.className = 'mt-6 p-4 rounded-md bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
    }
    
    // Set the message
    resultElement.innerHTML = result.message;
    
    // Show the result
    resultElement.classList.remove('hidden');
}

// Initialize the password checker when the page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing password checker');
    const checkButton = document.getElementById('checkPassword');
    const pwdInput = document.getElementById('pwdInput');
    
    if (checkButton && pwdInput) {
        console.log('Password checker elements found');
        
        checkButton.addEventListener('click', async function() {
            console.log('Check button clicked');
            
            // Show loading state
            checkButton.disabled = true;
            const checkingText = messages && messages[currentLang] && messages[currentLang].pwdCheckingButton ? 
                                messages[currentLang].pwdCheckingButton : "Checking...";
            
            checkButton.innerHTML = '<span class="inline-block animate-spin mr-2">↻</span>' + checkingText;
            
            // Check the password
            const result = await checkPassword(pwdInput.value);
            console.log('Password check result:', result);
            
            // Display the result
            displayPasswordResult(result);
            
            // Reset button state
            checkButton.disabled = false;
            const buttonText = messages && messages[currentLang] && messages[currentLang].pwdCheckButton ? 
                             messages[currentLang].pwdCheckButton : "Check Security";
            
            checkButton.innerHTML = buttonText;
        });
        
        // Also trigger on Enter key in password field
        pwdInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                console.log('Enter key pressed in password field');
                checkButton.click();
            }
        });
    } else {
        console.warn('Password checker elements not found');
    }
});
