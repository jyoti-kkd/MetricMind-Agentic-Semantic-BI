"use client";

import { useState } from "react";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAsk() {
    if (!question.trim() || loading) return;

    setLoading(true);
    setAnswer("Analyzing your question...");

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Request failed.");
      }

      setAnswer(data.answer);
    } catch (error) {
      setAnswer(
        error instanceof Error
          ? `Error: ${error.message}`
          : "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">

        {/* Header */}
        <header className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight">
            MetricMind
          </h1>

          <p className="mt-2 text-lg text-slate-400">
            Agentic Semantic BI Engine
          </p>

          <p className="mt-4 max-w-3xl text-sm text-slate-500">
            Ask business questions in natural language and receive
            governed analytical insights using Cube semantic metrics
            and Snowflake data.
          </p>
        </header>

        {/* Architecture */}
        <section className="mb-8 grid gap-4 md:grid-cols-4">

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">
              Data Warehouse
            </p>
            <h2 className="mt-2 text-lg font-semibold">
              Snowflake
            </h2>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">
              Transformation
            </p>
            <h2 className="mt-2 text-lg font-semibold">
              dbt
            </h2>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">
              Semantic Layer
            </p>
            <h2 className="mt-2 text-lg font-semibold">
              Cube
            </h2>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">
              Agent
            </p>
            <h2 className="mt-2 text-lg font-semibold">
              MetricMind
            </h2>
          </div>

        </section>

        {/* Chat */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

          <h2 className="text-xl font-semibold">
            Ask MetricMind
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Example: Which region has the highest revenue?
          </p>

          <div className="mt-6 flex flex-col gap-3 md:flex-row">

            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAsk();
                }
              }}
              placeholder="Ask a business question..."
              disabled={loading}
              className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-500 disabled:opacity-50"
            />

            <button
              onClick={handleAsk}
              disabled={loading || !question.trim()}
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Analyzing..." : "Ask MetricMind"}
            </button>

          </div>

        </section>

        {/* Answer */}
        {answer && (
          <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <h2 className="text-xl font-semibold">
              MetricMind Analysis
            </h2>

            <div className="mt-4 rounded-xl bg-slate-950 p-5">

              <p className="text-sm text-slate-400">
                Your Question
              </p>

              <p className="mt-2 font-medium">
                {question}
              </p>

              <div className="mt-6 border-t border-slate-800 pt-5">

                <p className="text-sm text-slate-400">
                  Analysis
                </p>

                <pre className="mt-3 whitespace-pre-wrap break-words font-sans text-sm leading-6 text-slate-200">
                  {answer}
                </pre>

              </div>

            </div>

          </section>
        )}

        {/* Governed Metrics */}
        <section className="mt-8">

          <h2 className="text-xl font-semibold">
            Governed Business Metrics
          </h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {[
              "Total Revenue",
              "Total Cost",
              "Total Profit",
              "Margin",
              "Shipping Cost",
              "Material Cost",
            ].map((metric) => (

              <div
                key={metric}
                className="rounded-xl border border-slate-800 bg-slate-900 p-4"
              >
                <p className="font-medium">
                  {metric}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Governed Cube metric
                </p>
              </div>

            ))}

          </div>

        </section>

        {/* Footer */}
        <footer className="mt-12 border-t border-slate-800 pt-6 text-center text-sm text-slate-500">
          MetricMind • Agentic Semantic BI Engine
        </footer>

      </div>
    </main>
  );
}