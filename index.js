const addNoteBtn = document.getElementById("addNoteBtn");
const noteText = document.getElementById("noteText");
const notesContainer = document.getElementById("notesContainer");

let notes = JSON.parse(localStorage.getItem("notes")) || [];

function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

function renderNotes() {
  notesContainer.innerHTML = "";
  notes.forEach((note, index) => {
    const noteDiv = document.createElement("div");
    noteDiv.classList.add("note");
    noteDiv.innerHTML = `
      <p>${note}</p>
      <button class="delete-btn" onclick="deleteNote(${index})">X</button>
    `;
    notesContainer.appendChild(noteDiv);
  });
}

function addNote() {
  const text = noteText.value.trim();
  if (text === "") return alert("Write something first!");
  notes.push(text);
  saveNotes();
  renderNotes();
  noteText.value = "";
}

function deleteNote(index) {
  notes.splice(index, 1);
  saveNotes();
  renderNotes();
}

addNoteBtn.addEventListener("click", addNote);
renderNotes();
