import React, { useContext, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
//import { Button, Dropdown, Form, Row, Col } from "react-bootstrap";
import { Form } from "react-bootstrap";

import { observer } from "mobx-react-lite";
import { Context } from "../../index";

import {
  fetchRacktype,
  fetchManufacturer,
  fetchRacktypeCreate,
  fetchRacktypeUpdate,
  fetchOneRacktype,
  fetchRacktypeDelete,
  fetchRacktypeUploadGLB,
} from "../../http/commAPI";

import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { MODEL_ROUTE } from "../../utils/consts";

import { vc3d_glob } from "../../3d/dev2020/f5_vc3d_glob";
import { i3d_base } from "../../3d/dev2020/f4_base";
import { i3d_all } from "../../3d/dev2020/f7_assist";
import objLoaders from "../../3d/obj-loaders.js";
import { common } from "../../common/common";

import { HexColorPicker } from "react-colorful";
//import "react-colorful/dist/index.css";

const Obj = observer(() => {
  const history = useHistory();
  const { device } = useContext(Context);
  const { id } = useParams();
  const [oneValue, setOneValue] = useState({
    id: "",
    name: "",
    manufacturer: 0,
    model3d: "",
    color: "",
    params1: "",
    params2: "",
    params3: "",
    dts: "",
    dt: "",
    user: 0,
  });
  const [color, setColor] = useState("#fff");

  const [fileGLB, setFileGLB] = useState(null);
  const [filesJPG, setFilesJPG] = useState(null);

  const selectFileGLB = (e) => {
    setFileGLB(e.target.files[0]);
  };
  const selectFilesJPG = (e) => {
    setFilesJPG(e.target.files[0]);
  };

  useEffect(() => {
    fetchOneRacktype(id).then((data) => {
      device.setRacktypeOne(data);
      if (!device.getRacktypeOne) return;

      const {
        id,
        name,
        manufacturer,
        model3d,
        color,
        params1,
        params2,
        params3,
        dts,
        dt,
        user,
      } = device.getRacktypeOne;
      setOneValue({
        id,
        name,
        manufacturer,
        model3d,
        color,
        params1,
        params2,
        params3,
        dts,
        dt,
        user,
      });
      if (color) setColor(color);

      //console.log("fetchOneRacktype    oneValue ===", oneValue);

      fetchManufacturer(null, null, 1, 999).then((data) => {
        //console.log("fetchManufacturer           data.rows = ", data.rows, "data.count = ", data.count)
        device.setManufacturer(data.rows);
        device.setManufacturerTotal(data.count);
        //device.getManufacturer.map(obj =>console.log("MMMMMMMMMMMMMMMMMMMMMMMMMMMM obj ========", obj))
      });
    });
  }, [id]);

  function DELETE(event) {
    fetchRacktypeDelete(oneValue.id);
    history.push(MODEL_ROUTE + "/");
  }
  function UPDATE(event) {
    //console.log("UPDATE oneValue ===", oneValue);
    fetchRacktypeUpdate(oneValue);
  }
  const onDone = (data) => {
    //console.log("udated data=", data);
  };
  const uploadGLBJPG = () => {
    //console.log("fileGLB", fileGLB, "filesJPG", filesJPG)
    const formData = new FormData();
    formData.append("id", oneValue.id);
    formData.append("name", oneValue.name);
    formData.append("manufacturer", oneValue.manufacturer);
    formData.append("model3d", oneValue.model3d);
    formData.append("color", oneValue.color);
    formData.append("params1", oneValue.params1);
    formData.append("params2", oneValue.params2);
    formData.append("params3", oneValue.params3);
    formData.append("dts", oneValue.dts);
    formData.append("dt", oneValue.dt);
    formData.append("user", oneValue.user);

    formData.append("glb", fileGLB);
    formData.append("imgs", filesJPG);
    //console.log("@@@@@@@@@@@@@@ formData.get('imgs') = ", formData.get("imgs"))
    //console.log("@@@@@@@@@@@@@@ formData.get('glb') = ", formData.get("glb"))
    //console.log("@@@@@@@@@@@@@@ formData.get('name') = ", formData.get("name"))
    //formData.append("info", JSON.stringify(info));
    fetchRacktypeUploadGLB(formData, oneValue.id).then((data) => onDone(data));
  };

  async function CREATE(event) {
    const data = await fetchRacktypeCreate(oneValue); //
    //console.log("CREATE data = =  = = =", data, "CREATE data.id = =  = = =", data.id)

    device.setRacktypeOne(data);
    const {
      id,
      name,
      manufacturer,
      model3d,
      color,
      params1,
      params2,
      params3,
      dts,
      dt,
      user,
    } = device.getRacktypeOne;
    //console.log("CREATE ===", name, manufacturer, model3d, "p1 ===", params1, "p2 ===", params2, user)

    setOneValue({
      id,
      name,
      manufacturer,
      model3d,
      color,
      params1,
      params2,
      params3,
      dts,
      dt,
      user,
    });

    history.push(MODEL_ROUTE + "/" + data.id);
  }
  //function fClassName(pad1_true) { if (pad1_true) { return "form-control" + " pad1"; } else return "form-control" }

  if (!device.getRacktypeOne) {
    return <h1 className="work_page navbar">Данные отсутствуют</h1>;
  }

  return (
    <div className="work_page navbar1">
      <Container>
        <Row className="mt-2">
          <h4>
            <strong>3D модель {oneValue.name}</strong>
          </h4>
        </Row>

        <Row className="mt-2">
          <Col md={3}>
            <HexColorPicker
              color={color}
              onChange={(e) => {
                setColor(e);
                setOneValue({ ...oneValue, color: e });
              }}
            />
          </Col>
          <Col md={9}>
            <table>
              <thead>
                <tr>
                  <th>Field</th>
                  <th>Value</th>
                  <th>Edit</th>
                </tr>
              </thead>

              {/* name, manufacturer, model3d, params1, params2, user */}

              <tbody>
                <tr>
                  <td>id</td>
                  <td>{device.getRacktypeOne.id}</td>
                  <td></td>
                </tr>
                <tr>
                  <td>name</td>
                  <td>{oneValue.name}</td>
                  <td>
                    <input
                      type="text"
                      className="form-control pad1"
                      value={oneValue.name}
                      onChange={(e) =>
                        setOneValue({ ...oneValue, name: e.target.value })
                      }
                    />
                  </td>
                </tr>

                <tr>
                  <td>manufacturer</td>
                  <td>{oneValue.manufacturer}</td>
                  <td>
                    <select
                      value={oneValue.manufacturer}
                      onChange={(e) => {
                        //console.log("!!!!!! e.target.value = ", e.target.value, {...oneValue, manufacturer: e.target.value});
                        return setOneValue({
                          ...oneValue,
                          manufacturer: e.target.value,
                        });
                      }}
                      // className={fClassName(true)}
                    >
                      <option value="-1" defaultValue>
                        Производитель не выбран
                      </option>
                      {device.getManufacturer.map((objselect, index) => (
                        <option key={objselect.id} value={objselect.id}>
                          {" "}
                          {objselect.id + " " + objselect.name}{" "}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>

                <tr>
                  <td>model3d</td>
                  <td>{oneValue.model3d}</td>
                  <td>
                    <input
                      type="text"
                      className="form-control pad1"
                      value={oneValue.model3d}
                      onChange={(e) =>
                        setOneValue({ ...oneValue, model3d: e.target.value })
                      }
                    />
                  </td>
                </tr>

                <tr>
                  <td>color</td>
                  <td>{oneValue.color}</td>
                  <td>
                    <input
                      type="text"
                      className="form-control pad1"
                      value={oneValue.color}
                      onChange={(e) => {
                        setOneValue({ ...oneValue, color: e.target.value });
                        setColor(e.target.value);
                      }}
                    />
                  </td>
                </tr>

                <tr>
                  <td>params1</td>
                  <td>{oneValue.params1}</td>
                  <td>
                    <input
                      type="textarea"
                      className="form-control pad1"
                      value={oneValue.params1}
                      onChange={(e) =>
                        setOneValue({ ...oneValue, params1: e.target.value })
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td>params2</td>
                  <td>{oneValue.params2}</td>
                  <td>
                    <input
                      type="text"
                      className="form-control pad1"
                      value={oneValue.params2}
                      onChange={(e) =>
                        setOneValue({ ...oneValue, params2: e.target.value })
                      }
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <Button className="mt-1 " onClick={(e) => DELETE(e)}>
              DELETE
            </Button>
            <Button className="mt-1 ml-1 danger" onClick={(e) => CREATE(e)}>
              CREATE
            </Button>
            <Button className="mt-1 ml-1 danger" onClick={(e) => UPDATE(e)}>
              UPDATE
            </Button>
            <hr />
            GLB
            <Form.Control
              className="mt-3"
              type="file"
              onChange={selectFileGLB}
            />
            <hr />
            JPG
            <Form.Control
              className="mt-3"
              type="file"
              // multiple
              onChange={selectFilesJPG}
            />
            <hr />
            <Button
              className="mt-1 ml-1 danger"
              onClick={(e) => uploadGLBJPG(e)}
            >
              UPDATE & UPLOAD
            </Button>
            <Button
              className="mt-1 ml-1 danger"
              onClick={(e) => {
                vc3d_glob.device = device;
                common.clear3dscene();
              }}
            >
              CLEAR
            </Button>
            <Button
              className="mt-1 ml-1 danger"
              onClick={(e) => {
                vc3d_glob.device = device;

                //i3d_base.load_gltf_2021(oneValue.model3d, oneValue.params1, oneValue.params2);
                i3d_base.load_gltf_2021(oneValue);

                //console.log("===============LOAD 3D==================vc3d_glob.SCENE.children = ", vc3d_glob.SCENE.children );
              }}
            >
              LOAD 3D
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
});

export default Obj;

/**
                    <RSselect pad1_true={false}/>
                    <STselect_label pad1_true={false} />

 */
