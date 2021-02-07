let meals = document.querySelector('#meals');
let mealDetailsContentContainer = document.querySelector('#meal-details-content'); 
let mealImageContainer = document.querySelector('#meal-details-image');
let mealDetails = document.querySelector('#meal-details');
let mealLoader = document.querySelector('#meals-loader');
let mealDetailsLoader = document.querySelector('#meal-details-loader');
let form = document.forms.searchForm;
let emptyIcon = document.querySelector('#empty-icon');
let notFound = document.querySelector('#not-found-icon');

// this will execute when search form submits.
let submitForm = (event) => {
  // prevent browser default actions
  event.preventDefault();

  // hide empty box icon
  emptyIcon.classList.add('d-none');
  // clear meals data. so that previous data will be removed
  meals.innerHTML = "";

  // if response is not empty and 
  // not found is visible then hide it.
  notFound.classList.contains('d-none') || notFound.classList.add('d-none');

  // get forms input text 
  let searchText = form.elements.searchInput.value ;

  if (searchText) {
    // if searchText is not empty then get foods data
    getFoods(searchText);
  } else {
    notFound.classList.remove('d-none');
    return;
  }
}

let getFoods = async (foodName) => {
  // show loader when fetching data
  mealLoader.classList.remove('d-none');
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${foodName}`);
  let data = await response.json();
  // hide loader
  mealLoader.classList.add('d-none');
  let { meals } = data;

  // if meals is null then 
  // show error image and return
  if (!meals) {
    notFound.classList.remove('d-none');
    return;
  }

  foodItem(meals);
  // remove previous searchText input
  form.elements.searchInput.value = "";
}

// this will make food items and add it to the DOM.
let foodItem = (foods) => {
  foods.forEach(food => {
    let foodBox = `
      <div id="meal-box" class="meals-box rounded-3 overflow-hidden shadow-sm d-flex flex-column align-items-center">
        <img src='${food.strMealThumb}' class="w-100">
        <h3 class="py-3 px-2 fs-6">${food.strMeal}</h3>
        <small id="food-id" class="d-none">${food.idMeal}</small>
      </div>
    `
    // add items to the end of meals section.
    meals.insertAdjacentHTML('beforeend', foodBox);
  })
}

// this will be called if one of the food item is clicked.
let showFoodDetails = (event) => {
  let isFood = event.target.closest('#meal-box');

  // if click is not in the food item, then stop execution
  if (!isFood) {
    return;
  }
  // clear previous details
  mealImageContainer.innerHTML = "";
  mealDetailsContentContainer.innerHTML = "";

  let foodId = isFood.querySelector('#food-id').innerHTML;
  mealDetailsLoader.classList.contains('d-none') && mealDetailsLoader.classList.remove('d-none');
  
  // set modal sections top 
  mealDetails.style.top = window.pageYOffset + 'px';
  // show meal details option
  mealDetails.classList.remove('d-none');
  // search food details with food id.
  getFoodDetails(foodId);
}

// this function get the food details and shows in a modal.
let getFoodDetails = async (foodId) => {
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${foodId}`);
  let data = await response.json(); // food details response

  // hide loader when loading completed
  mealDetailsLoader.classList.add('d-none');

  let { meals: [details] } = data; // destructure from data object
  let ingredients = getIngredientsList(details); // get ingredient list
  let detailsContent = `
    <h1 class="fs-3 fw-bold">${details.strMeal}</h1>
    <h2 class="fs-5 fw-bold">Ingredients</h2>
  `;

  let mealImage = `
    <img class="w-100 rounded-3" src="${details.strMealThumb}" alt="${details.strMeal}">
  `;
  // add details contents
  mealDetailsContentContainer.insertAdjacentHTML("afterbegin", detailsContent);
  mealDetailsContentContainer.append(ingredients);
  mealImageContainer.insertAdjacentHTML('afterbegin', mealImage);
  // freeze the window when modal is visible
  document.body.style.overflow = "hidden";
}

// this function will return all the ingredients for specific food
let getIngredientsList = (foodDetails) => {
  let ingredientNames = [];
  let ingredientQuantity = [];
  let ingredientListContainer = document.createElement('ul');
  ingredientListContainer.classList.add('ingredient-list');
  for (option in foodDetails) {
    // if option name matches then push it.
    if (/^strIngredient\d*$/.test(option) && foodDetails[option] !== "") {
      ingredientNames.push(foodDetails[option])
    }

    if (/^strMeasure\d*$/.test(option) && foodDetails[option] !== "") {
      ingredientQuantity.push(foodDetails[option])
    }
  }

  // create ingredient list with ingredient quantity and ingredient name
  for (let index = 0; index < ingredientNames.length; index++){
    let li = `<li class="ingredient-item fs-5">${ingredientQuantity[index]} ${ingredientNames[index]}</li>`;
    ingredientListContainer.insertAdjacentHTML('beforeend', li);
  }

  return ingredientListContainer;
}

// hide the details section
let hideDetailsBox = () => {
  let detailsBox = document.querySelector('#meal-details');
  detailsBox.classList.add('d-none');
  // unfreeze the window.
  document.body.style.overflow = "";
}
