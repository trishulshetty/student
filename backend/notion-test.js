import { Client } from "@notionhq/client";
import dotenv from "dotenv";
dotenv.config();

async function testNotion() {
  const notion = new Client({ auth: process.env.NOTION_TOKEN });
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DB_ID,
    });
    console.log("✅ Notion connected, got rows:", response.results.length);
  } catch (err) {
    console.error("❌ Notion Error:", err.message);
  }
}
testNotion();
