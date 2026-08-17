cube(`CorporateSales`, {
  sql: `SELECT * FROM METRICMIND_DB.RAW.CORPORATE_SALES`,

  measures: {
    count: {
      type: `count`
    },

    totalRevenue: {
      sql: `REVENUE`,
      type: `sum`
    },

    totalCost: {
      sql: `COST`,
      type: `sum`
    },

    totalShippingCost: {
      sql: `SHIPPING_COST`,
      type: `sum`
    },

    totalProfit: {
      sql: `REVENUE - COST - SHIPPING_COST`,
      type: `sum`
    },

    averageRevenue: {
      sql: `REVENUE`,
      type: `avg`
    }
  },

  dimensions: {
    date: {
      sql: `DATE`,
      type: `time`
    },

    country: {
      sql: `COUNTRY`,
      type: `string`
    },

    region: {
      sql: `REGION`,
      type: `string`
    },

    product: {
      sql: `PRODUCT`,
      type: `string`
    }
  }
});