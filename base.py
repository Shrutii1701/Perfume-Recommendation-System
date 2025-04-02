import google.generativeai as genai
from flask import Flask, request, render_template, jsonify, send_file
import os

app = Flask(__name__)
genai.configure(api_key="AIzaSyA2nDfI8ofYHjskbpMHMozv6Gnk_JRcoKo")
model = genai.GenerativeModel("gemini-2.0-flash")

def generate(prompt):
    system_prompt = """You are a perfume recommendation expert. Provide brief, concise recommendations.
    For each perfume, use this exact format:
    
    • Perfume #1:
      • Brand & Name: [Keep it short]
      • Notes: [List 2-3 key notes only]
      • Price: [₹ amount]
      • Best For: [1-2 words]
      • Quick Description: [Maximum 10 words]

    Important Guidelines:
    • Provide exactly 3 perfumes
    • Keep all descriptions extremely brief
    • Use only bullet points
    • Include prices in ₹ (INR)
    • Match the specified gender, occasion, budget, and mood
    • Focus on perfumes available in India"""
    
    full_prompt = f"{system_prompt}\n\n{prompt}"
    response = model.generate_content(full_prompt)
    return response.text

@app.route('/')
def home():
    return send_file('index.html')

@app.route('/generate', methods=['POST'])
def get_recommendation():
    prompt = request.json.get('prompt', '')
    result = generate(prompt)
    return jsonify({'result': result})

if __name__ == '__main__':
    app.run(debug=True)