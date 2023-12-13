import { renderNotes } from "./app.js";

let arrayofNotes = JSON.parse(localStorage.getItem("notesKey")) || [];
let showArchiveNotes = document.querySelector(".archive-notes-container");

function renderArchiveNotes() {
  const archivedNotes = arrayofNotes.filter(({ isArchived }) => isArchived);
  showArchiveNotes.innerHTML = renderNotes(archivedNotes);
}

showArchiveNotes.addEventListener("click", (e) => {
  let type = e.target.dataset.type;
  let noteId = e.target.dataset.id;

  switch (type) {
    case "del":
      // Find the note in the array
      const noteToDelete = arrayofNotes.find(({ id }) => id.toString() === noteId);

      // Check if the note is both pinned and archived
      if (noteToDelete && noteToDelete.isPinned && noteToDelete.isArchived) {
        // Do nothing, as delete button should not work for pinned and archived notes
      } else {
        // Delete the note for other cases
        arrayofNotes = arrayofNotes.filter(({ id }) => id.toString() !== noteId);
        localStorage.setItem("notesKey", JSON.stringify(arrayofNotes));
        renderArchiveNotes();
      }
      break;

    case "archive":
      arrayofNotes = arrayofNotes.map((note) =>
        note.id.toString() === noteId ? { ...note, isArchived: !note.isArchived } : note
      );
      localStorage.setItem("notesKey", JSON.stringify(arrayofNotes));
      renderArchiveNotes();
      break;
  }
});

// Initial rendering of archived notes
renderArchiveNotes();
