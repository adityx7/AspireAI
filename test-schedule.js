const axios = require('axios');

async function testScheduleCall() {
    try {
        console.log('🧪 Testing schedule call...');
        
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 15); // 15 days from now
        
        const response = await axios.post('http://localhost:5002/api/video-calls/initiate', {
            initiatorId: '1CR22CS024',
            initiatorType: 'student',
            initiatorName: 'Test Student',
            receiverId: 'BNMG001',
            receiverType: 'mentor',
            receiverName: 'Bhavya',
            scheduledTime: futureDate.toISOString()
        });
        
        console.log('✅ Schedule response:', JSON.stringify(response.data, null, 2));
        
        // Now try to fetch upcoming calls
        setTimeout(async () => {
            const upcomingResponse = await axios.get('http://localhost:5002/api/video-calls/upcoming/1CR22CS024');
            console.log('\n📋 Upcoming calls:', JSON.stringify(upcomingResponse.data, null, 2));
        }, 1000);
        
    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
}

testScheduleCall();
