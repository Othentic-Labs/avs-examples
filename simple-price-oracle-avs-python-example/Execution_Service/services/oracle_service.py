import os
import requests
from dotenv import load_dotenv

load_dotenv()  # Load environment variables

@staticmethod
def get_price(pair):
    try:
        response = requests.get(f"https://api.binance.com/api/v3/ticker/price?symbol={pair}")
        response.raise_for_status()  # Raise an error for HTTP issues
        return response.json()
    except requests.exceptions.RequestException as err:
        print(f"Binance API error: {err}")
        return None

