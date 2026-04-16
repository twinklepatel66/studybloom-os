const API = "http://localhost:5000";

document.getElementById("username").innerText =
  "Hi, " + localStorage.getItem("user");

// Section switch
function showSection(section) {
  ["dashboard","tasks","notes","timetable"].forEach(id => {
    document.getElementById(id).style.display = "none";
  });
  document.getElementById(section).style.display = "block";
}

// Toast
function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.innerText = msg;
  toast.style.display = "block";
  setTimeout(() => toast.style.display = "none", 2000);
}

// TASKS

async function loadTasks() {
  const res = await fetch(API + "/tasks");
  const tasks = await res.json();

  const list = document.getElementById("taskList");
  list.innerHTML = "";

  let completed = 0;

  tasks.forEach(t => {
    if (t.completed) completed++;

    const div = document.createElement("div");
    div.className = "task";

    div.innerHTML = `
      <span class="${t.completed ? "completed" : ""}">
        ${t.text}
      </span>
      <div>
        <button onclick="toggleTask(${t.id})">✔</button>
        <button onclick="deleteTask(${t.id})">🗑</button>
      </div>
    `;

    list.appendChild(div);
  });

  document.getElementById("totalTasks").innerText = tasks.length;
  document.getElementById("completedTasks").innerText = completed;
}

async function addTask() {
  const text = document.getElementById("taskInput").value;

  await fetch(API + "/tasks", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({text})
  });

  showToast("Task added!");
  loadTasks();
}

async function toggleTask(id) {
  await fetch(API + "/tasks/" + id, {method: "PUT"});
  loadTasks();
}

async function deleteTask(id) {
  await fetch(API + "/tasks/" + id, {method: "DELETE"});
  showToast("Task deleted!");
  loadTasks();
}

// NOTES

async function loadNotes() {
  const res = await fetch(API + "/notes");
  const notes = await res.json();

  const list = document.getElementById("noteList");
  list.innerHTML = "";

  notes.forEach(n => {
    const div = document.createElement("div");
    div.className = "task";

    div.innerHTML = `
      <span>${n.text}</span>
      <button onclick="deleteNote(${n.id})">🗑</button>
    `;

    list.appendChild(div);
  });

  document.getElementById("totalNotes").innerText = notes.length;
}

async function addNote() {
  const text = document.getElementById("noteInput").value;

  await fetch(API + "/notes", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({text})
  });

  showToast("Note added!");
  loadNotes();
}

async function deleteNote(id) {
  await fetch(API + "/notes/" + id, {method: "DELETE"});
  showToast("Note deleted!");
  loadNotes();
}

// INIT
loadTasks();
loadNotes();
