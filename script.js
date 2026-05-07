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
    { value: "tuna", emoji: "🐠" },
    { value: "sausage", emoji: "🌭" },
    { value: "ham", emoji: "🍖" },
    { value: "bacon", emoji: "🥓" },
    { value: "beans", emoji: "🫘" },
    { value: "lentils", emoji: "🫘" },
    { value: "chickpeas", emoji: "🫘" }
  ],

  Vegetables: [
    { value: "broccoli", emoji: "🥦" },
    { value: "spinach", emoji: "🥬" },
    { value: "onion", emoji: "🧅" },
    { value: "garlic", emoji: "🧄" },
    { value: "tomatoes", emoji: "🍅" },
    { value: "mushrooms", emoji: "🍄" },
    { value: "potatoes", emoji: "🥔" },
    { value: "carrot", emoji: "🥕" },
    { value: "corn", emoji: "🌽" },
    { value: "pepper", emoji: "🫑" },
    { value: "cucumber", emoji: "🥒" },
    { value: "lettuce", emoji: "🥬" },
    { value: "zucchini", emoji: "🥒" },
    { value: "peas", emoji: "🫛" },
    { value: "green beans", emoji: "🫛" },
    { value: "cauliflower", emoji: "🥦" },
    { value: "sweet potato", emoji: "🍠" },
    { value: "celery", emoji: "🥬" },
    { value: "cabbage", emoji: "🥬" },
    { value: "avocado", emoji: "🥑" }
  ],

  Fruits: [
    { value: "apple", emoji: "🍎" },
    { value: "banana", emoji: "🍌" },
    { value: "lemon", emoji: "🍋" },
    { value: "lime", emoji: "🍋" },
    { value: "orange", emoji: "🍊" },
    { value: "strawberry", emoji: "🍓" },
    { value: "blueberry", emoji: "🫐" },
    { value: "pineapple", emoji: "🍍" },
    { value: "grapes", emoji: "🍇" },
    { value: "peach", emoji: "🍑" }
  ],

  GrainsAndCarbs: [
    { value: "rice", emoji: "🍚" },
    { value: "pasta", emoji: "🍝" },
    { value: "bread", emoji: "🍞" },
    { value: "noodles", emoji: "🍜" },
    { value: "oats", emoji: "🥣" },
    { value: "tortilla", emoji: "🌮" },
    { value: "quinoa", emoji: "🥣" },
    { value: "couscous", emoji: "🥣" },
    { value: "bagel", emoji: "🥯" },
    { value: "flour", emoji: "🌾" },
    { value: "crackers", emoji: "🍘" }
  ],

  Dairy: [
    { value: "cheese", emoji: "🧀" },
    { value: "milk", emoji: "🥛" },
    { value: "butter", emoji: "🧈" },
    { value: "yogurt", emoji: "🍶" },
    { value: "cream", emoji: "🥛" },
    { value: "mozzarella", emoji: "🧀" },
    { value: "parmesan", emoji: "🧀" },
    { value: "feta", emoji: "🧀" }
  ]
};

const container = document.getElementById("ingredients-container");
const searchInput = document.getElementById("ingredient-search");

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

/* ---------------------------
   SELECTED INGREDIENT UI
----------------------------*/

function updateSelectedUI() {
  const selectedContainer = document.getElementById("selected-container");

  const selected = [...document.querySelectorAll(".chip.selected")];

  selectedContainer.innerHTML = selected.map(chip => {
    return `<div class="selected-pill">${chip.innerHTML}</div>`;
  }).join("");
}

/* ---------------------------
   RENDER INGREDIENTS
----------------------------*/

function renderIngredients(searchTerm = "") {
  container.innerHTML = "";

  Object.entries(ingredientCategories).forEach(([category, items]) => {

    const filteredItems = searchTerm.trim() === ""
      ? items
      : items.filter(ing =>
          ing.value.toLowerCase().includes(searchTerm.toLowerCase())
        );

    if (!filteredItems.length) return;

    const section = document.createElement("div");
    section.className = "category";

    section.innerHTML = `
      <h2>${category}</h2>
      <div class="ingredient-grid"></div>
    `;

    const grid = section.querySelector(".ingredient-grid");

    filteredItems.forEach(ing => {

      const chip = document.createElement("div");

      chip.className = "chip";
      chip.dataset.value = ing.value;

      chip.innerHTML = `
        <span>${ing.emoji}</span>
        ${capitalize(ing.value)}
      `;

      chip.addEventListener("click", () => {
        chip.classList.toggle("selected");
        updateSelectedUI();
      });

      grid.appendChild(chip);
    });

    container.appendChild(section);
  });

  updateSelectedUI();
}

/* ---------------------------
   SEARCH
----------------------------*/

searchInput.addEventListener("input", () => {
  renderIngredients(searchInput.value);
  document.getElementById("status").textContent = "";
});

/* ---------------------------
   API FETCH
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

  status.innerHTML = "🔍 Searching recipes...";
  results.innerHTML = "";

  try {

    const allResults = await Promise.all(
      selected.map(fetchMealsByIngredient)
    );

    const mealCount = {};
    const mealData = {};

    allResults.forEach(meals => {
      meals.forEach(meal => {

        mealCount[meal.idMeal] =
          (mealCount[meal.idMeal] || 0) + 1;

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

    results.innerHTML = "";

    sorted.forEach(m => {

      const card = document.createElement("div");
      card.className = "recipe-card";

      card.addEventListener("click", () => {
        window.open(
          `https://www.themealdb.com/meal/${m.idMeal}`,
          "_blank"
        );
      });

      card.innerHTML = `
        <img src="${m.strMealThumb}" alt="${m.strMeal}" loading="lazy" />
        <div class="card-body">
          <h3>${m.strMeal}</h3>
          <span class="badge">
            ${m.matchCount} ingredient${m.matchCount > 1 ? "s" : ""} matched
          </span>
        </div>
      `;

      results.appendChild(card);
    });

  } catch (err) {
    console.error(err);
    status.textContent = "Something went wrong.";
  }
}

/* ---------------------------
   INIT
----------------------------*/

renderIngredients();