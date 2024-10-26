import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_PRIVATE_KEY")

supabase = create_client(url, key)

def fetch_item_categories():
    # Fetch item categories from the database
    response = supabase.table('Item_Categories').select('*').execute()

    print(response)
    
    if not response.data:
        raise Exception("Error fetching item categories: No data returned.")
    
    return response.data 

def insert_transaction_query(grand_total):
    # Insert into Transactions table
    transaction_response = supabase.table('Transactions').insert({
        'grand_total': grand_total
    }).execute()
    
    if not transaction_response.data:
        raise Exception("Error inserting transaction: No data returned.")
    
    return transaction_response.data[0]['id']  # Return the newly created transaction ID

def insert_item_query(transaction_id, item_category_id, quantity):
    # Insert into Items table
    item_response = supabase.table('Items').insert({
        'transaction_id': transaction_id,
        'item_category_id': item_category_id,
        'quantity': quantity
    }).execute()

def get_all_transactions():
    return supabase.rpc("get_all_transactions").execute()

