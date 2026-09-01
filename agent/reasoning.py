from langchain_ollama import ChatOllama


llm = ChatOllama(
    model="llama3",
    temperature=0,
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


def analyze_question(question: str):
    prompt = f"""
You are the MetricMind BI assistant.

You must answer business questions using ONLY the following
Cube.dev semantic layer schema:

{cube_schema}

For complex questions, follow these analytical steps:

Step 1: Identify the business metrics required.
Step 2: Identify the dimensions needed for the analysis.
Step 3: Determine the logical comparison or calculation.
Step 4: Provide a concise business conclusion.

User question:
{question}

Return the answer in this format:

Analysis Steps:
1. ...
2. ...
3. ...
4. ...

Conclusion:
...
"""

    response = llm.invoke(prompt)

    return response.content


if __name__ == "__main__":
    question = "Which region has the highest profit margin?"

    result = analyze_question(question)

    print(result)