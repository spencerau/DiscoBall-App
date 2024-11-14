# api/server.py

from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/api/server', methods=['POST'])
def handler():
    import sys
    print("Python version:", sys.version)

    import json
    import os
    from datetime import datetime
    from pymongo.mongo_client import MongoClient
    from pymongo.server_api import ServerApi
    from dotenv import load_dotenv

    # Load environment variables
    load_dotenv()

    password = os.getenv("DB_PASSWORD")
    if not password:
        return jsonify({"error": "DB_PASSWORD environment variable not set"}), 500

    uri = f"mongodb+srv://spencerau:{password}@discoball-responses.ptrf0.mongodb.net/?retryWrites=true&w=majority&appName=discoball-responses"

    client = MongoClient(uri, server_api=ServerApi('1'))

    # Test MongoDB connection with ping
    try:
        client.admin.command('ping')
        print("Pinged your deployment. You successfully connected to MongoDB!")
    except Exception as e:
        print("MongoDB connection error:", e)
        return jsonify({"error": "Failed to connect to MongoDB"}), 500

    db = client["DiscoBallAnswers"]
    collection = db["participants"]

    try:
        data = request.get_json()
        participant_id = data.get("participant_id")
        responses = data.get("responses")

        if not participant_id or not responses:
            return jsonify({"error": "Missing participant ID or responses"}), 400

        document = {
            "_id": participant_id,
            "responses": responses,
            "createdAt": datetime.utcnow()
        }

        collection.insert_one(document)

        return jsonify({"message": "Survey response saved successfully"}), 201
    except Exception as e:
        print("Error in handler:", e)
        return jsonify({"error": str(e)}), 500

# Remove the 'app.run()' block; Vercel handles the server startup