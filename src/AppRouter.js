import React, { useContext } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { authRoutes, publicRoutes } from "./routes";
import { COMM_ROUTE } from "./utils/consts";
import { HOME_ROUTE } from "./utils/consts";
import { Context } from "./index";
import { observer } from "mobx-react-lite";

import SideBar from "./components/sidebar01/sidebar01";
//<SideBar />
import NavBar from "./components/sidebar01/navbar01";
//<NavBar />

//!!!!!!!!!!!!   3 варианта: 1, 2 - CLASS,  3-й вариант - функция
//import ThreeMount2 from "./3d/three-mount-2"; // 1 - class
//import ThreeMount2 from "./3d/three-mount-2-ThreeJS"; // 2 - class
import ThreeMount2 from "./3d/three-mount-2-f"; // 3 - function, для функции нужен <div id="ThreeJS"
//<ThreeMount2 rootElement={rootElement} />

const AppRouter = observer((props) => {
  const { user } = useContext(Context);
  let rootElement = props.rootElement;

  return (
    <div className="wrapper d-flex align-items-stretch">
      <SideBar />

      <div id="content" className="p-0 p-md-0">
        <NavBar />
        <ThreeMount2 rootElement={rootElement} />

        <Switch>
          {user.isAuth &&
            authRoutes.map(({ path, Component }) => (
              <Route key={path} path={path} component={Component} exact />
            ))}
          {publicRoutes.map(({ path, Component }) => (
            <Route key={path} path={path} component={Component} exact />
          ))}
          <Redirect to={HOME_ROUTE} />
        </Switch>
      </div>
    </div>
  );
});

/*
<ThreeMount2 rootElement={rootElement} />

        <div className="wrapper d-flex align-items-stretch">
            <SideBar />
            <div id="content" className="p-0 p-md-0">
                <NavBar />

                <Switch>
                {user.isAuth && authRoutes.map(({path, Component}) =>
                <Route key={path} path={path} component={Component} exact/>
            )}
            {publicRoutes.map(({path, Component}) =>
                <Route key={path} path={path} component={Component} exact/>
            )}
            <Redirect to={COMM_ROUTE}/>
                </Switch>
            </div>
        </div>
* */

export default AppRouter;
