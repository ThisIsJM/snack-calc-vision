from datetime import datetime
from PIL import Image

def save_image_results(results):
    for i, result in enumerate(results):
        # Plot detection results on the image
        annotated_image = result.plot()  # This returns an annotated image

        # Convert the NumPy array to a Pillow Image
        annotated_image_pil = Image.fromarray(annotated_image)

        # Create the filename with the timestamp
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"./results/img_{timestamp}_{i}.jpg"  # Adding index to filename if multiple results

        # Save the annotated image
        annotated_image_pil.save(filename)