#!/usr/bin/env python3

import os
import shutil

# ================= CONFIG =================

CASIA_ROOT = r"D:\genesys\datasets\CASIA2"
CASIA_AU = os.path.join(CASIA_ROOT, "Au")   # Authentic
CASIA_TP = os.path.join(CASIA_ROOT, "Tp")   # Tampered

UNIFIED_REAL = r"D:\genesys\unified_dataset\REAL"
UNIFIED_EDITED = r"D:\genesys\unified_dataset\EDITED"

VALID_EXTENSIONS = (".jpg", ".jpeg", ".png", ".bmp", ".tif", ".tiff")

# =========================================


def ensure_dirs():
    os.makedirs(UNIFIED_REAL, exist_ok=True)
    os.makedirs(UNIFIED_EDITED, exist_ok=True)


def copy_images(src_dir, dst_dir, prefix):
    count = 0

    for file in os.listdir(src_dir):
        if not file.lower().endswith(VALID_EXTENSIONS):
            continue  # skip non-image files

        src = os.path.join(src_dir, file)
        dst = os.path.join(dst_dir, f"{prefix}_{file}")

        if not os.path.exists(dst):
            shutil.copy(src, dst)
            count += 1

    return count


def main():
    print("🚀 Processing CASIA Dataset")
    ensure_dirs()

    real_count = copy_images(CASIA_AU, UNIFIED_REAL, "casia_real")
    edited_count = copy_images(CASIA_TP, UNIFIED_EDITED, "casia_edit")

    print("\n✅ CASIA DONE")
    print(f"REAL images added   : {real_count}")
    print(f"EDITED images added : {edited_count}")


if __name__ == "__main__":
    main()
