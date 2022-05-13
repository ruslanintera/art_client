import React, { useContext } from "react";
import { Card, Col } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import star from "../../assets/star.png";
import { useHistory } from "react-router-dom";
import { MODEL_ROUTE, ROUTE_3D } from "../../utils/consts";

import { observer } from "mobx-react-lite";
import { Context } from "../../index";
import { fetchOneRacktype, fetchOneDC } from "../../http/commAPI";
import { common } from "../../common/common";
import { i3d_base } from "../../3d/dev2020/f4_base";

import { vc3d_glob } from "../../3d/dev2020/f5_vc3d_glob";
// import { i3d_base } from "../../3d/dev2020/f4_base";
// import { i3d_all } from "../../3d/dev2020/f7_assist";
// import objLoaders from "../../3d/obj-loaders.js";

const RacktypeItem = observer(({ obj, short }) => {
  //console.log("objobjobjobjobjobjobjobjobjobjobjobjobjobjobjobjobjobjobjobjobjobjobjobjobjobj ", obj);
  const history = useHistory();
  const { device } = useContext(Context);

  function ADD_MODEL(m) {
    //model_id
    try {
      console.log("model_id = ", m);

      if (!m) {
        return;
      }
      fetchOneRacktype(m).then((data) => {
        device.setRacktypeOne(data);
        //console.log("rt================= data", data);
        if (!device.getRacktypeOne) return;
        vc3d_glob.currentRT = device.getRacktypeOne;

        const DC = { dc: 1, x: 1, z: 1 }; //device.getDCOne    dc, x, z
        //console.log("DC", DC);
        vc3d_glob.currentRT.DC = DC; //{ dc, x, z }; //device.getDCOne

        if (vc3d_glob.currentRT && vc3d_glob.SCENE) {
          vc3d_glob.device = device;
          //common.clear3dscene();

          device.setActive3dModel({
            dc: vc3d_glob.currentRT.DC.dc,
            name: vc3d_glob.currentRT.name,

            x: 1, // vc3d_glob.currentDCRack.x,
            z: 1, // vc3d_glob.currentDCRack.z,
            rt: 1, // vc3d_glob.currentDCRack.rt,
            type: 1, // vc3d_glob.currentDCRack.type, //type:  0 - empty, 1 - rack, 2 - ремонт, 3 - замена, rt - RACKTYPE
            p: 1, // vc3d_glob.currentDCRack.p,
          });

          let x = 0;
          let y = 0;
          let z = 0;
          let rx = 0;
          let ry = 0;
          let rz = 0;
          let s = 1;
          let set = 1;

          //i3d_base.load_gltf_2021();
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
          });
        }
      });
    } catch (e) {
      console.error("ERRR==", e);
    }
  }

  if (short) {
    return (
      <tr>
        <td
          className={"mt-3 comm_num"}
          onClick={() => history.push(MODEL_ROUTE + "/" + obj.id)}
        >
          {obj.id}
        </td>
        <td className={"mt-3 comm_num"} onClick={() => ADD_MODEL(obj.id)}>
          {obj.id}
        </td>
        {/* <td
          className={"mt-3 comm_num"}
          onClick={() => {
            if (obj.id == device.getActiveRackType.id) {
              device.setActiveRackType({});
              vc3d_glob.red_cubes.map((cube) => {
                vc3d_glob.SCENE.remove(cube);
              });
              vc3d_glob.red_cubes.length = 0;
              vc3d_glob.delete_previous_cube = true;
            } else {
              device.setActiveRackType({ ...obj });
              vc3d_glob.delete_previous_cube = false;
            }
          }}
        >
          {obj.id == device.getActiveRackType.id ? "a" : "-"}
        </td> */}

        <td className="community_name">{obj.name}</td>
        <td
          className={"mt-3 comm_num"}
          onClick={() => history.push(ROUTE_3D + "/" + obj.id)}
        >
          {obj.id}
        </td>
      </tr>
    );
  }

  return (
    <tr>
      <td
        className={"mt-3 comm_num"}
        onClick={() => history.push(MODEL_ROUTE + "/" + obj.id)}
      >
        {obj.id}
      </td>
      <td
        className={"mt-3 comm_num"}
        onClick={() => {
          //device.setRacktypeOne({ ...obj });
          //console.log("obj", obj, "obj.id = ", obj.id)

          if (obj.id == device.getActiveRackType.id) {
            device.setActiveRackType({});
            vc3d_glob.red_cubes.map((cube) => {
              vc3d_glob.SCENE.remove(cube);
            });
            vc3d_glob.red_cubes.length = 0;
            vc3d_glob.delete_previous_cube = true;
          } else {
            device.setActiveRackType({ ...obj });
            vc3d_glob.delete_previous_cube = false;
            //console.log("device.getActiveRackType.name = ", device.getActiveRackType.name, " !!! ", device.getActiveRackType )
          }
        }}
      >
        {obj.id == device.getActiveRackType.id ? "deactivate" : "activate"}
      </td>

      <td className="community_name">{obj.name}</td>
      <td className="community_name">{obj.manufacturer}</td>
      <td className="community_name">{obj.model3d}</td>
      <td className="community_name">{obj.color}</td>
      <td
        className={"mt-3 comm_num"}
        onClick={() => history.push(ROUTE_3D + "/" + obj.id)}
      >
        {obj.id}
      </td>
    </tr>
  );
});

export default RacktypeItem;
