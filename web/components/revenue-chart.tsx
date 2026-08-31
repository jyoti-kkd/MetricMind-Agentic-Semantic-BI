"use client";

import ReactECharts from "echarts-for-react";

export type ChartType = "revenue" | "profit" | "trend" | "margin";

type RevenueChartProps = {
  chartType: ChartType;
};

const chartData = {
  revenue: [32500, 28700, 41200, 33030],
  profit: [11200, 9800, 15800, 10420],
  margin: [34.5, 34.1, 38.3, 31.6],
  trend: [18000, 22000, 25000, 31000, 36000, 42000],
};

export default function RevenueChart({
  chartType,
}: RevenueChartProps) {
  let option;

  if (chartType === "profit") {
    option = {
      title: {
        text: "Profit by Region",
        left: "center",
        textStyle: { color: "#e2e8f0" },
      },
      tooltip: { trigger: "axis" },
      xAxis: {
        type: "category",
        data: ["North", "South", "East", "West"],
        axisLabel: { color: "#94a3b8" },
      },
      yAxis: {
        type: "value",
        axisLabel: { color: "#94a3b8" },
      },
      series: [
        {
          name: "Profit",
          type: "bar",
          data: chartData.profit,
        },
      ],
    };
  } else if (chartType === "trend") {
    option = {
      title: {
        text: "Revenue Trend",
        left: "center",
        textStyle: { color: "#e2e8f0" },
      },
      tooltip: { trigger: "axis" },
      xAxis: {
        type: "category",
        data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        axisLabel: { color: "#94a3b8" },
      },
      yAxis: {
        type: "value",
        axisLabel: { color: "#94a3b8" },
      },
      series: [
        {
          name: "Revenue",
          type: "line",
          smooth: true,
          data: chartData.trend,
        },
      ],
    };
  } else if (chartType === "margin") {
    option = {
      title: {
        text: "Profit Margin by Region",
        left: "center",
        textStyle: { color: "#e2e8f0" },
      },
      tooltip: {
        trigger: "axis",
        formatter: "{b}: {c}%",
      },
      xAxis: {
        type: "category",
        data: ["North", "South", "East", "West"],
        axisLabel: { color: "#94a3b8" },
      },
      yAxis: {
        type: "value",
        axisLabel: {
          color: "#94a3b8",
          formatter: "{value}%",
        },
      },
      series: [
        {
          name: "Profit Margin",
          type: "bar",
          data: chartData.margin,
        },
      ],
    };
  } else {
    option = {
      title: {
        text: "Revenue & Profit Overview",
        left: "center",
        textStyle: { color: "#e2e8f0" },
      },
      tooltip: { trigger: "axis" },
      legend: {
        data: ["Revenue", "Profit"],
        bottom: 0,
        textStyle: { color: "#94a3b8" },
      },
      xAxis: {
        type: "category",
        data: ["North", "South", "East", "West"],
        axisLabel: { color: "#94a3b8" },
      },
      yAxis: {
        type: "value",
        axisLabel: { color: "#94a3b8" },
      },
      series: [
        {
          name: "Revenue",
          type: "bar",
          data: chartData.revenue,
        },
        {
          name: "Profit",
          type: "bar",
          data: chartData.profit,
        },
      ],
    };
  }

  return (
    <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-6">
      <ReactECharts
        option={option}
        style={{
          height: "400px",
          width: "100%",
        }}
      />
    </div>
  );
}