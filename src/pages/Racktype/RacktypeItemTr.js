import React, { useContext } from "react";
import { Card, Col } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import star from "../../assets/star.png";
import { useHistory } from "react-router-dom";
import { MODEL_ROUTE, ROUTE_3D } from "../../utils/consts";

import { observer } from "mobx-react-lite";
import { Context } from "../../index";
// import { fetchOneRacktype, fetchOneDC } from "../../http/commAPI";
// import { common } from "../../common/common";
// import { i3d_base } from "../../3d/dev2020/f4_base";

import { vc3d_glob } from "../../3d/dev2020/f5_vc3d_glob";
import { react3d } from "../../3d/react3d";
// import { i3d_base } from "../../3d/dev2020/f4_base";
// import { i3d_all } from "../../3d/dev2020/f7_assist";
// import objLoaders from "../../3d/obj-loaders.js";

const RacktypeItem = observer(({ obj, short }) => {
  //console.log("objobjobjobjobjobjobjo ", obj);
  const history = useHistory();
  const { device } = useContext(Context);

  if (short) {
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
          onClick={() => react3d.ADD_MODEL(obj.id, device)}
        >
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
          console.log("obj", obj, "obj.id = ", obj.id);

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
