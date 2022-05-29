import React, { useContext, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
//import { Button, Dropdown, Form, Row, Col } from "react-bootstrap";
import { Form } from "react-bootstrap";

import { observer } from "mobx-react-lite";
import { Context } from "../../index";
import styles from "./PhotoVideoPage.module.css";

import {
  fetchPhotoVideo,
  fetchManufacturer,
  fetchPhotoVideoCreate,
  fetchPhotoVideoUpdate,
  fetchOnePhotoVideo,
  fetchPhotoVideoDelete,
  fetchPhotoVideoUploadGLB,
} from "../../http/commAPI";

import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { PHOTO_ROUTE } from "../../utils/consts";

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
  const { store } = useContext(Context);

  const { id } = useParams();
  const [oneValue, setOneValue] = useState({
    id: "",
    name: "",
    manufacturer: 0,
    pathimg: "",
    color: "",
    params1: "",
    params2: "",
    params3: "",
    type: "",
    user: 0,
  });
  const [color, setColor] = useState("#fff");

  const [fileGLB, setFileGLB] = useState(null);
  const [filesJPG, setFilesJPG] = useState(null);
  const [params3Array, setParams3Array] = useState([]);

  const selectFileGLB = (e) => {
    setFileGLB(e.target.files[0]);
  };
  const selectFilesJPG = (e) => {
    //setFilesJPG(e.target.files[0]);
    setFilesJPG(e.target.files);
  };

  useEffect(() => {
    fetchOnePhotoVideo(id).then((data) => {
      device.setPhotoVideoOne(data);
      if (!device.getPhotoVideoOne) return;

      const {
        id,
        name,
        manufacturer,
        pathimg,
        color,
        params1,
        params2,
        params3,
        type,
        user,
      } = device.getPhotoVideoOne;
      setOneValue({
        id,
        name,
        manufacturer,
        pathimg,
        color,
        params1,
        params2,
        params3,
        type,
        user,
      });
      if (color) setColor(color);

      fetchManufacturer(null, null, 1, 999).then((data) => {
        device.setManufacturer(data.rows);
        device.setManufacturerTotal(data.count);
      });
      const params3_JSON = JSON.parse(params3);
      const imgPathArray = params3_JSON.map((item, idx) => {
        return (
          process.env.REACT_APP_API_URL +
          `user${store.user.id}/img${id}/${item}`
        );
      });
      setParams3Array(imgPathArray);
    });
  }, [id]);

  function DELETE(event) {
    fetchPhotoVideoDelete(oneValue.id);
    history.push(PHOTO_ROUTE + "/");
  }
  function UPDATE(event) {
    fetchPhotoVideoUpdate(oneValue);
  }
  const onDone = (data) => {
    console.log("udated data=", data);

    if (data?.record?.params3) {
      setOneValue({ ...oneValue, params3: data.record.params3 });

      const params3_JSON = JSON.parse(data.record.params3);
      const imgPathArray = params3_JSON.map((item, idx) => {
        return (
          process.env.REACT_APP_API_URL +
          `user${store.user.id}/img${id}/${item}`
        );
      });
      setParams3Array(imgPathArray);
    }
  };
  const uploadGLBJPG = () => {
    const formData = new FormData();
    formData.append("id", oneValue.id);
    formData.append("name", oneValue.name);
    formData.append("manufacturer", oneValue.manufacturer);
    formData.append("pathimg", oneValue.pathimg);
    formData.append("color", oneValue.color);
    formData.append("params1", oneValue.params1);
    formData.append("params2", oneValue.params2);
    formData.append("params3", oneValue.params3);
    formData.append("type", oneValue.type);
    formData.append("user", oneValue.user);
    formData.append("glb", fileGLB);
    for (let i = 0; i < filesJPG.length; i++) {
      formData.append(`images_${i}`, filesJPG[i]);
    }

    fetchPhotoVideoUploadGLB(formData, oneValue.id).then((data) =>
      onDone(data)
    );
  };

  async function CREATE(event) {
    const data = await fetchPhotoVideoCreate(oneValue); //
    //console.log("CREATE data = =  = = =", data, "CREATE data.id = =  = = =", data.id)

    device.setPhotoVideoOne(data);
    const {
      id,
      name,
      manufacturer,
      pathimg,
      color,
      params1,
      params2,
      params3,
      type,
      user,
    } = device.getPhotoVideoOne;

    setOneValue({
      id,
      name,
      manufacturer,
      pathimg,
      color,
      params1,
      params2,
      params3,
      type,
      user,
    });
    history.push(PHOTO_ROUTE + "/" + data.id);
  }

  if (!device.getPhotoVideoOne) {
    return <h3 className="work_page navbar">Данные отсутствуют</h3>;
  }

  return (
    <div className="work_page navbar1">
      <Container>
        <Row className="mt-2">
          <h4>
            <strong>3D модель. {oneValue.name}</strong>
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
            {params3Array.map((item) => {
              return <img src={item} alt={item} key={item + Date.now()}></img>;
            })}
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

              <tbody>
                <tr>
                  <td>id</td>
                  <td>{device.getPhotoVideoOne.id}</td>
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
                  <td>pathimg</td>
                  <td>{oneValue.pathimg}</td>
                  <td>
                    <input
                      type="text"
                      className="form-control pad1"
                      value={oneValue.pathimg}
                      onChange={(e) =>
                        setOneValue({ ...oneValue, pathimg: e.target.value })
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
                <tr>
                  <td>params3</td>
                  <td>{oneValue.params3}</td>
                  <td>
                    <input
                      type="text"
                      className="form-control pad1"
                      value={oneValue.params3}
                      onChange={(e) =>
                        setOneValue({ ...oneValue, params3: e.target.value })
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
              accept=".glb"
              onChange={selectFileGLB}
            />
            <hr />
            JPG
            <Form.Control
              className="mt-3"
              type="file"
              accept="image/*"
              multiple
              onChange={selectFilesJPG}
            />
            <hr />
            <Button
              className="mt-1 ml-1 danger"
              onClick={(e) => uploadGLBJPG(e)}
            >
              UPDATE & UPLOAD
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