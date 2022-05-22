import * as THREE from "three";
import { i3d_ao3 } from "./f8_ao3.js";
import { i3d_down_up } from "./f88_down.js";
import { i3d_events_func } from "./f8_events_func.js";
import { i3d_mats } from "./f2_mats.js";
import { app } from "./f9_appvue.js";
import { i3d_all } from "./f7_assist.js";
import { i3d_app_sets } from "./f3_apparat_sets.js";
import { vc3d_glob } from "./f5_vc3d_glob.js";

class i3d_Dop {
  addCubeNew(selected_obj, color) {
    //if(vc3d_glob.red_cube) { vc3d_glob.SCENE.remove(vc3d_glob.red_cube); }

    var geo_selected = new THREE.BoxBufferGeometry(16, 16, 16);

    var geometry_selected = geo_selected.clone();

    let x1 = selected_obj.position.x;
    let z1 = selected_obj.position.z;
    let y1 = selected_obj.position.y + 8;

    geometry_selected.translate(x1, y1, z1);
    vc3d_glob.red_cube = new THREE.Mesh(
      geo_selected,
      new THREE.MeshBasicMaterial({ visible: true, color: color })
    );
    //vc3d_glob.red_cube.rotation.x = -90 * Math.PI / 180;
    vc3d_glob.red_cube.position.x = x1;
    vc3d_glob.red_cube.position.y = y1;
    vc3d_glob.red_cube.position.z = z1;

    if (vc3d_glob.device.getActiveRackType.id) {
      vc3d_glob.red_cubes.push(vc3d_glob.red_cube);
    }

    vc3d_glob.red_cube.wtype = "rack"; //
    vc3d_glob.red_cube.MODEL3D = 1; //
    vc3d_glob.SCENE.add(vc3d_glob.red_cube);
  }
}
export let i3d_dop = new i3d_Dop(); // i3d_Events.
