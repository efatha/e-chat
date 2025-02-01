const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const userName = urlParams.get('name');
const toogleUserName = document.querySelector(".iconUser");
toogleUserName.textContent = `${userName}`;
