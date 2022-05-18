import React, { useContext, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { observer } from "mobx-react-lite";
import { Context } from "../../index";

import {
  fetchRack3d,
  fetchOneRacktype,
  fetchOneDC,
  fetchRacktype,
  fetchRack3dCreate,
  fetchRack3dUpdate,
  fetchOneRack3d,
  fetchRack3dDelete,
} from "../../http/commAPI";

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
  const dc = parseInt(id_array[0]);
  const rt = parseInt(id_array[1]);
  const x = parseInt(id_array[2]);
  const z = parseInt(id_array[3]);

  useEffect(() => {
    // Не удалять
    // fetchOneRack3d(rt).then(data => {
    //     device.setRack3dOne(data)
    //     if(!device.getRack3dOne) return;
    //     const { id, name } = device.getRack3dOne;
    //     setOneValue({id, name});
    // })

    //vc3d_glob.currentRackALL = {};

    fetchOneDC(dc).then((data) => {
      //console.log("dc================= data", data, "dc", dc);
      device.setDCOne(data);
      if (!device.getDCOne) return;
      vc3d_glob.device = device;

      //const { id, name, adress, model3d, params1, params2, params3, updatedAt } = device.getDCOne;
      //setOneValue({id, name, adress, model3d, params1, params2, params3, updatedAt});

      // найдем rack (vc3d_glob.currentDCRack) из большого списка всех стеллажей выбранного РЦ (DC) - список тут: device.getDCOne.params1
      // информация о проблемах стеллажа хранится именно там, а не в записях типа стелажа или где либо еще
      try {
        var params1_obj = eval("(" + device.getDCOne.params1 + ")");
        if (params1_obj) {
          device.getDCOne.params1_obj = params1_obj;
        }
      } catch (e) {
        console.error("device.getDCOne = ", device.getDCOne);
        console.error("EeeRRRRRORRRRR e ", e);
        return;
      }
      // НАШЛИ конкретный стеллаж по адресу (x,z)
      vc3d_glob.currentDCRack = device.getDCOne.params1_obj.racks.find(
        (obj, index) => {
          return obj.x == x && obj.z == z;
        }
      );

      fetchOneRacktype(rt).then((data) => {
        device.setRacktypeOne(data);
        //console.log("rt================= data", data, "rt", rt);
        if (!device.getRacktypeOne) return;
        //const RT = device.getRacktypeOne;
        vc3d_glob.currentRT = device.getRacktypeOne;
        //const { id, name, manufacturer, model3d, color, params1, params2, user } = device.getRacktypeOne;
        //setOneValue({id, name, manufacturer, model3d, color, params1, params2, user});
        //console.log("fetchOneRacktype    oneValue ===", oneValue);

        // if(vc3d_glob.currentDCRack) {
        //     if(vc3d_glob.currentDCRack.p) { RT.p = vc3d_glob.currentDCRack.p; } // проблемы стеллажа
        //     if(vc3d_glob.currentDCRack.rt) { RT.rt = vc3d_glob.currentDCRack.rt; } // Rack Type
        // }
        //console.log("00000 00000000000000    RT = ", RT)

        const DC = { dc, x, z }; //device.getDCOne
        vc3d_glob.currentRT.DC = { dc, x, z }; //device.getDCOne

        if (vc3d_glob.currentRT && vc3d_glob.currentDCRack && vc3d_glob.SCENE) {
          vc3d_glob.device = device;
          common.clear3dscene();
          //i3d_base.load_gltf_2021(RT, DC);

          //console.log("Rack3D Page!   vc3d_glob.currentR T = ", vc3d_glob.currentRT, "vc3d_glob.currentDCRack = ", vc3d_glob.currentDCRack  )

          // device.setActive3dModel({
          //   dc: vc3d_glob.currentRT.DC.dc,
          //   name: vc3d_glob.currentRT.name,

          //   x: vc3d_glob.currentDCRack.x,
          //   z: vc3d_glob.currentDCRack.z,
          //   rt: vc3d_glob.currentDCRack.rt,
          //   type: vc3d_glob.currentDCRack.type, //type:  0 - empty, 1 - rack, 2 - ремонт, 3 - замена, rt - RACKTYPE
          //   p: vc3d_glob.currentDCRack.p,
          // });

          i3d_base.load_gltf_2021();
        }
      });

      // fetchRacktype(null, null, null, null, null, null, null, null, 1, 999).then(data => {
      //     device.setRacktype3d(data.rows)
      //     //device.setRacktypeTotal(data.count)
      //     //const Racktype = [...vc3d_glob.device.getRacktype3d];
      //     // const RT = device.getRacktype3d.find((obj, index) => { return obj.id === rt })
      //     //console.log("0000000000000000000    device.getRacktype3d = ", device.getRacktype3d)
      //     //console.log("vc3d_glob.currentDCRack = ", vc3d_glob.currentDCRack)
      // })
    });
  });

  // function DELETE(event) { fetchRack3dDelete(oneValue.id); history.push(RACK3D_ROUTE + '/'); }
  // function UPDATE(event) { fetchRack3dUpdate(oneValue); }
  // async function CREATE(event) {
  //     const data = await fetchRack3dCreate(oneValue); //
  //     //console.log("CREATE data = =  = = =", data, "CREATE data.id = =  = = =", data.id)

  //     device.setRack3dOne(data)
  //     const { id, name } = device.getRack3dOne;
  //     //console.log({id, name})
  //     setOneValue({id, name});

  //     history.push(RACK3D_ROUTE + '/' + data.id)
  // }

  //function fClassName(pad1_true) { if (pad1_true) { return "form-control" + " pad1"; } else return "form-control" }

  // if(!device.getRack3dOne) {
  //     return (
  //         <div className="work_page navbar">Данные отсутствуют 33</div>
  //     );
  // }

  return (
    <div className="work_page navbar1">
      {/* <Container>
            <Row className="mt-2">
                <h4><strong>Comm PAGE!</strong></h4>
            </Row>

            <Row className="mt-2">
                <Col md={3}>
                    

                    
                </Col>
                <Col md={9}>


                    <table>
                        <thead>
                        <tr><th>Field</th><th>Value</th><th>Edit</th></tr>
                        </thead>
                        
                        <tbody>
                        <tr><td>id</td><td>{device.getRack3dOne.id}</td><td></td></tr>
                        <tr><td>name</td><td>{oneValue.name}</td><td>
                            <input type="text"
                    value={oneValue.name} onChange={(e) => setOneValue({...oneValue, name: e.target.value})}
                    className="form-control pad1" id="first_name" name="first_name"/></td></tr>

                        </tbody>
                    </table>

                    <Button className="mt-1 " onClick={(e) => DELETE(e)}>DELETE</Button>
                    <Button className="mt-1 ml-1 danger" onClick={(e) => CREATE(e)}>CREATE</Button>
                    <Button className="mt-1 ml-1 danger" onClick={(e) => UPDATE(e)}>UPDATE</Button>






                </Col>
            </Row>
        </Container>
     */}
    </div>
  );
});

export default Obj;

/**
                    <RSselect pad1_true={false}/>
                    <STselect_label pad1_true={false} />

 */
