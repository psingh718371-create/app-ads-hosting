const apiKey = 'AIzaSyAlFShnTdBnDl0mc8PX46sLGx96-_MmeVM';

document.addEventListener('DOMContentLoaded', () => {
    const chatBtn = document.getElementById('chat-btn');
    const chatBox = document.getElementById('chat-box');
    const messages = document.getElementById('messages');
    const userInput = document.getElementById('user-input');

    if (!chatBtn || !chatBox || !messages || !userInput) return;

    chatBtn.addEventListener('click', () => {
        chatBox.style.display = chatBox.style.display === 'none' ? 'flex' : 'none';
    });

    userInput.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter' && userInput.value.trim() !== '') {
            const text = userInput.value.trim();
            messages.innerHTML += `<div style="margin-bottom:10px;"><b>आप:</b> ${text}</div>`;
            userInput.value = '';
            messages.scrollTop = messages.scrollHeight;

            try {
                const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contents: [{ parts: [{ text: text }] }] })
                });

                const data = await response.json();

                if (data.candidates && data.candidates[0].content) {
                    const aiResponse = data.candidates[0].content.parts[0].text;
                    messages.innerHTML += `<div style="margin-bottom:10px;"><b>Jarvis:</b> ${aiResponse}</div>`;
                } else {
                    messages.innerHTML += `<div style="color:red;"><b>Error:</b> ${data.error ? data.error.message : 'API Issue'}</div>`;
                }
            } catch (error) {
                // यहाँ वो 'catch' है जो आपके पिछले कोड में गायब था
                console.error(error);
                messages.innerHTML += `<div style="color:red;"><b>Error:</b> कनेक्शन की समस्या है।</div>`;
            }
            messages.scrollTop = messages.scrollHeight;
        }
    });
});