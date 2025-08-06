from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from trainer.utils.preprocess import preprocess_audio
from api.model.analyzer import analyze_audio
from contextlib import asynccontextmanager

import shutil
import os
import uuid

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("Starting up Speech Issues Analyzer API...")
    temp_dir = "temp_uploads"
    os.makedirs(temp_dir, exist_ok=True)
    print(f"Temporary directory {temp_dir} ready.")

    yield

    # Shutdown
    print("Shutting down Speech Issues Analyzer API...")
    try:
        # Clean up temporary files
        if os.path.exists(temp_dir):
            # Clean individual files first to handle any locked files
            for filename in os.listdir(temp_dir):
                file_path = os.path.join(temp_dir, filename)
                try:
                    if os.path.isfile(file_path):
                        os.remove(file_path)
                        print(f"Removed temporary file: {filename}")
                except Exception as e:
                    print(f"Warning: Could not remove file {filename}: {e}")

            # Remove the directory
            try:
                shutil.rmtree(temp_dir, ignore_errors=True)
                print(f"Temporary directory {temp_dir} cleaned up successfully.")
            except Exception as e:
                print(f"Warning: Could not remove directory {temp_dir}: {e}")
        else:
            print(f"No temporary directory {temp_dir} to clean up.")

        print("Shutdown completed successfully.")
    except Exception as e:
        print(f"Error during shutdown: {e}")

app = FastAPI(title="Speech Issues Analyzer API", lifespan=lifespan)

# Allow CORS for localhost
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost", "http://localhost:3000", "http://127.0.0.1", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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
        result = analyze_audio(preprocessed_path, base=True)

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