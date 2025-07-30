"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleAnalyze() {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Failed to analyze file");
      }
      const data = await res.json();
      setResult(data.analysis);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center p-8 gap-4">
      <h1 className="text-2xl font-bold">Speech Issues Analyzer</h1>

      <input
        type="file"
        accept="audio/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button
        onClick={handleAnalyze}
        disabled={!file || loading}
        className="mt-2 px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
      >
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      {error && <p className="text-red-500">{error}</p>}

      {result && (
        <pre className="w-full max-w-xl whitespace-pre-wrap text-left bg-gray-100 p-4 rounded">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
