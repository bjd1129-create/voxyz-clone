// Test script to verify heartbeat API functionality
// This will be run after deployment to verify the infrastructure

const testHeartbeat = async () => {
  console.log('Testing heartbeat API...');
  
  try {
    const response = await fetch('/api/heartbeat');
    
    if (response.ok) {
      const data = await response.json();
      console.log('✓ Heartbeat API is responding');
      console.log('Response:', JSON.stringify(data, null, 2));
      
      // Verify expected response structure
      const expectedFields = ['timestamp', 'status', 'triggers', 'reactions', 'stale', 'learning'];
      const missingFields = expectedFields.filter(field => !(field in data));
      
      if (missingFields.length === 0) {
        console.log('✓ Heartbeat API has correct response structure');
        return true;
      } else {
        console.log('⚠ Heartbeat API missing fields:', missingFields);
        return false;
      }
    } else {
      console.log('✗ Heartbeat API returned error:', response.status);
      return false;
    }
  } catch (error) {
    console.log('✗ Error testing heartbeat API:', error.message);
    return false;
  }
};

// For server-side testing
if (typeof window === 'undefined') {
  testHeartbeat().then(success => {
    if (success) {
      console.log('\n✓ Infrastructure verification: PASSED');
      process.exit(0);
    } else {
      console.log('\n✗ Infrastructure verification: FAILED');
      process.exit(1);
    }
  });
}

export default testHeartbeat;