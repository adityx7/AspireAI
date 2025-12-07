const axios = require('axios');

async function testVideoCall() {
    try {
        console.log('🧪 Testing video call API...');
        
        const response = await axios.post('http://localhost:5002/api/video-calls/initiate', {
            initiatorId: 'test123',
            initiatorType: 'student',
            initiatorName: 'Test Student',
            receiverId: 'BNMG001',
            receiverType: 'mentor',
            receiverName: 'Bhavya'
        });
        
        console.log('✅ Success:', response.data);
    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
}

testVideoCall();
