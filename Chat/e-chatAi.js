const msgInput = document.getElementById("message-input");
const sendMsgBtn = document.querySelector(".send-message");
const eChatBody = document.querySelector(".chat-body"); // Corrected the class selector

const userData = {
    message: null
}

const createMsgElement = (content, classes) => {
    const div = document.createElement("div");
    div.classList.add("message", classes);
    div.innerHTML = content;
    return div;
}

// Handle outgoing messages
const handleOutgoingMsg = (e) => {
    e.preventDefault();
    userData.message = msgInput.value.trim();

    const msgContent = `<div class="message-text">${userData.message}</div>`;
    const outgoingMsgDiv = createMsgElement(msgContent, "user-message");
    eChatBody.appendChild(outgoingMsgDiv);
    
    // Scroll to the latest message
    eChatBody.scrollTop = eChatBody.scrollHeight;
    
    // Clear the input field after sending the message
    msgInput.value = '';
}

msgInput.addEventListener("keydown", (e) => {
    const userMsg = e.target.value.trim();
    if (e.key === "Enter" && userMsg) {
        handleOutgoingMsg(e);
    }
});
sendMsgBtn.addEventListener("click", (e) => handleOutgoingMsg(e))
