import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const question = body.question;

    if (!question || typeof question !== "string") {
      return NextResponse.json(
        { success: false, error: "Question is required." },
        { status: 400 }
      );
    }

    const agentPath =
      "E:\\MetricMind\\MetricMind-Agentic-Semantic-BI\\agent\\index.js";

    const result = await new Promise<string>((resolve, reject) => {
      const child = spawn(
        "node",
        [agentPath, question],
        {
          env: process.env,
          shell: true,
        }
      );

      let output = "";
      let errorOutput = "";

      child.stdout.on("data", (data) => {
        output += data.toString();
      });

      child.stderr.on("data", (data) => {
        errorOutput += data.toString();
      });

      child.on("close", (code) => {
        if (code === 0) {
          resolve(output);
        } else {
          reject(
            new Error(
              errorOutput || output || "Agent failed."
            )
          );
        }
      });
    });

    // --------------------------------------------------
    // Find Cube data
    // --------------------------------------------------

    const dataMatch = result.match(
      /"data":\s*\[(.*?)\]\s*\}/s
    );

    if (!dataMatch) {
      return NextResponse.json({
        success: true,
        answer: "MetricMind could not find a business result.",
        data: [],
      });
    }

    const dataText = dataMatch[1];

    // --------------------------------------------------
    // Detect dimension
    // --------------------------------------------------

    const lowerQuestion = question.toLowerCase();

    let dimension: "region" | "country" | "product" | null =
      null;

    if (lowerQuestion.includes("country")) {
      dimension = "country";
    } else if (lowerQuestion.includes("region")) {
      dimension = "region";
    } else if (lowerQuestion.includes("product")) {
      dimension = "product";
    }

    // --------------------------------------------------
    // Dimension query
    // --------------------------------------------------

    if (dimension) {
      const dimensionKey =
        `CorporateSales.${dimension}`;

      const rowPattern = new RegExp(
        `"${dimensionKey.replace(".", "\\.")}"\\s*:\\s*"([^"]+)"[\\s\\S]*?"CorporateSales\\.totalRevenue"\\s*:\\s*"([^"]+)"`,
        "g"
      );

      const rows = [
        ...dataText.matchAll(rowPattern),
      ];

      if (rows.length > 0) {
        const data = rows.map((row) => ({
          name: row[1],
          value: Number(row[2]),
        }));

        data.sort((a, b) => b.value - a.value);

        const title =
          dimension.charAt(0).toUpperCase() +
          dimension.slice(1);

        const highest = data[0];

        const answer =
          `Highest Revenue ${title}: ${highest.name}\n\n` +
          `Revenue: ${highest.value.toLocaleString(
            "en-US",
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }
          )}\n\n` +
          `Revenue by ${title}:\n` +
          data
            .map(
              (item, index) =>
                `${index + 1}. ${item.name} — ${item.value.toLocaleString(
                  "en-US",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}`
            )
            .join("\n");

        return NextResponse.json({
          success: true,
          answer,
          data,
          dimension,
        });
      }
    }

    // --------------------------------------------------
    // Single metric queries
    // --------------------------------------------------

    const metricMatch =
      dataText.match(
        /"CorporateSales\.([^"]+)":\s*"([^"]+)"/
      );

    if (metricMatch) {
      const metric = metricMatch[1];
      const value = Number(metricMatch[2]);

      const metricNames: Record<string, string> = {
        totalRevenue: "Total Revenue",
        totalCost: "Total Cost",
        totalProfit: "Total Profit",
        totalShippingCost: "Total Shipping Cost",
        totalMaterialCost: "Total Material Cost",
        margin: "Margin",
      };

      const title =
        metricNames[metric] || metric;

      let formattedValue: string;

      if (metric === "margin") {
        formattedValue =
          `${(value * 100).toFixed(2)}%`;
      } else {
        formattedValue =
          value.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });
      }

      const answer =
        `${title}\n\n${formattedValue}`;

      return NextResponse.json({
        success: true,
        answer,
        data: [
          {
            name: title,
            value,
          },
        ],
        metric,
      });
    }

    // --------------------------------------------------
    // Safe fallback
    // Never return raw Agent/Cube output
    // --------------------------------------------------

    return NextResponse.json({
      success: true,
      answer:
        "MetricMind received the result, but could not format it yet.",
      data: [],
    });

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
}