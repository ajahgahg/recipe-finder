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

  const status = document.getElementById("status");
  const results = document.getElementById("results");
  status.textContent = "Finding recipes...";
  results.innerHTML = "";

        try {
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            system: `You are a recipe assistant. When given a list of ingredients, suggest 3 recipes that use some or all of them. Respond ONLY with a JSON array of objects, no markdown, no extra text. Each object: { "name": string, "time": string, "difficulty": "easy"|"medium"|"hard", "uses": string[], "description": string (1-2 sentences) }`,
            messages: [{ role: "user", content: `Ingredients I have: ${selected.join(", ")}` }]
          })
        });