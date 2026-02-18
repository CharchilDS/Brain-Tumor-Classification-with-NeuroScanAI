# 🧠 NeuroScanAI — Brain Tumor MRI Classification

<div align="center">

[![Live Demo](https://img.shields.io/badge/🤗%20Hugging%20Face-Live%20Demo-blue?style=for-the-badge)](https://huggingface.co/spaces/Charchil185/neuroscanai)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/CharchilDS/Brain-Tumor-Classification-with-NeuroScanAI)

**A full-stack deep learning web application for brain tumor classification from MRI scans.**

*Research Demo Only — Not for Clinical Use*

</div>

---

## 🌐 Live Demo

👉 **[Try it here → https://huggingface.co/spaces/Charchil185/neuroscanai](https://huggingface.co/spaces/Charchil185/neuroscanai)**

> ⚠️ Note: The app may take 1-2 minutes to wake up on first visit (free tier cold start). Once loaded, predictions are fast.

---

## 📌 Overview

NeuroScanAI is a deep learning-powered web application that classifies brain MRI scans into four categories using a fine-tuned **EfficientNet** model. It features a modern React frontend, a FastAPI backend, and is fully containerized with Docker.

---

## ✨ Features

- 🔬 **Real-time MRI Classification** — Upload any brain MRI and get instant predictions
- 🎯 **4-Class Detection** — Glioma, Meningioma, Pituitary Tumor, No Tumor
- 📊 **Confidence Scores** — Class probability breakdown for each prediction
- 🗺️ **Grad-CAM Visualization** — Visual explanation of model attention regions
- 🛡️ **Input Validation** — Rejects non-MRI images automatically
- 📄 **Downloadable Report** — Export prediction results as a report
- ⚡ **Fast Inference** — Average prediction time under 1 second

---

## 🧪 Model Performance

| Metric | Score |
|--------|-------|
| Model Architecture | EfficientNet (fine-tuned) |
| Accuracy | 97%+ |
| Classes | Glioma, Meningioma, Pituitary, No Tumor |
| Input Size | 224 × 224 px |
| Framework | TensorFlow / Keras |

---

## 🏗️ Tech Stack

### Frontend
- ⚛️ React + TypeScript (Vite)
- 🎨 Tailwind CSS + shadcn/ui
- 🎞️ Framer Motion (animations)

### Backend
- ⚡ FastAPI (Python)
- 🧠 TensorFlow 2.19 / Keras
- 🖼️ Pillow (image processing)
- 🚀 Gunicorn + Uvicorn

### Infrastructure
- 🐳 Docker (single container with supervisord)
- 🌐 Nginx (reverse proxy + SPA routing)
- 🤗 Hugging Face Spaces (deployment)

---

## 🚀 Running Locally

### Prerequisites
- Docker & Docker Compose installed
- `brain_tumor_model.keras` file in `backend/`

### Steps

```bash
# Clone the repository
git clone https://github.com/CharchilDS/Brain-Tumor-Classification-with-NeuroScanAI.git
cd Brain-Tumor-Classification-with-NeuroScanAI

# Build and run with Docker Compose
docker-compose up --build
```

Then open **http://localhost:3000** in your browser.

---

## 📁 Project Structure

```
├── backend/
│   ├── main.py              # FastAPI app + prediction logic
│   ├── requirements.txt     # Python dependencies
│   └── Dockerfile           # Backend Docker config
├── src/
│   ├── pages/               # React pages (Home, Demo, Results)
│   ├── components/          # Reusable UI components
│   └── lib/api.ts           # API client
├── Dockerfile               # Single container (frontend + backend)
├── supervisord.conf         # Process manager config
├── nginx.conf               # Nginx reverse proxy config
└── docker-compose.yml       # Local development setup
```

---

## 🔬 How It Works

1. User uploads a brain MRI scan (PNG/JPG)
2. Frontend sends the image to the FastAPI backend via `/api/predict`
3. Backend validates the image (checks if it's a grayscale MRI)
4. EfficientNet model runs inference and returns class probabilities
5. Results are displayed with confidence scores and Grad-CAM overlay

---

## ⚠️ Disclaimer

This application is intended for **research and educational purposes only**. It is **not** a medical device and should **not** be used for clinical diagnosis. Always consult a qualified medical professional for any health concerns.

---

## 👨‍💻 Author

**Charchil Singh**
- GitHub: [@CharchilDS](https://github.com/CharchilDS)
- Hugging Face: [@Charchil185](https://huggingface.co/Charchil185)

---

<div align="center">
⭐ If you found this project useful, please consider giving it a star!
</div>
