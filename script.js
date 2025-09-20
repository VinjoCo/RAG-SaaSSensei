document.addEventListener('DOMContentLoaded', () => {
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const chatHistory = document.getElementById('chat-history');

    // Function to add a new message to the chat history
    function addMessage(message, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        messageDiv.innerHTML = `<p>${message}</p>`;
        chatHistory.appendChild(messageDiv);
        // Scroll to the bottom to see the new message
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    // Function to handle sending a message
    async function sendMessage() {
        const question = userInput.value.trim();
        if (question === '') return;

        // Add user's message to the chat history
        addMessage(question, 'user');
        userInput.value = '';

        // Add a "thinking" message from the bot
        const botThinkingDiv = document.createElement('div');
        botThinkingDiv.classList.add('message', 'bot-message', 'thinking');
        botThinkingDiv.innerHTML = '<p>...</p>';
        chatHistory.appendChild(botThinkingDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight;

        try {
            // Send the user's question to the Flask API
            const response = await fetch('/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ question: question })
            });
            const data = await response.json();
            
            // Remove the "thinking" message
            chatHistory.removeChild(botThinkingDiv);

            // Add the bot's response to the chat history
            addMessage(data.answer, 'bot');
        } catch (error) {
            console.error('Error:', error);
            chatHistory.removeChild(botThinkingDiv);
            addMessage('Sorry, an error occurred. Please try again.', 'bot');
        }
    }

    // Event listeners for sending messages
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });
});