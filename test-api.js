import axios from 'axios';

async function testAPI() {
  try {
    console.log('Testing API endpoint...');
    
    const testText = "Artificial intelligence is intelligence demonstrated by machines, in contrast to the natural intelligence displayed by humans and animals. Leading AI textbooks define the field as the study of intelligent agents: any device that perceives its environment and takes actions that maximize its chance of successfully achieving its goals. Colloquially, the term artificial intelligence is often used to describe machines that mimic cognitive functions that humans associate with the human mind, such as learning and problem solving.";
    
    const response = await axios.post('http://localhost:5000/api/notes/summarize', {
      text: testText
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ API Test Successful!');
    console.log('Response:', response.data);
    
  } catch (error) {
    console.log('❌ API Test Failed!');
    console.log('Error:', error.response?.data || error.message);
    console.log('Status:', error.response?.status);
  }
}

testAPI();
