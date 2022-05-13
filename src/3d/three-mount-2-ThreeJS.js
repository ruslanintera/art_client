import React, { Component, useState, useEffect } from "react";

import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";
import {MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader";

//let vc3d_glob = {} // vc3d_glob.

/*===========================================================================================*/
import { i3d_all } from "./dev2020/f7_assist.js";
import { app } from "./dev2020/f9_appvue.js";
import { i3d_app_sets } from "./dev2020/f3_apparat_sets.js";
import { i3d_tween } from "./dev2020/f6_tween.js";
import { i3d_events } from "./dev2020/f8_events.js";
import { i3d_events_func } from "./dev2020/f8_events_func.js";
import { i3d_base } from "./dev2020/f4_base.js";
import { vc3d_glob } from "./dev2020/f5_vc3d_glob.js";
import { i3d_windows, i3d_windows1 } from "./dev2020/f10_windows.js";
/*===========================================================================================*/
import objLoaders from "./obj-loaders";
/*===========================================================================================*/


class ThreeMount2 extends React.PureComponent {
  componentDidMount() {
    const this1 = this;
    //alert("componentDidMount")
    //!!!! objLoaders.sceneSetupMount({this1})
    //if(vc3d_glob.onlyOneRender === 0) { objLoaders.sceneSetup({this1}); vc3d_glob.onlyOneRender = 1; }

    objLoaders.sceneSetup({this1});
    //objLoaders.sceneSetup_ThreeJS({this1});

  }
  render() {
    return (
      <div 
      
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'
          , zIndex:5, border: '0px solid #f00' }}
           ref={ref => (this.mount = ref)} 
           
      />
    )
  }
}
//

{/* <div style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'
, zIndex:4, border: '0px solid #f00' }}
 ref={ref => (this.mount = ref)} /> */}


export default ThreeMount2;