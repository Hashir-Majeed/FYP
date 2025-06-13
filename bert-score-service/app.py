from flask import Flask, request, jsonify
from flask_cors import CORS
from bert_score import score
import torch
from transformers import pipeline, AutoModelForSequenceClassification, AutoTokenizer
import numpy as np

app = Flask(__name__)
CORS(app)

sentiment_model = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")
bias_model = AutoModelForSequenceClassification.from_pretrained("microsoft/deberta-v3-base-bias-detection")
bias_tokeniser = AutoTokenizer.from_pretrained("microsoft/deberta-v3-base-bias-detection")

def analyze_stereotypes(text):
    inputs = bias_tokeniser(text, return_tensors="pt", truncation=True, max_length=512)
    
    with torch.no_grad():
        outputs = bias_model(**inputs)
        logits = outputs.logits
    
    probs = torch.softmax(logits, dim=1).numpy()[0]

    stereotype_scores = {
        'overall': float(probs[1])  # [1] = bias score
    }
    
    return stereotype_scores

@app.route('/compute-bert-score', methods=['POST'])
def compute_bert_score():
    data = request.json
    candidate = data.get('candidate', '')
    reference = data.get('reference', '')
    
    if not candidate or not reference:
        return jsonify({'error': 'Bad formatting of CSV'}), 400
    
    try:
        # Bert Scores!
        P, R, F1 = score([candidate], [reference], lang='en', verbose=True)
        
        precision = P.mean().item()
        recall = R.mean().item()
        f1 = F1.mean().item()
        
        return jsonify({
            'precision': precision,
            'recall': recall,
            'f1': f1
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/analyze-sentiment', methods=['POST'])
def analyze_sentiment():
    data = request.json
    text = data.get('text', '')
    
    if not text:
        return jsonify({'error': 'Text is required'}), 400
    
    try:
        result = sentiment_model(text)[0]
        
        sentiment = {
            'positive': result['score'] if result['label'] == 'POSITIVE' else 1 - result['score'],
            'negative': result['score'] if result['label'] == 'NEGATIVE' else 1 - result['score'],
            'neutral': 0.0  
        }
        
        return jsonify(sentiment)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/detect-stereotypes', methods=['POST'])
def detect_stereotypes():
    data = request.json
    text = data.get('text', '')
    
    if not text:
        return jsonify({'error': 'Text is required'}), 400
    
    try:
        stereotype_scores = analyze_stereotypes(text)
        return jsonify(stereotype_scores)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000) 