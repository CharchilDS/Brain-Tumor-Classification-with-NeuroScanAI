"""
Brain Tumor Classification API
==============================
FastAPI backend serving the EfficientNet model for MRI classification.

Model: brain_tumor_model.keras (Keras saved model)
Labels: glioma, meningioma, notumor, pituitary

Endpoints:
  GET  /         → Health check
  GET  /health   → Health check with model status
  POST /predict  → Upload MRI image → returns class + confidence scores
"""

import io
import os
import logging
from contextlib import asynccontextmanager

import numpy as np
from PIL import Image
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# ─── Logging ──────────────────────────────────────────────────────────────────
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ─── Constants ────────────────────────────────────────────────────────────────
MODEL_PATH = os.getenv("MODEL_PATH", "brain_tumor_model.keras")
IMAGE_SIZE = 224

# Label mapping - matches the training data folder order
LABELS = ["glioma", "notumor", "meningioma", "pituitary"]

# Display info for frontend
CLASS_INFO = {
    "glioma": {
        "label": "Glioma",
        "description": "A type of tumor that starts in the glial cells of the brain or spine. Gliomas are classified by cell type, grade, and location.",
        "severity": "high",
    },
    "meningioma": {
        "label": "Meningioma",
        "description": "A tumor that arises from the meninges, the membranes surrounding the brain and spinal cord. Most meningiomas are benign.",
        "severity": "medium",
    },
    "notumor": {
        "label": "No Tumor",
        "description": "No signs of a brain tumor were detected in this MRI scan.",
        "severity": "none",
    },
    "pituitary": {
        "label": "Pituitary",
        "description": "A tumor that forms in the pituitary gland at the base of the brain. Most pituitary tumors are benign adenomas.",
        "severity": "medium",
    },
}

# ─── Global model variable ────────────────────────────────────────────────────
model = None


def download_model_from_gdrive():
    """Download model from Google Drive if not present locally."""
    if os.path.exists(MODEL_PATH):
        logger.info(f"Model already exists at {MODEL_PATH}, skipping download.")
        return True
    try:
        import gdown
        logger.info("Model not found locally. Downloading from Google Drive...")
        file_id = "1pUB69sXWLrzy-FXIa0WkOGes_UdOye6o"
        url = f"https://drive.google.com/uc?id={file_id}"
        gdown.download(url, MODEL_PATH, quiet=False)
        logger.info(f"✅ Model downloaded to {MODEL_PATH}")
        return True
    except Exception as e:
        logger.error(f"❌ Failed to download model: {e}")
        return False


def load_model():
    """Load the Keras model."""
    global model
    try:
        # Suppress TensorFlow warnings
        os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"
        import tensorflow as tf
        logging.getLogger('tensorflow').setLevel(logging.ERROR)

        # Download model if not present
        if not download_model_from_gdrive():
            return False

        logger.info(f"Loading model from {MODEL_PATH}...")

        model = tf.keras.models.load_model(MODEL_PATH)

        logger.info("✅ Model loaded successfully!")
        logger.info(f"   Model type: {type(model)}")

        # Warm up the model with a dummy prediction
        dummy_input = np.zeros((1, IMAGE_SIZE, IMAGE_SIZE, 3), dtype=np.float32)
        _ = model.predict(dummy_input, verbose=0)
        logger.info("   Model warmed up and ready for inference.")

        return True
    except FileNotFoundError:
        logger.error(f"❌ Model file not found: {MODEL_PATH}")
        return False
    except Exception as e:
        logger.error(f"❌ Failed to load model: {e}")
        return False


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    success = load_model()
    if not success:
        logger.warning("⚠️  Server starting without model - predictions will fail")
    yield
    logger.info("Shutting down...")


# ─── FastAPI App ──────────────────────────────────────────────────────────────
app = FastAPI(
    title="Brain Tumor Classification API",
    description="MRI-based brain tumor classification using deep learning",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def is_likely_brain_mri(image_bytes: bytes) -> bool:
    """Validate that the uploaded image is likely a brain MRI scan."""
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img_array = np.array(image, dtype=np.float32)

    r, g, b = img_array[:, :, 0], img_array[:, :, 1], img_array[:, :, 2]

    rg_diff = np.mean(np.abs(r - g))
    gb_diff = np.mean(np.abs(g - b))
    channel_diff = (rg_diff + gb_diff) / 2
    if channel_diff > 12:
        logger.info(f"MRI validation failed: high channel diff = {channel_diff:.2f}")
        return False

    brightness = np.mean(img_array)
    if brightness > 160:
        logger.info(f"MRI validation failed: high brightness = {brightness:.2f}")
        return False

    return True


def preprocess_image(image_bytes: bytes) -> np.ndarray:
    """Preprocess image for model inference."""
    image = Image.open(io.BytesIO(image_bytes))
    if image.mode != "RGB":
        image = image.convert("RGB")
    image = image.resize((IMAGE_SIZE, IMAGE_SIZE), Image.Resampling.LANCZOS)
    img_array = np.array(image, dtype=np.float32)
    img_array = np.expand_dims(img_array, axis=0)
    return img_array


@app.get("/")
async def root():
    return {
        "status": "healthy",
        "service": "Brain Tumor Classification API",
        "model_loaded": model is not None,
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy" if model is not None else "degraded",
        "model_loaded": model is not None,
        "model_path": MODEL_PATH,
        "labels": LABELS,
        "image_size": IMAGE_SIZE,
    }


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded.")

    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail=f"Invalid file type: {file.content_type}.")

    try:
        image_bytes = await file.read()

        if not is_likely_brain_mri(image_bytes):
            raise HTTPException(
                status_code=400,
                detail="Invalid image. Please upload a Brain MRI scan only.",
            )

        img_array = preprocess_image(image_bytes)
        predictions = model.predict(img_array, verbose=0)
        probabilities = predictions[0]

        predicted_idx = int(np.argmax(probabilities))
        predicted_class = LABELS[predicted_idx]
        confidence = float(probabilities[predicted_idx]) * 100

        prob_dict = {}
        for i, label in enumerate(LABELS):
            display_label = CLASS_INFO[label]["label"]
            prob_dict[display_label] = round(float(probabilities[i]) * 100, 1)

        info = CLASS_INFO[predicted_class]

        return JSONResponse({
            "predictedClass": predicted_class,
            "label": info["label"],
            "confidence": round(confidence, 1),
            "probabilities": prob_dict,
            "description": info["description"],
            "severity": info["severity"],
        })

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)