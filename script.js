/* ---------------------------
   DOM REFERENCES
----------------------------*/

const container = document.getElementById("ingredients-container"); //takes element from html, and puts in javascript so js can use it
const selectedContainer = document.getElementById("selected-container"); //takes element from html, and puts in javascript so js can use it
const searchInput = document.getElementById("ingredient-search"); //takes element from html, and puts in javascript so js can use it

/* ---------------------------
   HELPER FUNCTIONS
----------------------------*/

function capitalize(str) { //capatilizes words
  return str.charAt(0).toUpperCase() + str.slice(1); //removes first letter from word, and changes it to uppercase
}

async function fetchMealsByIngredient(ingredient) { //takes data from the api, async function
  try { //incase anything goes wrong - error handling, java scriptw ill save it!
    const url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(ingredient)}`; //fetches free recipe api
    const res = await fetch(url); //fetches api 

    if (!res.ok) { //makes sure the request for api is successful
      console.warn(`API returned ${res.status} for ingredient: ${ingredient}`); //goes to console and warns if api returned an ingredient
      return []; 
    }

    const data = await res.json(); //turns api data to javasciprt data
    console.log(`Results for "${ingredient}":`, data.meals?.length ?? 0, "meals"); //prints amount of meals located
    return data.meals || []; //makes sure meals never equals null
  } catch (err) { 
    console.error(`Network error fetching "${ingredient}":`, err.message); //this will be here incase an error in the api happens or an ingredeint doesnt exist
    return []; //returns the data from the api
  }
}
/* ---------------------------
   INGREDIENT DATA
----------------------------*/

const ingredientCategories = { //creates a value for all the ingredients so it shows up
  Proteins: [
    { value: "chicken", emoji: "🍗" },
    { value: "beef", emoji: "🥩" },
    { value: "ground beef", emoji: "🥩" },
    { value: "salmon", emoji: "🐟" },
    { value: "tuna", emoji: "🐠" },
    { value: "cod", emoji: "🐟" },
    { value: "tilapia", emoji: "🐟" },
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
    { value: "chicken breast", emoji: "🍗" },
    { value: "chicken thigh", emoji: "🍗" },
    { value: "beans", emoji: "🫘" },
    { value: "black beans", emoji: "🫘" },
    { value: "kidney beans", emoji: "🫘" },
    { value: "lentils", emoji: "🫘" },
    { value: "chickpeas", emoji: "🫘" }
  ],

  Vegetables: [
    { value: "broccoli", emoji: "🥦" },
    { value: "spinach", emoji: "🥬" },
    { value: "lettuce", emoji: "🥬" },
    { value: "cabbage", emoji: "🥬" },
    { value: "kale", emoji: "🥬" },
    { value: "onion", emoji: "🧅" },
    { value: "garlic", emoji: "🧄" },
    { value: "tomato", emoji: "🍅" },
    { value: "carrot", emoji: "🥕" },
    { value: "corn", emoji: "🌽" },
    { value: "cucumber", emoji: "🥒" },
    { value: "bell pepper", emoji: "🫑" },
    { value: "jalapeno", emoji: "🌶️" },
    { value: "potato", emoji: "🥔" },
    { value: "sweet potato", emoji: "🍠" },
    { value: "mushroom", emoji: "🍄" },
    { value: "peas", emoji: "🫛" },
    { value: "green beans", emoji: "🫛" },
    { value: "zucchini", emoji: "🥒" },
    { value: "eggplant", emoji: "🍆" },
    { value: "avocado", emoji: "🥑" },
    { value: "celery", emoji: "🥬" }
  ],

  Fruits: [
    { value: "apple", emoji: "🍎" },
    { value: "banana", emoji: "🍌" },
    { value: "orange", emoji: "🍊" },
    { value: "strawberry", emoji: "🍓" },
    { value: "blueberry", emoji: "🫐" },
    { value: "raspberry", emoji: "🍓" },
    { value: "blackberry", emoji: "🫐" },
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
    { value: "cheddar cheese", emoji: "🧀" },
    { value: "mozzarella", emoji: "🧀" },
    { value: "butter", emoji: "🧈" },
    { value: "yogurt", emoji: "🥣" },
    { value: "cream", emoji: "🍶" },
    { value: "sour cream", emoji: "🥣" },
  { value: "cheese slices", emoji: "🧀" }
  ],

  Grains: [
    { value: "rice", emoji: "🍚" },
    { value: "white rice", emoji: "🍚" },
    { value: "brown rice", emoji: "🍚" },
    { value: "pasta", emoji: "🍝" },
    { value: "spaghetti", emoji: "🍝" },
    { value: "bread", emoji: "🍞" },
    { value: "noodles", emoji: "🍜" },
    { value: "ramen noodles", emoji: "🍜" },
    { value: "oats", emoji: "🥣" },
    { value: "quinoa", emoji: "🌾" },
    { value: "tortilla", emoji: "🫓" },
    { value: "flour", emoji: "🌾" },
    { value: "couscous", emoji: "🌾" }
  ],

  Spices: [
    { value: "salt", emoji: "🧂" },
    { value: "pepper", emoji: "⚫" },
    { value: "black pepper", emoji: "⚫" },
    { value: "paprika", emoji: "🌶️" },
    { value: "curry powder", emoji: "🍛" },
    { value: "oregano", emoji: "🌿" },
    { value: "basil", emoji: "🌿" },
    { value: "thyme", emoji: "🌿" },
    { value: "rosemary", emoji: "🌿" },
    { value: "cinnamon", emoji: "🪵" },
    { value: "garlic powder", emoji: "🧄" },
    { value: "onion powder", emoji: "🧅" }
  ],

  Snacks: [
    { value: "chocolate", emoji: "🍫" },
    { value: "cookies", emoji: "🍪" },
    { value: "popcorn", emoji: "🍿" },
    { value: "chips", emoji: "🥔" },
    { value: "potato chips", emoji: "🥔" },
    { value: "nuts", emoji: "🥜" },
    { value: "peanuts", emoji: "🥜" },
    { value: "almonds", emoji: "🥜" },
    { value: "pretzels", emoji: "🥨" }
  ],

   Liquids: [
    { value: "ketchup", emoji: "🟥" },
    { value: "mustard", emoji: "🟨" },
    { value: "mayo", emoji: "⬜" },
    { value: "chicken stock", emoji: "🐔" },
    { value: "olive oil", emoji: "🫒" },
    { value: "water", emoji: "💧" },
    { value: "red wine", emoji: "🟥" }
  ]
};
/* ---------------------------
   KEEP TRACK OF SELECTED ITEMS
----------------------------*/

const selectedIngredients = new Set(); //creates a const for all of the ingredients and it shows them in the categories

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
 //this will ensure that the pill will capitilize the ingredients, then will also show the emoji that i put
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
    `; //line above makes a div for the ingredients,

    const grid = section.querySelector(".ingredient-grid"); //another grid is made so that the ingredients can be selected

    filtered.forEach(ing => { //
      const chip = document.createElement("div");

      chip.className = "chip";
      chip.dataset.value = ing.value;

      if (selectedIngredients.has(ing.value)) { //when an ingredient is clicked it has a value
        chip.classList.add("selected");
      }

      chip.innerHTML = `${ing.emoji} ${capitalize(ing.value)}`;

      chip.addEventListener("click", () => { // an event listener for when a click happens, the ingredient is selcted

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
  if (value) {
    container.classList.add("show");
    renderIngredients(value);
  } else {
    container.classList.remove("show");
  }
});

searchInput.addEventListener("focus", () => { //when something is searched it will make sure that the function happens below
  if (searchInput.value.trim()) { //trims down the ingredients 
    container.classList.add("show"); //shows all available ingredients that match what is searched
  }
});

/* ---------------------------
   FIND RECIPES
----------------------------*/

async function findRecipes() { //is connected to button so that recipes can be found
  const selected = [...selectedIngredients];  //takes the selected ingredients and makes it a const
  const status = document.getElementById("status");  //
  const results = document.getElementById("results"); 

  if (!selected.length) {
    status.textContent = "Pick at least one ingredient first."; //makes sure that user chooses any ingreidents before pressing the button
    return;
  }

  status.textContent = `Searching recipes for: ${selected.join(", ")}...`;
  results.innerHTML = "";

  const allResults = await Promise.all(
    selected.map(fetchMealsByIngredient)
  );

  console.log("All API results:", allResults);

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
    const totalRaw = allResults.flat().length;
    if (totalRaw === 0) {
      status.textContent = "⚠️ Could not reach the recipe API. Check your internet connection or open the browser console for details."; //response incase their is no recipe that can be found
    } else {
      status.textContent = "No recipes found for those ingredients."; //if an ingredient doesn't exist, then this message will show
    }
    return;
  }

  const best = sorted[0].matchCount; //creates a list of best meals, for example if the most ingredients match it will show
  status.textContent = `${sorted.length} recipes found — sorted by best ingredient match`; //just the text that is shown when meal is found

  sorted.forEach(meal => {  
    const card = document.createElement("div"); //creates a card, by using html elements and this card will show when recipes are found
    card.className = "recipe-card"; //creates a card for the recipes
 
    const matchLabel = meal.totalIngredients > 1 //if the ingredient is more than one, it will write the text below.
      ? `${meal.matchCount} of ${meal.totalIngredients} ingredients matched` //creates the text for the amount of ingredients chosen, and amount of meals that match
      : "1 ingredient matched"; //incase only 1 ingredient is put, it will do 1 ingredient matched instead of staying 1 ingredients matched

    card.onclick = () => {
  localStorage.setItem(
    "selectedIngredients",
    JSON.stringify([...selectedIngredients]) 
  );

  window.location.href = `recipe.html?id=${meal.idMeal}`; //it takes a meal from the api and gets the website
};

    card.innerHTML = ` 
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" /> 
      <div class="card-body"> 
        <h3>${meal.strMeal}</h3>
        <span>${matchLabel}</span>
      </div>
    `;
//the code above me is basically creating a card for the recipe html, it is the recipe that is shown
    results.appendChild(card); //adds new elements for html, for ex: it will make the html for the recipes!
  });
}

/* ---------------------------
   INIT
----------------------------*/

renderIngredients();
updateSelectedUI();