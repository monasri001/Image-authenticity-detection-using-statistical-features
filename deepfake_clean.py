#!/usr/bin/env python3

import os
import shutil

# ================= CONFIG =================

TRAIN_ROOT = r"C:\Users\Monasri M\Downloads\Train"
TEST_ROOT  = r"C:\Users\Monasri M\Downloads\Test"

UNIFIED_REAL = r"D:\genesys\unified_dataset\REAL"
UNIFIED_AI   = r"D:\genesys\unified_dataset\AI_GENERATED"

REAL_DIR_NAME = "real"   # change if your folder name differs
FAKE_DIR_NAME = "fake"   # change if your folder name differs

VALID_EXTENSIONS = (".jpg", ".jpeg", ".png", ".bmp", ".tif", ".tiff")

# =========================================


def ensure_dirs():
    os.makedirs(UNIFIED_REAL, exist_ok=True)
    os.makedirs(UNIFIED_AI, exist_ok=True)


def copy_images(src_dir, dst_dir, prefix):
    count = 0

    if not os.path.exists(src_dir):
        return count

    for file in os.listdir(src_dir):
        if not file.lower().endswith(VALID_EXTENSIONS):
            continue

        src = os.path.join(src_dir, file)
        dst = os.path.join(dst_dir, f"{prefix}_{file}")

        if not os.path.exists(dst):
            shutil.copy(src, dst)
            count += 1

    return count


def process_split(root_dir, split_name):
    real_src = os.path.join(root_dir, REAL_DIR_NAME)
    fake_src = os.path.join(root_dir, FAKE_DIR_NAME)

    real_count = copy_images(real_src, UNIFIED_REAL, f"df_{split_name}_real")
    fake_count = copy_images(fake_src, UNIFIED_AI, f"df_{split_name}_ai")

    return real_count, fake_count


def main():
    print("🚀 Processing Deepfake Dataset (Train + Test, separate folders)")
    ensure_dirs()

    train_real, train_fake = process_split(TRAIN_ROOT, "train")
    test_real, test_fake   = process_split(TEST_ROOT, "test")

    print("\n✅ DEEPFAKE DATASET DONE")
    print(f"TRAIN → REAL: {train_real}, AI: {train_fake}")
    print(f"TEST  → REAL: {test_real}, AI: {test_fake}")
    print(f"TOTAL → REAL: {train_real + test_real}, AI: {train_fake + test_fake}")


if __name__ == "__main__":
    main()
