import axios from "axios";

export async function summarizeText(text) {
  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
      { inputs: text },
      { headers: { Authorization: `Bearer ${process.env.HF_API_TOKEN}` } }
    );

    console.log("HuggingFace Response:", response.data);

    // Handle different response formats
    if (response.data && Array.isArray(response.data) && response.data[0]) {
      if (response.data[0].summary_text) {
        return response.data[0].summary_text;
      } else if (response.data[0].generated_text) {
        return response.data[0].generated_text;
      }
    }

    // If response format is unexpected
    throw new Error("Unexpected response format from HuggingFace API");
  } catch (error) {
    console.error("HuggingFace API Error:", error.response?.data || error.message);
    throw new Error(`Summarization failed: ${error.response?.data?.error || error.message}`);
  }
}

export async function pushToNotion(text) {
  try {
    // First, let's get database info to understand its structure
    const dbResponse = await axios.get(`https://api.notion.com/v1/databases/${process.env.NOTION_DB_ID}`, {
      headers: {
        Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
        "Notion-Version": "2022-06-28"
      }
    });

    console.log("Database properties:", Object.keys(dbResponse.data.properties));

    // Find the title property (it might be named differently)
    const titleProperty = Object.entries(dbResponse.data.properties).find(([, prop]) => prop.type === 'title');
    const titlePropertyName = titleProperty ? titleProperty[0] : 'Name'; // fallback to 'Name'

    console.log("Using title property:", titlePropertyName);

    const response = await axios.post("https://api.notion.com/v1/pages",
      {
        parent: { database_id: process.env.NOTION_DB_ID },
        properties: {
          [titlePropertyName]: {
            title: [{ text: { content: `AI Summary - ${new Date().toLocaleDateString()}` } }]
          }
        },
        children: [
          {
            object: "block",
            type: "paragraph",
            paragraph: { rich_text: [{ text: { content: text } }] }
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
          "Content-Type": "application/json",
          "Notion-Version": "2022-06-28"
        }
      }
    );

    console.log("✅ Successfully saved to Notion!");
    return response.data;
  } catch (error) {
    console.error("Notion API Error:", error.response?.data || error.message);

    if (error.response?.status === 404) {
      throw new Error(`Database not found. Please check: 1) Database ID is correct, 2) Database is shared with your integration`);
    }

    throw new Error(`Failed to save to Notion: ${error.response?.data?.message || error.message}`);
  }
}
