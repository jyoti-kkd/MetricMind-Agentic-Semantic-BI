{{ config(
    materialized='view'
) }}

SELECT
    DATE,
    COUNTRY,
    REGION,
    PRODUCT,
    REVENUE,
    COST,
    SHIPPING_COST,
    MATERIAL_COST
FROM {{ source('raw', 'CORPORATE_SALES') }}