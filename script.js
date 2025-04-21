const API_KEY = "AIzaSyA2nDfI8ofYHjskbpMHMozv6Gnk_JRcoKo";

async function generate(prompt) {
    const systemPrompt = `You are a perfume recommendation expert. Provide brief, concise recommendations.
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
    • Focus on perfumes available in India`;

    const fullPrompt = `${systemPrompt}\n\n${prompt}`;

    try {
        const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=' + API_KEY, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: fullPrompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`API request failed with status ${response.status}: ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        
        // Check if the response has the expected structure
        if (!data || !data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0]) {
            throw new Error('Unexpected API response format');
        }

        // Check for any API-level errors
        if (data.error) {
            throw new Error(data.error.message || 'API returned an error');
        }

        const text = data.candidates[0].content.parts[0].text;
        if (!text) {
            throw new Error('No text generated from the API');
        }

        return text;
    } catch (error) {
        console.error('Error details:', error);
        return `An error occurred while generating recommendations: ${error.message}`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const budgetSlider = document.getElementById('budget');
    if (budgetSlider) {
        budgetSlider.addEventListener('input', function() {
            document.getElementById('priceValue').textContent = '₹' + this.value;
        });
    }
});

async function getRecommendation() {
    // Store form data in sessionStorage
    const formData = {
        gender: document.getElementById('gender').value,
        occasion: document.getElementById('occasion').value,
        budget: document.getElementById('budget').value,
        mood: document.getElementById('mood').value
    };
    sessionStorage.setItem('perfumeFormData', JSON.stringify(formData));
    
    // Redirect to results page
    window.location.href = 'results.html';
}