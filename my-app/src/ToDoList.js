import React, { Component } from "react";
import TodoItems from "./ToDoItems";
import data from "./finalRestaurant.json";
//var server = require("./server.js");
//var server2 = require("./2server.js");
//var server3 = require("./3server.js");

var counter = 0;

/*function toutFaire(){
  server.getRestaurant();
  server2.addRestaurantFromLF();
  server3.createJSONWithOffers();
}*/

export class Hello extends React.Component {

constructor(props) {
     super(props);
     this.state = {
       search: ''
     };
   }

   updateSearch(event){
     this.setState({search : event.target.value.substr(0,20)});
   }


//this function will return array of element 20 divs in this case
multipleElements() {
   let elements = [];
   for(let i = 0; i < 27; i++) {
            elements.push(
                  <div key={i}> element{i+1} </div>
           )
   }
    return elements;
}

//this function will separate each four element to display
separateElement () {
 var separateElements = [];
 var multiElements = data;


for(var i = 0; i < multiElements.length; i+=2) {

     var oneRow = [];
     oneRow.push(multiElements.slice(i, i+2).map(function(restaurant){
         console.log(restaurant.image);
         return <a href={restaurant.url} id="link"><div className="joli" style={{backgroundImage: "url(" + restaurant.image + ")"}}> <span>{restaurant.name} <br /> {restaurant.offer} <br /> <br /> {restaurant.city} <br /> <br /> {restaurant.stars} étoiles</span></div></a>
}))
separateElements.push(oneRow.map(itm => {return <div>{itm}</div>}))
}
return separateElements;
}



render() {
   return (
     <div>
      <div> {this.separateElement()} </div>
     </div>
   );
 }
};




//export default TodoList;
