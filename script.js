const ingredientCategories = {
  Proteins: [
    { value: "chicken", emoji: "🍗" },
    { value: "beef", emoji: "🥩" },
    { value: "salmon", emoji: "🐟" },
    { value: "eggs", emoji: "🥚" },
    { value: "shrimp", emoji: "🍤" },
    { value: "tofu", emoji: "🟫" },
    { value: "pork", emoji: "🥓" }
  ],

  Vegetables: [
    { value: "broccoli", emoji: "🥦" },
    { value: "spinach", emoji: "🥬" },
    { value: "onion", emoji: "🧅" },
    { value: "garlic", emoji: "🧄" },
    { value: "tomatoes", emoji: "🍅" },
    { value: "carrot", emoji: "🥕" },
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
const selectedContainer = document.getElementById("selected-container");

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

/* ---------------------------
   SELECTED INGREDIENTS UI
----------------------------*/

function updateSelectedUI() {
  const selected = [...document.querySelectorAll(".chip.selected")];

  selectedContainer.innerHTML = selected.map(chip => {
    return `
      <div class="selected-pill" data-value="${chip.dataset.value}">
        ${chip.innerHTML} ✕
      </div>
    `;
  }).join("");

  // remove when clicking pill
  document.querySelectorAll(".selected-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      const value = pill.dataset.value;

      const chip = document.querySelector(`.chip[data-value="${value}"]`);
      if (chip) chip.classList.remove("selected");

      updateSelectedUI();
    });
  });
}

/* ---------------------------
   RENDER INGREDIENTS
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
      });

      grid.appendChild(chip);
    });

    container.appendChild(section);
  });
}

/* ---------------------------
   SEARCH
----------------------------*/

searchInput.addEventListener("input", () => {
  const value = searchInput.value.trim();

  if (!value) {
    container.innerHTML = "";
    container.classList.remove("show");
    return;
  }

  container.classList.add("show");
  renderIngredients(value);
});

/* ---------------------------
   API CALL
----------------------------*/

async function fetchMealsByIngredient(ingredient) {
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(ingredient)}`
  );

  const data = await res.json();
  return data.meals || [];
}

/* ---------------------------
   FIND RECIPES
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

  status.textContent = "Searching recipes...";
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

  sorted.forEach(meal => {
    const card = document.createElement("div");
    card.className = "recipe-card";

    card.onclick = () => {
      window.open(`https://www.themealdb.com/meal/${meal.idMeal}`, "_blank");
    };

    card.innerHTML = `
      <img src="${meal.strMealThumb}" />
      <div class="card-body">
        <h3>${meal.strMeal}</h3>
        <span>${meal.matchCount} match(es)</span>
      </div>
    `;

    results.appendChild(card);
  });
}

/* ---------------------------
   INIT
----------------------------*/

renderIngredients();