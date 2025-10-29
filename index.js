// ---------------------- Get DOM elements ----------------------
const addNoteBtn = document.getElementById("addNoteBtn"); // Add Note button
const noteText = document.getElementById("noteText");     // Textarea input
const notesContainer = document.getElementById("notesContainer"); // Container for all notes

// ---------------------- Load saved notes ----------------------
// Get notes from localStorage or initialize empty array
let notes = JSON.parse(localStorage.getItem("notes")) || [];

// ---------------------- Save notes to localStorage ----------------------
function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

// ---------------------- Render all notes ----------------------
function renderNotes() {
  notesContainer.innerHTML = ""; // Clear previous notes

  notes.forEach((note, index) => {
    const noteDiv = document.createElement("div");
    noteDiv.classList.add("note");

    // Create note content: text + edit & delete buttons
    noteDiv.innerHTML = `
      <p class="note-text" contenteditable="false">${note}</p>
        <div class="note-buttons">
          <button class="copy-btn" onclick="copyNote(${index})">📋</button>
          <button class="edit-btn" onclick="editNote(${index}, this)">✎</button>
          <button class="delete-btn" onclick="deleteNote(${index})">X</button>
        </div>
    `;

    notesContainer.appendChild(noteDiv);
  });
}

// ---------------------- Error message handling ----------------------
let errorTimeout; // to prevent animation glitches on spam clicks

// ---------------------- Add new note ----------------------
function addNote() {
  const text = noteText.value.trim();                 // Get trimmed input
  const errorMsg = document.getElementById("errorMsg"); // Error message element

  if (text === "") { // If input is empty, show error
    errorMsg.textContent = "⚠️ Please write something before adding a note!";

    // Restart shake animation
    errorMsg.classList.remove("show");
    void errorMsg.offsetWidth; // force reflow to restart animation
    errorMsg.classList.add("show");

    // Clear previous timeout if user spams
    if (errorTimeout) clearTimeout(errorTimeout);

    // Hide message after 2 seconds with fade
    errorTimeout = setTimeout(() => {
      errorMsg.classList.remove("show"); // fade out
      setTimeout(() => {
        errorMsg.textContent = ""; // remove text after fade
      }, 500); // match CSS transition
    }, 2000);

    return;
  }

  // Add note normally
  notes.push(text);  // Add to notes array
  saveNotes();       // Save to localStorage
  renderNotes();     // Re-render all notes
  noteText.value = ""; // Clear textarea
}

// ---------------------- Copy note to clipboard ----------------------
function copyNote(index) {
  const noteContent = notes[index];
  const copyBtn = event.target;
  
  // If button is already in "copied" state, ignore click
  if (copyBtn.textContent === "✓") {
    return;
  }
  
  // Clipboard API
  navigator.clipboard.writeText(noteContent)
    .then(() => {
      showCopyFeedback(copyBtn);
    })
    .catch(err => {
      console.error('Failed to copy: ', err);
      // Fallback for older browsers
      fallbackCopyTextToClipboard(noteContent, copyBtn);
    });
}

// ---------------------- Fallback copy method ----------------------
function fallbackCopyTextToClipboard(text, copyBtn) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  
  try {
    document.execCommand('copy');
    showCopyFeedback(copyBtn);
  } catch (err) {
    console.error('Fallback copy failed: ', err);
    // Last resort - alert the user
    alert('Copy failed. Please copy manually:\n\n' + text);
  }
  
  document.body.removeChild(textArea);
}

// ---------------------- Show copy feedback ----------------------
function showCopyFeedback(copyBtn) {
  const originalText = copyBtn.textContent;
  copyBtn.textContent = "✓";
  copyBtn.style.background = "#00b341";
  
  // Reset button after 1 second
  setTimeout(() => {
    copyBtn.textContent = originalText;
    copyBtn.style.background = "";
  }, 1000);
}

// ---------------------- Edit existing note ----------------------
function editNote(index, button) {
  const noteParagraph = button.parentElement.previousElementSibling; // get <p> element

  if (noteParagraph.isContentEditable) {
    // Save the edited note
    noteParagraph.contentEditable = "false";
    notes[index] = noteParagraph.textContent.trim(); // update array
    saveNotes();                                      // save changes
    button.textContent = "✎";                         // restore edit icon
    button.style.background = "#ffb400";             // restore button color
  } else {
    // Make the note editable
    noteParagraph.contentEditable = "true";
    noteParagraph.focus();                            // focus cursor
    button.textContent = "💾";                         // change to save icon
    button.style.background = "#00b341";             // change button color
  }
}

// ---------------------- Delete a note ----------------------
function deleteNote(index) {
  notes.splice(index, 1); // remove note from array
  saveNotes();             // save updated array
  renderNotes();           // re-render all notes
}

// ---------------------- Event listener ----------------------
addNoteBtn.addEventListener("click", addNote); // Add note on button click

// ---------------------- Initial render ----------------------
renderNotes(); // Render notes when page loads