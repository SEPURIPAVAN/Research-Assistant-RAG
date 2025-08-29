import getpass
import os
import dotenv
dotenv.load_dotenv()


#if not os.environ.get("LANGSMITH_API_KEY"):
#  os.environ["LANGSMITH_API_KEY"] = getpass.getpass("Enter API key for LangSmith: ")
#os.environ["LANGSMITH_TRACING"] = "true"
if not os.environ.get("GOOGLE_API_KEY"):
  os.environ["GOOGLE_API_KEY"] = getpass.getpass("Enter API key for Google Gemini: ")

from langchain.chat_models import init_chat_model

llm = init_chat_model("gemini-2.5-flash", model_provider="google_genai")



from langchain_huggingface import HuggingFaceEmbeddings

embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")

from langchain_chroma import Chroma

vector_store = Chroma(
    collection_name="example_collection",
    embedding_function=embeddings,
    persist_directory="./chroma_langchain_db",
)

import bs4
from langchain import hub
from langchain_community.document_loaders import WebBaseLoader, PyPDFLoader
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langgraph.graph import START, StateGraph
from typing_extensions import List, TypedDict

################ This is for loading from a webpage will add optionality later

#loader = WebBaseLoader(
#    web_paths=("https://lilianweng.github.io/posts/2023-06-23-agent/",),
#    bs_kwargs=dict(
#        parse_only=bs4.SoupStrainer(
#            class_=("post-content", "post-title", "post-header")
#        )
#    ),
#)

loader = PyPDFLoader("example_data/nke-10k-2023.pdf")
docs = loader.load()

text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
all_splits = text_splitter.split_documents(docs)

_ = vector_store.add_documents(documents=all_splits)

prompt = hub.pull("rlm/rag-prompt")
print(prompt)

class State(TypedDict):
    question: str
    context: List[Document]
    answer: str

def retrieve(state: State):
    retrieved_docs = vector_store.similarity_search(state["question"])
    return {"context": retrieved_docs}


def generate(state: State):
    docs_content = "\n\n".join(doc.page_content for doc in state["context"])
    messages = prompt.invoke({"question": state["question"], "context": docs_content})
    response = llm.invoke(messages)
    return {"answer": response.content}


graph_builder = StateGraph(State).add_sequence([retrieve, generate])
graph_builder.add_edge(START, "retrieve")
graph = graph_builder.compile()

#response = graph.invoke({"question": "Tell me about the SolarWinds incident"})
#print(response["answer"])

response = graph.invoke({"question": "How many distribution centers does Nike have in the US?"})
print(response["answer"])