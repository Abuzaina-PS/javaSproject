const addTaskButton = document.getElementById("addTaskButton");
const taskInput = document.getElementById("myInput");
const todoList = document.getElementById("todoList");
const result = document.getElementById("inputVal");

// Filter buttons
document
  .getElementById("showAll")
  .addEventListener("click", () => updateList("all"));
document
  .getElementById("showDone")
  .addEventListener("click", () => updateList("done"));
document
  .getElementById("showTodo")
  .addEventListener("click", () => updateList("todo"));

// Modal elements
const editTaskModal = document.getElementById("editTaskModal");
const editTaskInput = document.getElementById("editTaskInput");
const saveEditButton = document.getElementById("saveEditButton");
const closeEditModalButton = document.querySelector(".close-btn");

// Variables to store task data
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let taskToEditIndex = null; // Store the index of the task being edited
let taskToDeleteIndex = null; // Store the index of the task being deleted

// Initialize the list with tasks from localStorage
updateList();

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

  const isDuplicate = tasks.some(
    (task) => task.name.toLowerCase() === inputValue.toLowerCase()
  );
  if (isDuplicate) {
    showMessage("Task already exists.", "red");
    return;
  }

  // Add the task to the array
  const newTask = {
    name: inputValue,
    done: false,
  };

  tasks.push(newTask);
  updateList(); // Update the list
  taskInput.value = ""; // Clear the input field
  saveTasks(); // Save tasks to localStorage
});

// Function to reset the button text
function resetButtonText() {
  addTaskButton.textContent = "Add Task"; // Reset the text to the original
}

// Show validation messages
function showMessage(message, color) {
  result.textContent = message;
  result.style.color = color;
  setTimeout(() => {
    result.textContent = ""; // Clear the message after 1 second
  }, 1000);
}

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Update the list dynamically
function updateList(filter = "all") {
  // Clear the list
  todoList.innerHTML = "";

  // Filter tasks based on the selected filter
  const filteredTasks = tasks.filter((task) => {
    if (filter === "done") return task.done;
    if (filter === "todo") return !task.done;
    return true; // Show all tasks
  });

  // Check if there are no tasks
  if (filteredTasks.length === 0) {
    const noTasksMessage = document.createElement("li");
    noTasksMessage.textContent = "No tasks.";
    noTasksMessage.className = "no-tasks-message"; // Optional: add a class for styling
    todoList.appendChild(noTasksMessage);
    return; // Exit the function early
  }

  // Iterate over filtered tasks
  filteredTasks.forEach((task, index) => {
    // Task item container
    const taskItem = document.createElement("li");
    taskItem.className = "task-item";

    // Task checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.className = "task-checkbox";
    checkbox.addEventListener("change", () => {
      tasks[index].done = checkbox.checked;
      saveTasks();
      updateList(filter);
    });

    // Task name
    const taskName = document.createElement("span");
    taskName.textContent = task.name;
    taskName.className = task.done ? "task-name done" : "task-name";

    // Actions container
    const actionsContainer = document.createElement("div");
    actionsContainer.className = "actions";

    // Edit button
    const editButton = document.createElement("button");
    editButton.className = "edit-button";
    editButton.innerHTML = '<i class="fa-solid fa-pen"></i>';
    editButton.addEventListener("click", () => openEditModal(index));

    // Delete button
    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
    deleteButton.addEventListener("click", () => {
      taskToDeleteIndex = index; // Store the index of the task to delete
      showDeleteModal("single"); // Show delete modal for this task
    });

    // Append buttons to actions container
    actionsContainer.appendChild(editButton);
    actionsContainer.appendChild(deleteButton);

    // Append elements to task item
    taskItem.appendChild(taskName);
    taskItem.appendChild(checkbox);
    taskItem.appendChild(actionsContainer);

    // Append task item to the list
    todoList.appendChild(taskItem);
  });

  // Update the state of delete buttons
  updateDeleteButtonsState();
}
// Function to update the state of delete buttons
function updateDeleteButtonsState() {
  const deleteDoneButton = document.getElementById("deletdoneButton");
  const deleteAllButton = document.getElementById("deletallButton");

  deleteAllButton.disabled = tasks.length === 0;
  deleteDoneButton.disabled = tasks.filter((task) => task.done).length === 0;
}

// Open the modal for editing
function openEditModal(index) {
  taskToEditIndex = index;
  editTaskInput.value = tasks[index].name;
  editTaskModal.style.display = "block";
}

// Close the edit modal
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
  saveTasks(); // Save changes to localStorage
  updateList();
  closeEditModal();
});

// Close the modal when clicking the "X" button
closeEditModalButton.addEventListener("click", closeEditModal);
// Delete confirmation modal elements
const deleteModal = document.getElementById("deleteModal");
const deleteModalText = document.getElementById("deleteModalText");
const confirmDeleteButton = document.getElementById("confirmDelete");
const cancelDeleteButton = document.getElementById("cancelDelete");
const closeDeleteModalButton = document.querySelector(".close-button");
// Close the modal when clicking outside of it
window.addEventListener("click", (event) => {
  if (event.target === editTaskModal) {
    closeEditModal();
  }
});

// Show delete confirmation modal
function showDeleteModal(action) {
  deleteModal.style.display = "block"; // Show the modal
  if (action === "single") {
    deleteModalText.textContent = "Are you sure you want to delete this task?";
  } else if (action === "all") {
    deleteModalText.textContent = "Are you sure you want to delete all tasks?";
  } else if (action === "done") {
    deleteModalText.textContent =
      "Are you sure you want to delete all completed tasks?";
  }
}

// Close the delete modal
function closeDeleteModal() {
  deleteModal.style.display = "none";
}

// Confirm delete action
confirmDeleteButton.addEventListener("click", () => {
  if (taskToDeleteIndex !== null) {
    tasks.splice(taskToDeleteIndex, 1); // Remove the specific task
  }
  saveTasks(); // Save changes to localStorage
  updateList(); // Update the list
  closeDeleteModal(); // Close the modal
});

// Cancel delete action
cancelDeleteButton.addEventListener("click", closeDeleteModal);

// Close modal when clicking outside
window.addEventListener("click", (event) => {
  if (event.target === deleteModal) {
    closeDeleteModal();
  }
});
// Select the "Delete Done Tasks" and "Delete All Tasks" buttons
const deleteDoneButton = document.getElementById("deletdoneButton");
const deleteAllButton = document.getElementById("deletallButton");

// Variable to store the type of delete action
let deleteAction = null;

// Add event listener to delete all tasks
deleteAllButton.addEventListener("click", () => {
  deleteAction = "all"; // Set the action to delete all
  showDeleteModal(deleteAction); // Show the confirmation modal
});

// Add event listener to delete only done tasks
deleteDoneButton.addEventListener("click", () => {
  deleteAction = "done"; // Set the action to delete done tasks
  showDeleteModal(deleteAction); // Show the confirmation modal
});

// Confirm delete action
confirmDeleteButton.addEventListener("click", () => {
  if (deleteAction === "all") {
    tasks = []; // Clear all tasks
  } else if (deleteAction === "done") {
    tasks = tasks.filter((task) => !task.done); // Clear only done tasks
  }

  saveTasks(); // Save changes to localStorage
  updateList(); // Update the list
  closeDeleteModal(); // Close the modal
});
