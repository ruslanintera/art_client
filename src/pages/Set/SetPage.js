import React, { useContext, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { observer } from "mobx-react-lite";
import { Context } from "../../index";
import { vc3d_glob } from "../../3d/dev2020/f5_vc3d_glob";
import objLoaders from "../../3d/obj-loaders.js";
import { common } from "../../common/common";

import {
  fetchModelType3d,
  fetchSetCreate,
  fetchSetUpdate,
  fetchOneDC,
  fetchSetDelete,
} from "../../http/commAPI";

import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { SET_ROUTE, SET_ROUTE_3D } from "../../utils/consts";

const Obj = observer(() => {
  const history = useHistory();
  const { device } = useContext(Context);
  const { id } = useParams();
  const [oneValue, setOneValue] = useState({
    name: "",
    adress: "",
    model3d: "",
    params1: "",
    params2: "",
    params3: "",
    updatedAt: "",
  });
  const [xzValue, setXZValue] = useState({ x: 90, z: 50 });

  useEffect(() => {
    vc3d_glob.device.setActive3dElement({});

    fetchOneDC(id).then((data) => {
      device.setSetOne(data);
      if (!device.getSetOne) return;

      const {
        id,
        name,
        adress,
        model3d,
        params1,
        params2,
        params3,
        updatedAt,
      } = device.getSetOne;
      setOneValue({
        id,
        name,
        adress,
        model3d,
        params1,
        params2,
        params3,
        updatedAt,
      });
    });
  }, [id]);

  function DELETE(event) {
    fetchSetDelete(oneValue.id);
    history.push(SET_ROUTE + "/");
  }
  function UPDATE(event) {
    try {
      //console.log("UPDATE oneValue = =  = = =", oneValue)
      fetchSetUpdate(oneValue);
    } catch (e) {
      common.coi_sys("UPDATE ERROR", e);
      alert(e.response.data.message); // Пользователь с таким email уже существует
    }
  }
  async function CREATE(event) {
    const data = await fetchSetCreate(oneValue); //
    device.setSetOne(data);
    const { id, name } = device.getSetOne;
    setOneValue({ id, name });
    history.push(SET_ROUTE + "/" + data.id);
  }

  if (!device.getSetOne) {
    return <div className="work_page navbar">Данные отсутствуют</div>;
  }

  return (
    <div className="work_page navbar1">
      <Container>
        <Row className="mt-2">
          <h4>
            <strong>SETS</strong>
          </h4>
        </Row>

        <Row className="mt-2">
          {/* <Col md={3}>
            <div className="form-group">
              <label htmlFor="formGroupExampleInput">X</label>
              <input
                type="number"
                className="form-control"
                id="x_qty"
                value={xzValue.x}
                onChange={(e) => setXZValue({ ...xzValue, x: e.target.value })}
              />

              <label htmlFor="formGroupExampleInput">Z</label>
              <input
                type="number"
                className="form-control"
                id="z_qty"
                value={xzValue.z}
                onChange={(e) => setXZValue({ ...xzValue, z: e.target.value })}
              />
            </div>
          </Col> */}
          <Col md={12}>
            <table style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Field</th>
                  {/* <th>Value</th> */}
                  <th>Edit</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>id</td>
                  {/* <td>{device.getSetOne.id}</td> */}
                  <td></td>
                </tr>
                <tr>
                  <td>name</td>
                  {/* <td>{oneValue.name}</td> */}
                  <td>
                    <input
                      type="text"
                      value={oneValue.name}
                      onChange={(e) =>
                        setOneValue({ ...oneValue, name: e.target.value })
                      }
                      className="form-control pad1"
                    />
                  </td>
                </tr>

                <tr>
                  <td>adress</td>
                  {/* <td>{oneValue.adress}</td> */}
                  <td>
                    <input
                      type="text"
                      value={oneValue.adress}
                      onChange={(e) =>
                        setOneValue({ ...oneValue, adress: e.target.value })
                      }
                      className="form-control pad1"
                    />
                  </td>
                </tr>

                <tr>
                  <td>model3d</td>
                  {/* <td>{oneValue.model3d}</td> */}
                  <td>
                    <input
                      type="text"
                      value={oneValue.model3d}
                      onChange={(e) =>
                        setOneValue({ ...oneValue, model3d: e.target.value })
                      }
                      className="form-control pad1"
                    />
                  </td>
                </tr>

                <tr>
                  <td>params2</td>
                  {/* <td>{oneValue.params2}</td> */}
                  <td>
                    <input
                      type="text"
                      value={oneValue.params2}
                      onChange={(e) =>
                        setOneValue({ ...oneValue, params2: e.target.value })
                      }
                      className="form-control pad1"
                    />
                  </td>
                </tr>

                <tr>
                  <td>params3</td>
                  {/* <td>{oneValue.params3}</td> */}
                  <td>
                    <input
                      type="textarea"
                      value={oneValue.params3}
                      onChange={(e) =>
                        setOneValue({ ...oneValue, params3: e.target.value })
                      }
                      className="form-control pad1"
                    />
                  </td>
                </tr>

                <tr>
                  <td>updatedAt</td>
                  <td>{oneValue.updatedAt}</td>
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

            <Button
              className="mt-1 ml-1 danger"
              onClick={(e) => {
                var win = window.open(
                  SET_ROUTE_3D + "/" + oneValue.id,
                  "_blank"
                );
                win.focus();
              }}
            >
              Open 3D
            </Button>

            {/* function SET(event) { history.push(SET_ROUTE + '/'); } */}
          </Col>
        </Row>
      </Container>
    </div>
  );
});

export default Obj;
