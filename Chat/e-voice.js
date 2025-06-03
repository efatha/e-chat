// Get DOM elements
const startRecordBtn = document.getElementById('start-record');
const messageInput = document.getElementById('message-input');
const chatBox = document.getElementById('chat-box'); // Cache this once

// Check browser support for Web Speech API
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

// Flag to prevent multiple starts
let isRecognizing = false;

// Handle button click to start/stop voice input
startRecordBtn.addEventListener('click', () => {
    if (isRecognizing) {
        recognition.stop();
        return;
    }
    recognition.start();
    isRecognizing = true;
    startRecordBtn.textContent = "🎙️ Listening...";
    startRecordBtn.disabled = true; // Disable to prevent multiple clicks until ready
});

// Handle speech result
recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    messageInput.value = transcript;
    sendMessage();
};

// Handle recognition start
recognition.onstart = () => {
    isRecognizing = true;
    startRecordBtn.textContent = "🎙️ Listening...";
    startRecordBtn.disabled = true;
};

// Handle recognition end
recognition.onend = () => {
    isRecognizing = false;
    startRecordBtn.textContent = "🎤";
    startRecordBtn.disabled = false;
};

// Handle recognition errors gracefully
recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    // You can provide user feedback here if you want
    startRecordBtn.textContent = "🎤";
    startRecordBtn.disabled = false;
    isRecognizing = false;
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
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`; // e.g., 'sent'
    messageElement.textContent = text;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}
