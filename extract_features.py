#!/usr/bin/env python3

import os
import cv2
import numpy as np
import pandas as pd
import random
import time
from scipy.stats import entropy
from skimage.feature import graycomatrix, graycoprops
from scipy.fft import fft2, fftshift
from PIL import Image
from io import BytesIO

# ================= CONFIG =================

DATASET_ROOT = r"D:\genesys\unified_dataset"
OUTPUT_CSV   = r"D:\image_authenticity_project\data\features_15k.csv"

MAX_IMAGES_PER_CLASS = 5000
RANDOM_SEED = 42

LABEL_MAP = {
    "REAL": 0,
    "EDITED": 1,
    "AI_GENERATED": 2
}

VALID_EXT = (".jpg", ".jpeg", ".png", ".bmp", ".tif", ".tiff")

# =========================================


def compute_entropy(gray):
    hist = cv2.calcHist([gray], [0], None, [256], [0,256])
    hist = hist.flatten()
    hist = hist / (hist.sum() + 1e-8)
    return entropy(hist)


def noise_features(gray):
    median = cv2.medianBlur(gray, 3)
    noise = gray.astype(np.float32) - median.astype(np.float32)
    return np.var(noise), np.mean(np.abs(noise))


def glcm_features(gray):
    glcm = graycomatrix(gray, [1], [0], 256, symmetric=True, normed=True)
    return (
        graycoprops(glcm, 'contrast')[0,0],
        graycoprops(glcm, 'homogeneity')[0,0],
        graycoprops(glcm, 'energy')[0,0],
        graycoprops(glcm, 'correlation')[0,0]
    )


def fft_features(gray):
    f = fftshift(fft2(gray))
    mag = np.abs(f)

    h, w = mag.shape
    center = mag[h//4:3*h//4, w//4:3*w//4]

    low_energy = np.sum(center)
    high_energy = np.sum(mag) - low_energy
    ratio = high_energy / (low_energy + 1e-8)

    return low_energy, high_energy, ratio


def edge_density(gray):
    edges = cv2.Canny(gray, 100, 200)
    return np.sum(edges > 0) / edges.size


def jpeg_artifact_score(image_path):
    try:
        img = Image.open(image_path).convert("RGB")
        buffer = BytesIO()
        img.save(buffer, format="JPEG", quality=95)
        recompressed = Image.open(BytesIO(buffer.getvalue()))
        diff = np.abs(
            np.array(img).astype(np.float32) -
            np.array(recompressed).astype(np.float32)
        )
        return np.mean(diff)
    except:
        return 0.0


def process_image(image_path, label):
    img = cv2.imread(image_path)
    if img is None:
        return None

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    noise_var, noise_energy = noise_features(gray)
    glcm_c, glcm_h, glcm_e, glcm_corr = glcm_features(gray)
    fft_low, fft_high, fft_ratio = fft_features(gray)

    return {
        "image_id": os.path.basename(image_path),
        "label": label,

        "entropy_gray_mean": compute_entropy(gray),
        "entropy_gray_std": np.std(gray),

        "noise_variance": noise_var,
        "noise_energy": noise_energy,

        "glcm_contrast": glcm_c,
        "glcm_homogeneity": glcm_h,
        "glcm_energy": glcm_e,
        "glcm_correlation": glcm_corr,

        "fft_low_freq_energy": fft_low,
        "fft_high_freq_energy": fft_high,
        "fft_ratio": fft_ratio,

        "channel_r_mean": np.mean(img[:,:,2]),
        "channel_r_std": np.std(img[:,:,2]),
        "channel_g_mean": np.mean(img[:,:,1]),
        "channel_g_std": np.std(img[:,:,1]),
        "channel_b_mean": np.mean(img[:,:,0]),
        "channel_b_std": np.std(img[:,:,0]),

        "edge_density": edge_density(gray),
        "jpeg_artifact_score": jpeg_artifact_score(image_path)
    }


def main():
    rows = []
    random.seed(RANDOM_SEED)

    print("🚀 Feature extraction started")
    overall_start = time.time()

    for class_name, label in LABEL_MAP.items():
        folder = os.path.join(DATASET_ROOT, class_name)

        if not os.path.exists(folder):
            print(f"⚠ Missing folder: {folder}")
            continue

        all_files = sorted(
            f for f in os.listdir(folder)
            if f.lower().endswith(VALID_EXT)
        )

        sample_size = min(MAX_IMAGES_PER_CLASS, len(all_files))
        sampled_files = random.sample(all_files, sample_size)

        print(f"\n▶ {class_name} | Images: {sample_size}")
        class_start = time.time()

        for idx, file in enumerate(sampled_files, start=1):
            path = os.path.join(folder, file)
            features = process_image(path, label)

            if features:
                rows.append(features)

            if idx % 25 == 0 or idx == sample_size:
                elapsed = time.time() - class_start
                print(f"  {class_name}: {idx}/{sample_size} ({elapsed:.1f}s)")

        print(f"✔ {class_name} completed")

    df = pd.DataFrame(rows)
    df.to_csv(OUTPUT_CSV, index=False)

    print("\n✅ FEATURE EXTRACTION DONE")
    print(f"Rows written: {len(df)}")
    print(f"Saved to: {OUTPUT_CSV}")
    print(f"Total time: {time.time() - overall_start:.1f}s")


if __name__ == "__main__":
    main()
