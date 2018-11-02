'use strict'; 
/*eslint-env jquery*/

function renderShoppingList(){
  //render shopping list in the DOM 
  console.log('renderShoppingList ran'); 
}

function handleNewItemSubmit(){
  //will be responsibile for users adding new items 
  console.log('handleNewItemSubmit ran');
}

function handleItemCheckClicked(){
  //will be responsible for when a user clicks the check button on a shopping list item
  console.log('handleItemCheckClicked ran');
}

function handleDeleteItemClicked(){
  //will be responsible for deleting an item when the user wants to
  console.log('handleDeleteItemClicked ran');
}

function handleShoppingList(){
  //this will be our callback function when the page loads 
  // will initially render the shopping list and activate individual functions
  console.log('handleShoppingList ran');
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
}

$(handleShoppingList());