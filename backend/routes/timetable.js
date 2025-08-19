import express from "express";
import { generateTimetable, pushTimetableToNotion } from "../services/timetableGenerator.js";

const router = express.Router();

router.post("/generate", async (req, res) => {
  try {
    const { subjects, timeSlots, preferences, studentName } = req.body;
    
    // Validate input
    if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
      return res.status(400).json({ error: "Please provide subjects array" });
    }
    
    if (!timeSlots || !Array.isArray(timeSlots) || timeSlots.length === 0) {
      return res.status(400).json({ error: "Please provide time slots array" });
    }
    
    console.log("Generating timetable for:", studentName || "Student");
    console.log("Subjects:", subjects);
    console.log("Time slots:", timeSlots);
    
    // Generate timetable
    const timetable = generateTimetable(subjects, timeSlots, preferences);
    console.log("Generated timetable:", timetable);
    
    // Save to Notion
    try {
      await pushTimetableToNotion(timetable, studentName || "Student");
      console.log("Successfully saved timetable to Notion");
    } catch (notionError) {
      console.log("Notion save failed (continuing anyway):", notionError.message);
      // Don't throw error - continue without Notion
    }
    
    res.json({ 
      timetable, 
      studentName: studentName || "Student",
      totalSubjects: subjects.length,
      totalSlots: timeSlots.length 
    });
  } catch (error) {
    console.error("Timetable Route Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
