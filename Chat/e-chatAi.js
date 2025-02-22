const msgInput = document.getElementById("message-input");
const sendMsgBtn = document.querySelector(".send-message");
const eChatBody = document.querySelector(".chat-body"); 
const eFile = document.querySelector("#e-file");
const fileUploadWrapper = document.querySelector(".file-upload-wrapper");


const API_KEY = "AIzaSyBl1YM-6ZUmidqoIBByNwCxVkdrVhhf7Jk";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const userData = {
    message: null,
    file: {
        data: null,
        mime_type: null
    }
}

const eChatMemory = []

const createMsgElement = (content, classes) => {
    const div = document.createElement("div");
    div.classList.add("message", classes);
    div.innerHTML = content;
    return div;
}

// Generate e-chat response using API
const generateEchatResponse = async (incomingMsgDiv) => {
    const msgElement = incomingMsgDiv.querySelector(".message-text"); 
    let parts = [{ text: userData.message }];
    if (userData.file.data) {
        parts.push({ inline_data: userData.file });
    }

    eChatMemory.push({
        role: "user",
        parts: parts
    });

    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: eChatMemory })
    };

    try {
        // Fetch data from the API
        const response = await fetch(API_URL, requestOptions);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error.message);

        // Check if the user asked about Efatha Rutakaza
        if (userData.message.toLowerCase().includes("who is efatha rutakaza") || userData.message.toLowerCase().includes("efatha rutakaza")) {
            const efathaInfo = `Efatha Rutakaza is a talented developer known for creating e-Chat, an advanced AI chatbot designed to assist with research and problem-solving. 
                His work leverages cutting-edge AI technologies to provide dynamic, context-aware, and highly accurate interactions. 
                e-Chat is used for academic inquiries, technical problem-solving, and general knowledge exploration, offering reliable and precise responses.

                Efatha has a passion for AI and machine learning, and his contributions have been recognized for their efficiency and precision in addressing complex research challenges.

                Would you like to know more about his projects or contributions?
            `;
            // Display the response about Efatha Rutakaza
            msgElement.innerText = efathaInfo;
        } 
        // Check if the user mentioned the creator or developer
        else if (userData.message.toLowerCase().includes("e-chat") || userData.message.toLowerCase().includes("developer of this")) {
            const creatorMessage = `e-Chat is an advanced AI chatbot developed by Efatha Rutakaza, a skilled developer with expertise in artificial intelligence and software engineering.
                Efatha created e-Chat using the latest AI technologies to help users with research, problem-solving, and general knowledge.

                His goal was to build a chatbot that understands and responds accurately to your needs. e-Chat is designed to provide useful, reliable information, and it continues to improve over time.

                Efatha is passionate about AI and works to make sure e-Chat stays innovative and effective for all users.
                Thank you for supporting this project – it helps us make e-Chat better every day!
            `;
            msgElement.innerText = creatorMessage;
        } else if (userData.message.toLowerCase().includes("efatha") || userData.message.toLowerCase().includes("Efatha Byamungu")) {
            const efatha = `Efatha Rutakaza is a professional front-end web developer specializing in user-friendly, interactive, and AI-powered applications. 
                He is known for his expertise in JavaScript, React.js, Python and API integrations. One of his notable projects is e-Chat, an advanced AI-driven chatbot designed 
                to assist users with research, problem-solving, and technical inquiries by providing context-aware, reliable responses.

                In addition to his development work, Efatha is passionate about mentoring and helping aspiring developers enhance their skills in web development.

                Would you like to learn more about his technical contributions or ongoing projects?`;
            msgElement.innerText = efatha;
        } else {
            // Extract and display e-chat text response from the API
            const apiTextResponse = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
            msgElement.innerText = apiTextResponse;
        }

        // Check if the message contains any code-related inquiry or format
        if (userData.message.toLowerCase().includes("code") || userData.message.toLowerCase().includes("javascript") || 
            userData.message.toLowerCase().includes("api") || userData.message.toLowerCase().includes("html") || 
            userData.message.toLowerCase().includes("css") || userData.message.toLowerCase().includes("js")) {
            // Apply special background and text color for code-related responses
            msgElement.style.backgroundColor = "#282c34"; // Set dark background for code inquiries
            msgElement.style.color = "#f8f8f2"; // Set light text color for code-related inquiries
            msgElement.style.fontFamily = "monospace"; // Optional: set monospace font to mimic code formatting
            msgElement.style.padding = "10px"; // Optional: add padding for better readability
            msgElement.style.borderRadius = "5px"; // Optional: rounded borders
        }

        // Add e-chat response to its memory
        eChatMemory.push({
            role: "model",
            parts: [{ text: msgElement.innerText }]
        });
    } catch (error) {
        console.log(error);
        msgElement.innerText = error.message;
        msgElement.style.color = "pink";
    } finally {
        userData.file = {};
        incomingMsgDiv.classList.remove('thinking');
        eChatBody.scrollTo({ top: eChatBody.scrollHeight, behavior: "smooth" });
    }
};

 

// Handle outgoing messages
const handleOutgoingMsg = (e) => {
    e.preventDefault();
    userData.message = msgInput.value.trim();
    let msgContent = `<div class="message-text">${userData.message || ""}</div>`;
    if (userData.file.data) {
        msgContent += `<div class="uploaded-image">
                          <img src="data:${userData.file.mime_type};base64,${userData.file.data}" alt="Uploaded Image">
                       </div>`;
    }
    const outgoingMsgDiv = createMsgElement(msgContent, "user-message");
    eChatBody.appendChild(outgoingMsgDiv);
    eChatBody.scrollTo({ top: eChatBody.scrollHeight, behavior: "smooth" });
    // Simulate bot response with indicator after a delay
    setTimeout(() => {
        const msgContent = `<img class="bot-avatar" src="icon/artificial-intelligence.gif" alt="">
               <div class="message-text">
                   <div class="thinking-indicator">
                       <div class="dot"></div>
                       <div class="dot"></div>
                       <div class="dot"></div>
                   </div>
               </div>`;
        const incomingMsgDiv = createMsgElement(msgContent, "bot-message");
        eChatBody.appendChild(incomingMsgDiv);
        eChatBody.scrollTo({ top: eChatBody.scrollHeight, behavior: "smooth" });
        generateEchatResponse(incomingMsgDiv);
    }, 500);
    // Clear the input field after sending the message
    msgInput.value = '';
}

msgInput.addEventListener("keydown", (e) => {
    const userMsg = e.target.value.trim();
    if (e.key === "Enter" && userMsg) {
        handleOutgoingMsg(e);
    }
});
// Handle file input change
eFile.addEventListener("change", () =>{
    const file = eFile.files[0];
    if(!file)return;

    const reader = new FileReader();
    reader.onload = (e) => {
        fileUploadWrapper.querySelector("img").src = e.target.result;
        fileUploadWrapper.classList.add("eFile-uploaded");
        const base64String = e.target.result.split(",")[1];
        // Srore file data in the userData
        userData.file = {
            data: base64String,
            mime_type: file.type
        };
        eFile.value = "";
    }
    reader.readAsDataURL(file);
});
sendMsgBtn.addEventListener("click", (e) => handleOutgoingMsg(e));
document.querySelector("#e-file-upload").addEventListener("click", () => eFile.click());

// javascript 
document.addEventListener("DOMContentLoaded", () => {
    const inputs = document.querySelectorAll(".js-tooltip");

    inputs.forEach(input => {
      const tooltip = document.createElement("div");
      tooltip.className = "tooltip";
      tooltip.innerText = input.getAttribute("title");
      document.body.appendChild(tooltip);

      input.addEventListener("mouseenter", (e) => {
        tooltip.style.display = "block";
        tooltip.style.left = `${e.pageX + 10}px`;
        tooltip.style.top = `${e.pageY + 10}px`;
        tooltip.style.background = "var(--efa-background)";
      });

      input.addEventListener("mousemove", (e) => {
        tooltip.style.left = `${e.pageX + 10}px`;
        tooltip.style.top = `${e.pageY + 10}px`;
      });

      input.addEventListener("mouseleave", () => {
        tooltip.style.display = "none";
      });

      // Remove the default title for all elements
      input.setAttribute("title", "");
    });
});
// emoji Application Programming Interface
document.addEventListener("DOMContentLoaded", function () {
    const emojiBtn = document.getElementById("emoji-btn");
    const emojiPicker = document.getElementById("emoji-picker");
    const emojiGrid = document.getElementById("emoji-grid");
    const emojiSearch = document.getElementById("emoji-search");
    const messageInput = document.getElementById("message-input");  // Targeting the message input

    let emojis = [];

    emojiBtn.addEventListener("click", function (event) {
        event.stopPropagation();
        emojiPicker.style.display = emojiPicker.style.display === "block" ? "none" : "block";

        if (emojis.length === 0) {
            fetchEmojis();
        }
    });

    document.addEventListener("click", function (event) {
        if (!emojiBtn.contains(event.target) && !emojiPicker.contains(event.target)) {
            emojiPicker.style.display = "none";
        }
    });

    async function fetchEmojis() {
        const apiKey = "4f6e97cc2547fe135c1d868ff95914344f715ee9";
        const apiUrl = `https://emoji-api.com/emojis?access_key=${apiKey}`; // Replace with a valid API key
        try {
            const response = await fetch(apiUrl);
            emojis = await response.json();
            displayEmojis(emojis);
        } catch (error) {
            console.error("Error fetching emojis:", error);
        }
    }

    function displayEmojis(emojiList) {
        emojiGrid.innerHTML = "";
        emojiList.slice(0, 100).forEach(emoji => { // Fetch up to 100 emojis
            const emojiItem = document.createElement("div");
            emojiItem.classList.add("emoji-item");
            emojiItem.innerText = emoji.character;
            emojiItem.addEventListener("click", () => {
                messageInput.value += emoji.character;  // Add emoji to message field when clicked
                emojiPicker.style.display = "none";  // Close emoji picker after selecting
            });
            emojiGrid.appendChild(emojiItem);
        });
    }
    emojiSearch.addEventListener("input", function () {
        const searchTerm = emojiSearch.value.toLowerCase();
        const filteredEmojis = emojis.filter(emoji => emoji.name.toLowerCase().includes(searchTerm)); // Filter based on emoji name
        displayEmojis(filteredEmojis);
    });
});     