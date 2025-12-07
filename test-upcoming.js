const axios = require('axios');

async function testUpcomingCalls() {
    try {
        console.log('🧪 Testing upcoming calls API...');
        
        // First, get the student's USN from localStorage (simulate)
        const userId = 'test123'; // Replace with actual student USN
        
        const response = await axios.get(`http://localhost:5002/api/video-calls/upcoming/${userId}`);
        
        console.log('✅ Response:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
}

testUpcomingCalls();
