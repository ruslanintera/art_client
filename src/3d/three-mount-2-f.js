import React, { Component, useState, useContext, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../index";

// import * as THREE from "three";
// import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
// import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
// import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";
// import {MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
// import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader";
/*===========================================================================================*/
// import { i3d_all } from "./dev2020/f7_assist.js";
// import { app } from "./dev2020/f9_appvue.js";
// import { i3d_app_sets } from "./dev2020/f3_apparat_sets.js";
// import { i3d_tween } from "./dev2020/f6_tween.js";
// import { i3d_events } from "./dev2020/f8_events.js";
// import { i3d_events_func } from "./dev2020/f8_events_func.js";
// import { i3d_base } from "./dev2020/f4_base.js";
import { vc3d_glob } from "./dev2020/f5_vc3d_glob.js";
// import { i3d_windows, i3d_windows1 } from "./dev2020/f10_windows.js";
/*===========================================================================================*/
import objLoaders from "./obj-loaders";
/*===========================================================================================*/
import { fetchModelType3d } from "../http/commAPI";

const ThreeMount2 = observer(() => {
  const { device } = useContext(Context);

  useEffect((props) => {
    // fetchModelType3d(null, null, null, null, null, null, null, null, 1, 999).then(data => {
    //   device.setModelType3d3d(data.rows)
    //   //device.setModelType3dTotal(data.count)
    // })

    vc3d_glob.device = device;
    objLoaders.sceneSetup_ThreeJS("ALL");
  });

  return <></>;
});

export default ThreeMount2;
