'use strict'; 
/*eslint-env jquery*/

//Shopping List needs to get rendered to the page
//Shopping List needs to be able to add items 
//Shopping List needs to be able to check items
//Shopping List needs to be able to delete items


//storeItems is responsible for storing the underlying data
//that our app will need to keep track of in order to work

//we have an array of shopping list items, each one is an object
//with a `name` and a `checked` property that will indicate 
//whether it is checked off or not

//we're pre-adding items to the shopping list so there's
//something to see when it loads
const storeItems = [

{name: "apple",
checked: true},
{name: "banana",
checked: true},


];


function renderShoppingList(){
  //render shopping list in the DOM 

  //Where should the shopping list be rendered? Our jQuery code will need to target the .js-shopping-list element, inserting <li>s inside

  //STEPS:
  //1.For each item in storeItems, generate a string representing an <li> with: 
    //-the item name rendered as inner text 
    //- the item's index in the array set as a data attribute (hidden to users)
    //-the item's checked state (true or false) toggling the class ".shopping0item__checked"
  //2. Join together the individual item strings into one long string
  //3. Insert this long string inside the ul in the DOM 

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
//hi 