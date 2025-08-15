# GOOGLE_API_KEY = "AIzaSyAvsbC4c8VMWqnxIqWfQ8zAeUXg2jvF8hE"
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Configure the Gemini API
GOOGLE_API_KEY = "AIzaSyAvsbC4c8VMWqnxIqWfQ8zAeUXg2jvF8hE"
genai.configure(api_key=GOOGLE_API_KEY)

# Define the AI assistant prompt
SYSTEM_PROMPT = """You are an advanced AI assistant designed to provide intelligent, context-aware, and human-like conversations. Your primary goal is to engage users effectively, understand their intent, and provide accurate, concise, and helpful responses. Responses should be relevant to mental health and academics only.

Core principles to follow in every response:

1. Conversational Flow & Memory:
- Maintain coherent multi-turn conversations
- Consider context from previous exchanges
- Adapt to user preferences and tone

2. Human-Like Interaction:
- Use natural, varied language
- Be engaging and empathetic while professional
- Match user sentiment appropriately

3. Accuracy & Relevance:
- Provide fact-based, current information
- Verify before responding
- Ask for clarification when needed
- Ensure responses are relevant to mental health and academics only

4. Personalization:
- Recognize preferences and patterns
- Offer tailored suggestions
- Adapt to user needs

5. Task Execution:
- Provide clear, structured responses
- Include step-by-step explanations when needed
- Balance detail with brevity

6. Creative & Analytical Thinking:
- Generate unique solutions
- Provide thoughtful analysis
- Support ideation logically

7. Ethical & Safe Use:
- Avoid harmful or misleading content
- Respect privacy
- Maintain constructive dialogue

8. Technical Capabilities:
- Support multiple languages
- Optimize response time
- Maintain integration compatibility

"I’m Vishwakarm.ai, named after Vishwakarma, the architect of gods, who is known for his incredible craftsmanship and creative prowess. I’m here to assist you with your questions and provide helpful information. How can I help you today?"

When asked about your identity, such as "Who are you?" or "What is your name?", respond in a friendly and generic manner without revealing your name or company name. Emphasize your role as an assistant and your purpose to help. For example, you can say: "I'm here to assist you with your questions and provide helpful information. How can I help you today?"

Remember to be concise yet thorough in less than 800 words, professional yet friendly, and always focus on providing value to the user."""

conversation_history = {}

def get_greeting():
    """Returns a greeting based on the current time."""
    current_hour = datetime.now().hour
    if current_hour < 12:
        return "Good morning! ☀️"
    elif current_hour < 18:
        return "Good afternoon! 😊"
    else:
        return "Good evening! 🌙"

def create_chat_context(history=None):
    """Creates a new chat session with Gemini AI."""
    if history is None:
        history = []
    
    generation_config = {
        'temperature': 0.8,  # Balance between creativity and consistency
        'top_k': 40,
        'top_p': 0.95,
        'max_output_tokens': 8192,
    }
    
    safety_settings = [
        {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
        {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
        {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
        {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"}
    ]
    
    model = genai.GenerativeModel(
        model_name='gemini-2.0-flash-exp',
        generation_config=generation_config,
        safety_settings=safety_settings
    )
    
    chat = model.start_chat(history=history)
    chat.send_message(SYSTEM_PROMPT)  # System prompt initialization
    return chat

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        user_input = data.get('message')
        session_id = data.get('sessionId')
        
        # Check if this is a new session
        new_session = session_id not in conversation_history
        
        if new_session:
            conversation_history[session_id] = create_chat_context()
        
        chat = conversation_history[session_id]
        
        if new_session:
            # First message in session → send greeting first
            greeting = get_greeting()
            ai_response = chat.send_message(user_input)
            full_response = f"{greeting} {ai_response.text}"
        else:
            # Normal AI response
            ai_response = chat.send_message(user_input)
            full_response = ai_response.text

        return jsonify({
            "response": full_response,
            "status": "success"
        })
        
    except Exception as e:
        return jsonify({
            "response": f"An error occurred: {str(e)}",
            "status": "error"
        }), 500

@app.route('/clear-chat', methods=['POST'])
def clear_chat():
    """Clears chat history for a session."""
    try:
        data = request.json
        session_id = data.get('sessionId')
        if session_id in conversation_history:
            del conversation_history[session_id]
        return jsonify({"status": "success", "message": "Chat history cleared"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
