from fastapi import FastAPI

app = FastAPI(title="Word Sprint API")


@app.get("/")
def root():
    return {
        "message": "Word Sprint API Running"
    }