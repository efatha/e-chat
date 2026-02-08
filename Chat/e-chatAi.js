/* ================================
   IMPORT PRIVATE KNOWLEDGE
================================ */
import { PRIVATE_KNOWLEDGE } from '../backend/privateData.js';

/* ================================
   SYSTEM PROMPT + MEMORY
================================ */
const knowledgeBase = `
${PRIVATE_KNOWLEDGE}
`;

const SYSTEM_PROMPT = `
You are e-Chat, created by Efatha Rutakaza.
Use the following knowledge:
${knowledgeBase}
Be professional, helpful, and accurate.
`;

const eChatMemory = [
  { role: "user", parts: [{ text: "SYSTEM INSTRUCTION:\n" + SYSTEM_PROMPT }] }
];

/* ================================
   DOM ELEMENTS
================================ */
const msgInput = document.getElementById("message-input");
const sendMsgBtn = document.querySelector(".send-message");
const eChatBody = document.querySelector(".chat-body");
const eFile = document.querySelector("#e-file");
const fileUploadWrapper = document.querySelector(".file-upload-wrapper");

const userData = { message: null, file: { data: null, mime_type: null } };

/* ================================
   OFFLINE / FALLBACK RESPONSE
================================ */
function getLocalResponse(message) {
  if (!message) return "⚠️ No message received.";

  const text = message.toLowerCase().trim();

  if (text.includes("efatha")) return "Efatha Rutakaza is the creator of e-Chat.";
  if (text.includes("e-chat")) return "e-Chat is an AI-powered chatbot built by Efatha.";
  if (text.includes("python")) return "Python is a versatile programming language.";
  if (text.includes("portfolio")) return "Efatha's portfolio: https://efatha.github.io/my-portofolio";
  if (text.includes("javascript") || text.includes("code")) return "I can help you with JavaScript and coding.";

  // Simple math detection
  const mathMatch = text.match(/(\d+\.?\d*)(\s*[%+\-*/]\s*)(\d+\.?\d*)/);
  if (mathMatch) {
    try {
      let expr = mathMatch[0].replace(/(\d+)%/g, "($1/100)");
      if (/^[0-9+\-*/().\s]+$/.test(expr)) {
        const result = Function(`"use strict"; return (${expr})`)();
        if (!isNaN(result)) return `Result: ${result}`;
      }
    } catch (err) {}
  }

  return "⚠️ Offline Mode: AI is unavailable, but I’m still here to help.";
}

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
   HANDLE OUTGOING MESSAGE
================================ */
const handleOutgoingMsg = (e) => {
  e.preventDefault(); // Prevent page reload

  userData.message = msgInput.value.trim();
  if (!userData.message && !userData.file.data) return;

  // User message
  let msgContent = `<div class="message-text">${userData.message || ""}</div>`;
  if (userData.file.data) {
    msgContent += `<div class="uploaded-image">
                      <img src="data:${userData.file.mime_type};base64,${userData.file.data}" alt="Uploaded Image">
                   </div>`;
  }
  const outgoingMsgDiv = createMsgElement(msgContent, "user-message");
  eChatBody.appendChild(outgoingMsgDiv);
  eChatBody.scrollTo({ top: eChatBody.scrollHeight, behavior: "smooth" });

  // Bot thinking
  const botThinkingDiv = createMsgElement(`
    <img class="bot-avatar" src="icon/artificial-intelligence.gif" alt="">
    <div class="message-text">
      <div class="thinking-indicator">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>
    </div>
  `, "bot-message");
  eChatBody.appendChild(botThinkingDiv);
  eChatBody.scrollTo({ top: eChatBody.scrollHeight, behavior: "smooth" });

  setTimeout(() => {
    // Offline fallback (or API call)
    const reply = getLocalResponse(userData.message);
    botThinkingDiv.querySelector(".message-text").innerText = reply;
    botThinkingDiv.style.backgroundColor = "#444";
    botThinkingDiv.style.color = "#fff";

    // Save to memory
    eChatMemory.push({ role: "user", parts: [{ text: userData.message }] });
    eChatMemory.push({ role: "model", parts: [{ text: reply }] });

    // Reset
    userData.file = {};
    botThinkingDiv.classList.remove("thinking");
    eChatBody.scrollTo({ top: eChatBody.scrollHeight, behavior: "smooth" });
  }, 500);

  // Clear input
  msgInput.value = '';
};

/* ================================
   EVENT LISTENERS
================================ */
msgInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleOutgoingMsg(e);
});
sendMsgBtn.addEventListener("click", handleOutgoingMsg);

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
