let emptyIcon = document.querySelector('#empty-icon');
let notFound = document.querySelector('#not-found-icon');
let meals = document.querySelector('#meals');


let submitForm = (event) => {
  // prevent browser default actions
  event.preventDefault();

  emptyIcon.classList.add('d-none');
  meals.innerHTML = "";
  // find the form and get search text.
  let form = document.forms.searchForm;
  let searchText = form.elements.searchInput.value;

  getFoods(searchText);
}

let getFoods = async (foodName) => {
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${foodName}`);
  let data = await response.json();
  let {meals} = data;
  console.log(meals);
  // if meals is null then 
  // show error image and return
  if (!meals) {
    notFound.classList.remove('d-none');
    notFound.classList.add('d-flex');
    return;
  }
  // if response is not empty and 
  // not found is visible then hide it.
  notFound.classList.contains('d-none') || notFound.classList.add('d-none');
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

  let foodId = isFood.querySelector('#food-id').innerHTML

  getFoodDetails(foodId);
  console.log(foodId);
}

let getFoodDetails = async (foodId) => {
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${foodId}`);
  let data = await response.json();
  let { meals: [details] } = data;
  console.log(details);
}

// let getIngredientsList = (foodDetails) => {
//   let ingred
// }

let hideDetailsBox = () => {
  let detailsBox = document.querySelector('#meal-details');
  detailsBox.classList.add('d-none')
}