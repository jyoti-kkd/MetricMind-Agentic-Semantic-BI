"use client";

import ReactECharts from "echarts-for-react";

const option = {
  title: {
    text: "Revenue & Profit Overview",
    left: "center",
    textStyle: {
      color: "#e2e8f0",
    },
  },

  tooltip: {
    trigger: "axis",
  },

  legend: {
    data: ["Revenue", "Profit"],
    bottom: 0,
    textStyle: {
      color: "#94a3b8",
    },
  },

  xAxis: {
    type: "category",
    data: ["North", "South", "East", "West"],
    axisLabel: {
      color: "#94a3b8",
    },
  },

  yAxis: {
    type: "value",
    axisLabel: {
      color: "#94a3b8",
    },
  },

  series: [
    {
      name: "Revenue",
      type: "bar",
      data: [32500, 28700, 41200, 33030],
    },
    {
      name: "Profit",
      type: "bar",
      data: [11200, 9800, 15800, 10420],
    },
  ],
};

export default function RevenueChart() {
  return (
    <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-6">
      <ReactECharts
        option={option}
        style={{ height: "400px", width: "100%" }}
      />
    </div>
  );
}