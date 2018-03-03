import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
//import TodoList from "./ToDoList";
import {TodoList,Hello} from "./ToDoList.js";

var destination = document.querySelector("#container");


ReactDOM.render(
    <div>
        <Hello/>
    </div>,
    destination
);
