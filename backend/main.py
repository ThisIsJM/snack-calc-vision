from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
from ultralytics import YOLO
import os
from  model_utils import predict_displayed_items

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

    results = predict_displayed_items(img)

    if 'error' in results:
        return jsonify({'error': results['error']}), 400

    return jsonify(results), 200

# @app.route('/calculate-price', methods=["POST"])
# def calculate_price():
#     if 'image' not in request.files:
#         return jsonify({'error': 'No image provided'}), 400

#     # Read the image file and decode in a single step
#     file = request.files['image']
#     img_data = np.frombuffer(file.read(), np.uint8)
#     img = cv2.imdecode(img_data, cv2.IMREAD_COLOR)

#     results = predict_displayed_items(img)







if __name__ == '__main__':
    app.run(host="0.0.0.0",port=5000,debug=True)