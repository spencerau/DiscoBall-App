import json
from pymongo import MongoClient
from datetime import datetime

def handler(event, context):
    #TODO: add mongodb connection uri; need to do this in a secure way
    client = MongoClient("mongodb_connection_uri")
    db = client["DiscoBallAnswers"]
    collection = db["participants"]

    try:
        data = json.loads(event['body'])
        participant_id = data.get("participant_id")
        responses = data.get("responses")

        if not participant_id or not responses:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "Missing participant ID or responses"})
            }

        document = {
            "_id": participant_id,
            "responses": responses,
            "createdAt": datetime.utcnow()
        }

        collection.insert_one(document)

        return {
            "statusCode": 201,
            "body": json.dumps({"message": "Survey response saved successfully"})
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }