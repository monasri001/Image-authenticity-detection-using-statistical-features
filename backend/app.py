from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import joblib
import numpy as np

from feature_extractor import extract_features_from_bytes

app = FastAPI(title="Image Authenticity Detection API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load trained model
model = joblib.load("model_binary.pkl")

# Load RL-optimized threshold
with open("threshold.txt", "r") as f:
    THRESHOLD = float(f.read())

LABELS = ["REAL", "EDITED", "AI_GENERATED"]


@app.get("/")
def home():
    return {"status": "Backend is running with real ML model"}


@app.post("/predict")
async def predict_image(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        features = extract_features_from_bytes(image_bytes)

        probs = model.predict_proba(features)[0]
        confidence = float(max(probs))
        pred_class = probs.argmax()

        # Class mapping
        if pred_class == 0:
            # REAL prediction
            return {
                "prediction": "REAL",
                "confidence": round(confidence, 3)
            }

        else:
            # FAKE prediction
            if confidence >= 0.75:
                return {
                    "prediction": "FAKE",
                    "confidence": round(confidence, 3)
                }
            elif confidence >= 0.60:
                return {
                    "prediction": "LIKELY MANIPULATED",
                    "confidence": round(confidence, 3)
                }
            else:
                return {
                    "prediction": "REAL",
                    "confidence": round(confidence, 3)
                }

    except Exception as e:
        return {"error": str(e)}



