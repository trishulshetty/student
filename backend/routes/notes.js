import express from "express";
import { summarizeText, pushToNotion } from "../services/summarizer.js";
const router = express.Router();

router.post("/summarize", async (req, res) => {
  try {
    const { text } = req.body;

    // Validate input
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "No text provided" });
    }

    if (text.length < 50) {
      return res.status(400).json({ error: "Text too short for summarization (minimum 50 characters)" });
    }

    console.log("Received text for summarization:", text.substring(0, 100) + "...");

    // Summarize with HuggingFace
    const summary = await summarizeText(text);
    console.log("Generated summary:", summary);

    // Save to Notion (optional - comment out if having issues)
    try {
      await pushToNotion(summary);
      console.log("Successfully saved to Notion");
    } catch (notionError) {
      console.log("Notion save failed (continuing anyway):", notionError.message);
      // Don't throw error - continue without Notion
    }

    res.json({ summary, original_length: text.length, summary_length: summary.length });
  } catch (error) {
    console.error("Route Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
