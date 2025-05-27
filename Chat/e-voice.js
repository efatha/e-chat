// Get DOM elements
const startRecordBtn = document.getElementById('start-record');
const messageInput = document.getElementById('message-input');

// Check if the browser supports the Web Speech API
if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
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

// Handle button click to start voice input
startRecordBtn.addEventListener('click', () => {
    recognition.start();
    startRecordBtn.textContent = "🎙️"; // Show listening icon
});

// Handle speech result
recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    messageInput.value = transcript;
    startRecordBtn.textContent = "🎤"; // Reset icon
    sendMessage(); // Automatically send the message
};

// Handle recognition error
recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    startRecordBtn.textContent = "🎤";
};

// Reset icon when done listening
recognition.onend = () => {
    startRecordBtn.textContent = "🎤";
};
// Send message from input
function sendMessage() {
    const message = messageInput.value.trim();
    if (message !== "") {
        displayMessage(message, 'sent');
        messageInput.value = "";
    }
}
// Display message in chat container
function displayMessage(text, type) {
    const chatBox = document.getElementById('chat-box'); // Make sure this element exists
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`; // e.g., 'sent'
    messageElement.textContent = text;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}
