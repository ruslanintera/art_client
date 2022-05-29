import io from "socket.io-client";

import { i3d_all } from "./f7_assist.js";
import { app } from "./f9_appvue.js";
import { i3d_app_sets } from "./f3_apparat_sets.js";
//import { i3d_tween } from "./f6_tween.js";
import { i3d_events } from "./f8_events.js";
import { i3d_events_func } from "./f8_events_func.js";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
//import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

import { vc3d_glob } from "./f5_vc3d_glob.js";
import { common } from "../../common/common";
import { fetchOneModelType3d, fetchOneDC } from "../../http/commAPI";
import { react3d } from "../react3d";

class i3d_Base {
  load_gltf_2021() {
    try {
      console.log("9999900 l oad_gltf_2021=", vc3d_glob.currentRT.model3d);

      if (!vc3d_glob.currentRT) {
        return;
      }

      let wl_1 = {};
      var onProgress = function (xhr) {
        //console.log( `${( xhr.loaded / xhr.total * 100 )}% loaded` );
      };
      var onError_gltf = function (error) {
        console.error("An error happened", error);
      };

      var loader = new GLTFLoader();
      const model_URL =
        process.env.REACT_APP_API_URL + vc3d_glob.currentRT.model3d;
      //console.log("$$$ model_URL = ", model_URL);
      loader.load(model_URL, function (gltf) {
        var gltf_model = gltf.scene;

        //console.log("gltf = ", gltf);
        //! const boundingBox = new THREE.Box3().setFromObject(gltf.scene); let size = boundingBox.getSize(); //console.log("4444444444      =                size", size)

        vc3d_glob.ray_objects.push(gltf.scene); // тут те модели, которые можно выбирать r aycaster-ом

        gltf.scene.move_type = 1; //parseInt(wl_1.move_type); //нужно ли двигать объект?
        gltf.scene.MODEL3D = 1; //
        gltf.scene.wtype = "gltf"; //
        if (vc3d_glob.currentRT.Set) {
          gltf.scene.Set = vc3d_glob.currentRT.Set;
        }

        // PARAMS ////////////////////////////////////////////////////////////////////
        if (!vc3d_glob.currentRT.params1) vc3d_glob.currentRT.params1 = "{}";
        if (!vc3d_glob.currentRT.params2) vc3d_glob.currentRT.params2 = "{}";

        try {
          if (
            typeof vc3d_glob.currentRT.params1 === "string" &&
            typeof vc3d_glob.currentRT.params2 === "string"
          ) {
            var JSON_params1 = eval("(" + vc3d_glob.currentRT.params1 + ")"); //console.log("JSON_params1 = ", JSON_params1)
            if (JSON_params1.size) {
              gltf.scene.scale.set(
                JSON_params1.size,
                JSON_params1.size,
                JSON_params1.size
              );
            }
            const x = JSON_params1.x || 0;
            const y = JSON_params1.y || 0;
            const z = JSON_params1.z || 0;
            gltf.scene.position.set(x, y, z);

            var JSON_params2 = eval("(" + vc3d_glob.currentRT.params2 + ")"); //console.log("JSON_params2 = ", JSON_params2)
            const cx = common.valOrDefault(JSON_params2.cx, 0);
            const cy = common.valOrDefault(JSON_params2.cy, 1000);
            const cz = common.valOrDefault(JSON_params2.cz, 500);
            vc3d_glob.CAMERA.position.set(cx, cy, cz);
            vc3d_glob.CAMERA.updateProjectionMatrix();
          } else {
            console.error(
              "ERRRR params12 NOT STRING !!!! typeof vc3d_glob.currentRT.params1 = ",
              typeof vc3d_glob.currentRT.params1,
              "typeof vc3d_glob.currentRT.params2 = ",
              typeof vc3d_glob.currentRT.params2
            );
          }
        } catch (e) {
          console.error("ERRRR params12", e);
        }

        gltf.scene.model_unid =
          vc3d_glob.currentRT.id || i3d_all.gener_name_to_input(16, "#aA");

        let data_rows = [],
          data_count = 1; // список элементов модели

        gltf.scene.traverse(function (child) {
          if (child.isMesh) {
            if (vc3d_glob.shadow) {
              child.castShadow = true;
              child.receiveShadow = true;
            }

            //vc3d_glob.ray_objects.push(child); // тут те модели, которые можно выбирать r aycaster-ом

            child.material.needsUpdate = true;
            child.model_unid = gltf.scene.model_unid;
            child.wtype = "gltf";
            if (vc3d_glob.currentRT.Set) {
              gltf.scene.Set = vc3d_glob.currentRT.Set;
            }

            // заполняем список элементов модели:
            data_rows.push({
              id: data_count,
              model_unid: gltf.scene.model_unid,
              name: child.name,
              active: 0,
              el: child,
            });

            data_count++;

            /*==== Раскрасим модель просто цветом =========================================================*/
            //wl_1.colored = "1"
            if (wl_1.colored == "1") {
              child.material.color = new THREE.Color("#00f"); //0x444444
              child.material.emissive = new THREE.Color("#00f");
              child.material.emissiveIntensity = 1;
            }
          }
        });

        // заполняем список элементов модели:
        vc3d_glob.device.setModelRack3d(data_rows);
        vc3d_glob.device.setModelRack3dTotal(data_count);

        // vc3d_glob.currentRT - rack 3d model    has Set = {dc, x, z }

        vc3d_glob.device.setActive3dElement({});
        gltf.scene.position.y += 1;
        vc3d_glob.SCENE.add(gltf.scene);
        //vc3d_glob.CAMERA.updateProjectionMatrix();
        //alert(94)

        //!!!!!!!!!!!!!!!!
        i3d_all.onWindowResize_AO();

        if (!vc3d_glob.animate) {
          i3d_all.animate3();
        }

        /**/
        //vc3d_glob.SCENE.add(gltf_model);

        //}, onProgress, onError_gltf);
        //}, onProgress);
      });
    } catch (e) {
      i3d_all.c_sys("ERROR mess: " + e.name + ": " + e.message, "e = ", e);
    }
  }
  load_gltf_2021_params({
    m,
    x = 0,
    y = 0,
    z = 0,
    rx = 0,
    ry = 0,
    rz = 0,
    s = 1,
    set = 1,
    data,
    matsArray,
  }) {
    //console.log("F4 matsArray = ", matsArray);

    try {
      if (!m) {
        return;
      }
      if (!vc3d_glob.device) {
        console.error("!vc3d_glob.device");
        return;
      }

      let wl_1 = {};
      var onProgress = function (xhr) {
        //console.log( `${( xhr.loaded / xhr.total * 100 )}% loaded` );
      };
      var onError_gltf = function (error) {
        console.error("An error happened", error);
      };

      var loader = new GLTFLoader();
      const model_URL = process.env.REACT_APP_API_URL + data.model3d;
      //console.log("$$$ model_URL = ", model_URL);
      loader.load(model_URL, function (gltf) {
        var gltf_model = gltf.scene;

        vc3d_glob.ray_objects.push(gltf.scene); // тут те модели, которые можно выбирать r aycaster-ом
        gltf.scene.move_type = 1; //parseInt(wl_1.move_type); //нужно ли двигать объект?
        gltf.scene.MODEL3D = 1; //
        gltf.scene.wtype = "gltf"; //
        // if (data.Set) {
        //   gltf.scene.Set = data.Set;
        // }

        gltf.scene.m = m;
        gltf.scene.scale.set(s, s, s);
        gltf.scene.position.set(x, y, z);
        //gltf.scene.setScale = s; //

        gltf.scene.model_id = data.id;
        gltf.scene.model_name = data.name;
        gltf.scene.model_unid = i3d_all.gener_name_to_input(16, "#aA");

        const cx = x || 0;
        const cy = y || 0;
        const cz = z || 0;
        gltf.scene.position.set(cx, cy, cz);

        let data_rows = [],
          data_count = 1; // список элементов модели

        if (matsArray) {
          matsArray.forEach((item) => {
            console.log("matsArray item", item);

            react3d.find_obj_set_mats(gltf.scene, item.el, item.params);
          });
        }

        gltf.scene.traverse(function (child) {
          if (child.isMesh) {
            if (vc3d_glob.shadow) {
              child.castShadow = true;
              child.receiveShadow = true;
            }

            //vc3d_glob.ray_objects.push(child); // тут те модели, которые можно выбирать r aycaster-ом

            child.material.needsUpdate = true;
            child.model_unid = gltf.scene.model_unid;
            child.wtype = "gltf";
            // if (vc3d_glob.currentRT.Set) {
            //   gltf.scene.Set = vc3d_glob.currentRT.Set;
            // }

            // заполняем список элементов модели:
            data_rows.push({
              id: data_count,
              model_unid: gltf.scene.model_unid,
              name: child.name,
              active: 0,
              el: child,
            });

            data_count++;

            /*==== Раскрасим модель просто цветом =========================================================*/
            //wl_1.colored = "1"
            if (wl_1.colored == "1") {
              child.material.color = new THREE.Color("#00f"); //0x444444
              child.material.emissive = new THREE.Color("#00f");
              child.material.emissiveIntensity = 1;
            }
          }
        });

        vc3d_glob.SCENE.add(gltf.scene);
        i3d_all.onWindowResize_AO();

        if (!vc3d_glob.animate) {
          i3d_all.animate3();
        }

        /**/
        //vc3d_glob.SCENE.add(gltf_model);
        //}, onProgress, onError_gltf);
        //}, onProgress);
      });
    } catch (e) {
      i3d_all.c_sys("ERROR mess: " + e.name + ": " + e.message, "e = ", e);
    }
  }

  // == RENDER =================================================================
  SCENE_PARAMS() {
    var sd = app.all.set[0];
    if (!sd) {
      return;
    }

    if (sd.fon_setClearColor != undefined) {
      vc3d_glob.renderer.setClearColor(sd.fon_setClearColor, 1);
    } else {
      vc3d_glob.renderer.setClearColor("#E9EAEE", 1);
    }

    // TEXT SPRITES
    //if(vc3d_glob.add_stext) i3d_tween.main_text(); // draw text   !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    vc3d_glob.CAMERA.position.x = sd.set_camera_x;
    vc3d_glob.CAMERA.position.y = sd.set_camera_y;
    vc3d_glob.CAMERA.position.z = sd.set_camera_z;
    vc3d_glob.CAMERA.lookAt(vc3d_glob.SCENE.position);

    if (sd.zoom_speed != undefined) {
      vc3d_glob.CONTROLS.zoomSpeed = parseInt(sd.zoom_speed);
      if (vc3d_glob.CONTROLS.zoomSpeed === 0) {
        vc3d_glob.CONTROLS.noZoom = true;
      }
    } else {
      vc3d_glob.CONTROLS.zoomSpeed = 10;
    }
    if (sd.rotate_speed != undefined) {
      vc3d_glob.CONTROLS.rotateSpeed = parseInt(sd.rotate_speed);
      if (vc3d_glob.CONTROLS.rotateSpeed === 0) {
        vc3d_glob.CONTROLS.noRotate = true;
      }
    } else {
      vc3d_glob.CONTROLS.rotateSpeed = 10;
    }

    //!!!
    if (sd.pan_speed != undefined) {
      if (!vc3d_glob.panSpeed_not_count) {
        vc3d_glob.CONTROLS.panSpeed = parseInt(sd.pan_speed);
        if (vc3d_glob.CONTROLS.panSpeed === 0) {
          vc3d_glob.CONTROLS.noPan = true;
        }
      }
    } else {
      vc3d_glob.CONTROLS.panSpeed = 10;
    }

    if (sd.controls_maxDistance != undefined) {
      vc3d_glob.CONTROLS.maxDistance = parseInt(sd.controls_maxDistance);
    } else {
      vc3d_glob.CONTROLS.maxDistance = 19000;
    }

    if (sd.controls_minDistance != undefined) {
      vc3d_glob.CONTROLS.minDistance = parseInt(sd.controls_minDistance);
    } else {
      vc3d_glob.CONTROLS.minDistance = 50;
    }

    var controls_maxPolarAngle = parseInt(sd.controls_maxPolarAngle);
    if (controls_maxPolarAngle > 0) {
      vc3d_glob.CONTROLS.maxPolarAngle = Math.PI / controls_maxPolarAngle;
    } else {
      vc3d_glob.CONTROLS.maxPolarAngle = Math.PI / 2;
    }

    /*=======================================================*/
    if (sd.controls_type != "3") {
      if (sd.controls_target_x != undefined) {
        vc3d_glob.CONTROLS.target.x = parseInt(sd.controls_target_x);
      } else {
        vc3d_glob.CONTROLS.target.x = 0;
      }
      if (sd.controls_target_y != undefined) {
        vc3d_glob.CONTROLS.target.y = parseInt(sd.controls_target_y);
      } else {
        vc3d_glob.CONTROLS.target.y = 0;
      }
      if (sd.controls_target_z != undefined) {
        vc3d_glob.CONTROLS.target.z = parseInt(sd.controls_target_z);
      } else {
        vc3d_glob.CONTROLS.target.z = 0;
      }
    }

    vc3d_glob.CONTROLS.staticMoving = true;
    vc3d_glob.CONTROLS.dynamicDampingFactor = 0.3;
    /*======================================================================================================================================================================*/
  }

  add_only_plane_and_mouse_move() {
    vc3d_glob.plane = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(1200000, 1200000, 1, 1),
      new THREE.MeshBasicMaterial({ visible: false, color: "#0f0" })
    );
    vc3d_glob.plane.not_3d_model = true;
    vc3d_glob.plane.name1 = "plane";
    vc3d_glob.SCENE.add(vc3d_glob.plane);

    /***************************************************************************************8 */

    if (vc3d_glob && vc3d_glob.floor) {
      switch (vc3d_glob.floor) {
        case "floor":
          vc3d_glob.plane.rotation.x = (-90 * Math.PI) / 180; // это нормальная плоскость - пол
          break;
        case "wall":
          break;
        default: // это нормальная плоскость - пол
          vc3d_glob.plane.rotation.x = (-90 * Math.PI) / 180;
          break;
      }
    } else {
      vc3d_glob.plane.rotation.x = (-90 * Math.PI) / 180; // это нормальная плоскость - пол
    }
  }

  render() {
    vc3d_glob.renderer.render(vc3d_glob.SCENE, vc3d_glob.CAMERA);
  }
}

export let i3d_base = new i3d_Base();

// f4_base.js
