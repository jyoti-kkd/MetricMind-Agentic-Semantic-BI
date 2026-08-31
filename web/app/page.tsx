"use client";

import { useState } from "react";
import MetricCard from "../components/metric-card";
import RevenueChart, {
  ChartType,
} from "../components/revenue-chart";

function detectChartType(question: string): ChartType {
  const text = question.toLowerCase();

  if (
    text.includes("margin") ||
    text.includes("profit margin")
  ) {
    return "margin";
  }

  if (
    text.includes("trend") ||
    text.includes("over time") ||
    text.includes("monthly") ||
    text.includes("month") ||
    text.includes("time series")
  ) {
    return "trend";
  }

  if (
    text.includes("profit") ||
    text.includes("earnings")
  ) {
    return "profit";
  }

  return "revenue";
}

export default function Home() {
  const [message, setMessage] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const [chartType, setChartType] =
    useState<ChartType>("revenue");

  async function handleSend() {
    if (!message.trim() || loading) return;

    const selectedChart = detectChartType(message);

    setChartType(selectedChart);
    setLoading(true);
    setAnswer("");

    try {
      const response = await fetch(
        "http://localhost:8000/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: message,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Backend request failed");
      }

      const data = await response.text();

      setAnswer(data);
    } catch (error) {
      console.error(error);

      setAnswer(
        "Unable to connect to the MetricMind backend."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col">

        <header className="border-b border-slate-800 px-6 py-5">
          <h1 className="text-2xl font-bold">
            MetricMind
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Agentic Semantic BI Engine
          </p>
        </header>

        <section className="px-6 py-8">

          <div className="mb-8">
            <h2 className="text-3xl font-semibold">
              Business Overview
            </h2>

            <p className="mt-2 text-slate-400">
              Key performance metrics from your semantic layer.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <MetricCard
              title="Total Revenue"
              value="$125,430"
              change="+12.5%"
            />

            <MetricCard
              title="Total Cost"
              value="$78,210"
              change="+5.2%"
            />

            <MetricCard
              title="Total Profit"
              value="$47,220"
              change="+18.7%"
            />

            <MetricCard
              title="Profit Margin"
              value="37.6%"
              change="+4.1%"
            />

          </div>

          <RevenueChart chartType={chartType} />

          <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-6">

            <h3 className="text-lg font-semibold">
              Ask MetricMind
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              Ask questions about revenue, cost, profit,
              margin, regions, and other business metrics.
            </p>

            {answer && (
              <div className="mt-5 rounded-xl border border-slate-700 bg-slate-950 p-4">
                <p className="whitespace-pre-wrap text-sm leading-6 text-slate-200">
                  {answer}
                </p>
              </div>
            )}

            <div className="mt-5 flex gap-3">

              <input
                type="text"
                value={message}
                onChange={(event) =>
                  setMessage(event.target.value)
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleSend();
                  }
                }}
                placeholder="Ask a business question..."
                className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-blue-500"
              />

              <button
                type="button"
                onClick={handleSend}
                disabled={loading}
                className="rounded-xl bg-blue-600 px-6 py-3 font-medium hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Thinking..." : "Send"}
              </button>

            </div>
          </div>

        </section>
      </div>
    </main>
  );
}