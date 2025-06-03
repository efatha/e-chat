
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
