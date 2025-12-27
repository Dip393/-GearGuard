const API = "http://localhost:5000/api";
let token = localStorage.getItem("token");
let currentUser = null;
let requests = [];

/* ---------- AUTH ---------- */

async function login() {
  const email = email.value;
  const password = password.value;

  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  token = data.token;
  currentUser = data.user;

  localStorage.setItem("token", token);
  showDashboard();
}

function logout() {
  localStorage.removeItem("token");
  location.reload();
}

/* ---------- UI HELPERS ---------- */

function showDashboard() {
  loginSection.classList.add("hidden");
  dashboardSection.classList.remove("hidden");
  welcome.innerText = `Welcome, ${currentUser.name}`;
  loadDashboard();
}

function backToDashboard() {
  requestsSection.classList.add("hidden");
  equipmentSection.classList.add("hidden");
  dashboardSection.classList.remove("hidden");
}

/* ---------- DASHBOARD ---------- */

async function loadDashboard() {
  const res = await fetch(`${API}/requests/dashboard`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  totalRequests.innerText = data.data.totalRequests;
}

/* ---------- EQUIPMENT ---------- */

async function loadEquipment() {
  dashboardSection.classList.add("hidden");
  equipmentSection.classList.remove("hidden");

  const res = await fetch(`${API}/equipment`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();

  equipmentList.innerHTML = "";
  data.data.forEach(eq => {
    const li = document.createElement("li");
    li.innerText = `${eq.name} (${eq.serialNumber}) - ${eq.status}`;
    equipmentList.appendChild(li);
  });
}

/* ---------- REQUESTS ---------- */

async function loadRequests() {
  dashboardSection.classList.add("hidden");
  requestsSection.classList.remove("hidden");

  const res = await fetch(`${API}/requests`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  requests = data.data;
  renderKanban();
}

function renderKanban() {
  content.innerHTML = `
    <div class="kanban">
      ${kanbanColumn("new", "New")}
      ${kanbanColumn("in_progress", "In Progress")}
      ${kanbanColumn("completed", "Completed")}
    </div>
  `;
}

function kanbanColumn(status, title) {
  const items = requests.filter(r => r.status === status);
  return `
    <div class="column">
      <h3>${title}</h3>
      ${items.map(card).join("")}
    </div>
  `;
}

function card(req) {
  return `
    <div class="card">
      <b>${req.issueTitle}</b><br>
      ${req.equipment.name}<br>
      Priority: ${req.priority}<br>
      ${req.isOverdue ? '<span class="overdue">OVERDUE</span>' : ""}
      ${currentUser.role === "admin" ? statusSelect(req) : ""}
    </div>
  `;
}

function statusSelect(req) {
  return `
    <select onchange="updateStatus('${req._id}', this.value)">
      <option ${req.status==="new"?"selected":""} value="new">New</option>
      <option ${req.status==="in_progress"?"selected":""} value="in_progress">In Progress</option>
      <option ${req.status==="completed"?"selected":""} value="completed">Completed</option>
    </select>
  `;
}

async function updateStatus(id, status) {
  await fetch(`${API}/requests/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ status })
  });

  const req = requests.find(r => r._id === id);
  req.status = status;
  renderKanban();
}

/* ---------- CALENDAR ---------- */

function renderCalendar() {
  const grouped = {};
  requests.forEach(r => {
    const d = r.createdAt.split("T")[0];
    grouped[d] = grouped[d] || [];
    grouped[d].push(r);
  });

  content.innerHTML = Object.keys(grouped).map(date => `
    <h4>${date}</h4>
    <ul>
      ${grouped[date].map(r => `
        <li>${r.issueTitle} - ${r.equipment.name}</li>
      `).join("")}
    </ul>
  `).join("");
}

/* ---------- AUTO LOGIN ---------- */

if (token) {
  showDashboard();
}
