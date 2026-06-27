from dotenv import load_dotenv
load_dotenv()

from langchain_groq import ChatGroq

llm = ChatGroq(model="openai/gpt-oss-120b")

from pydantic import BaseModel, Field

user_prompt = "create a simple calculator web application"

prompt = f"""
Your are the Planner agent. Convert the user prompt into a COMPLETE engineering project plan

User reuest: {user_prompt}
"""

class Plan(BaseModel):
    pass

resp = llm.with_structured_output(Schema).invoke(prompt)

print(resp)