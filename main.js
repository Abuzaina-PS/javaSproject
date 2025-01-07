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
    const row = document.createElement("tr");

    // Task Name
    const taskCell = document.createElement("td");
    taskCell.textContent = task.name;
    if (task.done) taskCell.classList.add("done");
    row.appendChild(taskCell);

    // Task Status
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

    // Actions
    const actionsCell = document.createElement("td");

    // Edit Button
    const editButton = document.createElement("button");
    editButton.textContent = "✏️";
    editButton.addEventListener("click", () => openEditModal(index));
    actionsCell.appendChild(editButton);

    // Delete Button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "🗑️";
    deleteButton.addEventListener("click", () => {
      tasks.splice(index, 1);
      updateTable(filter);
    });
    actionsCell.appendChild(deleteButton);

    row.appendChild(actionsCell);
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

  if (updatedTaskName === "") {
    alert("Task name cannot be empty!");
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
