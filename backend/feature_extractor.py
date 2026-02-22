import cv2
import numpy as np
from scipy.stats import entropy
from skimage.feature import graycomatrix, graycoprops
from scipy.fft import fft2, fftshift
from PIL import Image
from io import BytesIO


def extract_features_from_bytes(image_bytes):
    # Load image from bytes
    img = Image.open(BytesIO(image_bytes)).convert("RGB")
    img_np = np.array(img)

    # Grayscale (force uint8 for GLCM safety)
    gray = cv2.cvtColor(img_np, cv2.COLOR_RGB2GRAY).astype(np.uint8)

    # ================= ENTROPY =================
    hist = cv2.calcHist([gray], [0], None, [256], [0, 256]).flatten()
    hist = hist / (hist.sum() + 1e-8)
    entropy_val = entropy(hist)
    entropy_std = np.std(gray)

    # ================= NOISE =================
    median = cv2.medianBlur(gray, 3)
    noise = gray.astype(np.float32) - median.astype(np.float32)
    noise_var = np.var(noise)
    noise_energy = np.mean(np.abs(noise))

    # ================= GLCM =================
    glcm = graycomatrix(
        gray,
        distances=[1],
        angles=[0],
        levels=256,
        symmetric=True,
        normed=True
    )

    contrast = graycoprops(glcm, 'contrast')[0, 0]
    homogeneity = graycoprops(glcm, 'homogeneity')[0, 0]
    energy = graycoprops(glcm, 'energy')[0, 0]
    correlation = graycoprops(glcm, 'correlation')[0, 0]

    # ================= FFT =================
    f = fftshift(fft2(gray))
    mag = np.abs(f)

    h, w = mag.shape
    center = mag[h // 4: 3 * h // 4, w // 4: 3 * w // 4]

    low_energy = np.sum(center)
    high_energy = np.sum(mag) - low_energy
    fft_ratio = high_energy / (low_energy + 1e-8)

    # ================= COLOR CHANNELS =================
    r_mean, r_std = img_np[:, :, 0].mean(), img_np[:, :, 0].std()
    g_mean, g_std = img_np[:, :, 1].mean(), img_np[:, :, 1].std()
    b_mean, b_std = img_np[:, :, 2].mean(), img_np[:, :, 2].std()

    # ================= EDGE DENSITY =================
    edges = cv2.Canny(gray, 100, 200)
    edge_density = np.sum(edges > 0) / edges.size

    # ================= JPEG ARTIFACT (IN-MEMORY SAFE) =================
    buffer = BytesIO()
    img.save(buffer, format="JPEG", quality=95)
    buffer.seek(0)

    recompressed = Image.open(buffer).convert("RGB")
    recompressed_np = np.array(recompressed)

    diff = np.abs(
        img_np.astype(np.float32) -
        recompressed_np.astype(np.float32)
    )
    jpeg_score = np.mean(diff)

    # ================= FINAL FEATURE VECTOR =================
    features = [
        entropy_val, entropy_std,
        noise_var, noise_energy,
        contrast, homogeneity, energy, correlation,
        low_energy, high_energy, fft_ratio,
        r_mean, r_std,
        g_mean, g_std,
        b_mean, b_std,
        edge_density,
        jpeg_score
    ]

    return np.array(features, dtype=np.float32).reshape(1, -1)
