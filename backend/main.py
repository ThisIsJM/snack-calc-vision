from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
from ultralytics import YOLO
import os
from constants import snack_labels
from  model_utils import save_image_results

app = Flask(__name__)
CORS(app)

model_path = os.path.join(os.path.dirname(__file__), 'best.pt')
model = YOLO(model_path)

@app.route('/', methods=['GET'])
def home():
    return "backend is running"

@app.route('/predict', methods=["POST"])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    # Read the image file and decode in a single step
    file = request.files['image']
    img_data = np.frombuffer(file.read(), np.uint8)
    img = cv2.imdecode(img_data, cv2.IMREAD_COLOR)

    if img is None:
        return jsonify({'error': 'Invalid image format'}), 400

    # Resize the image for faster processing (adjust dimensions as needed)
    img = cv2.resize(img, (256, 256))  # Example resize, change according to your model

    # Perform prediction
    results = model.predict(img)

    # Use a list comprehension for better performance
    objects = [
        {
            'bbox': box.xyxy[0].tolist(),
            'class': snack_labels[int(box.cls[0].item())],
            'confidence': box.conf[0].item()
        }
        for result in results for box in result.boxes
    ]

    # Assuming object is a list of Results objects
    if(len(objects) > 0):
        save_image_results(results)

    return jsonify(objects)

if __name__ == '__main__':
    app.run(host="0.0.0.0",port=5000,debug=True)