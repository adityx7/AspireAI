from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai

app = Flask(__name__)
CORS(app)

genai.configure(api_key="AIzaSyAUzK6z5TDASTiOHhDAIK3gEf7Ga3ppXmQ")

@app.route('/chat', methods=['POST'])
def chat():
    print("🔵 Request received!")
    try:
        data = request.json
        user_input = data.get('message', 'hello')
        print(f"📨 Message: {user_input}")
        
        model = genai.GenerativeModel('gemini-2.0-flash')
        response = model.generate_content(user_input)
        
        print(f"✅ Response generated")
        return jsonify({"response": response.text, "status": "success"})
    except Exception as e:
        print(f"❌ Error: {e}")
        return jsonify({"response": str(e), "status": "error"}), 500

if __name__ == '__main__':
    print("🚀 Starting AI service on port 5001...")
    app.run(debug=False, host='127.0.0.1', port=5001, threaded=True)
