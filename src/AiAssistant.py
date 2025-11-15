# filename: app.py
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from datetime import datetime
import time

app = Flask(__name__)
CORS(app)

# Configure the Gemini API with hardcoded key
GOOGLE_API_KEY = "AIzaSyAUzK6z5TDASTiOHhDAIK3gEf7Ga3ppXmQ"
genai.configure(api_key=GOOGLE_API_KEY)

# Use gemini-2.0-flash which is fast and available
DEFAULT_MODEL_NAME = "gemini-2.0-flash"

SYSTEM_PROMPT = """You are Vishwakarm.ai, a helpful AI assistant for AspireAI. You provide support related to mental health and academics. Be friendly, empathetic, and concise in your responses."""

conversation_history = {}

def get_greeting():
    current_hour = datetime.now().hour
    if current_hour < 12:
        return "Good morning! ☀️"
    elif current_hour < 18:
        return "Good afternoon! 😊"
    else:
        return "Good evening! 🌙"

def safe_send_message(chat, message_text, max_retries=2):
    """Send message to chat with a retry on transient errors."""
    attempt = 0
    while True:
        try:
            resp = chat.send_message(message_text)
            # resp may have .text or .content depending on SDK; handle both
            if hasattr(resp, "text"):
                return resp
            # some SDK versions return a dict or object with 'candidates'
            if hasattr(resp, "candidates") and len(resp.candidates) > 0:
                return resp.candidates[0]
            return resp
        except Exception as e:
            attempt += 1
            if attempt > max_retries:
                raise
            time.sleep(1.0 * attempt)

def create_chat_context(history=None):
    """Creates a new chat session with a compatible Gemini model."""
    if history is None:
        history = []

    # generation config - keep tokens reasonable and compatible with model
    generation_config = {
        "temperature": 0.7,
        "top_k": 40,
        "top_p": 0.95,
        "max_output_tokens": 1024,
    }

    safety_settings = [
        {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
        {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
        {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
        {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"}
    ]

    # Create the model/chat object with a supported model name
    model = genai.GenerativeModel(
        model_name=DEFAULT_MODEL_NAME,
        generation_config=generation_config,
        safety_settings=safety_settings
    )

    chat = model.start_chat(history=history)
    return chat

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.json or {}
        user_input = data.get('message', '')
        session_id = data.get('sessionId', 'default')

        if not user_input:
            return jsonify({"response": "No message provided.", "status": "error"}), 400

        new_session = session_id not in conversation_history

        if new_session:
            conversation_history[session_id] = create_chat_context()

        chat = conversation_history[session_id]

        # Add system context if new session
        full_user_input = user_input
        if new_session:
            full_user_input = f"{SYSTEM_PROMPT}\n\nUser: {user_input}"

        # send user's message safely with retry
        resp_obj = safe_send_message(chat, full_user_input)
        # extract text in a resilient way
        if hasattr(resp_obj, "text"):
            ai_text = resp_obj.text
        elif hasattr(resp_obj, "content"):
            ai_text = resp_obj.content
        elif isinstance(resp_obj, dict) and "text" in resp_obj:
            ai_text = resp_obj["text"]
        else:
            # fallback: string representation
            ai_text = str(resp_obj)

        if new_session:
            greeting = get_greeting()
            full_response = f"{greeting} {ai_text}"
        else:
            full_response = ai_text

        return jsonify({"response": full_response, "status": "success"})

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"response": f"An error occurred: {str(e)}", "status": "error"}), 500

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

@app.route('/list-models', methods=['GET'])
def list_models():
    """
    List available models for the current API key (helpful to debug which Gemini models you can use).
    """
    try:
        models = genai.list_models()
        # return model names and brief info
        model_list = [{"name": m.model_name if hasattr(m, "model_name") else getattr(m, "name", str(m)),
                       "description": getattr(m, "description", "")} for m in models]
        return jsonify({"models": model_list, "status": "success"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    # run with: GOOGLE_API_KEY=... python app.py
    app.run(debug=True, port=5000)
