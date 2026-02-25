// अपनी API Key यहाँ डालें
const apiKey = 'AIzaSyBvdQrpcGl9wsa_S2IQmTsnNt99L3Pv-qU';

document.addEventListener('DOMContentLoaded', () => {
    const chatBtn = document.getElementById('chat-btn');
    const chatBox = document.getElementById('chat-box');
    const messages = document.getElementById('messages');
    const userInput = document.getElementById('user-input');

    if (!chatBtn || !chatBox || !messages || !userInput) return;

    // चैट बॉक्स खोलना और बंद करना
    chatBtn.addEventListener('click', () => {
        chatBox.style.display = chatBox.style.display === 'none' ? 'flex' : 'none';
    });

    // मैसेज भेजने का फंक्शन
    userInput.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter' && userInput.value.trim() !== '') {
            const text = userInput.value.trim();
            
            // यूजर का मैसेज स्क्रीन पर दिखाएँ
            messages.innerHTML += `<div style="margin-bottom:10px;"><b>आप:</b> ${text}</div>`;
            userInput.value = '';
            messages.scrollTop = messages.scrollHeight;

            try {
                // Gemini 1.5 Flash API को कॉल करना
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{ text: text }]
                        }]
                    })
                });

                const data = await response.json();

                // AI का जवाब दिखाना
                if (data.candidates && data.candidates[0].content) {
                    const aiResponse = data.candidates[0].content.parts[0].text;
                    messages.innerHTML += `<div style="margin-bottom:10px;"><b>Jarvis:</b> ${aiResponse}</div>`;
                } else {
                    messages.innerHTML += `<div style="color:red;"><b>Error:</b> ${data.error ? data.error.message : 'कुछ गड़बड़ हुई'}</div>`;
                }

            } catch (error) {
                messages.innerHTML += `<div style="color:red;"><b>Error:</b> इंटरनेट या कनेक्शन की समस्या है।</div>`;
            }
            messages.scrollTop = messages.scrollHeight;
        }
    });
});