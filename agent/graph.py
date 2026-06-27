from dotenv import load_dotenv
load_dotenv()

from langchain_groq import ChatGroq

llm = ChatGroq(model="openai/gpt-oss-120b")

resp = llm.invoke("Who invented Kriya yoga. answer in 1 sentence")

print(resp.content)