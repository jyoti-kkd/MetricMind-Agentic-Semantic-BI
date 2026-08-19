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

async function main() {
  const question =
    process.argv.slice(2).join(" ") ||
    "What is the total revenue by country?";

  console.log("\nUser question:");
  console.log(question);

  const token = createCubeToken();

  console.log("\nCube JWT generated.");

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