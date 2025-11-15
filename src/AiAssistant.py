# filename: app.py
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Configure Gemini API
GOOGLE_API_KEY = "AIzaSyCT5PVIDAzQFDzjaWthFXBNuPwCGxyuMFk"
genai.configure(api_key=GOOGLE_API_KEY)

SYSTEM_PROMPT = """You are Kyro, a helpful AI assistant for AspireAI. You provide support related to mental health and academics. Be friendly, empathetic, and concise in your responses."""

conversation_history = {}

def get_greeting():
    current_hour = datetime.now().hour
    if current_hour < 12:
        return "Good morning! ☀️"
    elif current_hour < 18:
        return "Good afternoon! 😊"
    else:
        return "Good evening! 🌙"

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.json or {}
        user_input = data.get('message', '')
        session_id = data.get('sessionId', 'default')

        if not user_input:
            return jsonify({"response": "No message provided.", "status": "error"}), 400

        new_session = session_id not in conversation_history
        
        # Quick response for simple greetings - NO API CALL
        user_lower = user_input.lower().strip()
        if user_lower in ['hi', 'hello', 'hey']:
            greeting = get_greeting() if new_session else ""
            response_text = "Hello! 👋 I'm Kyro. I'm here to help you with academics and mental health. What would you like to talk about today?"
            return jsonify({"response": f"{greeting} {response_text}".strip(), "status": "success"})
        
        if 'help' in user_lower:
            response_text = "I can help you with:\n• Study planning and time management\n• Stress and anxiety management\n• Career guidance\n• Academic challenges\n\nWhat do you need help with?"
            return jsonify({"response": response_text, "status": "success"})

        # Initialize Gemini chat for new sessions
        if new_session:
            model = genai.GenerativeModel(
                model_name='gemini-2.0-flash-exp',
                generation_config={
                    "temperature": 0.7,
                    "top_p": 0.95,
                    "max_output_tokens": 500,
                }
            )
            conversation_history[session_id] = model.start_chat(history=[])

        chat = conversation_history[session_id]

        try:
            # Send message to Gemini
            if new_session:
                full_input = f"{SYSTEM_PROMPT}\n\nUser: {user_input}"
            else:
                full_input = user_input
                
            response = chat.send_message(full_input)
            ai_text = response.text

            # Add greeting for new sessions
            if new_session:
                greeting = get_greeting()
                full_response = f"{greeting} {ai_text}"
            else:
                full_response = ai_text

            return jsonify({"response": full_response, "status": "success"})
            
        except Exception as api_error:
            print(f"Gemini API Error: {api_error}")
            return jsonify({"response": "I'm having trouble right now. Please try 'hi' or 'help' for quick responses.", "status": "error"}), 500

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"response": f"Sorry, I encountered an error. Please try again.", "status": "error"}), 500

@app.route('/clear-chat', methods=['POST'])
def clear_chat():
    try:
        data = request.json or {}
        session_id = data.get('sessionId')
        if not session_id:
            return jsonify({"status": "error", "message": "sessionId required"}), 400
        if session_id in conversation_history:
            del conversation_history[session_id]
        return jsonify({"status": "success", "message": "Chat history cleared"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({"status": "ok", "message": "Kyro is running!"})

if __name__ == '__main__':
    print("🚀 Starting Kyro on http://127.0.0.1:5001")
    app.run(debug=True, port=5001, threaded=True, use_reloader=True)
