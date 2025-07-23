from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from trainer.utils.preprocess import preprocess_audio
from trainer.model.analyzer import analyze_audio
from contextlib import asynccontextmanager

import shutil
import os
import uuid

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    yield
    # Shutdown
    temp_dir = "temp_uploads"
    if os.path.exists(temp_dir):
        shutil.rmtree(temp_dir, ignore_errors=True)
        print(f"Temporary directory {temp_dir} cleaned up.")
    else:
        print(f"No temporary directory {temp_dir} to clean up.")

app = FastAPI(title="Speech Issues Analyzer API", lifespan=lifespan)


@app.post("/analyze")
async def analyze_speech(file: UploadFile = File(...)):
    try:
        # Save file temporarily
        temp_id = str(uuid.uuid4())
        temp_dir = "temp_uploads"
        os.makedirs(temp_dir, exist_ok=True)
        temp_path = os.path.join(temp_dir, f"{temp_id}_{file.filename}")

        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Preprocess file (optional: normalize, clean, etc.)
        preprocessed_path = preprocess_audio(temp_path)

        # Analyze file (speech-to-text + NLP)
        result = analyze_audio(preprocessed_path)

        # Clean up
        os.remove(temp_path)

        return JSONResponse(content={"success": True, "analysis": result})

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

@app.get("/")
async def root():
    return {"message": "Welcome to the Speech Issues Analyzer API. Use /analyze to upload audio files."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000, log_level="info")