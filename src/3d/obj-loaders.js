import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { BufferGeometryUtils } from "three/examples/jsm/utils/BufferGeometryUtils";

// import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";
// import {MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
// import { app } from "./dev2020/f9_appvue.js";
// import { i3d_app_sets } from "./dev2020/f3_apparat_sets.js";
// import { i3d_tween } from "./dev2020/f6_tween.js";
// import { i3d_events_func } from "./dev2020/f8_events_func.js";

/*===========================================================================================*/
import { i3d_all } from "./dev2020/f7_assist.js";
import { i3d_events } from "./dev2020/f8_events.js";
import { i3d_base } from "./dev2020/f4_base.js";
import { vc3d_glob } from "./dev2020/f5_vc3d_glob.js";
import { i3d_windows, i3d_windows1 } from "./dev2020/f10_windows.js";
/*===========================================================================================*/
import { common } from "../common/common";

class ObjLoaders {
  getOffsetSum(elem) {
    var top = 0,
      left = 0;
    while (elem) {
      top = top + parseFloat(elem.offsetTop);
      left = left + parseFloat(elem.offsetLeft);
      elem = elem.offsetParent;
      //console.log("top = ", top, "left = ", left)
    }

    return { top: Math.round(top), left: Math.round(left) };
  }

  rt_Custom() {
    vc3d_glob.temp_material = new THREE.MeshBasicMaterial({
      color: vc3d_glob.rack_BLUE_color,
      transparent: true,
      opacity: 0.8,
    });
    vc3d_glob.rack_empty_material = new THREE.MeshBasicMaterial({
      color: vc3d_glob.rack_empty_color,
      transparent: true,
      opacity: 0.8,
    });
    vc3d_glob.rack_empty_DARK_material = new THREE.MeshBasicMaterial({
      color: vc3d_glob.rack_empty_DARK_color,
      transparent: true,
      opacity: 0.8,
    });
    vc3d_glob.rack_BLUE_material = new THREE.MeshBasicMaterial({
      color: vc3d_glob.rack_BLUE_color,
      transparent: true,
      opacity: 0.8,
    });
    vc3d_glob.rack_GREEN_material = new THREE.MeshBasicMaterial({
      color: vc3d_glob.rack_GREEN_color,
      transparent: true,
      opacity: 0.8,
    });

    // 0 - empty, 1 - rack, 2 - ремонт, 3 - замена, 22 - 2+ ремонтов, 33 - 2+ замен, 23 - и ремонты и замены нужны
    vc3d_glob.rack_repair2_material = new THREE.MeshBasicMaterial({
      color: vc3d_glob.rack_repair2_color,
      transparent: true,
      opacity: 0.8,
    });
    vc3d_glob.rack_repair22_material = new THREE.MeshBasicMaterial({
      color: vc3d_glob.rack_repair22_color,
      transparent: true,
      opacity: 0.8,
    });
    vc3d_glob.rack_change3_material = new THREE.MeshBasicMaterial({
      color: vc3d_glob.rack_change3_color,
      transparent: true,
      opacity: 0.8,
    });
    vc3d_glob.rack_change33_material = new THREE.MeshBasicMaterial({
      color: vc3d_glob.rack_change33_color,
      transparent: true,
      opacity: 0.8,
    });
    vc3d_glob.rack_repair_change23_material = new THREE.MeshBasicMaterial({
      color: vc3d_glob.rack_repair_change23_color,
      transparent: true,
      opacity: 0.8,
    });

    if (vc3d_glob.i3d_windows) {
      i3d_windows.createWinds();
      i3d_windows1.createWinds();
      i3d_all.onWindowResize_AO();
    }
  }

  getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      const rand = Math.random();
      //color += letters[Math.floor(Math.random() * 16)];
      color += letters[Math.floor(rand * 16)];
    }
    return color;
  }
  getRandomNumber(rank, digits) {
    // rank - qty of digits in number
    digits = digits || "0123456789";
    let number1 = "";
    for (var i = 0; i < rank; i++) {
      const rand = Math.random();
      if (rand != 1) number1 += digits[Math.floor(rand * digits.length)];
    }
    return parseInt(number1);
  }
  getRandomMinMax(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  rt_Listeners() {
    window.addEventListener("resize", i3d_all.onWindowResize_AO, false);

    vc3d_glob.renderer.domElement.addEventListener(
      "pointermove",
      i3d_events.onDocumentMouseMove8,
      false
    );
    vc3d_glob.renderer.domElement.addEventListener(
      "pointerdown",
      i3d_events.onDocumentMouseDown8,
      false
    ); //alert(777)
    vc3d_glob.renderer.domElement.addEventListener(
      "pointerup",
      i3d_events.onDocumentMouseUp8,
      false
    );
    vc3d_glob.renderer.domElement.addEventListener(
      "touchstart",
      i3d_events.onDocumentTouchStart,
      false
    );
    vc3d_glob.renderer.domElement.addEventListener(
      "touchend",
      i3d_events.onDocumentMouseUp8,
      false
    );
    vc3d_glob.renderer.domElement.addEventListener(
      "touchmove",
      i3d_events.onDocumentTouchMove,
      false
    );
    vc3d_glob.CONTROLS.addEventListener("change", function () {
      //console.log("==================================6788")
      vc3d_glob.renderer.render(vc3d_glob.SCENE, vc3d_glob.CAMERA);
    }); //! если Orbit или другой Control изменяется, тогда перерендерим всю сцену, это если animate () не включено

    document.addEventListener("wheel", function (e) {
      // "wheel" OR 'scroll'
      //console.log("scroll, e = ", e)
      vc3d_glob.renderer.render(vc3d_glob.SCENE, vc3d_glob.CAMERA);
    });

    window.addEventListener("keydown", function (e) {
      //console.log("keydown, e = ", e)
      //i3d_events.onDocument_keydown
    });
  }

  rt_SceneCameraLight() {
    vc3d_glob.SCENE = new THREE.Scene();
    var VIEW_ANGLE = 60,
      ASPECT = vc3d_glob.SCREEN_WIDTH / vc3d_glob.SCREEN_HEIGHT,
      NEAR = 1,
      FAR = 100000;
    vc3d_glob.CAMERA = new THREE.PerspectiveCamera(
      VIEW_ANGLE,
      ASPECT,
      NEAR,
      FAR
    );
    vc3d_glob.SCENE.add(vc3d_glob.CAMERA);
    vc3d_glob.CAMERA.position.set(0, 1000, 500);

    vc3d_glob.raycaster = new THREE.Raycaster();
    var ambient = new THREE.AmbientLight("#fff");
    vc3d_glob.SCENE.add(ambient);

    vc3d_glob.CONTROLS = new OrbitControls(
      vc3d_glob.CAMERA,
      vc3d_glob.renderer.domElement
    );
    vc3d_glob.CONTROLS.update();
    vc3d_glob.renderer.setClearColor("#E9EAEE", 1);

    if (!vc3d_glob.no_SCENE_PARAMS) {
      i3d_base.SCENE_PARAMS();
    }

    /** */
    vc3d_glob.mouseHelper = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.1, 2),
      new THREE.MeshNormalMaterial()
    );
    //vc3d_glob.mouseHelper.fix = 0;
    //!vc3d_glob.mouseHelper.MODEL3D = 1;

    //vc3d_glob.mouseHelper.visible = false;
    vc3d_glob.SCENE.add(vc3d_glob.mouseHelper);

    const geometry = new THREE.BufferGeometry();
    geometry.setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
    vc3d_glob.line = new THREE.Line(geometry, new THREE.LineBasicMaterial());
    vc3d_glob.SCENE.add(vc3d_glob.line);
    /** */

    i3d_base.add_only_plane_and_mouse_move(); // тут добавляем интерактив
  }

  createElementIn(id, ParentElement) {
    var firstElement = document.createElement("div");
    firstElement.id = id; //'firstElement';
    firstElement.style.width = "100%";
    firstElement.style.height = "100%";
    firstElement.style.marginLeft = "0px";
    firstElement.style.marginTop = "0px";
    ParentElement.appendChild(firstElement);
    return firstElement;
  }

  sceneSetup_SUPER_WORK(props) {
    const this1 = props.this1;
    vc3d_glob.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    vc3d_glob.renderer.setPixelRatio(window.devicePixelRatio);
    let elCanvas = this1.mount.appendChild(vc3d_glob.renderer.domElement);
    vc3d_glob.renderer.setSize(window.innerWidth, window.innerHeight);

    vc3d_glob.renderer.gammaOutput = true;
    let tl = objLoaders.getOffsetSum(elCanvas);
    vc3d_glob.canvas_top = tl.top;
    vc3d_glob.canvas_left = tl.left;
    objLoaders.rt_SceneCameraLight();
    objLoaders.rt_Custom();
    objLoaders.rt_Listeners();
    i3d_all.onWindowResize_AO();
  }

  //НЕ УДАЛЯТЬ, ТУТ МОНТИРУЕМ К ЭЛЕМЕНТУ
  sceneSetup_OL(props) {
    const this1 = props.this1;
    vc3d_glob.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    vc3d_glob.renderer.setPixelRatio(window.devicePixelRatio);
    let elCanvas = this1.mount.appendChild(vc3d_glob.renderer.domElement);

    const width = elCanvas.clientWidth;
    const height = elCanvas.clientHeight;
    vc3d_glob.SCREEN_WIDTH = width;
    vc3d_glob.SCREEN_HEIGHT = height;
    vc3d_glob.renderer.setSize(width, height);
    vc3d_glob.renderer.gammaOutput = true;

    let tl = objLoaders.getOffsetSum(elCanvas);
    vc3d_glob.canvas_top = tl.top;
    vc3d_glob.canvas_left = tl.left;

    objLoaders.rt_SceneCameraLight();
    objLoaders.rt_Custom();
    objLoaders.rt_Listeners();

    i3d_all.onWindowResize_AO();
  }

  sceneSetup_ThreeJS(mode) {
    if (mode === "ALL") {
      vc3d_glob.renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
      });
      vc3d_glob.renderer.setPixelRatio(window.devicePixelRatio);

      var container = document.getElementById("ThreeJS");

      let elCanvas = container.appendChild(vc3d_glob.renderer.domElement);

      const width = elCanvas.clientWidth;
      const height = elCanvas.clientHeight;
      vc3d_glob.SCREEN_WIDTH = width;
      vc3d_glob.SCREEN_HEIGHT = height;

      vc3d_glob.renderer.setSize(width, height);
      vc3d_glob.renderer.gammaOutput = true;

      let tl = objLoaders.getOffsetSum(elCanvas);
      vc3d_glob.canvas_top = tl.top;
      vc3d_glob.canvas_left = tl.left;

      objLoaders.rt_SceneCameraLight();
      objLoaders.rt_Listeners();
      objLoaders.rt_Custom();
    } else if (mode === "CUSTOM") {
      objLoaders.rt_Custom();
    }

    i3d_all.onWindowResize_AO();
  }
}

let objLoaders = new ObjLoaders();
export default objLoaders;
