import cv2
import numpy as np
import matplotlib.pyplot as plt

def plot_rgb_histogram_line(image_path, title="RGB Histogram"):
    # Read image
    image = cv2.imread(image_path)
    if image is None:
        raise ValueError("Image path is incorrect or image not found")

    # Split BGR channels
    b, g, r = cv2.split(image)

    # Calculate histograms (256 bins, range 0–256)
    hist_r = cv2.calcHist([r], [0], None, [256], [0, 256])
    hist_g = cv2.calcHist([g], [0], None, [256], [0, 256])
    hist_b = cv2.calcHist([b], [0], None, [256], [0, 256])

    # Flatten histograms
    hist_r = hist_r.flatten()
    hist_g = hist_g.flatten()
    hist_b = hist_b.flatten()

    # Intensity values
    x = np.arange(256)

    # Plot
    plt.figure(figsize=(8, 5))

    plt.plot(x, hist_b, color='blue', linewidth=1.5, label='Blue')
    plt.plot(x, hist_g, color='green', linewidth=1.5, label='Green')
    plt.plot(x, hist_r, color='red', linewidth=1.5, label='Red')

    plt.xlabel("Pixel Intensity (0–255)")
    plt.ylabel("Number of Pixels")
    plt.title(title)
    plt.legend()
    plt.grid(True)
    plt.tight_layout()
    plt.show()

# plot_rgb_histogram_line(
#     "D:\\genesys\\ai-generated-8954406_1280.jpg",
#     title="RGB Histogram – Sample Image"
# ) #AI image

plot_rgb_histogram_line(
    r"D:\genesys\fakeme.png",
    title="RGB Histogram – fake Image"
) #AI image



# plot_rgb_histogram_line(
#     r"D:\genesys\edited.jpeg",
#     title="RGB Histogram – Sample Image"
# )


