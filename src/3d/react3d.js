// import * as THREE from 'three';
// import { vc3d_glob } from "../3d/dev2020/f5_vc3d_glob";
// import { i3d_base } from "../3d/dev2020/f4_base";
// import { i3d_all } from "../3d/dev2020/f7_assist";
import { fetchOneModelType3d, fetchSetUpdate } from "../http/commAPI";
import { vc3d_glob } from "./dev2020/f5_vc3d_glob";
//import { common } from "../common/common";
import { i3d_base } from "./dev2020/f4_base";

class React3d {
  ADD_MODEL(m, device) {
    //model_id
    try {
      console.log("model_id = ", m);

      if (!m) {
        return;
      }
      fetchOneModelType3d(m).then((data) => {
        device.setModelType3dOne(data);
        console.log("rt================= data", data);
        if (!device.getModelType3dOne) return;
        vc3d_glob.currentRT = device.getModelType3dOne;

        const Set = { dc: 1, x: 1, z: 1 }; //device.getSetOne    dc, x, z
        //console.log("Set", Set);
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

  SAVE(device) {
    try {
      let SetOne = vc3d_glob.device.getSetOne;
      let { id, name, adress, model3d, params1, params2, params3, updatedAt } =
        device.getSetOne;

      //console.log("SetOne", SetOne);

      var JSON_params2, JSON_params3;
      try {
        JSON_params2 = eval("(" + params2 + ")");
      } catch (e) {
        JSON_params2 = [];
      }
      try {
        JSON_params3 = eval("(" + params3 + ")");
      } catch (e) {
        JSON_params3 = [];
      }
      if (JSON_params2 == {}) {
        JSON_params2 = [];
      }
      if (JSON_params3 == {}) {
        JSON_params3 = [];
      }

      console.log("44444 JSON_params3 = ", JSON_params3);

      //console.log("params3", params3);
      //console.log("vc3d_glob.SCENE", vc3d_glob.SCENE);

      for (var i = vc3d_glob.SCENE.children.length - 1; i >= 0; i--) {
        if (vc3d_glob.SCENE.children[i].MODEL3D) {
          let model = vc3d_glob.SCENE.children[i];
          //console.log("model = ", model.position);
          //console.log("model = ", model);
          //console.log("model.m = ", model.m);
          let found;
          for (let j = 0; j < JSON_params3.length; j++) {
            if (JSON_params3[j].m == model.m) {
              console.log("@@@@@@@@@ model.m = ", model.m);
              console.log("position = ", model.position);
              JSON_params3[j].x = model.position.x;
              JSON_params3[j].y = model.position.y;
              JSON_params3[j].z = model.position.z;
              // JSON_params3.rx = model.rotation.x
              // JSON_params3.ry = model.rotation.y
              // JSON_params3.rz = model.rotation.z
              found = true;
            }
          }
          if (!found) {
            JSON_params3.push({
              m: model.m,
              x: model.position.x,
              y: model.position.y,
              z: model.position.z,
            });
          }
          //setOneValue({ ...oneValue, model3d: e.target.value })
          //vc3d_glob.device.setSetOne(data);
        }
      }
      JSON_params2.cx = vc3d_glob.CAMERA.position.x;
      JSON_params2.cy = vc3d_glob.CAMERA.position.y;
      JSON_params2.cz = vc3d_glob.CAMERA.position.z;
      params2 = JSON.stringify(JSON_params2);
      SetOne = { ...SetOne, params2: params2 };

      //console.log("JSON_params3 = ", JSON_params3);
      params3 = JSON.stringify(JSON_params3);
      SetOne = { ...SetOne, params3: params3 };
      console.log("========== SetOne = ", SetOne);
      console.log("cam = ", vc3d_glob.CAMERA.position);

      fetchSetUpdate(SetOne);
    } catch (e) {
      console.error("ERRR sidebar ==", e);
    }
  }
}

export let react3d = new React3d();
