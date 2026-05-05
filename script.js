const ingredients = [
      { value: "chicken", emoji: "🍗" },
      { value: "rice", emoji: "🍚" },
      { value: "cheese", emoji: "🧀" },
      { value: "eggs", emoji: "🥚" },
      { value: "pasta", emoji: "🍝" },
      { value: "tomatoes", emoji: "🍅" },
      { value: "onion", emoji: "🧅" },
      { value: "garlic", emoji: "🧄" },
      { value: "spinach", emoji: "🥬" },
      { value: "potatoes", emoji: "🥔" },
      { value: "beef", emoji: "🥩" },
      { value: "salmon", emoji: "🐟" },
      { value: "broccoli", emoji: "🥦" },
      { value: "mushrooms", emoji: "🍄" },
      { value: "lemon", emoji: "🍋" },
      { value: "butter", emoji: "🧈" },
    ];

    const grid = document.getElementById("grid");
ingredients.forEach(ing => {
  const chip = document.createElement("label");
  chip.className = "chip";
  chip.innerHTML = `<input type="checkbox" value="${ing.value}"><span class="dot"></span><span style="font-size:15px">${ing.emoji}</span>${ing.value.charAt(0).toUpperCase() + ing.value.slice(1)}`;
  chip.addEventListener("change", () => chip.classList.toggle("selected", chip.querySelector("input").checked));
  grid.appendChild(chip);
});

async function findRecipes() {
  const selected = [...document.querySelectorAll(".chip input:checked")].map(i => i.value);
  if (!selected.length) {
    document.getElementById("status").textContent = "Pick at least one ingredient first.";
    return;
  }