"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ChartData {
  name: string;
  value: number;
}

export default function Home() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleAsk() {
    if (!question.trim() || loading) return;

    setLoading(true);
    setAnswer("Analyzing your question...");
    setChartData([]);

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

      setAnswer(data.answer || "No answer returned.");

      /*
       * The API returns the visualization data as `data`.
       * Convert it safely into the format expected by Recharts.
       */
      if (Array.isArray(data.data)) {
        const formattedData = data.data
          .map((item: any) => ({
            name: String(item.name ?? ""),
            value: Number(item.value ?? 0),
          }))
          .filter(
            (item: ChartData) =>
              item.name.length > 0 && Number.isFinite(item.value)
          );

        setChartData(formattedData);
      } else if (Array.isArray(data.chartData)) {
        const formattedData = data.chartData
          .map((item: any) => ({
            name: String(item.name ?? ""),
            value: Number(item.value ?? 0),
          }))
          .filter(
            (item: ChartData) =>
              item.name.length > 0 && Number.isFinite(item.value)
          );

        setChartData(formattedData);
      }
    } catch (error) {
      setAnswer(
        error instanceof Error
          ? `Error: ${error.message}`
          : "An unexpected error occurred."
      );

      setChartData([]);
    } finally {
      setLoading(false);
    }
  }

  function formatNumber(value: number) {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
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

          <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-500">
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

        {/* Ask MetricMind */}
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
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
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

        {/* Data Visualization */}
        {chartData.length > 0 && (
          <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <h2 className="text-xl font-semibold">
              Data Visualization
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Visualization generated from the governed Cube result.
            </p>

            <div className="mt-6 h-96 w-full">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart
                  data={chartData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 30,
                    bottom: 20,
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#334155"
                  />

                  <XAxis
                    dataKey="name"
                    tick={{
                      fill: "#cbd5e1",
                      fontSize: 14,
                    }}
                    axisLine={{
                      stroke: "#475569",
                    }}
                    tickLine={{
                      stroke: "#475569",
                    }}
                  />

                  <YAxis
                    tick={{
                      fill: "#cbd5e1",
                      fontSize: 12,
                    }}
                    axisLine={{
                      stroke: "#475569",
                    }}
                    tickLine={{
                      stroke: "#475569",
                    }}
                    tickFormatter={(value) =>
                      Number(value).toLocaleString("en-US")
                    }
                  />

                  <Tooltip
                    formatter={(value) => [
                      formatNumber(Number(value)),
                      "Revenue",
                    ]}
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "1px solid #334155",
                      borderRadius: "10px",
                      color: "#ffffff",
                    }}
                    labelStyle={{
                      color: "#ffffff",
                      fontWeight: 600,
                    }}
                  />

                  <Bar
                    dataKey="value"
                    name="Revenue"
                    fill="#3b82f6"
                    radius={[8, 8, 0, 0]}
                  />

                </BarChart>
              </ResponsiveContainer>

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
                className="rounded-xl border border-slate-800 bg-slate-900 p-4 transition hover:border-blue-500"
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
          MetricMind &bull; Agentic Semantic BI Engine
        </footer>

      </div>
    </main>
  );
}