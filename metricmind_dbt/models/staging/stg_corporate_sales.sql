{{ config(materialized='view') }}

SELECT
    ORDER_ID,
    ORDER_DATE,
    REGION,
    COUNTRY,
    PRODUCT,
    CATEGORY,
    QUANTITY,
    REVENUE,
    COST
FROM {{ source('raw', 'corporate_sales_raw') }}