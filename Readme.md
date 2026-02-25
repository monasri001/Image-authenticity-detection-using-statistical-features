# 🛡️ AuthentiScan

## Image Authenticity Detection Using Statistical Image Forensics

> Detecting **REAL vs EDITED vs AI-GENERATED** images using statistical forensic analysis — without deep CNNs.

---

# 📌 Overview

With the rapid advancement of image editing software and AI image generators, distinguishing between authentic and manipulated images has become increasingly difficult.

Most solutions rely on deep learning models that:

* Require high GPU resources
* Lack interpretability
* Use rigid classification thresholds

**AuthentiScan** introduces a lightweight, explainable alternative using statistical image forensics and machine learning.

Instead of learning visual patterns, this system detects **numerical irregularities** caused by manipulation.

---

# 🎥 Demo Screens

### 🔹 Upload Interface
<img width="1902" height="916" alt="image" src="https://github.com/user-attachments/assets/ddc7dc82-b4bd-4abb-b0fa-c66b7f750866" />


### 🔹 Image Analysis (RGB Histogram Comparison)

<img width="1914" height="1079" alt="Screenshot 2026-02-24 214308" src="https://github.com/user-attachments/assets/d85d1685-3564-4a08-988e-73f2f91d1f0d" />

### 🔹 Model Prediction Output

<img width="1908" height="908" alt="Screenshot 2026-02-24 214210" src="https://github.com/user-attachments/assets/a960fa34-bdbb-4036-959e-888f76fd941b" />

---

# 🧠 Problem Statement

* AI image generators are widely accessible
* Photoshop editing is increasingly realistic
* Human visual inspection is unreliable
* Deep learning solutions are expensive and black-box

There is a need for:

✔ Explainable decisions
✔ Lightweight computation
✔ Confidence-aware classification
✔ Real-time deployment capability

---

# 💡 Proposed Solution

Instead of CNNs, this system:

1. Extracts **statistical forensic features**
2. Converts image → numerical feature vector
3. Applies **Random Forest classifier**
4. Uses **confidence-aware decision layer**
5. Calibrates thresholds using RL-inspired optimization

This ensures:

* Interpretability
* Lower computation
* Real-world deployability

---

# 📊 Forensic Features Extracted

Each image is converted into structured numerical features:

### 🔹 1. Entropy

Measures randomness in pixel distribution.

### 🔹 2. Noise Statistics

Detects unnatural smoothing or synthetic noise.

### 🔹 3. Texture (GLCM)

* Contrast
* Homogeneity
* Energy
* Correlation

### 🔹 4. Frequency Domain (FFT)

* Low frequency energy
* High frequency energy
* Spectral ratio

### 🔹 5. Color Channel Statistics

Mean & Std of R, G, B

### 🔹 6. Edge Density

Detects boundary inconsistencies.

### 🔹 7. JPEG Artifact Score

Detects recompression artifacts.

---

# 🧪 Datasets Used

To ensure robustness:

| Dataset          | Purpose               |
| ---------------- | --------------------- |
| CASIA v2         | Authentic vs Tampered |
| PS-Battles       | Edited vs Original    |
| Deepfake Dataset | real vs fake/AI gen   |

Final dataset:

* Balanced
* ~15,000 images
* Binary classification: REAL (0) / FAKE (1)

---

# ⚙️ System Workflow

```
Image Upload
      ↓
Preprocessing
      ↓
Feature Extraction
      ↓
Random Forest Model
      ↓
Confidence-Aware Decision Layer(RL based)
      ↓
Final Prediction
```

---

# 🤖 Machine Learning Model

### Model Used:

Random Forest Classifier

### Why Random Forest?

* Handles non-linearity
* Works well with tabular data
* Robust to noise
* Provides probability output (important for confidence scoring)

### Performance (Balanced Dataset)

* Accuracy: ~71–72%
* Balanced Precision & Recall
* Strong separation in confusion matrix

---

# 🎯 Decision Layer Calibration

Instead of fixed threshold:

| Confidence  | Output             |
| ----------- | ------------------ |
| ≥ 0.75      | FAKE               |
| 0.60 – 0.75 | Likely Manipulated |
| < 0.60      | REAL               |

### RL-Inspired Optimization

* Thresholds dynamically tuned
* Maximizes classification reward
* Reduces false positives
* Improves borderline case reliability

---

# 🏗️ System Architecture

## 🔹 Frontend

* React (Vite)
* Tailwind CSS
* Image preview
* Animated scanning UI
* Confidence bar visualization

## 🔹 Backend

* FastAPI
* REST API
* Joblib model loading
* Threshold configuration

## 🔹 ML & Processing

* Pandas
* NumPy
* Scikit-learn
* OpenCV
* Scikit-image
* SciPy

---

# 📂 Project Structure

```
P1-IMAGEAUTH/
│
├── backend/
│   ├── app.py
│   ├── feature_extractor.py
│   ├── image_auth_model.pkl
│   ├── threshold.txt
│   └── requirements.txt
│
├── data/
│   └── features_15k.csv
│
├── image2stats/
│   ├── casia_clean.py
│   ├── deepfake_clean.py
│   └── ps_battles_clean.py
│
├── notebooks/
│   ├── 02_ml_training_confidence.ipynb
│   └── 03_rl_threshold_optimization.ipynb
│
├── scripts/
│   ├── extract_features.py
│   └── rgb_analysis.py
│
├── frontend/
│
└── README.md
```

---

# 🚀 Setup Guide

## 🔹 Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn app:app --reload
```

Backend:
[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## 🔹 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend:
[http://localhost:5173](http://localhost:5173)

---

# 🔌 API Endpoint

### POST `/predict`

**Request:**
multipart/form-data
Field name: `file`

**Response:**

```json
{
  "prediction": "REAL",
  "confidence": 0.62
}
```

---

# 🔥 Key Advantages

✔ No GPU dependency
✔ Explainable feature-based reasoning
✔ Lightweight and fast
✔ Confidence-aware outputs
✔ RL-inspired threshold tuning
✔ Real-time deployable

---

# ⚠ Limitations

* Accuracy depends on dataset quality
* Extremely high-quality AI images remain challenging
* Binary training (REAL vs FAKE)

---

# 🔮 Future Improvements

* Hybrid statistical + deep learning model
* Multi-class classification (REAL / EDITED / AI)
* Manipulation heatmap localization
* Continuous online threshold learning
* Larger dataset integration

---

# 📄 Research Perspective

This project demonstrates that:

> Statistical image forensics combined with machine learning can provide interpretable, efficient, and practical authenticity detection without relying on deep CNN architectures.

It bridges the gap between classical digital forensics and modern AI-generated image detection.

---

