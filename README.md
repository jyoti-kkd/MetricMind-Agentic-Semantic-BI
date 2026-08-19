# MetricMind — Agentic Semantic BI Engine

An agentic semantic Business Intelligence platform designed to transform corporate sales data into reliable, structured, and actionable business insights.

## Project Overview

MetricMind combines data warehousing, data transformation, semantic modeling, and agentic AI to provide a governed analytics platform for corporate sales data.

The project uses:

- Snowflake for data storage and data warehousing
- dbt for data transformation and analytical modeling
- Cube.js as the governed semantic layer
- An Agent for natural-language business questions
- GitHub for version control

The main objective is to prevent an LLM from generating uncontrolled or rogue SQL. Instead, the Agent generates governed queries using predefined semantic metrics and dimensions.

## Architecture

User Business Question
        |
        v
MetricMind Agent
        |
        | Natural Language Understanding
        v
Governed Cube Query
        |
        v
Cube.js Semantic Layer
        |
        v
Snowflake
        |
        v
Business Result

## Data Architecture

Corporate Sales Dataset
        |
        v
Snowflake RAW Layer
        |
        v
dbt STAGING Layer
        |
        v
dbt ANALYTICS Layer
        |
        v
Cube.js Semantic Layer
        |
        v
MetricMind Agent
        |
        v
Business Insights

## Data Layers

### RAW

Contains the original corporate sales data loaded into Snowflake.

### STAGING

Contains cleaned and standardized data prepared using dbt.

### ANALYTICS

Contains transformed models for:

- Revenue analysis
- Cost analysis
- Corporate sales summaries

### Semantic Layer

Cube.js provides governed business metrics and dimensions.

Example metric:

CorporateSales.totalRevenue

Example dimensions:

CorporateSales.country
CorporateSales.product
CorporateSales.region

## Agentic BI

The MetricMind Agent accepts natural-language business questions and converts them into governed Cube queries.

Example:

What is the total revenue by country?

The Agent generates a governed query:

{
  "measures": [
    "CorporateSales.totalRevenue"
  ],
  "dimensions": [
    "CorporateSales.country"
  ]
}

The Agent does not directly generate uncontrolled SQL. Cube.js uses the predefined semantic model to execute the query against Snowflake.

## Agent and Cube Integration

The Agent uses JWT authentication to communicate securely with the Cube API.

The integration flow is:

Natural Language Question
        |
        v
Agent
        |
        v
JWT Authentication
        |
        v
Cube API
        |
        v
Semantic Metric + Dimensions
        |
        v
Snowflake
        |
        v
Structured Result

## Tested Business Queries

The Agent and Cube integration has been tested with:

### Revenue by Country

What is the total revenue by country?

### Revenue by Product

What is the total revenue by product?

### Revenue by Region

What is the total revenue by region?

These queries successfully return results from Snowflake through the Cube semantic layer.

## Key Analytical Models

- Revenue Analysis
- Cost Analysis
- Corporate Sales Summary

## Data Quality

dbt tests are used to validate important source columns including:

- DATE
- COUNTRY
- REVENUE
- COST

## Technologies

- Snowflake
- dbt
- Cube.js
- Node.js
- JavaScript
- LangChain
- OpenAI
- SQL
- Python
- GitHub
- Power BI

##Project Structure
MetricMind-Agentic-Semantic-BI/
│
├── data/
│
├── docs/
│
├── models/
│   ├── staging/
│   │   ├── sources.yml
│   │   └── stg_corporate_sales.sql
│   │
│   └── analytics/
│       ├── corporate_sales_summary.sql
│       ├── cost_analysis.sql
│       └── revenue_analysis.sql
│
├── cube/
│   └── cube.js
│
├── cube_app/
│   ├── cube.js
│   ├── package.json
│   └── package-lock.json
│
├── agent/
│   ├── index.js
│   ├── package.json
│   └── package-lock.json
│
├── dbt_project.yml
├── README.md
└── README_dbt.md
## Current Project Status
- Snowflake data warehouse configured
- Corporate sales data loaded into RAW layer
- dbt staging models completed
- dbt analytics models completed
- Cube.js semantic layer configured
- Revenue, cost, profit, and margin metrics defined
- Agentic Cube query integration completed
- Natural-language business question workflow tested

## Project Objective

MetricMind aims to provide a reliable Agentic BI system where users can ask business questions in natural language while the underlying metrics and data access remain governed by a semantic layer.

This approach helps reduce incorrect metric definitions, uncontrolled SQL generation, and inconsistent business calculations.