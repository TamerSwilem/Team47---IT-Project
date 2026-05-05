const usersKey = "team47Users";
const currentUserKey = "team47CurrentUser";

function showAuthMessage(form, message, type = "error") {
  const messageElement = form.querySelector(".form-message");
  if (!messageElement) return;
  messageElement.textContent = message;
  messageElement.className = "form-message " + type;
}

function getUsers() {
  return JSON.parse(localStorage.getItem(usersKey)) || [];
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem(currentUserKey));
}

function setCurrentUser(user) {
  localStorage.setItem(currentUserKey, JSON.stringify(user));
}

function initRegisterForm() {
  const form = document.querySelector("#registerForm");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const firstName = form.querySelector("#firstName").value.trim();
    const lastName = form.querySelector("#lastName").value.trim();
    const email = form.querySelector("#registerEmail").value.trim().toLowerCase();
    const password = form.querySelector("#registerPassword").value;
    const confirmPassword = form.querySelector("#confirmPassword").value;
    const users = getUsers();

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      showAuthMessage(form, "Please fill in all fields.");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      showAuthMessage(form, "Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      showAuthMessage(form, "Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      showAuthMessage(form, "Passwords do not match.");
      return;
    }

    if (users.some((user) => user.email === email)) {
      showAuthMessage(form, "An account with this email already exists.");
      return;
    }

    users.push({ firstName, lastName, email, password });
    localStorage.setItem(usersKey, JSON.stringify(users));
    setCurrentUser({ firstName, lastName, email });

    showAuthMessage(form, "Account created successfully. Redirecting...", "success");
    setTimeout(() => {
      window.location.href = "Homepage.html";
    }, 700);
  });
}

function initLoginForm() {
  const form = document.querySelector("#loginForm");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = form.querySelector("#loginEmail").value.trim().toLowerCase();
    const password = form.querySelector("#loginPassword").value;
    const users = getUsers();
    const user = users.find((item) => item.email === email && item.password === password);

    if (!email || !password) {
      showAuthMessage(form, "Please enter your email and password.");
      return;
    }

    if (!user) {
      showAuthMessage(form, "Email or password is incorrect.");
      return;
    }

    setCurrentUser({ firstName: user.firstName, lastName: user.lastName, email: user.email });
    showAuthMessage(form, "Logged in successfully. Redirecting...", "success");

    setTimeout(() => {
      window.location.href = "Homepage.html";
    }, 700);
  });
}

function initAuthNav() {
  const user = getCurrentUser();
  if (!user) return;

  const loginLink = document.querySelector('.navBarButtons a[href="login.html"]');
  if (!loginLink) return;

  const loginButton = loginLink.querySelector(".navBarButton");
  if (loginButton) loginButton.textContent = "Logout";

  const registerPrompt = document.querySelector(".navBarRightSec .navBarRegister");
  if (registerPrompt) {
    registerPrompt.innerHTML = `Welcome, <span style="color: rgb(54, 189, 252);">${user.firstName}</span>`;
  }

  loginLink.addEventListener("click", (event) => {
    event.preventDefault();
    localStorage.removeItem(currentUserKey);
    window.location.href = "Homepage.html";
  });
}
