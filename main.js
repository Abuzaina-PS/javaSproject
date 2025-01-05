const button = document.getElementById("myButton");
const input = document.getElementById("myInput");
const result = document.getElementById("inputVal");

// Change button text on mouse events
button.addEventListener("mousedown", function () {
  button.textContent = "Adding Task...";
});

button.addEventListener("mouseup", function () {
  button.textContent = "Add New Task";
});

// Validate input on button click
button.addEventListener("click", function () {
  const inputValue = input.value.trim(); // Get the input value and remove extra spaces

  if (inputValue == "") {
    // Check if the input is empty
    result.textContent = "Task can not be empety.";
    result.style.color = "red";
    setTimeout(() => {
      result.textContent = "";
    }, 1000);
  } else if (inputValue.length < 4) {
    // Check if the input is less than 3 characters
    result.textContent = "task must be at least 5 charecters long";
    result.style.color = "red";
    setTimeout(() => {
      result.textContent = "";
    }, 1000);
  } else if (/^\d/.test(inputValue)) {
    // Check if the text starts with a number
    result.textContent = "Task can not starts with a number.";
    result.style.color = "red";
    setTimeout(() => {
      result.textContent = "";
    }, 1000);
  } else {
  }
});
