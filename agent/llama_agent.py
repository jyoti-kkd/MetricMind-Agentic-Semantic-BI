from langchain_ollama import ChatOllama

llm = ChatOllama(
    model="llama3",
    temperature=0
)

cube_schema = """
Cube.dev semantic layer: orders

Measures:
- orders.count
- orders.total_revenue
- orders.total_cost
- orders.total_profit
- orders.profit_margin

Dimensions:
- orders.region
- orders.order_date
"""

question = """
What metrics are available in the MetricMind semantic layer?
Answer only using the provided Cube.dev schema.
"""

prompt = f"""
You are the MetricMind BI assistant.

Here is the Cube.dev semantic layer schema:

{cube_schema}

User question:
{question}

Explain which measures and dimensions are available.
"""

response = llm.invoke(prompt)

print(response.content)