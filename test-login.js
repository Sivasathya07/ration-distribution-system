const axios = require('axios');

// Test backend connection and login
async function testLogin() {
  try {
    console.log('Testing backend connection...');
    
    // Test 1: Health check
    const healthCheck = await axios.get('http://localhost:5000/api/health');
    console.log('✅ Backend is running:', healthCheck.data);
    
    // Test 2: Try login with seed credentials
    console.log('\nTesting login with admin credentials...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@ration.gov.in',
      password: 'admin123'
    });
    
    console.log('✅ Login successful!');
    console.log('Token:', loginResponse.data.token.substring(0, 20) + '...');
    console.log('User:', loginResponse.data.user);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received. Is the backend running?');
    }
  }
}

testLogin();
