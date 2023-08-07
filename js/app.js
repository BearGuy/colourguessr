document.addEventListener("DOMContentLoaded", () => {
  const colorContainer = document.getElementById("color-container");
  const referenceColorDiv = document.getElementById("reference-color");
  const userColorDiv = document.getElementById("user-color");
  const redSlider = document.getElementById("red-slider");
  const greenSlider = document.getElementById("green-slider");
  const blueSlider = document.getElementById("blue-slider");
  const submitBtn = document.getElementById("submit-btn");
  const scoreDisplay = document.getElementById("score");

  let targetColor;

  function generateRandomColor() {
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);
    return { red, green, blue };
  }

  function displayColor(color, element) {
    element.style.backgroundColor = `rgb(${color.red}, ${color.green}, ${color.blue})`;
  }

  function calculateScore(userColor, targetColor) {
    const distance = Math.sqrt(
      (userColor.red - targetColor.red) ** 2 +
      (userColor.green - targetColor.green) ** 2 +
      (userColor.blue - targetColor.blue) ** 2
    );
    return Math.round(100 - (distance / 441) * 100); // 441 is the max distance between two RGB colors
  }

  function updateScoreDisplay(score) {
    scoreDisplay.textContent = `Score: ${score}/100`;
  }

  function startNewRound() {
    targetColor = generateRandomColor();
    displayColor(targetColor, referenceColorDiv);
    updateScoreDisplay("");
    redSlider.value = 127;
    greenSlider.value = 127;
    blueSlider.value = 127;
    updateUserColor();
  }

  function updateUserColor() {
    const userColor = {
      red: parseInt(redSlider.value),
      green: parseInt(greenSlider.value),
      blue: parseInt(blueSlider.value),
    };
    displayColor(userColor, userColorDiv);
  }

  function handleSubmitClick() {
    const userColor = {
      red: parseInt(redSlider.value),
      green: parseInt(greenSlider.value),
      blue: parseInt(blueSlider.value),
    };
    const score = calculateScore(userColor, targetColor);
    updateScoreDisplay(score);
  }

  document.getElementById("new-color-btn").addEventListener("click", startNewRound);

  redSlider.addEventListener("input", updateUserColor);
  greenSlider.addEventListener("input", updateUserColor);
  blueSlider.addEventListener("input", updateUserColor);
  submitBtn.addEventListener("click", handleSubmitClick);

  startNewRound();
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker
      .register("/serviceWorker.js")
      .then(res => console.log("service worker registered"))
      .catch(err => console.log("service worker not registered", err))
  })
}
