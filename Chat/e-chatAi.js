/* ================================
   IMPORT PRIVATE KNOWLEDGE
   (KEEP IN .gitignore)
================================ */
import { PRIVATE_KNOWLEDGE } from '../backend/privateData.js';

/* ================================
   LOCAL TRAINED DATA (KNOWLEDGE)
================================ */
const knowledgeBase = `
${PRIVATE_KNOWLEDGE}

// === CUSTOM KNOWLEDGE ADDITION SPACE ===
`;

/* ================================
   SYSTEM PROMPT
================================ */
const SYSTEM_PROMPT = `
You are e-Chat, created by Efatha Rutakaza.

Use the following knowledge:

${knowledgeBase}

Be professional, helpful, and accurate.
`;

/* ================================
   DOM ELEMENTS
================================ */
const msgInput = document.getElementById("message-input");
const sendMsgBtn = document.querySelector(".send-message");
const eChatBody = document.querySelector(".chat-body"); 
const eFile = document.querySelector("#e-file");
const fileUploadWrapper = document.querySelector(".file-upload-wrapper");

/* ================================
   API SETTINGS (Optional)
================================ */
const API_KEY = "YOUR_API_KEY"; // Replace with your API key if using online API
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

/* ================================
   USER DATA & MEMORY
================================ */
const userData = { message: null, file: { data: null, mime_type: null } };
const eChatMemory = [
  { role: "user", parts: [{ text: "SYSTEM INSTRUCTION:\n" + SYSTEM_PROMPT }] }
];

/* ================================
   CREATE MESSAGE ELEMENT
================================ */
const createMsgElement = (content, classes) => {
  const div = document.createElement("div");
  div.classList.add("message", classes);
  div.innerHTML = content;
  return div;
};

/* ================================
   OFFLINE AI RESPONSE
================================ */
function getLocalResponse(message) {
  if (!message) return "⚠️ No message received.";

  const text = message.toLowerCase().trim();

  if (text.includes("efatha")) return "Efatha Rutakaza is the creator of e-Chat.";
  if (text.includes("e-chat")) return "e-Chat is an AI-powered chatbot built by Efatha.";
  if (text.includes("python")) return "Python is a versatile programming language.";
  if (text.includes("portfolio")) return "Efatha's portfolio: https://efatha.github.io/my-portofolio";
  if (text.includes("javascript") || text.includes("code")) return "I can help you with JavaScript and coding.";

  // Math expressions: 2+3, 10*5, 8/2, 50%
  const mathMatch = text.match(/(\d+\.?\d*)(\s*[%+\-*/]\s*)(\d+\.?\d*)/);
  if (mathMatch) {
    try {
      let expr = mathMatch[0].replace(/(\d+)%/g, "($1/100)");
      if (/^[0-9+\-*/().\s]+$/.test(expr)) {
        const result = Function(`"use strict"; return (${expr})`)();
        if (!isNaN(result)) return `Result: ${result}`;
      }
    } catch (err) { console.error("Math error:", err); }
  }

  // Number fallback: add 3 and 5
  const numbers = text.match(/\d+\.?\d*/g);
  if (numbers && numbers.length >= 2) return `Sum: ${Number(numbers[0]) + Number(numbers[1])}`;

  return "⚠️ Offline Mode: AI is unavailable, but I’m still here to help.";
}

/* ================================
   GENERATE CHATBOT RESPONSE
================================ */
const generateEchatResponse = async (incomingMsgDiv) => {
  const msgElement = incomingMsgDiv.querySelector(".message-text");
  let parts = [{ text: userData.message }];
  if (userData.file.data) parts.push({ inline_data: userData.file });

  eChatMemory.push({ role: "user", parts: parts });

  // Only call API if API_KEY is provided
  if (API_KEY && API_KEY !== "YOUR_API_KEY") {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: eChatMemory })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error.message);

      const apiTextResponse = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
      msgElement.innerText = apiTextResponse;
    } catch (err) {
      console.warn("API failed, using offline mode.");
      msgElement.innerText = getLocalResponse(userData.message);
    }
  } else {
    // Offline fallback
    msgElement.innerText = getLocalResponse(userData.message);
  }

  // Style code messages
  if (/code|javascript|api|html|css|js/.test(userData.message.toLowerCase())) {
    msgElement.style.backgroundColor = "#282c34";
    msgElement.style.color = "#f8f8f2";
    msgElement.style.fontFamily = "monospace";
    msgElement.style.padding = "10px";
    msgElement.style.borderRadius = "5px";
  }

  // Save bot response to memory
  eChatMemory.push({ role: "model", parts: [{ text: msgElement.innerText }] });

  // Clear file data
  userData.file = {};
  incomingMsgDiv.classList.remove("thinking");
  eChatBody.scrollTo({ top: eChatBody.scrollHeight, behavior: "smooth" });
};

/* ================================
   HANDLE USER MESSAGE
================================ */
const handleOutgoingMsg = (e) => {
  e.preventDefault();
  const userMsg = msgInput.value.trim();
  if (!userMsg) return;

  userData.message = userMsg;
  let msgContent = `<div class="message-text">${userData.message}</div>`;
  if (userData.file.data) {
    msgContent += `<div class="uploaded-image"><img src="data:${userData.file.mime_type};base64,${userData.file.data}" alt="Uploaded Image"></div>`;
  }

  const outgoingMsgDiv = createMsgElement(msgContent, "user-message");
  eChatBody.appendChild(outgoingMsgDiv);
  eChatBody.scrollTo({ top: eChatBody.scrollHeight, behavior: "smooth" });

  // Bot thinking indicator
  const thinkingDiv = createMsgElement(`<img class="bot-avatar" src="icon/artificial-intelligence.gif" alt=""><div class="message-text"><div class="thinking-indicator"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div></div>`, "bot-message");
  eChatBody.appendChild(thinkingDiv);
  eChatBody.scrollTo({ top: eChatBody.scrollHeight, behavior: "smooth" });

  // Generate bot response
  setTimeout(() => generateEchatResponse(thinkingDiv), 500);

  msgInput.value = '';
};

/* ================================
   EVENT LISTENERS
================================ */
msgInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleOutgoingMsg(e);
});
sendMsgBtn.addEventListener("click", handleOutgoingMsg);

// File uploads
eFile.addEventListener("change", () => {
  const file = eFile.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    fileUploadWrapper.querySelector("img").src = e.target.result;
    fileUploadWrapper.classList.add("eFile-uploaded");
    userData.file = { data: e.target.result.split(",")[1], mime_type: file.type };
    eFile.value = "";
  };
  reader.readAsDataURL(file);
});
document.querySelector("#e-file-upload").addEventListener("click", () => eFile.click());
