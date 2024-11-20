import os
import requests
from dotenv import load_dotenv


load_dotenv()
PRIVATE_KEY = os.getenv("PRIVATE_KEY")
APP_ID = "your_app_id" 
CLUSTER_NAME = "discoball-responses"

BASE_URL = f"https://data.mongodb-api.com/app/{APP_ID}/endpoint/data/v1"
headers = {
    "Content-Type": "application/json",
    "api-key": PRIVATE_KEY,
}

payload = {
    "dataSource": CLUSTER_NAME,
    "database": "DiscoBallAnswers",
    "collection": "participants",
    "filter": {},
    "limit": 2 
}

response = requests.post(f"{BASE_URL}/action/find", headers=headers, json=payload)

if response.status_code == 200:
    print("Query Results:", response.json())
else:
    print("Error:", response.status_code, response.text)