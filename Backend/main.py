from fastapi import FastAPI
app = FastAPI()
@app.get("/")
def send_answer():
    return {"answer": "Test Answer from FastAPI"}