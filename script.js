import { renderNotes } from "./app.js";
const title = document.querySelector(".title");
const note = document.querySelector(".note");
const addButton = document.querySelector(".add-btn");
const notesDisplay = document.querySelector(".notes-display");
const showPinnedNotes = document.querySelector(".pinned-notes-container");
const showOtherNotes = document.querySelector(".notes-container");
const pinTitle = document.querySelector(".pin-title");
const otherTitle = document.querySelector(".other-title");

// Load notes from localStorage or take an empty array
let arrayofNotes = JSON.parse(localStorage.getItem("notesKey")) || [];

// Separate pinned and other notes for rendering
const pinnedNotes = arrayofNotes.filter(
  ({ isPinned, isArchived }) => isPinned && !isArchived
);
const otherNotes = arrayofNotes.filter(
  ({ isPinned, isArchived }) => !isPinned && !isArchived
);

// Render notes on page load
showPinnedNotes.innerHTML = renderNotes(pinnedNotes);
showOtherNotes.innerHTML = renderNotes(otherNotes);

// Toggle visibility of title elements based on notes existence
function toggleTitleVisibility() {
  if (arrayofNotes.length > 0) {
    pinTitle.classList.remove("d-none");
    otherTitle.classList.remove("d-none");
  } else {
    pinTitle.classList.add("d-none");
    otherTitle.classList.add("d-none");
  }
}

// Initial toggle on page load
toggleTitleVisibility();

// addButton.addEventListener("click", () => {
//   if (title.value.trim().length > 0 || note.value.trim().length > 0) {
//     const newNote = {
//       title: title.value.trim(),
//       note: note.value.trim(),
//       id: Date.now(),
//       isPinned: false,
//       isArchived: false,
//     };

//     arrayofNotes = [...arrayofNotes, newNote];

//     if (newNote.isPinned) {
//       showPinnedNotes.innerHTML = renderNotes([...pinnedNotes, newNote]);
//     } else {
//       showOtherNotes.innerHTML = renderNotes([...otherNotes, newNote]);
//     }
//     localStorage.setItem("notesKey", JSON.stringify(arrayofNotes));
//   }
// // Toggle visibility of title elements based on notes existence
//   if (arrayofNotes.length > 0) {
//     pinTitle.classList.toggle("d-none");
//     otherTitle.classList.toggle("d-none");
//   }
//   title.value = "";
//   note.value = "";
// toggleTitleVisibility();
// });

// Event listener for deleting and pinning notes

addButton.addEventListener("click", () => {
  if (title.value.trim().length > 0 || note.value.trim().length > 0) {
    const newNote = {
      title: title.value.trim(),
      note: note.value.trim(),
      id: Date.now(),
      isPinned: false,
      isArchived: false,
    };

    if (newNote.isPinned) {
      pinnedNotes.push(newNote);
    } else {
      otherNotes.push(newNote);
    }

    arrayofNotes = [...pinnedNotes, ...otherNotes];

    showPinnedNotes.innerHTML = renderNotes(pinnedNotes);
    showOtherNotes.innerHTML = renderNotes(otherNotes);

    localStorage.setItem("notesKey", JSON.stringify(arrayofNotes));
  }
  title.value = "";
  note.value = "";
  toggleTitleVisibility();
});

notesDisplay.addEventListener("click", (e) => {
  let type = e.target.dataset.type;
  let noteId = e.target.dataset.id;

  switch (type) {
    case "del":
      const noteToDelete = arrayofNotes.find(
        ({ id }) => id.toString() === noteId
      );
      if (noteToDelete && !noteToDelete.isPinned) {
        arrayofNotes = arrayofNotes.filter(
          ({ id }) => id.toString() !== noteId
        );
        showOtherNotes.innerHTML = renderNotes(
          arrayofNotes.filter(
            ({ isPinned, isArchived }) => !isPinned && !isArchived
          )
        );
        localStorage.setItem("notesKey", JSON.stringify(arrayofNotes));
        toggleTitleVisibility();
      }
      break;
    case "pinned":
      arrayofNotes = arrayofNotes.map((note) =>
        note.id.toString() === noteId
          ? { ...note, isPinned: !note.isPinned, isArchived: false } // Ensure isArchived is set to false when unpinning
          : note
      );
      localStorage.setItem("notesKey", JSON.stringify(arrayofNotes));

      // Update the rendered notes based on pinned status
      const updatedPinnedNotes = arrayofNotes.filter(
        ({ isPinned, isArchived }) => isPinned && !isArchived
      );
      const updatedOtherNotes = arrayofNotes.filter(
        ({ isPinned, isArchived }) => !isPinned && !isArchived
      );

      showPinnedNotes.innerHTML = renderNotes(updatedPinnedNotes);
      showOtherNotes.innerHTML = renderNotes(updatedOtherNotes);
      toggleTitleVisibility();
      break;

    case "archive":
      arrayofNotes = arrayofNotes.map((note) =>
        note.id.toString() === noteId
          ? { ...note, isArchived: !note.isArchived }
          : note
      );
      localStorage.setItem("notesKey", JSON.stringify(arrayofNotes));
      location.reload();
      // Update the rendered notes based on archived status
      updatedOtherNotes = arrayofNotes.filter(
        ({ isArchived, isPinned }) => !isArchived && !isPinned
      );
      updatedPinnedNotes = arrayofNotes.filter(
        ({ isArchived, isPinned }) => !isArchived && isPinned
      );

      showOtherNotes.innerHTML = renderNotes(updatedOtherNotes);
      showPinnedNotes.innerHTML = renderNotes(updatedPinnedNotes);
      toggleTitleVisibility();

      // Update local storage after UI update
      localStorage.setItem("notesKey", JSON.stringify(arrayofNotes));
      break;
  }
});
