{{ config(
    materialized='table'
) }}

SELECT
    COUNTRY,
    REGION,
    PRODUCT,
    SUM(REVENUE) AS TOTAL_REVENUE,
    SUM(COST) AS TOTAL_COST,
    SUM(REVENUE - COST) AS TOTAL_PROFIT
FROM {{ ref('stg_corporate_sales') }}
GROUP BY
    COUNTRY,
    REGION,
    PRODUCT