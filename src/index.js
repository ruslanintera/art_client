import React, { createContext } from "react";
import ReactDOM from "react-dom";
import App from "./App";
import UserStore from "./store/UserStore";
import DeviceStore from "./store/DeviceStore";
import Store from "./store/store";

import "./style.css";
import "./form.css";

export const Context = createContext(null);

ReactDOM.render(
  <Context.Provider
    value={{
      user: new UserStore(),
      device: new DeviceStore(),
      store: new Store(),
    }}
  >
    <App />
  </Context.Provider>,
  document.getElementById("root")
);
