// Function to validate the International Phone Numbers
function isValidPhoneNumber(phoneNumber) {
    // Regex to check valid phone number.
    const pattern = /^[+]{1}(?:[0-9\-\\(\\)\\/.]\s?){6,15}[0-9]{1}$/;

    // If the phone number is empty return false
    if (!phoneNumber) {
        return "false";
    }

    // Return true if the phone number
    // matched the Regex
    if (pattern.test(phoneNumber)) {
        return "true";
    } else {
        return "false";
    }
}

// Driver Code
// Test Case 1:
const str1 = "+919136812895";
console.log(isValidPhoneNumber(str1));

// Test Case 2:
const str2 = "+91 9136812895";
console.log(isValidPhoneNumber(str2));

// Test Case 3:
const str3 = "+123 123456";
console.log(isValidPhoneNumber(str3));

// Test Case 4:
const str4 = "+8801724825061";
console.log(isValidPhoneNumber(str4));
console.log(isValidPhoneNumber('+97147654321'));

