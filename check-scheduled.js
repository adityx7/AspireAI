const mongoose = require('mongoose');

async function checkScheduledCalls() {
    try {
        await mongoose.connect('mongodb://localhost:27017/mentorship_platform');
        console.log('✅ Connected to MongoDB');
        
        const VideoCall = mongoose.model('VideoCall', new mongoose.Schema({}, { strict: false }));
        
        const calls = await VideoCall.find({ status: { $in: ['scheduled', 'waiting'] } })
            .sort({ createdAt: -1 })
            .limit(5);
        
        console.log(`\n📋 Found ${calls.length} scheduled/waiting calls:\n`);
        calls.forEach((call, index) => {
            console.log(`${index + 1}. Room: ${call.roomId}`);
            console.log(`   Initiator: ${call.initiator.name} (${call.initiator.userId})`);
            console.log(`   Receiver: ${call.receiver.name} (${call.receiver.userId})`);
            console.log(`   Status: ${call.status}`);
            console.log(`   Scheduled: ${call.scheduledTime || 'N/A'}`);
            console.log(`   Created: ${call.createdAt}\n`);
        });
        
        await mongoose.connection.close();
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

checkScheduledCalls();
