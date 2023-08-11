document.addEventListener("DOMContentLoaded", () => {
  const colorContainer = document.getElementById("color-container");
  const referenceColorDiv = document.getElementById("reference-color");
  const userColorDiv = document.getElementById("user-color");
  const redSlider = document.getElementById("red-slider");
  const greenSlider = document.getElementById("green-slider");
  const blueSlider = document.getElementById("blue-slider");
  const submitBtn = document.getElementById("submit-btn");
  const newColorBtn = document.getElementById("new-color-btn");
  const scoreDisplay = document.getElementById("score");

  submitBtn.style.display = "block"
  newColorBtn.style.display = "none"

  let targetColor;
  let alpha = 0.01; // adjust this based on the difficulty level

  function generateRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return { r, g, b };
  }

  function displayColor(color, element) {
    element.style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
  }

  function oldCalculateScore(userColor, targetColor) {
    const distance = Math.sqrt(
      (userColor.red - targetColor.red) ** 2 +
      (userColor.green - targetColor.green) ** 2 +
      (userColor.blue - targetColor.blue) ** 2
    );
    return Math.round(100 - (distance / 441) * 100); // 441 is the max distance between two RGB colors
  }

  // Helper function to calculate the Euclidean distance between two colors in RGB space
  function colorDistance(color1, color2) {
    const diffR = color1.r - color2.r;
    const diffG = color1.g - color2.g;
    const diffB = color1.b - color2.b;
    return Math.sqrt(diffR * diffR + diffG * diffG + diffB * diffB);
  }

  // Scoring algorithm with exponential function
  function calculateScore(userColor, targetColor, alpha) {
    const difference = colorDistance(userColor, targetColor);
    const score = 100 * Math.exp(-alpha * difference);
    return Math.round(score);
  }

  function updateScoreDisplay(score) {
    scoreDisplay.textContent = `Score: ${score}/100`;
  }

  function toggleButtons() {
    submitBtnCurrentDisplay = submitBtn.style.display;
    newColorBtnCurrentDisplay = newColorBtn.style.display;

    submitBtn.style.display = submitBtnCurrentDisplay == "none" ? "block" : "none";
    newColorBtn.style.display = newColorBtnCurrentDisplay == "none" ? "block" : "none";
  }

  function startNewRound() {
    targetColor = generateRandomColor();
    displayColor(targetColor, referenceColorDiv);
    redSlider.value = 127;
    greenSlider.value = 127;
    blueSlider.value = 127;
    submitBtn.disabled = false;
    updateUserColor();
  }

  function updateUserColor() {
    const userColor = {
      r: parseInt(redSlider.value),
      g: parseInt(greenSlider.value),
      b: parseInt(blueSlider.value),
    };
    displayColor(userColor, userColorDiv);
  }

  function handleSubmitClick() {
    const userColor = {
      r: parseInt(redSlider.value),
      g: parseInt(greenSlider.value),
      b: parseInt(blueSlider.value),
    };
    const score = calculateScore(userColor, targetColor, alpha);
    updateScoreDisplay(score);
    toggleButtons();
  }

  function handleNewColorClick() {
      startNewRound();
      toggleButtons();
  }

  updateScoreDisplay("")


  redSlider.addEventListener("input", updateUserColor);
  greenSlider.addEventListener("input", updateUserColor);
  blueSlider.addEventListener("input", updateUserColor);
  submitBtn.addEventListener("click", handleSubmitClick);
  newColorBtn.addEventListener("click", handleNewColorClick);

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
