'use strict'; 
/*eslint-env jquery*/

//STORE keeps the underlying data that our app will need to keep traxck of. Made up of objects with name and checked property (bool)
//We're pre-adding items to the list so they're there when it loads (when finished, dont do that)
const STORE = [
  {name: 'apples', checked: false},
  {name: 'oranges', checked: false},
  {name: 'milk', checked: true},
  {name: 'bread', checked: false}
];


//Shopping List (list of <li>s) needs to get rendered to the ul element (.js-shopping-list element):
function renderShoppingList(){
//  Call the function that generates a long string off all the items 
  const shoppingListItemsString = generateShoppingItemsString(STORE);

  //Insert this long string inside the ul html in the DOM 
  $('.js-shopping-list').html(shoppingListItemsString);
}

//Generate and return a string of all the <li>s by looping over each item with map and calling a function on each of them to generate the item string  
function generateShoppingItemsString(STORE) {
  const items = STORE.map((item, index) => generateItemElement(item, index));
  return items.join('');
  //QUESTION: how does it know what the index is? 
}

//Generates and returns a string representing an <li> item with the item name as inner text, the item's index as a data attributed, and the item's checked state as a class being toggled
function generateItemElement(item, index) {
  return  `
  <li class="js-item-index-element" data-item-index="${index}">
    <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>
    <div class="shopping-item-controls">
      <button class="shopping-item-toggle js-item-toggle">
          <span class="button-label">check</span>
      </button>
      <button class="shopping-item-delete js-item-delete">
          <span class="button-label">delete</span>
      </button>
    </div>
  </li>`;
}

//Shopping List needs to be able to add items 
function handleNewItemSubmit(){
  //Have an event listener listen to when user adds and submits form 
  $('form').submit(event=>{
    event.preventDefault();
    //Get the name of the new item 
    const itemName = $('.js-shopping-list-entry').val();
    //Clear the text area for next potential input
    $('.js-shopping-list-entry').val('');
    //Create a new object representing the added item and add to STORE
    addItemToShoppingList(itemName);
    //Render the page again 
    renderShoppingList();
  });
}
//Create a new object representing the added item and add to STORE
function addItemToShoppingList(itemName){
  STORE.push({name: itemName, checked: false});
}

//Shopping List needs to be able to check and uncheck items
function handleItemCheckClicked(){
}

//Shopping List needs to be able to delete items
function handleDeleteItemClicked(){
}

function handleShoppingList(){
  //this will be our callback function when the page loads 
  // will initially render the shopping list and activate individual functions
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
}

$(handleShoppingList());

