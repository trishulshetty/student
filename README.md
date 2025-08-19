# AI Note-Maker & Study Planner

A MERN stack application that uses AI to summarize notes and automatically saves them to Notion using free APIs.

## 🚀 Features

- **AI-Powered Summarization**: Uses Hugging Face's BART model for text summarization
- **Notion Integration**: Automatically saves summaries to your Notion database
- **Clean React UI**: Simple and intuitive interface with Tailwind CSS
- **MongoDB Storage**: Stores data using MongoDB Atlas (free tier)

## 📂 Project Structure

```
ai-note-agent/
│── backend/
│   ├── server.js        # Entry point
│   ├── routes/
│   │    └── notes.js    # Routes for summarize & push to Notion
│   ├── services/
│   │    └── summarizer.js  # Hugging Face + Notion logic
│   └── .env             # Secrets (Mongo, HuggingFace, Notion tokens)
│
│── frontend/
│   ├── src/
│   │    ├── App.js      # React UI
│   │    └── index.js
│   └── package.json
```

## 🛠️ Setup Instructions

### Prerequisites

1. **MongoDB Atlas Account**: Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. **Hugging Face Account**: Get a free API token from [Hugging Face](https://huggingface.co/settings/tokens)
3. **Notion Integration**: Create an integration and database at [Notion Developers](https://developers.notion.com/)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Copy the environment template and add your credentials:
   ```bash
   cp .env.example .env
   ```

   Then edit `.env` with your actual credentials:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_atlas_connection_string
   HF_API_TOKEN=your_huggingface_api_token
   NOTION_TOKEN=your_notion_integration_token
   NOTION_DB_ID=your_notion_database_id
   ```

3. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Start the React development server:
   ```bash
   npm start
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🔧 API Endpoints

- `POST /api/notes/summarize` - Summarizes text and saves to Notion

## 📝 Usage

1. Open the application in your browser
2. Paste your lecture notes or text in the textarea
3. Click "Summarize & Save to Notion"
4. The AI will generate a summary and automatically save it to your Notion database

## 🆓 Free APIs Used

- **Hugging Face Inference API**: Free tier for AI summarization
- **Notion API**: Free for personal use
- **MongoDB Atlas**: Free tier (512MB storage)

## 🚨 Important Notes

- Make sure your Notion integration has access to your database
- The Hugging Face model may take a few seconds to respond on first use
- Ensure your MongoDB Atlas cluster allows connections from your IP address
