// Debug Logout Functions - Run these in browser console

// Force logout function
window.forceLogout = function() {
    console.log('🚨 Force logout called from console');
    localStorage.removeItem('medlink_user');
    localStorage.removeItem('medlink_token');
    window.location.href = '/';
};

// Check auth status
window.checkAuthStatus = function() {
    console.log('🔍 Current auth status:');
    console.log('Local storage user:', localStorage.getItem('medlink_user'));
    console.log('Local storage token:', localStorage.getItem('medlink_token'));
    console.log('Current URL:', window.location.href);
};

// Test logout button click
window.testLogoutButton = function() {
    console.log('🔘 Testing logout button click...');
    const logoutButtons = document.querySelectorAll('button[onclick*="logout"], button:contains("Logout"), button:contains("Sign Out")');
    console.log('Found logout buttons:', logoutButtons.length);
    logoutButtons.forEach((btn, index) => {
        console.log(`Button ${index}:`, btn.textContent, btn.onclick);
    });
};

// Manual logout without backend
window.manualLogout = function() {
    console.log('🔧 Manual logout - clearing storage and redirecting...');
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/';
};

console.log('✅ Debug logout functions loaded!');
console.log('Available functions:');
console.log('- forceLogout() - Force logout and redirect');
console.log('- checkAuthStatus() - Check current auth state');
console.log('- testLogoutButton() - Test logout button functionality');
console.log('- manualLogout() - Complete manual logout');
