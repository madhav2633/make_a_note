import React from "react";  //to import react library
import ReactDOM from "react-dom/client";  //to import ReactDOM for rendering
import App from "./App";    //to import root App component
import './index.css';

//Tell React: find the div with id "root" in index.html and render <App /> inside it

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App/> {/*Root component of your app */}
  </React.StrictMode>
);