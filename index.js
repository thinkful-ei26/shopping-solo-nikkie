'use strict'; 
/*eslint-env jquery, global cuid*/
/*global cuid*/

//STORE keeps the underlying data that our app will need to keep traxck of. Made up of objects with name and checked property (bool)
//We're pre-adding items to the list so they're there when it loads (when finished, dont do that)

//we need a data type to remember the other states of the page as well, such as whether or not the checkbox is clicked, etc. So we'll make an object 

//we should give it a unique ID bc the indexes are changing throughout 
const STORE = {
  items: [ 
    //  {name: 'apples', checked: false, id: ''},
    // {name: 'oranges', checked: false},
    // {name: 'milk', checked: true},
    // {name: 'bread', checked: false}
  ],
  hideChecked: false,
  searchTerm: null
};

//Shopping List (list of <li>s) needs to get rendered to the ul element (.js-shopping-list element):
function renderShoppingList(){
  console.log(STORE);
  //make a copy of the STORE obj so we can filter it if necassary 
  let filteredItems = [...STORE.items];

  if(STORE.hideChecked){
    //call a function that filters the array
    filteredItems = filterListItems(filteredItems);
  }

  if(STORE.searchTerm!==null){
    //if there's a search term, filter the page to see that 
    filteredItems = filterBySearch(filteredItems);
    console.log(filteredItems);
  }
  //  Call the function that generates a long string off all the items 
  const shoppingListItemsString = generateShoppingItemsString(filteredItems);

  //Insert this long string inside the ul html in the DOM 
  $('.js-shopping-list').html(shoppingListItemsString);
}

//Filter by the search
function filterBySearch(filteredItems){
  return filteredItems.filter((item)=>STORE.searchTerm===item.name);
}

//Filter the list items in the object to only those that are unchecked
function filterListItems(filteredItems){
  return filteredItems.filter((item)=>
    !item.checked);
}

//Generate and return a string of all the <li>s by looping over each item with map and calling a function on each of them to generate the item string  
function generateShoppingItemsString(storeItems) {
  const items = storeItems.map((item) => generateItemElement(item));
  return items.join('');
}

//Generates and returns a string representing an <li> item with the item name as inner text, the item's uniqueID as a data attributed, and the item's checked state as a class being toggled
function generateItemElement(item) {
  return  `
  <li class="js-item-index-element" data-item-unique="${item.id}">
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
  $('.js-submit-button').click(event=>{
    console.log('adding item');
    event.preventDefault(); //not working 
    //Get the name of the new item 
    const itemName = $('.js-shopping-list-entry').val();
    //Clear the text area for next potential input
    $('.js-shopping-list-entry').val('');
    //Call a function that creates a new object representing the added item and adds it to STORE
    addItemToShoppingList(itemName);
    //Render the page again 
    renderShoppingList();
  });
}
//Create a new object representing the added item and add to STORE
function addItemToShoppingList(itemName){
  STORE.items.push({name: itemName, checked: false, id: cuid()});
}

//Shopping List needs to be able to check and uncheck items
function handleItemCheckClicked(){
  //Have an event listener that listens if user clicks check button (remember event delegation bc these buttons dont exist when page first loads)
  $('.js-shopping-list').on('click', '.js-item-toggle', function (event){
    //Call a function that retrieves the item's uniqueID in STORE from the data attribute 
    const uniqueID = getItemUniqueID(event.target);
    
    // console.log(event.target);
    // console.log(event.currentTarget);
    // console.log(this);

    //target points to exactly what in the button we clicked - so that could be span
    //currentTarget is the button itself/what we put the event listener on (and keyword this is usually the same as currentTarget)

    //Call a function that toggles the checked property for the item with given uniqueID.
    toggleCheckedForListItem(uniqueID);
    //Re-render page
    renderShoppingList();
  });
}

//Retrieves the item's unique ID in STORE from the data attribute 
function getItemUniqueID(item){
  return $(item).closest('.js-item-index-element').data('item-unique');
}

//toggles the checked property for the item with the given unique ID 
function toggleCheckedForListItem(uniqueID){
  const item = getItem(uniqueID);
  item.checked = !item.checked;
}

//Shopping List needs to be able to delete items
function handleDeleteItemClicked(){
  //Listen for when delete button is click (again, remember event delegation)
  $('.js-shopping-list').on('click', '.js-item-delete', event =>{
    //Call function that returns uniqueID of which item was clicked 
    const uniqueID = getItemUniqueID(event.target);
    //QUESTION: currentTarget vs target vs this

    //Call function that deletes that item with said uniqueID from the STORE array
    deleteItem(uniqueID);

    //Re-render 
    renderShoppingList();

  });
}

// deletes item with said uniqueID from the STORE array
function deleteItem(uniqueID){
  //using the ID, find the current index. Then delete at that index 
  STORE.items.splice(getItemIndex(uniqueID),1);
}

//Retrieves the item's index in STORE given the unique ID
function getItemIndex(uniqueID){
  return STORE.items.indexOf(getItem(uniqueID));
}

function getItem(uniqueID){
  return STORE.items.find((item)=>item.id===uniqueID);
}

function handleHideCheckedItems(){
  //Have an event listener on the checkbox 
  $('.js-toggle-hide').click(event=>{
    console.log('checked');
    //When event is triggered, update the hideChecked property in the STORE object 
    toggleHideChecked();
    //Re-render with filtered objects
    renderShoppingList();
  });

}

//toggles the hidechecked property in the STORE 
function toggleHideChecked(){
  STORE.hideChecked=(!STORE.hideChecked);
}

function  handleSearchItemSubmit(){
  
  //listen for when user submits form 
  $('.js-search-button').click(event=>{

    event.preventDefault();

    //grab the value in the input text area 
    const searchItem = $('.js-toggle-search').val();

    //set text to blank
    $('.js-toggle-search').val('');

    //change searchTerm from null to whatever the term is 
    STORE.searchTerm = searchItem; 

    //re-render page with filtered items (figure out )
    renderShoppingList();

  });

}

function handleCancelSearchSubmit(){
  //listen for when button is clicked
  $('.js-cancel-search-button').click(event=>{
    //prevent default
    event.preventDefault();

    //change the searchTerm to null
    STORE.searchTerm = null;
    //re-render
    renderShoppingList();
  });
}

function handleShoppingList(){
  //this will be our callback function when the page loads 
  // will initially render the shopping list and activate individual functions
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleHideCheckedItems();
  handleSearchItemSubmit();
  handleCancelSearchSubmit();
}

$(handleShoppingList());

