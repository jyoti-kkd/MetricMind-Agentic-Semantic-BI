# MetricMind-Agentic-Semantic-BI

An agentic semantic Business Intelligence platform designed to transform corporate sales data into reliable, structured, and actionable business insights.

## Project Overview

MetricMind integrates data warehousing, data transformation, and business intelligence to provide a scalable analytics foundation for corporate sales data.

The project uses Snowflake for data storage and dbt for data transformation and analytical modeling.

## Data Architecture

Corporate Sales Dataset
↓
Snowflake RAW Layer
↓
dbt STAGING Layer
↓
dbt ANALYTICS Layer
↓
Semantic / BI Layer
↓
Business Insights

## Data Layers

### RAW
Contains the original corporate sales data loaded into Snowflake.

### STAGING
Contains cleaned and standardized data prepared using dbt.

### ANALYTICS
Contains transformed models for revenue analysis, cost analysis, and corporate sales summaries.

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
- SQL
- Python
- GitHub
- Power BI

## Project Structure

```text
MetricMind-Agentic-Semantic-BI/
│
├── data/
├── docs/
├── models/
│   ├── staging/
│   └── analytics/
├── dbt_project.yml
├── README.md
└── README_dbt.md
