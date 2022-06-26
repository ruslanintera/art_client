import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { MODEL_ROUTE, ROUTE_3D } from "../../utils/consts";
import { observer } from "mobx-react-lite";
import { Context } from "../../index";
//import { vc3d_glob } from "../../3d/dev2020/f5_vc3d_glob";
import { react3d } from "../../3d/react3d";
import styles from "./ModelType3d.module.css"

const ModelType3dItem = observer(({ obj, short }) => {
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
          if (obj.id == device.getActiveModel.id) {
            device.setActiveModel({});
          } else {
            device.setActiveModel({ ...obj });
          }
        }}
      >
        {obj.id == device.getActiveModel.id ? "deactivate" : "activate"}
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

export default ModelType3dItem;
