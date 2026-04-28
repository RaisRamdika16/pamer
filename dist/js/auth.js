let user = [];

async function MemuatUser() {
  try {
    const response = await fetch("js/user.json");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    user = await response.json();
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}
MemuatUser();

async function login(event) {
  if (event) {
    event.preventDefault();
  }

  if (user.length === 0) {
    await MemuatUser();
  }

  let email = document.getElementById("email").value.trim();
  let password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Please fill in all fields!");
    return;
  }

  let ditemukan = false;
  for (let i = 0; i < user.length; i++) {
    if (user[i].email === email && user[i].password === password) {
      sessionStorage.setItem("name", user[i].name);
      // Show success notification
      showNotification("Login successful! ✨", "success");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 800);
      ditemukan = true;
      break;
    }
  }

  // Also check localStorage for newly registered users
  if (!ditemukan) {
    const registeredUsers =
      JSON.parse(localStorage.getItem("registeredUsers")) || [];
    for (let user of registeredUsers) {
      if (user.email === email && user.password === password) {
        sessionStorage.setItem("name", user.name);
        showNotification("Login successful! ✨", "success");
        setTimeout(() => {
          window.location.href = "index.html";
        }, 800);
        ditemukan = true;
        break;
      }
    }
  }

  if (!ditemukan) {
    showNotification("Email or password incorrect!", "error");
  }
}

async function registerUser(newUser) {
  // Check if email already exists
  if (user.length === 0) {
    await MemuatUser();
  }

  const emailExists = user.some((u) => u.email === newUser.email);

  // Also check localStorage
  const registeredUsers =
    JSON.parse(localStorage.getItem("registeredUsers")) || [];
  const emailExistsInStorage = registeredUsers.some(
    (u) => u.email === newUser.email,
  );

  if (emailExists || emailExistsInStorage) {
    showNotification("Email already registered!", "error");
    return;
  }

  // Save to localStorage (simulating backend)
  registeredUsers.push(newUser);
  localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));

  // Show success
  document.getElementById("registerForm").style.display = "none";
  document.getElementById("success-message").classList.remove("hidden");

  showNotification("Account created successfully! Welcome! 🎉", "success");

  setTimeout(() => {
    window.location.href = "login.html";
  }, 2000);
}

function showNotification(message, type = "success") {
  const notification = document.createElement("div");
  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";
  notification.className = `fixed top-6 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg animate-pulse z-40 max-w-sm`;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}
