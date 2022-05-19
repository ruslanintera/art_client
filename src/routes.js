import Admin from "./pages/Admin";
import {
  MODEL_ROUTE,
  ROUTE_3D,
  ADMIN_ROUTE,
  LOGIN_ROUTE,
  REGISTRATION_ROUTE,
  HOME_ROUTE,
  SET_ROUTE,
  DC_ROUTE,
  ROLE_ROUTE,
  MANUFACTURER_ROUTE,
  RACK_ROUTE,
} from "./utils/consts";

//import Auth from "./auth/Auth";
import Page3d from "./pages/Rack3d/Page3d";
import Auth from "./pages/Racktype/Auth";
import Racktype from "./pages/Racktype/Racktype";
import RacktypePage from "./pages/Racktype/RacktypePage";

import Role from "./pages/Role/Role";
import RolePage from "./pages/Role/RolePage";
import Manufacturer from "./pages/Manufacturer/Manufacturer";
import ManufacturerPage from "./pages/Manufacturer/ManufacturerPage";
import DC from "./pages/DC/DC";
import DCPage from "./pages/DC/DCPage";
import Set from "./pages/DC/Set";

import Rack from "./pages/Rack/Rack";
import RackPage from "./pages/Rack/RackPage";

import Home from "./pages/Home";

export const authRoutes = [];

export const publicRoutes = [
  { path: ROUTE_3D + "/:id", Component: Page3d },
  { path: LOGIN_ROUTE, Component: Auth },
  { path: REGISTRATION_ROUTE, Component: Auth },
  { path: MODEL_ROUTE, Component: Racktype },
  { path: MODEL_ROUTE + "/:id", Component: RacktypePage },
  { path: DC_ROUTE + "/:id", Component: DCPage },
  { path: SET_ROUTE + "/:id", Component: Set },

  { path: ADMIN_ROUTE, Component: Admin },
  { path: ROLE_ROUTE, Component: Role },
  { path: ROLE_ROUTE + "/:id", Component: RolePage },
  { path: MANUFACTURER_ROUTE, Component: Manufacturer },
  { path: MANUFACTURER_ROUTE + "/:id", Component: ManufacturerPage },
  { path: DC_ROUTE, Component: DC },
  { path: RACK_ROUTE, Component: Rack },
  { path: RACK_ROUTE + "/:id", Component: RackPage },

  { path: HOME_ROUTE, Component: Home },
];
