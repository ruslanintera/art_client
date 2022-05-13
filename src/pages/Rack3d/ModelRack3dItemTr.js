import React, { useState } from "react";
import { Card, Col } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import star from "../../assets/star.png";
import { useHistory } from "react-router-dom";
import { RACK3D_ROUTE } from "../../utils/consts";
import { HOME_ROUTE } from "../../utils/consts";
import { i3d_events_func } from "../../3d/dev2020/f8_events_func.js";
import { vc3d_glob } from "../../3d/dev2020/f5_vc3d_glob";

const Rack3dItem = ({ obj, forceUpdate }) => {
  const history = useHistory();
  let select_color = "#fff";
  if (obj.active == 1) {
    select_color = "#709";
  } else {
    //select_color = "#fff"
  }

  return (
    <tr style={{ backgroundColor: select_color }}>
      <td
        className={"mt-3 comm_num"}
        onClick={() => {
          i3d_events_func.find_obj(
            vc3d_glob.SCENE,
            obj.model_unid,
            obj.name,
            i3d_events_func.temp_mat_curr_obj_2021
          );

          i3d_events_func.temp_mat_record_2021(obj.model_unid, obj.name); // определим элемент в таблице элементов 3Д модели

          history.push(HOME_ROUTE);
          forceUpdate(); // ререндеринг родительского компонента
        }}
      >
        {obj.id}
      </td>
      <td className="community_name">{obj.model_unid}</td>
      <td className="community_name">{obj.name}</td>
    </tr>

    // <tr>
    //     <td className={"mt-3 comm_num"} onClick={() => history.push(RACK3D_ROUTE + '/' + obj.id)}>{obj.id}</td>
    //     <td className="community_name">{obj.name}</td>
    // </tr>
  );
};

export default Rack3dItem;
