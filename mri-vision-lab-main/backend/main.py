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


def load_model():
    """Load the Keras model."""
    global model
    try:
        # Suppress TensorFlow warnings
        os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"
        import tensorflow as tf
        logging.getLogger('tensorflow').setLevel(logging.ERROR)

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
        logger.error("   Please ensure brain_tumor_model.keras is in the backend directory.")
        return False
    except Exception as e:
        logger.error(f"❌ Failed to load model: {e}")
        return False


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    # Startup
    success = load_model()
    if not success:
        logger.warning("⚠️  Server starting without model - predictions will fail")
    yield
    # Shutdown
    logger.info("Shutting down...")


# ─── FastAPI App ──────────────────────────────────────────────────────────────
app = FastAPI(
    title="Brain Tumor Classification API",
    description="MRI-based brain tumor classification using deep learning",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS - allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def is_likely_brain_mri(image_bytes: bytes) -> bool:
    """
    Validate that the uploaded image is likely a brain MRI scan.

    Checks:
    1. Grayscale-like appearance — MRIs have very similar R, G, B channels.
    2. Low average brightness — MRI scans are mostly dark with bright regions.
    3. Low color saturation — MRIs are not colorful images.

    Returns True if the image passes all checks, False otherwise.
    """
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img_array = np.array(image, dtype=np.float32)

    r, g, b = img_array[:, :, 0], img_array[:, :, 1], img_array[:, :, 2]

    # Check 1: Channel similarity (MRIs are grayscale → R ≈ G ≈ B)
    rg_diff = np.mean(np.abs(r - g))
    gb_diff = np.mean(np.abs(g - b))
    channel_diff = (rg_diff + gb_diff) / 2
    if channel_diff > 12:  # High color variance → not an MRI
        logger.info(f"MRI validation failed: high channel diff = {channel_diff:.2f}")
        return False

    # Check 2: Mostly dark background (MRI scans have a large black background)
    brightness = np.mean(img_array)
    if brightness > 160:  # Very bright image → not an MRI
        logger.info(f"MRI validation failed: high brightness = {brightness:.2f}")
        return False

    # Check 3: Low color saturation via HSV
    image_hsv = image.convert("HSV") if hasattr(image, "convert") else None
    if image_hsv:
        hsv_array = np.array(image_hsv, dtype=np.float32)
        mean_saturation = np.mean(hsv_array[:, :, 1])
        if mean_saturation > 40:  # Highly saturated → colorful, not an MRI
            logger.info(f"MRI validation failed: high saturation = {mean_saturation:.2f}")
            return False

    return True


def preprocess_image(image_bytes: bytes) -> np.ndarray:
    """
    Preprocess image for model inference.

    - Resize to 224x224
    - Convert to RGB
    - Normalize to [0, 1]
    """
    image = Image.open(io.BytesIO(image_bytes))

    # Convert to RGB if necessary (handles grayscale, RGBA, etc.)
    if image.mode != "RGB":
        image = image.convert("RGB")

    # Resize
    image = image.resize((IMAGE_SIZE, IMAGE_SIZE), Image.Resampling.LANCZOS)

    # Convert to numpy array and normalize
    img_array = np.array(image, dtype=np.float32)

    # Add batch dimension
    img_array = np.expand_dims(img_array, axis=0)

    return img_array


@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "Brain Tumor Classification API",
        "model_loaded": model is not None,
    }


@app.get("/health")
async def health_check():
    """Detailed health check."""
    return {
        "status": "healthy" if model is not None else "degraded",
        "model_loaded": model is not None,
        "model_path": MODEL_PATH,
        "labels": LABELS,
        "image_size": IMAGE_SIZE,
    }


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """
    Predict brain tumor class from MRI image.

    Parameters:
        file: Image file (PNG, JPG, JPEG)

    Returns:
        {
            "predictedClass": "glioma",
            "label": "Glioma",
            "confidence": 94.5,
            "probabilities": {
                "Glioma": 94.5,
                "Meningioma": 3.2,
                "No Tumor": 1.5,
                "Pituitary": 0.8
            },
            "description": "...",
            "severity": "high"
        }
    """
    # Check if model is loaded
    if model is None:
        raise HTTPException(
            status_code=503,
            detail="Model not loaded. Please check server logs.",
        )

    # Validate file type
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type: {file.content_type}. Please upload an image.",
        )

    try:
        # Read and preprocess image
        image_bytes = await file.read()

        # ── MRI Validation ──────────────────────────────────────────────────
        if not is_likely_brain_mri(image_bytes):
            raise HTTPException(
                status_code=400,
                detail="Invalid image. Please upload a Brain MRI scan only. "
                       "The uploaded image does not appear to be an MRI scan.",
            )
        # ────────────────────────────────────────────────────────────────────

        img_array = preprocess_image(image_bytes)

        # Run inference
        predictions = model.predict(img_array, verbose=0)
        probabilities = predictions[0]

        # Get predicted class
        predicted_idx = int(np.argmax(probabilities))
        predicted_class = LABELS[predicted_idx]
        confidence = float(probabilities[predicted_idx]) * 100

        # Build probability dict with display labels
        prob_dict = {}
        for i, label in enumerate(LABELS):
            display_label = CLASS_INFO[label]["label"]
            prob_dict[display_label] = round(float(probabilities[i]) * 100, 1)

        # Get class info
        info = CLASS_INFO[predicted_class]

        return JSONResponse({
            "predictedClass": predicted_class,
            "label": info["label"],
            "confidence": round(confidence, 1),
            "probabilities": prob_dict,
            "description": info["description"],
            "severity": info["severity"],
        })

    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}",
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
