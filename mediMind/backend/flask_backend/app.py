from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json.get('text', '')
    result = {
        'length': len(data),
        'uppercase': data.upper()
    }
    return jsonify(result)

if __name__ == '__main__':
    app.run(port=8000)