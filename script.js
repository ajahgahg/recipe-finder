const ingredientCategories = {
  Proteins: [
    { value: "chicken", emoji: "🍗" },
    { value: "beef", emoji: "🥩" },
    { value: "salmon", emoji: "🐟" },
    { value: "eggs", emoji: "🥚" },
    { value: "shrimp", emoji: "🍤" },
    { value: "tofu", emoji: "🧈" },
    { value: "turkey", emoji: "🍖" }
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
    { value: "pepper", emoji: "🫑" }
  ],

  GrainsAndCarbs: [
    { value: "rice", emoji: "🍚" },
    { value: "pasta", emoji: "🍝" },
    { value: "bread", emoji: "🍞" },
    { value: "noodles", emoji: "🍜" },
    { value: "oats", emoji: "🥣" }
  ],

  Dairy: [
    { value: "cheese", emoji: "🧀" },
    { value: "milk", emoji: "🥛" },
    { value: "butter", emoji: "🧈" },
    { value: "yogurt", emoji: "🍶" }
  ],

  FruitsAndExtras: [
    { value: "lemon", emoji: "🍋" },
    { value: "apple", emoji: "🍎" },
    { value: "avocado", emoji: "🥑" },
    { value: "beans", emoji: "🫘" },
    { value: "chili", emoji: "🌶️" }
  ]
};

const container = document.getElementById("ingredients-container");

Object.entries(ingredientCategories).forEach(([category, items]) => {
  const section = document.createElement("div");

  section.className = "category";

  section.innerHTML = `
    <h2>${formatCategoryName(category)}</h2>
    <div class="ingredient-grid"></div>
  `;

  const grid = section.querySelector(".ingredient-grid");

  items.forEach(ing => {
    const chip = document.createElement("div");

    chip.className = "chip";
    chip.dataset.value = ing.value;

    chip.innerHTML = `
      <span class="dot"></span>
      <span>${ing.emoji}</span>
      ${capitalize(ing.value)}
    `;

    chip.addEventListener("click", () => {
      chip.classList.toggle("selected");
    });

    grid.appendChild(chip);
  });

  container.appendChild(section);
});

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function formatCategoryName(name) {
  return name.replace(/([A-Z])/g, " $1").trim();
}

async function fetchMealsByIngredient(ingredient) {
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`
  );

  const data = await res.json();

  return data.meals || [];
}

async function findRecipes() {
  const selected = [
    ...document.querySelectorAll(".chip.selected")
  ].map(c => c.dataset.value);

  const status = document.getElementById("status");
  const results = document.getElementById("results");

  if (!selected.length) {
    status.textContent = "Pick at least one ingredient first.";
    return;
  }

  status.innerHTML = `
    <span class="loader"></span>
    Searching recipes...
  `;

  results.innerHTML = "";

  try {
    const allResults = await Promise.all(
      selected.map(fetchMealsByIngredient)
    );

    const mealCount = {};
    const mealData = {};

    allResults.forEach((meals) => {
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
      status.textContent =
        "No recipes found. Try different ingredients.";
      return;
    }

    status.textContent = `${sorted.length} recipes found`;

    results.innerHTML = sorted.map(m => `
      <div class="recipe-card"
        onclick="window.open(
          'https://www.themealdb.com/meal/${m.idMeal}',
          '_blank'
        )">

        <img
          src="${m.strMealThumb}"
          alt="${m.strMeal}"
          loading="lazy"
        />

        <div class="card-body">
          <h3>${m.strMeal}</h3>

          <div class="badges">
            <span class="badge highlight">
              ${m.matchCount}
              ingredient${m.matchCount > 1 ? 's' : ''}
              matched
            </span>
          </div>
        </div>
      </div>
    `).join("");

  } catch (e) {
    console.error(e);

    status.textContent =
      "Something went wrong. Try again.";
  }
}