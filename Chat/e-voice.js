const startRecordBtn = document.getElementById('start-record');
const messageInput = document.getElementById('message-input');

// Check if the browser supports the Web Speech API
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    // Browser supports speech recognition
} else {
    // If not supported, disable button and inform user
    startRecordBtn.disabled = true;
    startRecordBtn.title = "Voice input not supported on this browser.";
}

// Setup SpeechRecognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

// Configure recognition settings
recognition.lang = 'en-US';
recognition.continuous = false;
recognition.interimResults = false;

// Listen on button click
startRecordBtn.addEventListener('click', () => {
    recognition.start();
    startRecordBtn.textContent = "🎙️"; // Show listening icon
});

// Handle result
recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    messageInput.value = transcript;
    startRecordBtn.textContent = "🎤"; // Reset icon

    // Automatically send the message
    sendMessage(); // <-- Make sure this function is defined
};

// Handle error
recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    startRecordBtn.textContent = "🎤";
};

// Reset icon when recognition ends
recognition.onend = () => {
    startRecordBtn.textContent = "🎤";
};

function displayMessage(text, type) {
    const chatBox = document.getElementById('chat-box'); // Replace with your chat container ID
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`; // 'sent' or 'received'
    messageElement.textContent = text;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}