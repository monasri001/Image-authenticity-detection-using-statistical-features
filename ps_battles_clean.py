# #!/usr/bin/env python3

# import csv
# import os
# import requests
# import hashlib
# import shutil
# import time
# from typing import Optional
# from concurrent.futures import ThreadPoolExecutor, as_completed

# # ================= CONFIG =================

# ORIGINALS_TSV = r"D:\genesys\datasets\psb\originals.tsv"
# PHOTOSHOPS_TSV = r"D:\genesys\datasets\psb\photoshops.tsv"

# RAW_DIR = r"D:\genesys\ps_battles_raw"
# ORIGINALS_DIR = os.path.join(RAW_DIR, "originals")
# PHOTOSHOPS_DIR = os.path.join(RAW_DIR, "photoshops")

# UNIFIED_REAL = r"D:\genesys\unified_dataset\REAL"
# UNIFIED_EDITED = r"D:\genesys\unified_dataset\EDITED"

# FAILED_LOG = r"D:\genesys\psb_failed.log"

# TIMEOUT = 20
# MAX_WORKERS = 5   # SAFE for Imgur

# HEADERS = {
#     "User-Agent": (
#         "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
#         "AppleWebKit/537.36 (KHTML, like Gecko) "
#         "Chrome/120.0.0.0 Safari/537.36"
#     )
# }

# # =========================================


# def ensure_dirs():
#     for d in [ORIGINALS_DIR, PHOTOSHOPS_DIR, UNIFIED_REAL, UNIFIED_EDITED]:
#         os.makedirs(d, exist_ok=True)


# def log_fail(msg: str):
#     with open(FAILED_LOG, "a", encoding="utf-8") as f:
#         f.write(msg + "\n")


# def download_image(url: str, dest: str) -> bool:
#     if os.path.exists(dest):
#         return True

#     try:
#         r = requests.get(url, headers=HEADERS, timeout=TIMEOUT)
#         if r.status_code != 200:
#             return False

#         data = r.content
#         if len(data) < 1000:  # reject HTML / empty responses
#             return False

#         with open(dest, "wb") as f:
#             f.write(data)

#         return True

#     except Exception:
#         return False


# def threaded_download(tasks, label):
#     print(f"⬇️ Downloading {label} images: {len(tasks)} tasks")

#     success = 0
#     with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
#         futures = {
#             executor.submit(download_image, url, dest): name
#             for url, dest, name in tasks
#         }

#         for future in as_completed(futures):
#             name = futures[future]
#             if future.result():
#                 success += 1
#             else:
#                 log_fail(name)

#     print(f"✅ {label} downloaded: {success}/{len(tasks)}")


# def process_originals():
#     tasks = []
#     with open(ORIGINALS_TSV, newline="", encoding="utf-8") as f:
#         reader = csv.reader(f, delimiter="\t")
#         next(reader)

#         for row in reader:
#             img_id, url, ext = row[0], row[1], row[2]
#             raw_path = os.path.join(ORIGINALS_DIR, f"{img_id}.{ext}")
#             unified_path = os.path.join(UNIFIED_REAL, f"psb_real_{img_id}.{ext}")
#             tasks.append((url, raw_path, img_id))

#     threaded_download(tasks, "ORIGINALS")

#     for file in os.listdir(ORIGINALS_DIR):
#         shutil.copy(
#             os.path.join(ORIGINALS_DIR, file),
#             os.path.join(UNIFIED_REAL, f"psb_real_{file}")
#         )


# def process_photoshops():
#     tasks = []
#     with open(PHOTOSHOPS_TSV, newline="", encoding="utf-8") as f:
#         reader = csv.reader(f, delimiter="\t")
#         next(reader)

#         for row in reader:
#             edit_id, original_id, url, ext = row[0], row[1], row[2], row[3]
#             subdir = os.path.join(PHOTOSHOPS_DIR, original_id)
#             os.makedirs(subdir, exist_ok=True)

#             raw_path = os.path.join(subdir, f"{edit_id}.{ext}")
#             unified_path = os.path.join(UNIFIED_EDITED, f"psb_edit_{edit_id}.{ext}")
#             tasks.append((url, raw_path, edit_id))

#     threaded_download(tasks, "PHOTOSHOPS")

#     for root, _, files in os.walk(PHOTOSHOPS_DIR):
#         for file in files:
#             shutil.copy(
#                 os.path.join(root, file),
#                 os.path.join(UNIFIED_EDITED, f"psb_edit_{file}")
#             )


# def sanity_check():
#     real_count = len(os.listdir(UNIFIED_REAL))
#     edited_count = len(os.listdir(UNIFIED_EDITED))

#     print("\n📊 FINAL COUNT")
#     print(f"REAL   : {real_count}")
#     print(f"EDITED : {edited_count}")

#     if real_count == 0 or edited_count == 0:
#         print("❌ ERROR: One class empty")
#     else:
#         print("🎉 PS-Battles download COMPLETE")


# def main():
#     print("🚀 Starting PS-Battles Best-Effort Downloader")
#     ensure_dirs()
#     process_originals()
#     process_photoshops()
#     sanity_check()


# if __name__ == "__main__":
#     main()


#!/usr/bin/env python3

import os
import shutil
import random

# ================= CONFIG =================

PHOTOSHOPS_ROOT = r"D:\genesys\ps_battles_raw\photoshops"
UNIFIED_EDITED  = r"D:\genesys\unified_dataset\EDITED"

IMAGES_PER_FOLDER = 5   # ⬅ set to 5 or 10

VALID_EXTENSIONS = (".jpg", ".jpeg", ".png", ".bmp", ".tif", ".tiff")

RANDOM_SEED = 42  # reproducibility

# =========================================


def ensure_dirs():
    os.makedirs(UNIFIED_EDITED, exist_ok=True)


def sample_and_copy():
    random.seed(RANDOM_SEED)

    total_copied = 0
    folder_count = 0

    print("🚀 Sampling edited images from PS-Battles")

    for folder in os.listdir(PHOTOSHOPS_ROOT):
        folder_path = os.path.join(PHOTOSHOPS_ROOT, folder)

        if not os.path.isdir(folder_path):
            continue

        # Collect valid images in this folder
        images = [
            f for f in os.listdir(folder_path)
            if f.lower().endswith(VALID_EXTENSIONS)
        ]

        if not images:
            continue

        folder_count += 1

        # Sample N images (or all if fewer)
        sample = random.sample(
            images,
            min(IMAGES_PER_FOLDER, len(images))
        )

        for img in sample:
            src = os.path.join(folder_path, img)

            dst_name = f"psb_edit_{folder}_{img}"
            dst = os.path.join(UNIFIED_EDITED, dst_name)

            if not os.path.exists(dst):
                shutil.copy(src, dst)
                total_copied += 1

    print("\n✅ DONE")
    print(f"Folders processed : {folder_count}")
    print(f"Images copied     : {total_copied}")


def main():
    ensure_dirs()
    sample_and_copy()


if __name__ == "__main__":
    main()
