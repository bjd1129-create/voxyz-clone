#!/usr/bin/env node

// 测试 heartbeat API 脚本
const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

async function testHeartbeatAPI() {
  console.log('🧪 Testing Heartbeat API...\n');
  
  try {
    // 检查本地开发服务器是否运行
    console.log('🔍 Checking if development server is running...');
    
    // 尝试调用 heartbeat API
    const response = await fetch('http://localhost:3000/api/heartbeat');
    const data = await response.json();
    
    console.log('✅ Heartbeat API Response:');
    console.log(JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('\n🎉 Heartbeat API is working correctly!');
      console.log(`📊 Status: ${data.status}`);
      console.log(`⏰ Timestamp: ${data.timestamp}`);
      
      // 检查各个组件的状态
      console.log('\n📋 Component Status:');
      console.log(`   Triggers: ${data.triggers.success ? '✅' : '❌'} (${data.triggers.processed}/${data.triggers.totalRules} processed)`);
      console.log(`   Reactions: ${data.reactions.success ? '✅' : '❌'} (${data.reactions.processed}/${data.reactions.totalQueued} processed)`);
      console.log(`   Stale Steps: ${data.stale.success ? '✅' : '❌'} (${data.stale.recovered}/${data.stale.totalStale} recovered)`);
      console.log(`   Learning: ${data.learning.success ? '✅' : '❌'} (${data.learning.promoted} promoted)`);
    } else {
      console.log(`\n❌ Heartbeat API returned error: ${response.status} ${response.statusText}`);
      console.log('Error details:', data);
    }
  } catch (error) {
    console.log('❌ Could not reach heartbeat API at http://localhost:3000/api/heartbeat');
    console.log('💡 This is expected if the dev server is not running.');
    console.log('\nTo test properly, please:\n');
    console.log('1. Start the development server:');
    console.log('   cd /Users/bjd/openclaw/company/website');
    console.log('   npm run dev\n');
    console.log('2. Then run this test again, or manually visit:');
    console.log('   http://localhost:3000/api/heartbeat\n');
  }
}

// 如果直接运行此脚本，则执行测试
if (require.main === module) {
  testHeartbeatAPI().catch(console.error);
}

module.exports = { testHeartbeatAPI };