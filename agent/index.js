const jwt = require("jsonwebtoken");

const CUBE_URL = "http://localhost:4000";

function createCubeToken() {
  const secret = process.env.CUBEJS_API_SECRET;

  if (!secret) {
    throw new Error("CUBEJS_API_SECRET is not set.");
  }

  return jwt.sign(
    {
      iat: Math.floor(Date.now() / 1000)
    },
    secret
  );
}

function createCubeQuery(question) {
  const text = question.toLowerCase();

  // Governed semantic mapping.
  // The agent can ONLY use approved Cube measures and dimensions.

  if (
    text.includes("revenue") &&
    text.includes("country")
  ) {
    return {
      measures: [
        "CorporateSales.totalRevenue"
      ],
      dimensions: [
        "CorporateSales.country"
      ]
    };
  }

  if (
    text.includes("revenue") &&
    text.includes("product")
  ) {
    return {
      measures: [
        "CorporateSales.totalRevenue"
      ],
      dimensions: [
        "CorporateSales.product"
      ]
    };
  }

  if (
    text.includes("revenue") &&
    text.includes("region")
  ) {
    return {
      measures: [
        "CorporateSales.totalRevenue"
      ],
      dimensions: [
        "CorporateSales.region"
      ]
    };
  }

  if (text.includes("total revenue")) {
    return {
      measures: [
        "CorporateSales.totalRevenue"
      ],
      dimensions: []
    };
  }

  // Material cost mapping
  if (
    text.includes("material cost") ||
    text.includes("material costs")
  ) {
    return {
      measures: [
        "CorporateSales.totalMaterialCost"
      ],
      dimensions: []
    };
  }

  // Shipping cost mapping
  if (
    text.includes("shipping cost") ||
    text.includes("shipping costs")
  ) {
    return {
      measures: [
        "CorporateSales.totalShippingCost"
      ],
      dimensions: []
    };
  }

  // Total cost mapping
  if (
    text.includes("total cost") ||
    text.includes("total costs")
  ) {
    return {
      measures: [
        "CorporateSales.totalCost"
      ],
      dimensions: []
    };
  }

  // Profit mapping
  if (
    text.includes("profit") ||
    text.includes("total profit")
  ) {
    return {
      measures: [
        "CorporateSales.totalProfit"
      ],
      dimensions: []
    };
  }

  // Margin mapping
  if (text.includes("margin")) {
    return {
      measures: [
        "CorporateSales.margin"
      ],
      dimensions: []
    };
  }

  throw new Error(
    "I could not map the question to a governed MetricMind metric."
  );
}

async function cubeQuery(token, query) {
  const response = await fetch(
    `${CUBE_URL}/cubejs-api/v1/load?query=${encodeURIComponent(
      JSON.stringify(query)
    )}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  const body = await response.text();

  if (!response.ok) {
    throw new Error(
      `Cube query failed: ${response.status} - ${body}`
    );
  }

  return JSON.parse(body);
}


// --------------------------------------------------
// Multi-step European Margin Analysis
// --------------------------------------------------

async function analyzeEuropeanMargin(token) {
  console.log("\nStarting multi-step European margin analysis...");

  const europeFilter = {
    member: "CorporateSales.region",
    operator: "equals",
    values: ["Europe"]
  };

  const queries = {
    revenue: {
      measures: [
        "CorporateSales.totalRevenue"
      ],
      dimensions: [],
      filters: [europeFilter]
    },

    profit: {
      measures: [
        "CorporateSales.totalProfit"
      ],
      dimensions: [],
      filters: [europeFilter]
    },

    margin: {
      measures: [
        "CorporateSales.margin"
      ],
      dimensions: [],
      filters: [europeFilter]
    },

    shippingCost: {
      measures: [
        "CorporateSales.totalShippingCost"
      ],
      dimensions: [],
      filters: [europeFilter]
    },

    materialCost: {
      measures: [
        "CorporateSales.totalMaterialCost"
      ],
      dimensions: [],
      filters: [europeFilter]
    }
  };

  const results = {};

  for (const [name, query] of Object.entries(queries)) {
    console.log(`\nStep: Querying ${name}`);

    console.log("Governed Cube query:");
    console.log(JSON.stringify(query, null, 2));

    results[name] = await cubeQuery(token, query);

    console.log("Result:");
    console.log(
      JSON.stringify(results[name].data, null, 2)
    );
  }

  return results;
}


// --------------------------------------------------
// Business Reasoning Layer
// --------------------------------------------------

function explainEuropeanMargin(results) {
  const revenue = Number(
    results.revenue.data[0]?.[
      "CorporateSales.totalRevenue"
    ] || 0
  );

  const profit = Number(
    results.profit.data[0]?.[
      "CorporateSales.totalProfit"
    ] || 0
  );

  const margin = Number(
    results.margin.data[0]?.[
      "CorporateSales.margin"
    ] || 0
  );

  const shippingCost = Number(
    results.shippingCost.data[0]?.[
      "CorporateSales.totalShippingCost"
    ] || 0
  );

  const materialCost = Number(
    results.materialCost.data[0]?.[
      "CorporateSales.totalMaterialCost"
    ] || 0
  );

  const totalCost = revenue - profit;

  const materialPercent =
    revenue === 0
      ? 0
      : (materialCost / revenue) * 100;

  const shippingPercent =
    revenue === 0
      ? 0
      : (shippingCost / revenue) * 100;

  console.log("\n----------------------------------------");
  console.log("MetricMind Business Analysis");
  console.log("----------------------------------------");

  console.log("Region: Europe");
  console.log(`Revenue: ${revenue.toFixed(2)}`);
  console.log(`Profit: ${profit.toFixed(2)}`);
  console.log(`Margin: ${(margin * 100).toFixed(2)}%`);
  console.log(`Material Cost: ${materialCost.toFixed(2)}`);
  console.log(`Shipping Cost: ${shippingCost.toFixed(2)}`);
  console.log(`Total Cost: ${totalCost.toFixed(2)}`);

  console.log("\nCost Driver Analysis:");

  console.log(
    `Material cost represents ${materialPercent.toFixed(2)}% of European revenue.`
  );

  console.log(
    `Shipping cost represents ${shippingPercent.toFixed(2)}% of European revenue.`
  );

  if (materialCost > shippingCost) {
    console.log(
      "Material cost is the larger identified cost driver."
    );
  } else {
    console.log(
      "Shipping cost is the larger identified cost driver."
    );
  }

  console.log("\nConclusion:");

  if (margin < 0.25) {
    console.log(
      "European margin is relatively low based on the current governed metrics."
    );
  } else {
    console.log(
      "European margin is currently above the 25% analysis threshold."
    );
  }

  console.log(
    "The analysis is based entirely on governed Cube semantic metrics."
  );
}


// --------------------------------------------------
// Product Profit Ranking Analysis
// --------------------------------------------------

async function analyzeProductProfitRanking(token) {
  console.log("\nStarting product profit ranking analysis...");

  const query = {
    measures: [
      "CorporateSales.totalProfit"
    ],
    dimensions: [
      "CorporateSales.product"
    ]
  };

  console.log("\nGoverned Cube query:");
  console.log(JSON.stringify(query, null, 2));

  const result = await cubeQuery(token, query);

  console.log("\nRaw Cube result:");
  console.log(JSON.stringify(result.data, null, 2));

  const rows = result.data.map((row) => ({
    product: row["CorporateSales.product"],
    profit: Number(
      row["CorporateSales.totalProfit"] || 0
    )
  }));

  rows.sort((a, b) => b.profit - a.profit);

  const highest = rows[0];

  console.log("\n----------------------------------------");
  console.log("MetricMind Product Profit Ranking");
  console.log("----------------------------------------");

  if (!highest) {
    console.log("No product profit data was returned.");
    return;
  }

  console.log(
    `Highest Profit Product: ${highest.product}`
  );

  console.log(
    `Profit: ${highest.profit.toFixed(2)}`
  );

  console.log("\nProduct Profit Ranking:");

  rows.forEach((row, index) => {
    console.log(
      `${index + 1}. ${row.product} - ${row.profit.toFixed(2)}`
    );
  });

  console.log(
    "\nThe ranking is based entirely on the governed Cube semantic metric CorporateSales.totalProfit."
  );
}


// --------------------------------------------------
// Main Agent
// --------------------------------------------------

async function main() {
  const question =
    process.argv.slice(2).join(" ") ||
    "What is the total revenue by country?";

  console.log("\nUser question:");
  console.log(question);

  const token = createCubeToken();

  console.log("\nCube JWT generated.");

  const text = question.toLowerCase();

  // Product profit ranking
  if (
    text.includes("product") &&
    text.includes("profit") &&
    (
      text.includes("highest") ||
      text.includes("top") ||
      text.includes("best")
    )
  ) {
    await analyzeProductProfitRanking(token);
    return;
  }

  // Multi-step European margin analysis
  if (
    text.includes("europe") &&
    text.includes("margin")
  ) {
    const results = await analyzeEuropeanMargin(token);

    explainEuropeanMargin(results);

    return;
  }

  // Normal single governed query
  const query = createCubeQuery(question);

  console.log("\nGenerated governed Cube query:");
  console.log(JSON.stringify(query, null, 2));

  const result = await cubeQuery(token, query);

  console.log("\nCube result:");
  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error("Agent error:", error.message);
  process.exit(1);
});
