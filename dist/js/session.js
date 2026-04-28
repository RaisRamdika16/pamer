


function logout() {
    sessionStorage.removeItem("name");
    window.location.href = "login.html";
}

function login() {
    let name = sessionStorage.getItem("name");
    if (name) {
        document.getElementById("welcome-message").textContent = `Welcome, ${name}!`;
    } else {
        window.location.href = "login.html";
    }
}