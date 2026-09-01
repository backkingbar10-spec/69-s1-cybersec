const API_URL = "http://localhost:9091";

let currentRole = "user";

const rolePage = document.getElementById("role-page");
const loginPage = document.getElementById("login-page");
const registerPage = document.getElementById("register-page");
const forgotPage = document.getElementById("forgot-page");
const profilePage = document.getElementById("profile-page");

const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const forgotForm = document.getElementById("forgot-form");
const logoutBtn = document.getElementById("logout-btn");

const loginError = document.getElementById("login-error");
const registerError = document.getElementById("register-error");
const forgotError = document.getElementById("forgot-error");
const forgotSuccess = document.getElementById("forgot-success");

const loginEmailGroup = document.getElementById("login-email-group");
const loginEmail = document.getElementById("login-email");
const loginIdentifierGroup = document.getElementById("login-identifier-group");
const loginIdentifier = document.getElementById("login-identifier");

function setRole(role) {
    currentRole = role;
    const isAdmin = role === "admin";
    document.getElementById("login-role-label").textContent = isAdmin ? "Admin" : "User";
    document.getElementById("reg-role-label").textContent = isAdmin ? "Admin" : "User";
    document.getElementById("forgot-role-label").textContent = isAdmin ? "Admin" : "User";

    if (isAdmin) {
        loginEmailGroup.classList.remove("hidden");
        loginEmail.required = true;
        loginIdentifierGroup.classList.add("hidden");
        loginIdentifier.required = false;
        document.getElementById("reg-confirm-group").classList.remove("hidden");
        document.getElementById("reg-confirm").required = true;
    } else {
        loginEmailGroup.classList.add("hidden");
        loginEmail.required = false;
        loginIdentifierGroup.classList.remove("hidden");
        loginIdentifier.required = true;
        document.getElementById("reg-confirm-group").classList.add("hidden");
        document.getElementById("reg-confirm").required = false;
    }
}

function showPage(page) {
    [rolePage, loginPage, registerPage, forgotPage, profilePage].forEach((p) => {
        p.classList.add("hidden");
    });
    page.classList.remove("hidden");
}

document.getElementById("choose-admin").addEventListener("click", () => {
    setRole("admin");
    showPage(loginPage);
});

document.getElementById("choose-user").addEventListener("click", () => {
    setRole("user");
    showPage(loginPage);
});

document.getElementById("show-role").addEventListener("click", (e) => {
    e.preventDefault();
    showPage(rolePage);
});

document.getElementById("show-register").addEventListener("click", (e) => {
    e.preventDefault();
    loginForm.reset();
    loginError.textContent = "";
    registerError.textContent = "";
    showPage(registerPage);
});

document.getElementById("show-login").addEventListener("click", (e) => {
    e.preventDefault();
    registerForm.reset();
    registerError.textContent = "";
    showPage(loginPage);
});

document.getElementById("show-forgot").addEventListener("click", (e) => {
    e.preventDefault();
    forgotError.textContent = "";
    forgotSuccess.textContent = "";
    showPage(forgotPage);
});

document.getElementById("back-to-login").addEventListener("click", (e) => {
    e.preventDefault();
    showPage(loginPage);
});

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    loginError.textContent = "";

    const password = document.getElementById("login-password").value;
    let payload, url;

    if (currentRole === "admin") {
        const email = loginEmail.value;
        url = `${API_URL}/admin/login`;
        payload = { email, password, rememberMe: false };
    } else {
        const identifier = loginIdentifier.value;
        url = `${API_URL}/api/auth/local`;
        payload = { identifier, password };
    }

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const body = await res.json();

        if (!res.ok) {
            loginError.textContent = body.data?.error?.message || body.error?.message || "Login failed";
            return;
        }

        const data = body.data || body;
        const jwt = data.jwt || data.token;
        localStorage.setItem("jwt", jwt);
        localStorage.setItem("role", currentRole);
        showProfile(data.user || data);
    } catch (err) {
        loginError.textContent = "Cannot connect to server";
    }
});

registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    registerError.textContent = "";

    const username = document.getElementById("reg-username").value;
    const email = document.getElementById("reg-email").value;
    const password = document.getElementById("reg-password").value;

    let url, payload;

    if (currentRole === "admin") {
        const confirm = document.getElementById("reg-confirm").value;
        if (confirm !== password) {
            registerError.textContent = "Passwords do not match";
            return;
        }
        url = `${API_URL}/admin/register`;
        payload = { username, email, password };
    } else {
        url = `${API_URL}/api/auth/local/register`;
        payload = { username, email, password };
    }

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const body = await res.json();

        if (!res.ok) {
            registerError.textContent = body.data?.error?.message || body.error?.message || "Registration failed";
            return;
        }

        const data = body.data || body;
        const jwt = data.jwt || data.token;
        localStorage.setItem("jwt", jwt);
        localStorage.setItem("role", currentRole);
        showProfile(data.user || data);
    } catch (err) {
        registerError.textContent = "Cannot connect to server";
    }
});

forgotForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    forgotError.textContent = "";
    forgotSuccess.textContent = "";

    const email = document.getElementById("forgot-email").value;
    let url = currentRole === "admin"
        ? `${API_URL}/admin/forgot-password`
        : `${API_URL}/api/auth/forgot-password`;

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        const body = await res.json();

        if (!res.ok) {
            forgotError.textContent = body.data?.error?.message || body.error?.message || "Failed to send reset link";
            return;
        }

        forgotSuccess.textContent = body.message || body.data?.message || "Password reset link sent to your email!";
        document.getElementById("forgot-email").value = "";
    } catch (err) {
        forgotError.textContent = "Cannot connect to server";
    }
});

logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("role");
    loginForm.reset();
    showPage(rolePage);
});

function showProfile(user) {
    const role = currentRole === "admin" ? "Admin" : "User";
    document.getElementById("p-role").textContent = role;
    document.getElementById("p-id").textContent = user.id ?? user.documentId ?? "-";
    document.getElementById("p-username").textContent = user.username ?? user.firstname ?? "-";
    document.getElementById("p-email").textContent = user.email ?? "-";
    showPage(profilePage);
}

window.addEventListener("DOMContentLoaded", () => {
    const jwt = localStorage.getItem("jwt");
    const role = localStorage.getItem("role") || "user";
    if (jwt) {
        setRole(role);
        const url = role === "admin" ? `${API_URL}/admin/users/me` : `${API_URL}/api/users/me`;
        fetch(url, {
            headers: { Authorization: `Bearer ${jwt}` },
        })
            .then((res) => {
                if (!res.ok) throw new Error();
                return res.json();
            })
            .then((body) => {
                const user = body.data || body;
                showProfile(user);
            })
            .catch(() => {
                localStorage.removeItem("jwt");
                localStorage.removeItem("role");
                showPage(rolePage);
            });
    }
});
