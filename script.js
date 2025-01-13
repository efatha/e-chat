var wrapper = document.querySelector(".wrapper .form");
Name = document.querySelector(".inpName");
Email = document.querySelector(".inpEmail");
btn = document.querySelector("button");

btn.addEventListener("click", () => {
    let userName = Name.value; // Store user name for later use
    let userEmail = Email.value; // Store user email for later use
    // test to get user name and email without any bug
    console.log(` user-name: ${userName} \n user-email: ${userEmail}`)
});  