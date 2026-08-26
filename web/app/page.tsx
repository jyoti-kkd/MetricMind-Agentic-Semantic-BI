"use client";

import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col">
        {/* Header */}
        <header className="border-b border-slate-800 px-6 py-5">
          <h1 className="text-2xl font-bold">MetricMind</h1>
          <p className="mt-1 text-sm text-slate-400">
            Agentic Semantic BI Engine
          </p>
        </header>

        {/* Chat area */}
        <section className="flex flex-1 flex-col px-6 py-8">
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-xl font-bold">
              M
            </div>

            <h2 className="text-3xl font-semibold">
              Ask MetricMind
            </h2>

            <p className="mt-3 max-w-xl text-slate-400">
              Ask questions about revenue, cost, profit, margin, regions,
              and other business metrics.
            </p>
          </div>

          {/* Input */}
          <div className="mt-8">
            <div className="flex gap-3 rounded-2xl border border-slate-700 bg-slate-900 p-3">
              <input
                type="text"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Ask a business question..."
                className="flex-1 bg-transparent px-3 py-3 text-white outline-none placeholder:text-slate-500"
              />

              <button
                type="button"
                onClick={() => setMessage("")}
                className="rounded-xl bg-blue-600 px-6 py-3 font-medium transition hover:bg-blue-500"
              >
                Send
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}