from http.server import BaseHTTPRequestHandler
import json
import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

class handler(BaseHTTPRequestHandler):

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Content-Type', 'application/json')
        self.end_headers()

        try:
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))

            participant_id = data.get('participant_id')
            responses = data.get('responses')

            password = os.getenv("DB_PASSWORD")
            uri = f"mongodb+srv://spencerau:{password}@discoball-responses.ptrf0.mongodb.net/?retryWrites=true&w=majority&appName=discoball-responses"
            client = MongoClient(uri)
            db = client["DiscoBallAnswers"]
            collection = db["participants"]

            document = {
                "_id": participant_id,
                "responses": responses
            }

            collection.insert_one(document)

            response_data = {
                'status': 'success',
                'participant_id': participant_id,
                'responses': responses
            }
        except Exception as e:
            response_data = {
                'status': 'error',
                'message': str(e)
            }

        self.wfile.write(json.dumps(response_data).encode('utf-8'))