import Admin from "./pages/Admin";
import {
  MODEL_ROUTE,
  ROUTE_3D,
  ADMIN_ROUTE,
  PHOTO_ROUTE, VIDEO_ROUTE, AUDIO_ROUTE,
  LOGIN_ROUTE,
  REGISTRATION_ROUTE,
  HOME_ROUTE,
  SET_ROUTE,
  SET_ROUTE_3D,
  MANUFACTURER_ROUTE,
} from "./utils/consts";

//import Auth from "./auth/Auth"
//import Racktype from "./pages/Racktype/Racktype";
//import RacktypePage from "./pages/Racktype/RacktypePage";

import Page3d from "./pages/ModelType3d/Page3d"
import Auth from "./pages/Auth/Auth"
import ModelType3d from "./pages/ModelType3d/ModelType3d";
import ModelType3dPage from "./pages/ModelType3d/ModelType3dPage";

import Video from "./pages/Video/Video"
import VideoPage from "./pages/Video/VideoPage"

import Photo from "./pages/Photo/Photo"
import PhotoPage from "./pages/Photo/PhotoPage"

import Audio from "./pages/Audio/Audio"
import AudioPage from "./pages/Audio/AudioPage"

import Manufacturer from "./pages/Manufacturer/Manufacturer"
import ManufacturerPage from "./pages/Manufacturer/ManufacturerPage"
import Home from "./pages/Home"

import Set from "./pages/Set/Set"
import SetPage from "./pages/Set/SetPage"
import SetPage3d from "./pages/Set/SetPage3d"

export const authRoutes = [];

export const publicRoutes = [
  { path: MODEL_ROUTE, Component: ModelType3d },
  { path: MODEL_ROUTE + "/:id", Component: ModelType3dPage },
  { path: ROUTE_3D + "/:id", Component: Page3d },

  { path: LOGIN_ROUTE, Component: Auth },
  { path: REGISTRATION_ROUTE, Component: Auth },
  
  // { path: PHOTO_ROUTE, Component: PhotoVideo },
  // { path: PHOTO_ROUTE + "/:id", Component: PhotoVideoPage },
  { path: PHOTO_ROUTE, Component: Photo },
  { path: PHOTO_ROUTE + "/:id", Component: PhotoPage },
  { path: VIDEO_ROUTE, Component: Video },
  { path: VIDEO_ROUTE + "/:id", Component: VideoPage },
  { path: AUDIO_ROUTE, Component: Audio },
  { path: AUDIO_ROUTE + "/:id", Component: AudioPage },

  { path: SET_ROUTE, Component: Set },
  { path: SET_ROUTE + "/:id", Component: SetPage },
  { path: SET_ROUTE_3D + "/:id", Component: SetPage3d },

  { path: ADMIN_ROUTE, Component: Admin },
  { path: MANUFACTURER_ROUTE, Component: Manufacturer },
  { path: MANUFACTURER_ROUTE + "/:id", Component: ManufacturerPage },

  { path: HOME_ROUTE, Component: Home },
];
