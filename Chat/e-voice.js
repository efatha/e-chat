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
