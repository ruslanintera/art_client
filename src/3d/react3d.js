﻿// import * as THREE from 'three';
// import { vc3d_glob } from "../3d/dev2020/f5_vc3d_glob";
// import { i3d_base } from "../3d/dev2020/f4_base";
import { i3d_all } from "./dev2020/f7_assist";
import { fetchOneModelType3d, fetchSetUpdate } from "../http/commAPI";
import { vc3d_glob } from "./dev2020/f5_vc3d_glob";
//import { common } from "../common/common";
import { i3d_base } from "./dev2020/f4_base";

class React3d {
  ADD_IMAGE(obj, item, device) {
    console.log("888888", { ...obj }, item);
  }
  ADD_MODEL(m, device) {
    // m = model id
    try {
      if (!m) {
        return;
      }
      fetchOneModelType3d(m).then((data) => {
        device.setModelType3dOne(data);
        if (!device.getModelType3dOne) return;
        vc3d_glob.currentRT = device.getModelType3dOne;

        const Set = { dc: 1, x: 1, z: 1 }; //device.getSetOne    dc, x, z
        vc3d_glob.currentRT.Set = Set; //{ dc, x, z }; //device.getSetOne

        if (vc3d_glob.currentRT && vc3d_glob.SCENE) {
          vc3d_glob.device = device;

          let x = device.getActive3dElement.cx || 0;
          let y = device.getActive3dElement.cy || 0;
          let z = device.getActive3dElement.cz || 0;
          let rx = 0;
          let ry = 0;
          let rz = 0;
          let s = 1;
          let set = 1;

          i3d_base.load_gltf_2021_params({
            m,
            x,
            y,
            z,
            rx,
            ry,
            rz,
            s,
            set,
            data,
          });
        }
      });
    } catch (e) {
      console.error("ERRR==", e);
    }
  }
  DELETE() {
    try {
      if (vc3d_glob.curr_obj_all) {
        vc3d_glob.SCENE.remove(vc3d_glob.curr_obj_all);

        vc3d_glob.ray_objects = vc3d_glob.ray_objects.filter((item) => {
          return item.uuid !== vc3d_glob.curr_obj_all.uuid;
        });
        vc3d_glob.ray_objects.forEach((item, idx) => {
          //console.log("item", item);
        });
        if (!vc3d_glob.animate) {
          i3d_all.animate2();
        }
      }
    } catch (e) {
      console.error("ERRR del==", e);
    }
  }
  SAVE(device) {
    try {
      let SetOne = vc3d_glob.device.getSetOne;
      let { id, name, adress, model3d, params1, params2, params3, updatedAt } =
        device.getSetOne;

      var JSON_params2 = {},
        JSON_params3 = [];

      for (var i = vc3d_glob.SCENE.children.length - 1; i >= 0; i--) {
        if (vc3d_glob.SCENE.children[i].MODEL3D) {
          let model = vc3d_glob.SCENE.children[i];
          JSON_params3.push({
            m: model.m,
            x: model.position.x,
            y: model.position.y,
            z: model.position.z,
            rx: model.rotation.x,
            ry: model.rotation.y,
            rz: model.rotation.z,
            s: model.scale.x,
          });
        }
      }
      JSON_params2.cx = vc3d_glob.CAMERA.position.x;
      JSON_params2.cy = vc3d_glob.CAMERA.position.y;
      JSON_params2.cz = vc3d_glob.CAMERA.position.z;

      params2 = JSON.stringify(JSON_params2);
      SetOne = { ...SetOne, params2: params2 };
      params3 = JSON.stringify(JSON_params3);
      SetOne = { ...SetOne, params3: params3 };

      fetchSetUpdate(SetOne);
    } catch (e) {
      console.error("ERRR sidebar ==", e);
    }
  }
}

export let react3d = new React3d();
