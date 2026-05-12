const container = document.getElementById("recipe-container");

const params = new URLSearchParams(window.location.search);
const mealId = params.get("id");

const selectedIngredients = JSON.parse(
  localStorage.getItem("selectedIngredients") || "[]"
);

async function loadRecipe() {

  try {

    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
    );

    const data = await res.json();

    const meal = data.meals[0];

    const ingredients = [];

    for (let i = 1; i <= 20; i++) {

      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];

      if (ingredient && ingredient.trim()) {

        ingredients.push({
          name: ingredient.trim(),
          measure: measure.trim()
        });

      }
    }

    const checklist = ingredients.map(item => {

      const alreadyHave = selectedIngredients.some(selected =>
        item.name.toLowerCase().includes(selected.toLowerCase())
      );

      return `
        <label class="check-item ${alreadyHave ? "have" : "need"}">

          <input
            type="checkbox"
            ${alreadyHave ? "checked" : ""}
          >

          <span>
            ${item.measure} ${item.name}
            ${alreadyHave ? "✅ Have" : "🛒 Need"}
          </span>

        </label>
      `;
    }).join("");

    container.innerHTML = `

      <div class="recipe-page">

        <img
          class="recipe-image"
          src="${meal.strMealThumb}"
          alt="${meal.strMeal}"
        />

        <h2>${meal.strMeal}</h2>

        <h3>Ingredients Checklist</h3>

        <div class="checklist">
          ${checklist}
        </div>

        <h3>Instructions</h3>

        <p class="instructions">
          ${meal.strInstructions}
        </p>

      </div>

    `;

  } catch (err) {

    console.error(err);

    container.innerHTML = `
      <p>Failed to load recipe.</p>
    `;
  }
}

function goBack() {
  window.location.href = "index.html";
}

loadRecipe();