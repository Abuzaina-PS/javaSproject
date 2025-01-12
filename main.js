const addTaskButton = document.getElementById("addTaskButton");

const taskInput = document.getElementById("myInput");
const todoList = document.getElementById("todoList"); // Changed to a list
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
const closeModalButton = document.querySelector(".close-btn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || []; // Load tasks from localStorage
let taskToEditIndex = null; // Store the index of the task being edited

// Initialize the list with tasks from localStorage
updateList();

// Add task event listener

addTaskButton.addEventListener("click", () => {
  const originalText = addTaskButton.textContent; // Store the original text
  addTaskButton.textContent = "Adding..."; // Change the button text

  const inputValue = taskInput.value.trim();

  if (inputValue === "") {
    showMessage("Task cannot be empty.", "red");
    resetButtonText();
    return;
  }

  if (inputValue.length < 5) {
    showMessage("Task must be at least 5 characters long.", "red");
    resetButtonText();
    return;
  }

  if (/^\d/.test(inputValue)) {
    showMessage("Task cannot start with a number.", "red");
    resetButtonText();
    return;
  }
  const isDuplicate = tasks.some(
    (task) => task.name.toLowerCase() === inputValue.toLowerCase()
  );
  if (isDuplicate) {
    showMessage("Task already exists.", "red");
    resetButtonText();
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

  // Reset the button text after the task is added
  resetButtonText();
});

// Function to reset the button text
function resetButtonText() {
  setTimeout(() => {
    addTaskButton.textContent = "Add Task"; // Reset the text to the original
  }, 990); // Delay for 1 second to simulate a loading effect
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
      if (confirm("Are you sure you want to delete this task?")) {
        tasks.splice(index, 1);
        saveTasks();
        updateList(filter);
      }
    });

    // Append buttons to actions container
    actionsContainer.appendChild(editButton);
    actionsContainer.appendChild(deleteButton);

    // Append elements to task item
    taskItem.appendChild(taskName); // Ensuring text is center
    taskItem.appendChild(checkbox);
    taskItem.appendChild(actionsContainer);

    // Append task item to the list
    todoList.appendChild(taskItem);
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
  saveTasks(); // Save changes to localStorage
  updateList();
  closeEditModal();
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
  .addEventListener("click", () => updateList("all"));
document
  .getElementById("showDone")
  .addEventListener("click", () => updateList("done"));
document
  .getElementById("showTodo")
  .addEventListener("click", () => updateList("todo"));

// Select the "Delete Done Tasks" and "Delete All Tasks" buttons
const deleteDoneButton = document.getElementById("deletdoneButton");
const deleteAllButton = document.getElementById("deletallButton");

// Add event listener to delete all tasks
deleteAllButton.addEventListener("click", () => {
  tasks = [];
  saveTasks(); // Save changes to localStorage
  updateList();
});

// Add event listener to delete only done tasks
deleteDoneButton.addEventListener("click", () => {
  tasks = tasks.filter((task) => !task.done);
  saveTasks(); // Save changes to localStorage
  updateList();
});
