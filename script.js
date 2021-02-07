let emptyIcon = document.querySelector('#empty-icon');
let notFound = document.querySelector('#not-found-icon');
let mealLoader = document.querySelector('#meals-loader');
let mealDetailsLoader = document.querySelector('#meal-details-loader');
let meals = document.querySelector('#meals');
let mealDetailsContentContainer = document.querySelector('#meal-details-content'); 
let mealImageContainer = document.querySelector('#meal-details-image');
let mealDetails = document.querySelector('#meal-details');


let submitForm = (event) => {
  // prevent browser default actions
  event.preventDefault();

  emptyIcon.classList.add('d-none');
  meals.innerHTML = "";

  // if response is not empty and 
  // not found is visible then hide it.
  notFound.classList.contains('d-none') || notFound.classList.add('d-none');
  // find the form and get search text.
  let form = document.forms.searchForm;
  let searchText = form.elements.searchInput.value;

  getFoods(searchText);
}

let getFoods = async (foodName) => {
  mealLoader.classList.remove('d-none')
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${foodName}`);
  let data = await response.json();
  mealLoader.classList.add('d-none')
  let {meals} = data;
  // if meals is null then 
  // show error image and return
  if (!meals) {
    notFound.classList.remove('d-none');
    return;
  }
  foodItem(meals);
}

let foodItem = (foods) => {
  foods.forEach(food => {
    let foodBox = `
      <div id="meal-box" class="meals-box rounded-3 overflow-hidden shadow-sm d-flex flex-column align-items-center">
        <img src='${food.strMealThumb}' class="w-100">
        <h3 class="py-3 px-2 fs-6">${food.strMeal}</h3>
        <small id="food-id" class="d-none">${food.idMeal}</small>
      </div>
    `

    meals.insertAdjacentHTML('beforeend', foodBox);
  })
}

let showFoodDetails = (event) => {
  let isFood = event.target.closest('#meal-box');
  if (!isFood) {
    return;
  }
  mealImageContainer.innerHTML = "";
  mealDetailsContentContainer.innerHTML = "";

  let foodId = isFood.querySelector('#food-id').innerHTML
  mealDetailsLoader.classList.contains('d-none') && mealDetailsLoader.classList.remove('d-none');
  mealDetails.classList.remove('d-none');
  getFoodDetails(foodId);
}

let getFoodDetails = async (foodId) => {
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${foodId}`);
  let data = await response.json();

  mealDetailsLoader.classList.add('d-none');

  let { meals: [details] } = data;
  let ingredients = getIngredientsList(details);
  let detailsContent = `
    <h1 class="fs-3 fw-bold">${details.strMeal}</h1>
    <h2 class="fs-5 fw-bold">Ingredients</h2>
  `

  let mealImage = `
    <img class="w-100 rounded-3" src="${details.strMealThumb}" alt="${details.strMeal}">
  `
  mealDetails.style.top = window.pageYOffset + 'px';
  mealDetailsContentContainer.insertAdjacentHTML("afterbegin", detailsContent);
  mealDetailsContentContainer.append(ingredients);
  mealImageContainer.insertAdjacentHTML('afterbegin', mealImage);
  document.body.style.overflow = "hidden";
  
}

let getIngredientsList = (foodDetails) => {
  let ingredientNames = [];
  let ingredientQuantity = [];
  let ingredientListContainer = document.createElement('ul');
  ingredientListContainer.classList.add('ingredient-list');
  for (option in foodDetails) {
    if (/^strIngredient\d*$/.test(option) && foodDetails[option] !== "") {
      ingredientNames.push(foodDetails[option])
    }

    if (/^strMeasure\d*$/.test(option) && foodDetails[option] !== "") {
      ingredientQuantity.push(foodDetails[option])
    }
  }

  for (let index = 0; index < ingredientNames.length; index++){
    let li = `<li class="ingredient-item fs-5">${ingredientQuantity[index]} ${ingredientNames[index]}</li>`;
    ingredientListContainer.insertAdjacentHTML('beforeend', li);
  }

  return ingredientListContainer;
}

let hideDetailsBox = () => {
  let detailsBox = document.querySelector('#meal-details');
  detailsBox.classList.add('d-none')
  document.body.style.overflow = "";
}