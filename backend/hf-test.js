import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

async function testHF() {
  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/gpt2",
      { inputs: "Hello AI from Hugging Face!" },
      { headers: { Authorization: `Bearer ${process.env.HF_API_TOKEN}` } }
    );
    console.log("✅ Hugging Face response:", response.data[0].generated_text);
  } catch (err) {
    console.error("❌ HF Error:", err.response?.data || err.message);
  }
}
testHF();
