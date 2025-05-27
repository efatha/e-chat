const startRecordBtn = document.getElementById('start-record');
const messageInput = document.getElementById('message-input');

// Check if the browser supports the Web Speech API
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    // Ready to proceed
} else {
    // If not supported, disable button and inform user
    startRecordBtn.disabled = true;
    startRecordBtn.title = "Voice input not supported on this browser.";
}
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

// Set language to English
recognition.lang = 'en-US';

// We only want one command at a time
recognition.continuous = false;
recognition.interimResults = false;
// This feature helps the e-chat to start listening
startRecordBtn.addEventListener('click', () => {
    recognition.start(); // Start listening
    startRecordBtn.textContent = "🎙️ Listening..."; // Feedback
});
