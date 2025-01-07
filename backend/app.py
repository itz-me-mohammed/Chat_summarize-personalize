from flask import Flask, request, jsonify
from transformers import pipeline

app = Flask(__name__)

# Load Hugging Face pipelines
# Note: device=0 ensures the GPU is used if available.
summarizer = pipeline("summarization", model="sshleifer/distilbart-cnn-12-6", device=0)
text_generator = pipeline("text2text-generation", model="google/flan-t5-small", device=0)

@app.route('/api/summarize', methods=['POST'])
def summarize():
    data = request.get_json()
    participant_messages = data.get('messages', [])

    if not participant_messages:
        return jsonify({'error': 'No participant messages provided.'}), 400

    combined_text = "\n".join([f"Participant {i + 1}: {msg}" for i, msg in enumerate(participant_messages)])

    try:
        summary = summarizer(
            combined_text,
            max_length=50,
            min_length=10,
            do_sample=False,
            truncation=True
        )[0]['summary_text']
        return jsonify({'summary': summary})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/personalize', methods=['POST'])
def personalize():
    data = request.get_json()
    central_reply = data.get("central_reply", "")
    participant_contexts = data.get("participant_contexts", [])

    if not central_reply or not participant_contexts:
        return jsonify({"error": "Both 'central_reply' and 'participant_contexts' are required"}), 400

    personalized_replies = []
    for i, context in enumerate(participant_contexts):
        prompt = f"Personalize this reply:\n'{central_reply}'\nFor the context: '{context}'"
        reply = text_generator(prompt, max_length=50, num_return_sequences=1)[0]["generated_text"]
        personalized_replies.append({"participant": i + 1, "reply": reply.strip()})

    return jsonify({"personalized_replies": personalized_replies})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
