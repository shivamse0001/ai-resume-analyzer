import { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!file || !jobDescription) {
      alert("Please upload a resume and enter a job description!");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("job_description", jobDescription);

    try {
      const response = await axios.post(
        "https://ai-resume-analyzer-w2nm.onrender.com/analyze",
        formData
      );
      setResult(response.data.result);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 70) return "#1D9E75";
    if (score >= 40) return "#BA7517";
    return "#E53935";
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f0f", color: "#fff", fontFamily: "sans-serif", padding: "2rem" }}>
      
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "700", margin: 0 }}>
          AI Resume Analyzer
        </h1>
        <p style={{ color: "#888", marginTop: "0.5rem" }}>
          Upload your resume and paste a job description to get AI-powered feedback
        </p>
      </div>

      {/* Main container */}
      <div style={{ maxWidth: "900px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        
        {/* Left panel - inputs */}
        <div style={{ background: "#1a1a1a", borderRadius: "12px", padding: "1.5rem" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: "600", marginTop: 0, marginBottom: "1rem", color: "#ccc" }}>
            Upload Resume
          </h2>
          
          <div
            style={{ border: "2px dashed #333", borderRadius: "8px", padding: "2rem", textAlign: "center", marginBottom: "1.5rem", cursor: "pointer" }}
            onClick={() => document.getElementById("fileInput").click()}
          >
            <div style={{ fontSize: "2rem" }}>📄</div>
            <p style={{ color: "#888", margin: "0.5rem 0 0" }}>
              {file ? file.name : "Click to upload PDF"}
            </p>
            <input
              id="fileInput"
              type="file"
              accept=".pdf"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>

          <h2 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "0.5rem", color: "#ccc" }}>
            Job Description
          </h2>
          <textarea
            style={{ width: "100%", height: "180px", background: "#111", border: "1px solid #333", borderRadius: "8px", color: "#fff", padding: "0.75rem", fontSize: "13px", resize: "none", boxSizing: "border-box" }}
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />

          <button
            onClick={handleAnalyze}
            disabled={loading}
            style={{ width: "100%", marginTop: "1rem", padding: "0.85rem", background: loading ? "#333" : "#378ADD", color: "#fff", border: "none", borderRadius: "8px", fontSize: "15px", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "Analyzing..." : "Analyze Resume"}
          </button>

          {error && (
            <p style={{ color: "#E53935", marginTop: "1rem", fontSize: "13px" }}>{error}</p>
          )}
        </div>

        {/* Right panel - results */}
        <div style={{ background: "#1a1a1a", borderRadius: "12px", padding: "1.5rem" }}>
          {!result && !loading && (
            <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#444", textAlign: "center" }}>
              <div>
                <div style={{ fontSize: "3rem" }}>🤖</div>
                <p>Your analysis will appear here</p>
              </div>
            </div>
          )}

          {loading && (
            <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#888", textAlign: "center" }}>
              <div>
                <div style={{ fontSize: "2rem" }}>⏳</div>
                <p>Analyzing your resume...</p>
              </div>
            </div>
          )}

          {result && (
            <div>
              {/* Score */}
              <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                <div style={{ fontSize: "4rem", fontWeight: "700", color: getScoreColor(result.match_score) }}>
                  {result.match_score}
                </div>
                <div style={{ color: "#888", fontSize: "13px" }}>Match Score / 100</div>
              </div>

              {/* Summary */}
              <div style={{ background: "#111", borderRadius: "8px", padding: "1rem", marginBottom: "1rem" }}>
                <p style={{ margin: 0, fontSize: "13px", color: "#ccc", lineHeight: "1.6" }}>{result.summary}</p>
              </div>

              {/* Matched keywords */}
              <div style={{ marginBottom: "1rem" }}>
                <p style={{ fontSize: "12px", color: "#888", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Matched Keywords</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {result.matched_keywords.map((kw, i) => (
                    <span key={i} style={{ background: "#0d3320", color: "#1D9E75", padding: "3px 10px", borderRadius: "20px", fontSize: "12px" }}>{kw}</span>
                  ))}
                </div>
              </div>

              {/* Missing keywords */}
              <div style={{ marginBottom: "1rem" }}>
                <p style={{ fontSize: "12px", color: "#888", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Missing Keywords</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {result.missing_keywords.map((kw, i) => (
                    <span key={i} style={{ background: "#3b0d0d", color: "#E53935", padding: "3px 10px", borderRadius: "20px", fontSize: "12px" }}>{kw}</span>
                  ))}
                </div>
              </div>

              {/* Suggestions */}
              <div>
                <p style={{ fontSize: "12px", color: "#888", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Suggestions</p>
                {result.suggestions.map((s, i) => (
                  <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "8px", fontSize: "13px", color: "#ccc" }}>
                    <span style={{ color: "#378ADD", fontWeight: "600" }}>{i + 1}.</span>
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;