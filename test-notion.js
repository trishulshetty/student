import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config({ path: './backend/.env' });

async function testNotionAccess() {
  try {
    console.log('Testing Notion integration...');
    console.log('Integration: ai-note-agent');
    console.log('Database ID:', process.env.NOTION_DB_ID);
    console.log('Token (first 10 chars):', process.env.NOTION_TOKEN?.substring(0, 10) + '...');
    
    // Test 1: Get database info
    console.log('\n1. Testing database access...');
    const dbResponse = await axios.get(`https://api.notion.com/v1/databases/${process.env.NOTION_DB_ID}`, {
      headers: {
        Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
        "Notion-Version": "2022-06-28"
      }
    });
    
    console.log('✅ Database access successful!');
    console.log('Database title:', dbResponse.data.title[0]?.plain_text || 'Untitled');
    console.log('Properties:', Object.keys(dbResponse.data.properties));
    
    // Test 2: Create a test page
    console.log('\n2. Testing page creation...');
    const titleProperty = Object.entries(dbResponse.data.properties).find(([, prop]) => prop.type === 'title');
    const titlePropertyName = titleProperty ? titleProperty[0] : 'Name';
    
    const pageResponse = await axios.post("https://api.notion.com/v1/pages", {
      parent: { database_id: process.env.NOTION_DB_ID },
      properties: {
        [titlePropertyName]: { 
          title: [{ text: { content: "Test from AI Note Agent" } }] 
        }
      },
      children: [
        {
          object: "block",
          type: "paragraph",
          paragraph: { rich_text: [{ text: { content: "This is a test entry created by your AI Note Agent. Integration is working!" } }] }
        }
      ]
    }, {
      headers: {
        Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28"
      }
    });
    
    console.log('✅ Page creation successful!');
    console.log('Page URL:', pageResponse.data.url);
    console.log('\n🎉 Notion integration is fully working!');
    
  } catch (error) {
    console.log('❌ Notion test failed!');
    console.log('Error:', error.response?.data || error.message);
    
    if (error.response?.status === 404) {
      console.log('\n💡 Solution: Make sure to share your database with the "ai-note-agent" integration');
      console.log('1. Go to: https://www.notion.so/42599711d1504630bb7ff1e8a096d5f7');
      console.log('2. Click "Share" → "Invite"');
      console.log('3. Type "ai-note-agent" and select it');
      console.log('4. Give it "Edit" permissions');
    }
  }
}

testNotionAccess();
