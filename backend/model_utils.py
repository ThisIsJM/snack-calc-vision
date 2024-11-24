from ultralytics import YOLO
from datetime import datetime
from PIL import Image
import cv2
from supabase_queries import fetch_item_categories
import os

model_path = os.path.join(os.path.dirname(__file__), 'best.pt')
model = YOLO(model_path)

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

def predict_from_image(img):
    if img is None:
        return ({'error': 'Invalid image format'})

    # Resize the image for faster processing (adjust dimensions as needed)
    img = cv2.resize(img, (480, 480))  # Example resize, change according to your model
    return model.predict(img)

def get_displayed_items(img):
    item_categories = fetch_item_categories()
    results = predict_from_image(img)

    if 'error' in results:
        return results 

    objects = [
        {
            'bbox': box.xyxy[0].tolist(),
            'class':  item_categories[int(box.cls[0].item())]["name"],
            'confidence': box.conf[0].item()
        }
        for result in results for box in result.boxes
    ]

    return objects

def calculate_item_price(img):
    item_categories = fetch_item_categories()
    results = predict_from_image(img)

    if 'error' in results:
        return results 
    
    if(len(results) <= 0):
        return {
            'item_list': [],
            'grand_total': 0
        }
    
    #return array of object with these properties (item, quantity, total_price) from results
    item_details = []
    item_counts = {}

    for result in results:
        for box in result.boxes:
            class_id = int(box.cls[0].item())

            item_name = item_categories[class_id]["name"]
            price_per_item = item_categories[class_id]['price'] 

            #Count occurances for quantity
            if item_name in item_counts:
                item_counts[item_name]['quantity'] += 1
            else:
                item_counts[item_name] = {
                    'name': item_name,
                    'item_category_id': class_id + 1, #class_id is a zero based index while database id's starts at 1
                    'quantity': 1,
                    'price': price_per_item
                }

    grand_total = 0

    for item in item_counts.values():
        item['total_price'] = item['quantity'] * item['price']
        grand_total += item['total_price']

        item_details.append({
            'name': item['name'],
            'item_category_id': item['item_category_id'],
            'quantity': item['quantity'],
            'total_price': item['total_price']
        })

    return {
        'item_list': item_details,
        'grand_total': grand_total
    }