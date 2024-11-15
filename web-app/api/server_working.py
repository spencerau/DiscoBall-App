from http.server import BaseHTTPRequestHandler
import json

class handler(BaseHTTPRequestHandler):

    def do_POST(self):
        # Parse the Content-Length header to know how much data to read
        content_length = int(self.headers.get('Content-Length', 0))
        # Read the POST data
        post_data = self.rfile.read(content_length)
        # Decode and parse the JSON data
        data = json.loads(post_data.decode('utf-8'))

        # Extract data from the JSON payload
        participant_id = data.get('participant_id')
        responses = data.get('responses')

        # Process the data as needed
        # For demonstration, we'll just prepare a response

        # Prepare response data
        response_data = {
            'status': 'success',
            'participant_id': participant_id,
            'responses': responses
        }

        # Send HTTP headers
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()

        # Write response
        self.wfile.write(json.dumps(response_data).encode('utf-8'))