const ingredientCategories = {
  Proteins: [
    { value: "chicken", emoji: "🍗" },
    { value: "beef", emoji: "🥩" },
    { value: "salmon", emoji: "🐟" },
    { value: "eggs", emoji: "🥚" },
    { value: "shrimp", emoji: "🍤" },
    { value: "tofu", emoji: "🟫" },
    { value: "turkey", emoji: "🍖" },
    { value: "pork", emoji: "🥓" },
    { value: "beans", emoji: "🫘" }
  ],

  Vegetables: [
    { value: "broccoli", emoji: "🥦" },
    { value: "spinach", emoji: "🥬" },
    { value: "onion", emoji: "🧅" },
    { value: "garlic", emoji: "🧄" },
    { value: "tomatoes", emoji: "🍅" },
    { value: "carrot", emoji: "🥕" },
    { value: "potatoes", emoji: "🥔" },
    { value: "avocado", emoji: "🥑" }
  ],

  Fruits: [
    { value: "apple", emoji: "🍎" },
    { value: "banana", emoji: "🍌" },
    { value: "orange", emoji: "🍊" },
    { value: "strawberry", emoji: "🍓" }
  ]
};

const container = document.getElementById("ingredients-container");
const searchInput = document.getElementById("ingredient-search");

let selectedMode = false;

/* ---------------------------
   UI HELPERS
----------------------------*/

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function updateSelectedUI() {
  const selectedContainer = document.getElementById("selected-container");

  const selected = [...document.querySelectorAll(".chip.selected")];

  selectedContainer.innerHTML = selected.map(chip => {
    return `<div class="selected-pill">${chip.innerHTML}</div>`;
  }).join("");
}

/* ---------------------------
   RENDER ALL (SEARCH MODE)
----------------------------*/

function renderIngredients(searchTerm = "") {
  container.innerHTML = "";

  Object.entries(ingredientCategories).forEach(([category, items]) => {

    const filtered = searchTerm
      ? items.filter(i =>
          i.value.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : items;

    if (!filtered.length) return;

    const section = document.createElement("div");
    section.className = "category";

    section.innerHTML = `
      <h2>${category}</h2>
      <div class="ingredient-grid"></div>
    `;

    const grid = section.querySelector(".ingredient-grid");

    filtered.forEach(ing => {
      const chip = document.createElement("div");

      chip.className = "chip";
      chip.dataset.value = ing.value;

      chip.innerHTML = `${ing.emoji} ${capitalize(ing.value)}`;

      chip.addEventListener("click", () => {
        chip.classList.toggle("selected");
        updateSelectedUI();

        selectedMode = true;
        renderSelectedOnly();
      });

      grid.appendChild(chip);
    });

    container.appendChild(section);
  });
}

/* ---------------------------
   SELECTED ONLY VIEW
----------------------------*/

function renderSelectedOnly() {
  container.innerHTML = "";

  const selected = [...document.querySelectorAll(".chip.selected")];

  if (!selected.length) {
    container.innerHTML = "<p>No ingredients selected.</p>";
    return;
  }

  const section = document.createElement("div");
  section.className = "category";

  section.innerHTML = `
    <h2>Selected Ingredients</h2>
    <div class="ingredient-grid"></div>
  `;

  const grid = section.querySelector(".ingredient-grid");

  selected.forEach(chip => {
    const clone = chip.cloneNode(true);

    clone.addEventListener("click", () => {
      chip.classList.remove("selected");
      updateSelectedUI();
      renderSelectedOnly();
    });

    grid.appendChild(clone);
  });

  container.appendChild(section);
}

/* ---------------------------
   SEARCH
----------------------------*/

searchInput.addEventListener("input", () => {
  const value = searchInput.value.trim();

  selectedMode = false;

  if (!value) {
    container.innerHTML = "";
    return;
  }

  renderIngredients(value);
});

/* ---------------------------
   API (UNCHANGED)
----------------------------*/

async function fetchMealsByIngredient(ingredient) {
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(ingredient)}`
  );

  const data = await res.json();
  return data.meals || [];
}

/* ---------------------------
   FIND RECIPES (UNCHANGED)
----------------------------*/

async function findRecipes() {
  const selected = [...document.querySelectorAll(".chip.selected")]
    .map(c => c.dataset.value);

  const status = document.getElementById("status");
  const results = document.getElementById("results");

  if (!selected.length) {
    status.textContent = "Pick at least one ingredient first.";
    return;
  }

  status.textContent = "Searching...";
  results.innerHTML = "";

  const allResults = await Promise.all(
    selected.map(fetchMealsByIngredient)
  );

  const mealCount = {};
  const mealData = {};

  allResults.forEach(meals => {
    meals.forEach(meal => {
      mealCount[meal.idMeal] = (mealCount[meal.idMeal] || 0) + 1;
      mealData[meal.idMeal] = meal;
    });
  });

  const sorted = Object.entries(mealCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([id, count]) => ({
      ...mealData[id],
      matchCount: count
    }));

  if (!sorted.length) {
    status.textContent = "No recipes found.";
    return;
  }

  status.textContent = `${sorted.length} recipes found`;

  sorted.forEach(m => {
    const card = document.createElement("div");
    card.className = "recipe-card";

    card.onclick = () => {
      window.open(`https://www.themealdb.com/meal/${m.idMeal}`, "_blank");
    };

    card.innerHTML = `
      <img src="${m.strMealThumb}" />
      <div>
        <h3>${m.strMeal}</h3>
        <p>${m.matchCount} match(es)</p>
      </div>
    `;

    results.appendChild(card);
  });
}