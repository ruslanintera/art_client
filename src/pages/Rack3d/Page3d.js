import React, { useContext, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { observer } from "mobx-react-lite";
import { Context } from "../../index";

import { fetchOneRacktype, fetchOneDC } from "../../http/commAPI";

import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { RACK3D_ROUTE } from "../../utils/consts";

import { vc3d_glob } from "../../3d/dev2020/f5_vc3d_glob";
import { i3d_base } from "../../3d/dev2020/f4_base";
//import { i3d_all } from "../../3d/dev2020/f7_assist";
//import objLoaders from "../../3d/obj-loaders.js";
import { common } from "../../common/common";

const Obj = observer(() => {
  const history = useHistory();
  const { device } = useContext(Context);
  const [oneValue, setOneValue] = useState({ name: "" });

  const { id } = useParams();
  const idSplitRack = id;
  const id_array = idSplitRack.split("_"); // тут разберем rt=4, dc=2, x=5, z=6
  // const dc = parseInt(id_array[0]);
  // const rt = parseInt(id_array[1]);
  // const x = parseInt(id_array[2]);
  // const z = parseInt(id_array[3]);
  const rt = parseInt(id_array[0]);

  useEffect(() => {
    fetchOneRacktype(rt).then((data) => {
      device.setRacktypeOne(data);
      //console.log("rt================= data", data, "rt", rt);
      if (!device.getRacktypeOne) return;
      vc3d_glob.currentRT = device.getRacktypeOne;

      const DC = { dc: 1, x: 1, z: 1 }; //device.getDCOne    dc, x, z
      //console.log("DC", DC);
      vc3d_glob.currentRT.DC = DC; //{ dc, x, z }; //device.getDCOne

      //if (vc3d_glob.currentRT && vc3d_glob.currentDCRack && vc3d_glob.SCENE) {
      if (vc3d_glob.currentRT && vc3d_glob.SCENE) {
        vc3d_glob.device = device;
        common.clear3dscene();

        // device.setActive3dModel({
        //   dc: vc3d_glob.currentRT.DC.dc,
        //   name: vc3d_glob.currentRT.name,

        //   x: 1, // vc3d_glob.currentDCRack.x,
        //   z: 1, // vc3d_glob.currentDCRack.z,
        //   rt: 1, // vc3d_glob.currentDCRack.rt,
        //   type: 1, // vc3d_glob.currentDCRack.type, //type:  0 - empty, 1 - rack, 2 - ремонт, 3 - замена, rt - RACKTYPE
        //   p: 1, // vc3d_glob.currentDCRack.p,
        // });

        i3d_base.load_gltf_2021();
      }
    });
  });

  return <div className="work_page navbar1"></div>;
});

export default Obj;
