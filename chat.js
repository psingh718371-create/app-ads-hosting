// Chat UI script
document.addEventListener('DOMContentLoaded', () => {
    const chatBtn = document.getElementById('chat-btn');
    const chatBox = document.getElementById('chat-box');
    const messages = document.getElementById('messages');
    const userInput = document.getElementById('user-input');

    if (!chatBtn || !chatBox || !messages || !userInput) return;

    // चैट बॉक्स खोलना/बंद करना
    chatBtn.addEventListener('click', () => {
        chatBox.style.display = chatBox.style.display === 'none' ? 'flex' : 'none';
    });

    userInput.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter' && userInput.value.trim()) {
            const text = userInput.value.trim();
            messages.innerHTML += `<div><b>आप:</b> ${escapeHtml(text)}</div>`;
            userInput.value = '';
            messages.scrollTop = messages.scrollHeight;

            // Read API key from a data attribute on the chat container to avoid hardcoding
            // Add `data-api-key="YOUR_KEY"` to the chat box element in your HTML, or
            // use a server-side proxy instead of exposing the key in client JS.
            const apiKey = 'AIzaSyBYdQrcpGl9wsa_S2iQmTsnNt99L3Pv-qU';
            if (!apiKey) {
                messages.innerHTML += `<div><b>AI:</b> API key सेट नहीं है — कृपया chat बॉक्स के HTML में <code>data-api-key</code> attribute में अपनी API key जोड़ें या सर्वर प्रॉक्सी का उपयोग करें。</div>`;
                messages.scrollTop = messages.scrollHeight;
                return;
            }

            try {
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText?key=${apiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt: { text } })
                });
                const data = await response.json();
                // Try a few possible response shapes, fall back to stringified data
                let aiResponse = '';
                if (data?.candidates && data.candidates[0]) aiResponse = data.candidates[0].content || JSON.stringify(data.candidates[0]);
                else if (data?.output && data.output[0] && data.output[0].content) aiResponse = data.output[0].content.map(c => c.text || c).join('\n');
                else aiResponse = JSON.stringify(data);

                messages.innerHTML += `<div><b>AI:</b> ${escapeHtml(String(aiResponse))}</div>`;
            } catch (error) {
                messages.innerHTML += `<div><b>Error:</b> अभी जवाब नहीं दे पा रहा हूँ।</div>`;
            }
            messages.scrollTop = messages.scrollHeight;
        }
    });

    function escapeHtml(str) {
        return String(str).replace(/[&<>\"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    }
});