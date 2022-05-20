import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./AppRouter";

import NavBar from "./components/NavBar";
//<NavBar />

import { observer } from "mobx-react-lite";
import { Context } from "./index";
import { Spinner } from "react-bootstrap";

const App = observer(() => {
  const { store } = useContext(Context);
  //const [users, setUsers] = useState([]);

  const { user } = useContext(Context);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      store.checkAuth();
    }
  }, []);

  // if (loading) {
  //     return <Spinner animation={"grow"}/>
  // }

  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
});
//            <NavBar />

export default App;
