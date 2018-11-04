'use strict'; 
/*eslint-env jquery, global cuid*/
/*global cuid*/


//we should give it a unique ID bc the indexes are changing throughout 
//STORE is an object keeps the underlying data that our app will need to keep track of. Made up of an array of items(with name, unique id, checked and edit bool), a hideChecked bool set to false, and a searchTerm set to null
const STORE = {
  items: [],
  hideChecked: false,
  searchTerm: null
};

//********************    FUNCTIONS THAT UPDATE STORE    ********************

//Create a new object representing the added item and push it to STORE
function addItemToShoppingList(itemName){
  STORE.items.push({name: itemName, checked: false, id: cuid(), edit:false});
}

//toggles the checked property for the item with the given unique ID (QUESTION: item is a reference to the global?)
function toggleCheckedForListItem(item){
  item.checked = !item.checked;
}

// deletes item from the STORE array
function deleteItem(item){
  //using the ID, find the current index. Then delete item at that index from STORE
  STORE.items.splice(getItemIndex(item),1);
}

//toggles the hidechecked property in the STORE 
function toggleHideChecked(){
  STORE.hideChecked=(!STORE.hideChecked);
}

//changes the searchTerm in STORE to whatever is being searched
function changeSearchTerm(searchItem){
  STORE.searchTerm = searchItem; 
}

function toggleEditForItem(item){
  //toggles the edit value for item in the STORE
  item.edit = !item.edit;
}

function changeName(item, newName){
  item['name'] = newName;
}

//********************    DOM MANIPULATION    ********************

//Shopping List (list of all the <li>s) needs to get rendered to the ul element (.js-shopping-list element):
function renderShoppingList(){
  //make a copy of the items in the STORE so we can filter it if necassary 
  let filteredItems = [...STORE.items];
  
  //if filteredITEMS is empty at this point, that means nothing is in the list. SO then put something on the page that says list is empty :( add something to list - dis
  if (filteredItems.length===0){
    listIsEmpty();
  }
  //if its not empty, then display should = none for the p, and do everything else
  else{
    listIsNotEmpty();
  }
  //check if STORE's hidechecked property is true
  if(STORE.hideChecked){
    //call a helper function that filters the array
    filteredItems = filterByUnchecked(filteredItems);
  }
  //check if STORE's searchTerm is equal to anything
  if(STORE.searchTerm!==null){
    //if there's a search term, call a helper function to filter it by the term 
    filteredItems = filterBySearch(filteredItems);
  }
  //  Call a helper function that generates a long string off all the items 
  const shoppingListItemsString = generateShoppingItemsString(filteredItems);
  //Insert this long string inside the ul html in the DOM 
  $('.js-shopping-list').html(shoppingListItemsString);
  //call a helper function that updates the output counter 
  updateCounter(filteredItems);
}


//Changes the text of the output based on what the length of filteredItems is
function updateCounter(filteredItems){
  $('.js-list-count').html(`${filteredItems.length} items`);
}

function listIsEmpty(){
  $('#list-empty-message').css('display','block');
}

function listIsNotEmpty(){
  $('#list-empty-message').css('display','none');
}

//********************    HELPER FUNCTIONS    ********************

//Filter by the search - if the search term is anywhere in the word, return it 
function filterBySearch(filteredItems){
  //function returns new array with words that match given word in any way
  const filteredArr = [];
  filteredItems.forEach((item)=>{
    if(item['name'].includes(STORE.searchTerm) ){
      filteredArr.push(item);
    }
  });
  return filteredArr;
}

//Filter the list items in the object to only those that are unchecked
function filterByUnchecked(filteredItems){
  return filteredItems.filter((item)=>
    !item.checked);
}

//Generate and return a string of all the <li>s by looping over each item with map and calling a function on each of them to generate the item string  
function generateShoppingItemsString(storeItems) {
  const items = storeItems.map((item) =>{ 
    return generateItemElement(item);
  });
  return items.join('');
}

//Generates and returns a string representing an <li> item with the item name as inner text, the item's uniqueID as a data attribute, and the item's checked state as a class being toggled
function generateItemElement(item) {
  //see if check is clicked to toggle the class name and button name
  const checkButton = item.checked ? 'uncheck' : 'check';
  const checkedClass = item.checked ? 'shopping-item__checked' : '';
  //see if the item is in editing mode, and if it is then return a string with a form, with save and cancel (different mode)
  if(item.edit===true){
    return `
    <form id="js-shopping-list-form"> <li class="js-item-index-element" data-item-unique="${item.id}">
      <input class="shopping-item js-shopping-item-edit ${checkedClass}" value = "${item['name']}"></input>
      <div class="shopping-item-controls">
        <button class="shopping-item-save js-item-save" type = "submit">
            <span class="button-label">save</span>
        </button>
        <button class="shopping-item-cancel js-item-cancel">
            <span class="button-label">cancel</span>
        </button>
      </div>
    </li> </form>`;
  }
  //if it's not in editiing mode, just return the basic item look
  return  `
  <li class="js-item-index-element" data-item-unique="${item.id}">
    <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item['name']}</span>
    <div class="shopping-item-controls">
      <button class="shopping-item-toggle js-item-toggle">
          <span class="button-label">${checkButton}</span>
      </button>
      <button class="shopping-item-delete js-item-delete">
          <span class="button-label">delete</span>
      </button>
       <button class="shopping-item-edit js-item-edit">
          <span class="button-label">edit</span>
      </button>
    </div>
  </li>`;
}

//Retrieves the item's unique ID in STORE from the data attribute given some event.target
function getItemUniqueID(target){
  return $(target).closest('.js-item-index-element').data('item-unique');
}

//Retrieves the item's index in STORE given the item
function getItemIndex(item){
  return STORE.items.indexOf(item);
}

//returns a reference to the item in the global STORE
function getItem(uniqueID){
  return STORE.items.find((item)=>item.id===uniqueID);
}

// ********************    EVENT HANDLING FUNCTIONS   ********************

//Handles adding new items
function handleNewItemSubmit(){
  //Have an event listener listen to when user adds and submits form 
  $('.js-submit-button').click(event=>{
    //prevent the default (this is a submit button)
    event.preventDefault();
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

//Handles the checking/unchecking of an item
function handleItemCheckClicked(){
  //Have an event listener that listens if user clicks check button (remember event delegation bc these buttons dont exist when page first loads)
  $('.js-shopping-list').on('click', '.js-item-toggle', function (event){
    //Call a function that retrieves the item's uniqueID in STORE from the data attribute 
    const uniqueID = getItemUniqueID(event.target);
    //Find the item using this IID 
    const item = getItem(uniqueID);
    //Call a function that toggles the checked property for the item
    toggleCheckedForListItem(item);
    //Re-render page
    renderShoppingList();
  });
}

//Handles deleting items
function handleDeleteItemClicked(){
  //Listen for when delete button is click (again, remember event delegation)
  $('.js-shopping-list').on('click', '.js-item-delete', event =>{
    //Call function that returns uniqueID of which item was clicked 
    const uniqueID = getItemUniqueID(event.target);
    const item = getItem(uniqueID);
    //Call function that deletes that item with said uniqueID from the STORE array
    deleteItem(item);
    //Re-render 
    renderShoppingList();
  });
}

//Handles checking/unchecking the hide items checkbox
function handleHideCheckedItems(){
  //Have an event listener on the checkbox 
  $('.js-toggle-hide').click(event=>{
    //When event is triggered, toggle the hideChecked property in the STORE object 
    toggleHideChecked();
    //Re-render (with filtered objects)
    renderShoppingList();
  });
}

//handles trying to search for a specific item
function  handleSearchItemSubmit(){
  //listen for when user submits form to search
  $('.js-search-button').click(event=>{
    //since it's a submit button, prevent default
    event.preventDefault();
    //grab the value in the input text area 
    const searchItem = $('.js-toggle-search').val();
    //set text to blank
    $('.js-toggle-search').val('');
    //change searchTerm in STORE from null to whatever the term is 
    changeSearchTerm(searchItem);
    //re-render page
    renderShoppingList();
  });
}

function handleGoBackToList(){
  //listen for when button is clicked to go back to original list/cancel search
  $('.js-cancel-search-button').click(event=>{
    //prevent default (still a button!)
    event.preventDefault();
    //change the searchTerm to null
    changeSearchTerm(null);
    //re-render
    renderShoppingList();
  });
}

function handleNameEdit(){
  //listen for when user hits edit button
  $('.js-shopping-list').on('click', '.js-item-edit', event =>{
  //find out which element they hit edit for
    const uniqueID = getItemUniqueID(event.target);
    const item = getItem(uniqueID);
    //toggle the edit mode for this item
    toggleEditForItem(item);
    //re-render (in there it'll call generateItemElement which will return a different looking element box thats in edit mode)
    renderShoppingList();
  });
}

function handleSaveNameEdit(){
  //listen for when save is clicked
  $('.js-shopping-list').on('click', '.js-item-save', event =>{
    //prevent default (save is submit btn in form)
    event.preventDefault();
    //grab whatever the new name val in input is 
    const newName = $('.js-shopping-item-edit').val();
    //find out which item they're editing 
    const uniqueID = getItemUniqueID(event.target);
    const item = getItem(uniqueID);
    //change the name of the item they edited to the new val 
    changeName(item, newName);
    //toggle edit for the item
    toggleEditForItem(item);
    //render 
    renderShoppingList();
  });
}

function handleCancelNameEdit(){
  //listen for when cancel button is clicked 
  $('.js-shopping-list').on('click', '.js-item-cancel', event =>{
    //find the item 
    const uniqueID = getItemUniqueID(event.target);
    const item = getItem(uniqueID);

    //toggle edit for that item 
    toggleEditForItem(item);

    //render
    renderShoppingList();
  });
}

function handleShoppingList(){
  //this will be our callback function when the page loads which will activate all the individual handler functions and initially render the page 
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleHideCheckedItems();
  handleSearchItemSubmit();
  handleGoBackToList();
  handleNameEdit();
  handleSaveNameEdit();
  handleCancelNameEdit();
}

$(handleShoppingList());