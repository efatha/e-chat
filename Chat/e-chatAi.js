/**
 * Efatha's e-Chat Logic
 * Integrated Knowledge Base & Gemini API Handler with Offline Fallback
 */

// Example of your trained data
const PRIVATE_KNOWLEDGE = `
Efatha’s e-Chat trained knowledge: 
- He is a front-end developer.
- He created e-Chat.
- He mentors developers.
- He is skilled in JS, React.js, Python, HTML, CSS, API integration.
- Add more custom knowledge here as you train the AI.
`;

// DOM elements
const msgInput = document.getElementById("message-input");
const sendMsgBtn = document.querySelector(".send-message");
const eChatBody = document.querySelector(".chat-body");
const eFile = document.querySelector("#e-file");
const fileUploadWrapper = document.querySelector(".file-upload-wrapper");

// API configuration
const API_KEY = "xai-Ulm3PZfSrZ1BSIzyl4brL3obyFpAkPxWR6qG2myd9P7nB3D1Mbm83I1QO7WUHc3QUYsNsccVOll1L2kU";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

// User data and chat memory
const userData = {
  message: null,
  file: { data: null, mime_type: null }
};
const eChatMemory = [];

// Helper to create message elements
const createMsgElement = (content, classes) => {
  const div = document.createElement("div");
  div.classList.add("message", classes);
  div.innerHTML = content;
  return div;
};

/**
 * Local Knowledge Logic
 * Returns a response if the query matches specific keywords
 */
const getLocalResponse = (query) => {
  const msgLower = query.toLowerCase();

  if (msgLower.includes("who is efatha rutakaza") || msgLower.includes("efatha rutakaza")) {
    return `Efatha Rutakaza is a talented developer known for creating e-Chat, an advanced AI chatbot. His work leverages cutting-edge AI technologies to provide dynamic, context-aware, and highly accurate interactions. Would you like to know more about his projects?`;
  } 
  
  if (msgLower.includes("e-chat") || msgLower.includes("who created you") || msgLower.includes("who are you")) {
    return `I am an advanced AI chatbot developed by Efatha Rutakaza. Efatha created me using the latest AI technologies to help users with research, problem-solving, and general knowledge.`;
  }

  if (msgLower.includes("efatha")) {
    return `Efatha Rutakaza is a professional front-end web developer specializing in JavaScript, React.js, Python, and AI integrations. He is also passionate about mentoring aspiring developers.`;
  }

  if (msgLower.includes("tell me about your creator")) {
    return `Efatha Rutakaza is a passionate developer from Bukavu, DRC. Outside of tech, he enjoys music, reading, Bible study, and strategy games. His journey is driven by curiosity and a calling to uplift others.`;
  }

  return null; // No local match
};

// Generate e-chat response using API with Fallback
const generateEchatResponse = async (incomingMsgDiv) => {
  const msgElement = incomingMsgDiv.querySelector(".message-text");
  const msgLower = userData.message.toLowerCase();

  // 1️⃣ Priority: Check if query matches local "Efatha" knowledge (Even if API is online)
  const localMatch = getLocalResponse(userData.message);
  if (localMatch) {
    msgElement.innerText = localMatch;
    msgElement.style.backgroundColor = "#397d92";
    eChatMemory.push({ role: "model", parts: [{ text: msgElement.innerText }] });
    incomingMsgDiv.classList.remove("thinking");
    eChatBody.scrollTo({ top: eChatBody.scrollHeight, behavior: "smooth" });
    return;
  }

  // 2️⃣ Prepare API request
  let parts = [{ text: userData.message }];
  if (userData.file.data) parts.push({ inline_data: userData.file });
  eChatMemory.push({ role: "user", parts });

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: eChatMemory })
  };

  try {
    const response = await fetch(API_URL, requestOptions);
    const data = await response.json();
    if (!response.ok) throw new Error("API Connection Failed");

    const apiTextResponse = data.candidates?.[0]?.content?.parts?.[0]?.text?.replace(/\*\*(.*?)\*\*/g, "$1").trim() || "No response";
    msgElement.innerText = apiTextResponse;

    // Apply technical styling
    if (["code", "js", "html", "css", "python", "api"].some(key => msgLower.includes(key))) {
      msgElement.style.backgroundColor = "#282c34";
      msgElement.style.color = "#f8f8f2";
      msgElement.style.fontFamily = "monospace";
      msgElement.style.padding = "10px";
      msgElement.style.borderRadius = "5px";
    }

    eChatMemory.push({ role: "model", parts: [{ text: msgElement.innerText }] });

  } catch (error) {
    console.error("Chat Error:", error);
    
    // 3️⃣ API FAILED: Default Fallback Answers
    msgElement.style.color = "#ff6b6b";
    msgElement.style.borderLeft = "4px solid #ff6b6b";
    
    if (msgLower.includes("hello") || msgLower.includes("hi")) {
      msgElement.innerText = "Hello! My connection to the main AI is currently unstable, but I'm here. How can I help you locally?";
    } else if (msgLower.includes("help")) {
      msgElement.innerText = "I'm currently in 'Offline Mode'. I can answer questions about Efatha or e-Chat, but for general knowledge, please check your internet connection and try again.";
    } else {
      msgElement.innerText = "⚠️ Connection Error: I'm unable to reach my AI brain right now. Please check your API key or internet connection. (Note: I can still talk about my creator, Efatha!)";
    }
    
  } finally {
    userData.file = {};
    incomingMsgDiv.classList.remove("thinking");
    eChatBody.scrollTo({ top: eChatBody.scrollHeight, behavior: "smooth" });
  }
};

// Handle outgoing messages
const handleOutgoingMsg = (e) => {
  if (e) e.preventDefault();
  userData.message = msgInput.value.trim();
  if (!userData.message && !userData.file.data) return;

  let msgContent = `<div class="message-text">${userData.message || ""}</div>`;
  if (userData.file.data) {
    msgContent += `<div class="uploaded-image"><img src="data:${userData.file.mime_type};base64,${userData.file.data}" alt="Uploaded Image"></div>`;
  }

  const outgoingMsgDiv = createMsgElement(msgContent, "user-message");
  eChatBody.appendChild(outgoingMsgDiv);
  eChatBody.scrollTo({ top: eChatBody.scrollHeight, behavior: "smooth" });

  setTimeout(() => {
    const botContent = `
      <img class="bot-avatar" src="icon/artificial-intelligence.gif" alt="">
      <div class="message-text">
        <div class="thinking-indicator">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
      </div>`;
    const incomingMsgDiv = createMsgElement(botContent, "bot-message");
    eChatBody.appendChild(incomingMsgDiv);
    eChatBody.scrollTo({ top: eChatBody.scrollHeight, behavior: "smooth" });
    generateEchatResponse(incomingMsgDiv);
  }, 500);

  msgInput.value = "";
  fileUploadWrapper.classList.remove("eFile-uploaded");
};

// --- Event Listeners ---
msgInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && msgInput.value.trim()) handleOutgoingMsg(e);
});

sendMsgBtn.addEventListener("click", handleOutgoingMsg);
document.querySelector("#e-file-upload").addEventListener("click", () => eFile.click());

eFile.addEventListener("change", () => {
  const file = eFile.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    fileUploadWrapper.querySelector("img").src = e.target.result;
    fileUploadWrapper.classList.add("eFile-uploaded");
    const base64String = e.target.result.split(",")[1];
    userData.file = { data: base64String, mime_type: file.type };
    eFile.value = "";
  };
  reader.readAsDataURL(file);
});

// Tooltip & Emoji Systems remain as defined in your previous version...
// (Skipped for brevity but should be kept in your actual deployment)