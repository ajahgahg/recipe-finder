/* ---------------------------
   DOM REFERENCES
----------------------------*/

const container = document.getElementById("ingredients-container");
const selectedContainer = document.getElementById("selected-container");
const searchInput = document.getElementById("ingredient-search");

/* ---------------------------
   HELPER FUNCTIONS
----------------------------*/

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

async function fetchMealsByIngredient(ingredient) {
  try {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(ingredient)}`
    );
    const data = await res.json();
    return data.meals || [];
  } catch (err) {
    console.error(`Failed to fetch meals for ${ingredient}:`, err);
    return [];
  }
}

/* ---------------------------
   INGREDIENT DATA
----------------------------*/

const ingredientCategories = {
  Proteins: [
    { value: "chicken", emoji: "🍗" },
    { value: "beef", emoji: "🥩" },
    { value: "salmon", emoji: "🐟" },
    { value: "tuna", emoji: "🐠" },
    { value: "cod", emoji: "🐟" },
    { value: "eggs", emoji: "🥚" },
    { value: "shrimp", emoji: "🍤" },
    { value: "crab", emoji: "🦀" },
    { value: "lobster", emoji: "🦞" },
    { value: "tofu", emoji: "🟫" },
    { value: "pork", emoji: "🥓" },
    { value: "bacon", emoji: "🥓" },
    { value: "turkey", emoji: "🦃" },
    { value: "sausage", emoji: "🌭" },
    { value: "ham", emoji: "🍖" },
    { value: "beans", emoji: "🫘" },
    { value: "lentils", emoji: "🫘" },
    { value: "chickpeas", emoji: "🫘" }
  ],

  Vegetables: [
    { value: "broccoli", emoji: "🥦" },
    { value: "spinach", emoji: "🥬" },
    { value: "lettuce", emoji: "🥬" },
    { value: "cabbage", emoji: "🥬" },
    { value: "onion", emoji: "🧅" },
    { value: "garlic", emoji: "🧄" },
    { value: "tomatoes", emoji: "🍅" },
    { value: "carrot", emoji: "🥕" },
    { value: "corn", emoji: "🌽" },
    { value: "cucumber", emoji: "🥒" },
    { value: "bell pepper", emoji: "🫑" },
    { value: "jalapeno", emoji: "🌶️" },
    { value: "potato", emoji: "🥔" },
    { value: "sweet potato", emoji: "🍠" },
    { value: "mushroom", emoji: "🍄" },
    { value: "peas", emoji: "🫛" },
    { value: "zucchini", emoji: "🥒" },
    { value: "eggplant", emoji: "🍆" },
    { value: "avocado", emoji: "🥑" }
  ],

  Fruits: [
    { value: "apple", emoji: "🍎" },
    { value: "banana", emoji: "🍌" },
    { value: "orange", emoji: "🍊" },
    { value: "strawberry", emoji: "🍓" },
    { value: "blueberry", emoji: "🫐" },
    { value: "grapes", emoji: "🍇" },
    { value: "watermelon", emoji: "🍉" },
    { value: "pineapple", emoji: "🍍" },
    { value: "mango", emoji: "🥭" },
    { value: "peach", emoji: "🍑" },
    { value: "pear", emoji: "🍐" },
    { value: "kiwi", emoji: "🥝" },
    { value: "lemon", emoji: "🍋" },
    { value: "lime", emoji: "🍋" },
    { value: "cherries", emoji: "🍒" }
  ],

  Dairy: [
    { value: "milk", emoji: "🥛" },
    { value: "cheese", emoji: "🧀" },
    { value: "butter", emoji: "🧈" },
    { value: "yogurt", emoji: "🥣" },
    { value: "cream", emoji: "🍶" }
  ],

  Grains: [
    { value: "rice", emoji: "🍚" },
    { value: "pasta", emoji: "🍝" },
    { value: "bread", emoji: "🍞" },
    { value: "noodles", emoji: "🍜" },
    { value: "oats", emoji: "🥣" },
    { value: "quinoa", emoji: "🌾" },
    { value: "tortilla", emoji: "🫓" }
  ],

  Spices: [
    { value: "salt", emoji: "🧂" },
    { value: "pepper", emoji: "⚫" },
    { value: "paprika", emoji: "🌶️" },
    { value: "curry powder", emoji: "🍛" },
    { value: "oregano", emoji: "🌿" },
    { value: "basil", emoji: "🌿" },
    { value: "cinnamon", emoji: "🪵" }
  ],

  Snacks: [
    { value: "chocolate", emoji: "🍫" },
    { value: "cookies", emoji: "🍪" },
    { value: "popcorn", emoji: "🍿" },
    { value: "chips", emoji: "🥔" },
    { value: "nuts", emoji: "🥜" }
  ]
};

/* ---------------------------
   KEEP TRACK OF SELECTED ITEMS
----------------------------*/

const selectedIngredients = new Set();

/* ---------------------------
   SELECTED INGREDIENTS UI
----------------------------*/

function updateSelectedUI() {
  if (!selectedIngredients.size) {
    selectedContainer.innerHTML = "";
    return;
  }

  selectedContainer.innerHTML = `
    <div class="selected-wrapper">
      ${[...selectedIngredients].map(value => {
        const ingredient = Object.values(ingredientCategories)
          .flat()
          .find(i => i.value === value);

        return `
          <div class="selected-pill" data-value="${value}">
            ${ingredient.emoji} ${capitalize(value)}
            <span class="remove">×</span>
          </div>
        `;
      }).join("")}
    </div>
  `;

  document.querySelectorAll(".selected-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      const value = pill.dataset.value;

      selectedIngredients.delete(value);

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

      if (selectedIngredients.has(ing.value)) {
        chip.classList.add("selected");
      }

      chip.innerHTML = `${ing.emoji} ${capitalize(ing.value)}`;

      chip.addEventListener("click", () => {

        if (selectedIngredients.has(ing.value)) {
          selectedIngredients.delete(ing.value);
          chip.classList.remove("selected");
        } else {
          selectedIngredients.add(ing.value);
          chip.classList.add("selected");
        }

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
  container.classList.add("show");
  renderIngredients(value);
});

searchInput.addEventListener("focus", () => {
  container.classList.add("show");
});

/* ---------------------------
   FIND RECIPES
----------------------------*/

async function findRecipes() {
  const selected = [...selectedIngredients];
  const status = document.getElementById("status");
  const results = document.getElementById("results");

  if (!selected.length) {
    status.textContent = "Pick at least one ingredient first.";
    return;
  }

  status.textContent = `Searching recipes for: ${selected.join(", ")}...`;
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
      matchCount: count,
      totalIngredients: selected.length
    }));

  if (!sorted.length) {
    status.textContent = "No recipes found for those ingredients.";
    return;
  }

  const best = sorted[0].matchCount;
  status.textContent = `${sorted.length} recipes found — sorted by best ingredient match`;

  sorted.forEach(meal => {
    const card = document.createElement("div");
    card.className = "recipe-card";

    const matchLabel = meal.totalIngredients > 1
      ? `${meal.matchCount} of ${meal.totalIngredients} ingredients matched`
      : "1 ingredient matched";

    card.onclick = () => {
      window.open(`https://www.themealdb.com/meal/${meal.idMeal}`, "_blank");
    };

    card.innerHTML = `
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      <div class="card-body">
        <h3>${meal.strMeal}</h3>
        <span>${matchLabel}</span>
      </div>
    `;

    results.appendChild(card);
  });
}

/* ---------------------------
   INIT
----------------------------*/

container.classList.add("show");
renderIngredients();
updateSelectedUI();