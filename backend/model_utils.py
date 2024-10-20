from ultralytics import YOLO
from datetime import datetime
from PIL import Image
import cv2
import os
import json

model_path = os.path.join(os.path.dirname(__file__), 'best.pt')
model = YOLO(model_path)

with open('item_list.json') as json_file:
    item_list = json.load(json_file)

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

def predict_displayed_items(img):
    if img is None:
        return ({'error': 'Invalid image format'})

    # Resize the image for faster processing (adjust dimensions as needed)
    img = cv2.resize(img, (256, 256))  # Example resize, change according to your model

    # Perform prediction
    results = model.predict(img)

    # Use a list comprehension for better performance
    objects = [
        {
            'bbox': box.xyxy[0].tolist(),
            'class': item_list[int(box.cls[0].item())]['name'],
            'confidence': box.conf[0].item()
        }
        for result in results for box in result.boxes
    ]

    return objects

def calculate_item_price(items):
    return