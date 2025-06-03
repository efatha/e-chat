var wrapper = document.querySelector(".wrapper .form");
Name = document.querySelector(".inpName");
Email = document.querySelector(".inpEmail");
btn = document.querySelector("button");
const containerElement = document.querySelector(".new"); // Message in the auto complete text


btn.addEventListener("click", () => {
  let userName = Name.value; // Store user name for later use
  let userEmail = Email.value; // Store user email for later use
    // test to get user name and email without any bug
  console.log(` user-name: ${userName} \n user-email: ${userEmail}`);
    // Adding the empty area on which will be displayed the value grabbed from the input
  wrapper.style.display = "none";
let eChat = document.querySelector(".efatha-chat");
  eChat.style.display = "none";
    // The head message in the area
const forUser = document.getElementById("efa-chatMessage");
  forUser.innerHTML = `<h3 class="hello"> Warm Welcome ${userName}!</h3><br>
  <p class="thanks">thanks for signing</p>
  <button id="newPage">
    <a href="Chat/e-Chat.html?name=${userName}" class="herebtn">click here<a>
  </button>`
  // Auto text effect animation
let isSearchActive = false; // This variable Controls flag for auto text effect
let efaChatIndex = 1;
let characterIndex = 1;
  const efaChatUsers = ["0", `${userName}, confirm that this is <br>your email : <br>${userEmail} by clicking <br>the button in the border...`];
  function updateText() {
      if (!isSearchActive) {
          containerElement.innerHTML = `<h2 id="autoText">Hello ${efaChatUsers[efaChatIndex].slice(0, characterIndex)}</h2>`;
          characterIndex++;
          setTimeout(updateText, 80);
      }
  }
  // Start the animation
  updateText();
});
document.getElementById("sendBtn").addEventListener("click", function (e) {
  e.preventDefault();

  const name = document.getElementById("inpName").value.trim();
  const email = document.getElementById("inpEmail").value.trim();

  if (!name || !email) {
    alert("Please enter both name and email.");
    return;
  }

  // Disable button to prevent multiple submits
  const sendBtn = e.target;
  sendBtn.disabled = true;

  fetch("https://e-chat-cn5b.onrender.com", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: name, email: email }),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      document.getElementById("efa-chatMessage").textContent = data.message || "Success!";
      // Clear inputs:
      document.getElementById("inpName").value = "";
      document.getElementById("inpEmail").value = "";
    })
    .catch((err) => {
      document.getElementById("efa-chatMessage").textContent =
        "Error submitting data: " + err.message;
    })
    .finally(() => {
      sendBtn.disabled = false;
    });
});
