from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
from ultralytics import YOLO
import os
from  model_utils import get_displayed_items, calculate_item_price
from supabase_queries import insert_item_query, insert_transaction_query, get_all_transactions


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

    results = get_displayed_items(img)

    if 'error' in results:
        return jsonify({'error': results['error']}), 400   

    return jsonify(results), 200

@app.route('/calculate-price', methods=["POST"])
def calculate_price():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    # Read the image file and decode in a single step
    file = request.files['image']
    img_data = np.frombuffer(file.read(), np.uint8)
    img = cv2.imdecode(img_data, cv2.IMREAD_COLOR)

    item_prices = calculate_item_price(img)
    return jsonify(item_prices), 200

@app.route('/add-transaction', methods=['POST'])
def handle_insert_transaction():
    data = request.json
    
    # Extract grand total and items from request data
    grand_total = data.get('grand_total')
    item_list = data.get('item_list')
    
    if not grand_total or not item_list:
        return jsonify({"error": "Missing grand_total or items"}), 400

    try:
        # Insert transaction and get transaction ID
        transaction_id = insert_transaction_query(grand_total)
        
        # Insert items into Items table
        for item in item_list:
            item_category_id = item.get('item_category_id')  # Get item category ID
            quantity = item.get('quantity')  # Get item quantity
            
            if not item_category_id or quantity is None:
                return jsonify({"error": "Missing item_category_id or quantity in items"}), 400
            
            insert_item_query(transaction_id, item_category_id, quantity)
        
        return jsonify({"transaction_id": transaction_id}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/get-transactions',methods=["GET"])
def handle_get_transactions():
    response = get_all_transactions()

    return jsonify(response.data), 200


if __name__ == '__main__':
    app.run(host="0.0.0.0",port=5000,debug=True)