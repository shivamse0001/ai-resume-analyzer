import io
import json
import os
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import pdfplumber
import httpx

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY", "")
@app.get("/")
def home():
    return {"message": "Resume Analyzer API is running!"}

@app.post("/analyze")
async def analyze_resume(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):
    try:
        content = await file.read()
        resume_text = ""
        with pdfplumber.open(io.BytesIO(content)) as pdf:
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    resume_text += text

        if not resume_text:
            return {"error": "Could not extract text from PDF"}

        prompt = f"""You are an expert resume analyzer.
Analyze this resume against the job description and return EXACTLY this JSON:
{{
    "match_score": <number 0 to 100>,
    "matched_keywords": ["keyword1", "keyword2"],
    "missing_keywords": ["keyword1", "keyword2"],
    "suggestions": ["suggestion1", "suggestion2", "suggestion3"],
    "summary": "2 line overall feedback"
}}
RESUME:
{resume_text}
JOB DESCRIPTION:
{job_description}
Return only JSON, nothing else."""

        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "nvidia/nemotron-nano-9b-v2:free",
                    "messages": [{"role": "user", "content": prompt}]
                },
                timeout=60.0
            )
            data = response.json()

        if "choices" not in data:
            return {"error": str(data)}

        result = data["choices"][0]["message"]["content"].strip()

        if "```" in result:
            result = result.split("```")[1]
            if result.startswith("json"):
                result = result[4:]

        return {"result": json.loads(result)}

    except Exception as e:
        return {"error": str(e)}