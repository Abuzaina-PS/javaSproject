const addTaskButton = document.getElementById("addTaskButton");
const taskInput = document.getElementById("myInput");
const todoTable = document.getElementById("todoTable").querySelector("tbody");
const result = document.getElementById("inputVal");

// Modal elements
const editTaskModal = document.getElementById("editTaskModal");
const editTaskInput = document.getElementById("editTaskInput");
const saveEditButton = document.getElementById("saveEditButton");
const closeModalButton = document.querySelector(".close-btn");

let tasks = []; // Array to store tasks
let taskToEditIndex = null; // Store the index of the task being edited

// Add task event listener
addTaskButton.addEventListener("click", () => {
  const inputValue = taskInput.value.trim();

  if (inputValue === "") {
    showMessage("Task cannot be empty.", "red");
    return;
  }

  if (inputValue.length < 5) {
    showMessage("Task must be at least 5 characters long.", "red");
    return;
  }

  if (/^\d/.test(inputValue)) {
    showMessage("Task cannot start with a number.", "red");
    return;
  }

  // Add the task to the array
  const newTask = {
    name: inputValue,
    done: false,
  };
  tasks.push(newTask);

  updateTable(); // Update the table
  taskInput.value = ""; // Clear the input field
  saveTasks();
});

// Show validation messages
function showMessage(message, color) {
  result.textContent = message;
  result.style.color = color;
  setTimeout(() => {
    result.textContent = ""; // Clear the message after 1 second
  }, 1000);
}

// Update the table dynamically
function updateTable(filter = "all") {
  todoTable.innerHTML = ""; // Clear the table

  const filteredTasks = tasks.filter((task) => {
    if (filter === "done") return task.done;
    if (filter === "todo") return !task.done;
    return true;
  });

  filteredTasks.forEach((task, index) => {
    // Create a new row for each task
    const row = document.createElement("tr");

    // First Column: Task Name
    const taskCell = document.createElement("td");
    taskCell.textContent = task.name;
    if (task.done) taskCell.classList.add("done"); // Style for completed tasks
    row.appendChild(taskCell);

    // Second Column: Task Status
    const statusCell = document.createElement("td");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.addEventListener("change", () => {
      tasks[index].done = checkbox.checked;
      updateTable(filter);
    });
    statusCell.appendChild(checkbox);
    row.appendChild(statusCell);

    // Third Column: Actions (Edit/Delete)
    const actionsCell = document.createElement("td");

    // Edit Button
    const editButton = document.createElement("button");
    editButton.className = "edit-button"; // Add a class for styling

    const editIcon = document.createElement("i");
    editIcon.className = "fa-solid fa-pen";
    editIcon.style.color = "#FFD43B"; // Set the icon color
    editButton.appendChild(editIcon);

    editButton.addEventListener("click", () => openEditModal(index));
    actionsCell.appendChild(editButton);
    // Delete Button
    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button"; // Add a class for styling

    const trashIcon = document.createElement("i");
    trashIcon.className = "fa-solid fa-trash";
    trashIcon.style.color = "#ff0000"; // Set the icon color to red
    deleteButton.appendChild(trashIcon);

    deleteButton.addEventListener("click", () => {
      tasks.splice(index, 1); // Remove the task
      updateTable(filter); // Re-render the table
    });

    actionsCell.appendChild(deleteButton);

    actionsCell.appendChild(deleteButton);

    row.appendChild(actionsCell);

    // Append the row to the table body
    todoTable.appendChild(row);
  });
}

// Open the modal for editing
function openEditModal(index) {
  taskToEditIndex = index;
  editTaskInput.value = tasks[index].name;
  editTaskModal.style.display = "block";
}

// Close the modal
function closeEditModal() {
  editTaskModal.style.display = "none";
}

// Save the edited task
saveEditButton.addEventListener("click", () => {
  const updatedTaskName = editTaskInput.value.trim();
  const result2 = document.getElementById("demo");
  if (updatedTaskName === "") {
    result2.textContent = "Task cannot be empty.";
    result2.style.color = "red";
    return;
  } else if (updatedTaskName.length < 5) {
    result2.textContent = "Task must be at least 5 characters long.";
    result2.style.color = "red";
    return;
  } else if (/^\d/.test(updatedTaskName)) {
    result2.textContent = "Task cannot start with a number.";
    result2.style.color = "red";
    return;
  }

  tasks[taskToEditIndex].name = updatedTaskName;
  updateTable(); // Re-render the table
  closeEditModal(); // Close the modal
});

// Close the modal when clicking the "X" button
closeModalButton.addEventListener("click", closeEditModal);

// Close the modal when clicking outside of it
window.addEventListener("click", (event) => {
  if (event.target === editTaskModal) {
    closeEditModal();
  }
});

// Filter buttons
document
  .getElementById("showAll")
  .addEventListener("click", () => updateTable("all"));
document
  .getElementById("showDone")
  .addEventListener("click", () => updateTable("done"));
document
  .getElementById("showTodo")
  .addEventListener("click", () => updateTable("todo"));
// Select the "Delete Done Tasks" and "Delete All Tasks" buttons
const deleteDoneButton = document.getElementById("deletdoneButton");
const deleteAllButton = document.getElementById("deletallButton");

// Add event listener to delete all tasks
deleteAllButton.addEventListener("click", () => {
  tasks = []; // Clear the tasks array
  updateTable(); // Re-render the table
});

// Add event listener to delete only done tasks
deleteDoneButton.addEventListener("click", () => {
  tasks = tasks.filter((tasks) => !tasks.done); // Keep only tasks that are not done
  updateTable(); // Re-render the table
});
