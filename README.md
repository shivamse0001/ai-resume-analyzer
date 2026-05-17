# 🤖 AI Resume Analyzer

An AI-powered web application that analyzes your resume against a job description and provides a match score, keyword analysis, and improvement suggestions.

🌐 **Live Demo:** [ai-resume-analyzer-iota-lemon.vercel.app](https://ai-resume-analyzer-iota-lemon.vercel.app)

## ✨ Features
- 📄 Upload resume as PDF
- 📊 Get a match score out of 100
- ✅ See matched keywords in green
- ❌ See missing keywords in red
- 💡 Get 3 AI-powered improvement suggestions

## 🛠️ Tech Stack
- **Frontend:** React, Vite, Axios (Vercel)
- **Backend:** Python, FastAPI, pdfplumber (Render)
- **AI:** OpenRouter API, nvidia/nemotron model

## 🚀 Run Locally

### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 👨‍💻 Author
**Shivam Kumar**
- GitHub: [@shivamse0001](https://github.com/shivamse0001)
- Live: [ai-resume-analyzer-iota-lemon.vercel.app](https://ai-resume-analyzer-iota-lemon.vercel.app)
