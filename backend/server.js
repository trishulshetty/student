import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import notesRoute from "./routes/notes.js";
import timetableRoute from "./routes/timetable.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI).then(() => console.log("MongoDB Connected"));

mongoose.connection.once('open', () => {
  console.log("✅ MongoDB Connected:", mongoose.connection.name);
});

app.use("/api/notes", notesRoute);
app.use("/api/timetable", timetableRoute);

app.listen(process.env.PORT, () => console.log("Server running on " + process.env.PORT));
