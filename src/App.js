// App.js
import React from "react";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux"; 
import root from "./router/root";
import store from "./store";

function App() {
  return (
    <Provider store={store}>
      <div className="MAIN_WRAPPER">
        <RouterProvider router={root} />
      </div>
    </Provider>
  );
}

export default App;
