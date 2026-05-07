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
  const chip = document.createElement("div");
  chip.className = "chip";
  chip.dataset.value = ing.value;
  chip.innerHTML = `<span class="dot"></span><span>${ing.emoji}</span>${ing.value.charAt(0).toUpperCase() + ing.value.slice(1)}`;
  chip.addEventListener("click", () => chip.classList.toggle("selected"));
  grid.appendChild(chip);
});
 
async function fetchMealsByIngredient(ingredient) {
  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
  const data = await res.json();
  return data.meals || [];
}
 
async function findRecipes() {
  const selected = [...document.querySelectorAll(".chip.selected")].map(c => c.dataset.value);
  const status = document.getElementById("status");
  const results = document.getElementById("results");
 
  if (!selected.length) {
    status.textContent = "Pick at least one ingredient first.";
    return;
  }
 
  status.innerHTML = `<span class="loader"></span>Searching recipes...`;
  results.innerHTML = "";
 
  try {
    const allResults = await Promise.all(selected.map(fetchMealsByIngredient));
 
    const mealCount = {};
    const mealData = {};
    allResults.forEach((meals, i) => {
      meals.forEach(meal => {
        mealCount[meal.idMeal] = (mealCount[meal.idMeal] || 0) + 1;
        mealData[meal.idMeal] = { ...meal, matchedIngredient: selected[i] };
      });
    });
 
    const sorted = Object.entries(mealCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([id, count]) => ({ ...mealData[id], matchCount: count }));
 
    if (!sorted.length) {
      status.textContent = "No recipes found. Try different ingredients.";
      return;
    }
 
    status.textContent = `${sorted.length} recipes found`;
    results.innerHTML = sorted.map(m => `
      <div class="recipe-card" onclick="window.open('https://www.themealdb.com/meal/${m.idMeal}', '_blank')">
        <img src="${m.strMealThumb}/preview" alt="${m.strMeal}" loading="lazy" />
        <div class="card-body">
          <h3>${m.strMeal}</h3>
          <div class="badges">
            <span class="badge highlight">${m.matchCount} ingredient${m.matchCount > 1 ? 's' : ''} matched</span>
          </div>
        </div>
      </div>
    `).join("");
  } catch (e) {
    status.textContent = "Something went wrong. Try again.";
    console.error(e);
  }
}