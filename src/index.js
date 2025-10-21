import './App.scss';
import './Button.scss';
import './Responsive1500.scss';
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";


const rooter = ReactDOM.createRoot(document.getElementById("root"));
rooter.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
