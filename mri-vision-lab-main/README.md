# MRI Vision Lab 🧠

A deep learning web application for brain tumor classification from MRI scans using EfficientNet.

![Brain Tumor Classification](https://img.shields.io/badge/Deep%20Learning-TensorFlow-orange)
![React](https://img.shields.io/badge/Frontend-React%2018-blue)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-green)
![Docker](https://img.shields.io/badge/Deploy-Docker-blue)

## Overview

This application classifies brain MRI scans into four categories:
- **Glioma** - Tumors arising from glial cells
- **Meningioma** - Tumors from the meninges
- **Pituitary** - Tumors in the pituitary gland
- **No Tumor** - Healthy brain scans

## Project Structure

```
mri-vision-lab/
├── backend/                    # FastAPI backend
│   ├── main.py                 # API endpoints
│   ├── requirements.txt        # Python dependencies
│   ├── Dockerfile              # Backend container
│   └── brain_tumor_model.pkl   # 👈 ADD YOUR MODEL HERE
├── src/                        # React frontend
│   ├── pages/
│   │   ├── Demo.tsx            # Upload interface
│   │   └── Results.tsx         # Prediction results
│   └── lib/
│       ├── api.ts              # API client
│       └── mockInference.ts    # Fallback mock data
├── docker-compose.yml          # Production setup
├── docker-compose.dev.yml      # Development setup
├── Dockerfile                  # Frontend container
└── nginx.conf                  # Frontend server config
```

## Quick Start

### 1. Download the Model

Download your trained model from Google Drive:
```
https://drive.google.com/file/d/1XWx6C1cfasMthzhDhR1HciEsM0VErHwE/view?usp=drive_link
```

Save it as `backend/brain_tumor_model.pkl`

### 2. Run with Docker (Recommended)

```bash
# Build and start both services
docker-compose up --build

# Frontend: http://localhost:3000
# Backend:  http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### 3. Run Locally (Development)

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Frontend:**
```bash
npm install
npm run dev
# Opens at http://localhost:5173
```

Create `.env.local`:
```
VITE_API_URL=http://localhost:8000
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Health check |
| `/health` | GET | Detailed status with model info |
| `/predict` | POST | Upload image → get prediction |

### Example Request

```bash
curl -X POST http://localhost:8000/predict \
  -F "file=@brain_mri.jpg"
```

### Example Response

```json
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
  "description": "A type of tumor that starts in the glial cells...",
  "severity": "high"
}
```

## Deployment

### Render (Recommended)

1. Push code to GitHub
2. Create a new **Web Service** on [Render](https://render.com)
3. Connect your repository
4. Set build command: `docker-compose build backend`
5. Set start command: `docker-compose up backend`
6. Add environment variable: `MODEL_PATH=/app/brain_tumor_model.pkl`

For the frontend, create a **Static Site**:
1. Build command: `npm install && npm run build`
2. Publish directory: `dist`
3. Add environment: `VITE_API_URL=https://your-backend.onrender.com`

### Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### Vercel (Frontend) + Render (Backend)

1. Deploy backend to Render (see above)
2. Import frontend to Vercel
3. Add environment variable in Vercel:
   ```
   VITE_API_URL=https://your-backend.onrender.com
   ```

## Model Training

The model was trained on the [Brain Tumor MRI Dataset](https://www.kaggle.com/datasets/masoudnickparvar/brain-tumor-mri-dataset) using:

- **Architecture**: EfficientNetB1 (transfer learning)
- **Input size**: 224×224 RGB
- **Classes**: glioma, meningioma, notumor, pituitary
- **Framework**: TensorFlow/Keras

To retrain, use the Kaggle notebook and save with:
```python
import pickle
with open('brain_tumor_model.pkl', 'wb') as f:
    pickle.dump(model, f)
```

## Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- React Router

**Backend:**
- FastAPI
- TensorFlow
- Pillow
- Uvicorn/Gunicorn

**Infrastructure:**
- Docker & Docker Compose
- Nginx (production)

## Development

```bash
# Run with hot reload
docker-compose -f docker-compose.dev.yml up

# Run tests
npm test

# Lint
npm run lint
```

## Disclaimer

⚠️ **This is a research/educational tool only.** Results are not medical diagnoses. Always consult qualified healthcare professionals for medical decisions.

## License

MIT License - See [LICENSE](LICENSE) for details.

---

Built with ❤️ by [Charchil](https://github.com/CharchilDS)
