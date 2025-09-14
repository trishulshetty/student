---

# AI Note-Maker & Study Planner

A MERN stack application that uses AI to create summaries of your notes and saves them directly to Notion. It relies only on free APIs and tools.

---

## Features

* **AI Summarization**: Uses Hugging Face’s BART model to generate short summaries from long text.
* **Notion Integration**: Automatically stores the summaries in your Notion database.
* **Simple React Interface**: A clean and user-friendly design built with Tailwind CSS.
* **MongoDB Storage**: Data is saved using a free MongoDB Atlas cluster.

---

## Project Structure

```
ai-note-agent/
│── backend/
│   ├── server.js          # Entry point
│   ├── routes/
│   │    └── notes.js      # Routes for summarize & push to Notion
│   ├── services/
│   │    └── summarizer.js # Hugging Face + Notion logic
│   └── .env               # Secrets (Mongo, HuggingFace, Notion tokens)
│
│── frontend/
│   ├── src/
│   │    ├── App.js        # React UI
│   │    └── index.js
│   └── package.json
```

---

## Setup Instructions

### Prerequisites

* MongoDB Atlas (free account)
* Hugging Face API token
* Notion integration and database

### Backend Setup

```bash
cd backend
cp .env.example .env
```

Update `.env` with:

```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
HF_API_TOKEN=your_huggingface_api_token
NOTION_TOKEN=your_notion_integration_token
NOTION_DB_ID=your_notion_database_id
```

Start the server:

```bash
npm start
```

### Frontend Setup

```bash
cd frontend
npm start
```

Runs locally at:

* Frontend → [http://localhost:3000](http://localhost:3000)
* Backend → [http://localhost:5000](http://localhost:5000)

---

## API Endpoint

* `POST /api/notes/summarize` → Summarizes text and saves it to Notion.

---

## How to Use

1. Open the app in your browser.
2. Paste notes or text into the textarea.
3. Click **Summarize & Save**.
4. The AI generates a summary and stores it in Notion.

---

## Free Tools Used

* Hugging Face Inference API (summarization)
* Notion API (storage)
* MongoDB Atlas (database)

---

## Notes

* Notion integration must have access to your database.
* The first Hugging Face request may take a few seconds.
* MongoDB Atlas must allow your IP to connect.
