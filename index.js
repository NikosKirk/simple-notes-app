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
    <p class="note-text" contenteditable="false">${note}</p>
    <div class="note-buttons">
    <button class="edit-btn" onclick="editNote(${index}, this)">✎</button>
    <button class="delete-btn" onclick="deleteNote(${index})">X</button>
    </div>
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

function editNote(index, button) {
  const noteParagraph = button.parentElement.previousElementSibling;

  if (noteParagraph.isContentEditable) {
    // Save the note
    noteParagraph.contentEditable = "false";
    notes[index] = noteParagraph.textContent.trim();
    saveNotes();
    button.textContent = "✎";
    button.style.background = "#ffb400";
  } else {
    // Make it editable
    noteParagraph.contentEditable = "true";
    noteParagraph.focus();
    button.textContent = "💾";
    button.style.background = "#00b341";
  }
}

function deleteNote(index) {
  notes.splice(index, 1);
  saveNotes();
  renderNotes();
}

addNoteBtn.addEventListener("click", addNote);
renderNotes();
