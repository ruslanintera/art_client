import React, { Component, useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { observer } from "mobx-react-lite";
import { Context } from "../../index";
import { RACK3D_ROUTE } from "../../utils/consts";
import { Alert, Container, Row, Col, Tabs, Tab, Button } from "react-bootstrap";
import { fetchRacktype, fetchDCUpdate } from "../../http/commAPI";
import RacktypeList from "../../pages/Racktype/RacktypeList";
import PagesRacktype from "../../pages/Racktype/PagesRacktype";
import { useHistory } from "react-router-dom";
import { vc3d_glob } from "../../3d/dev2020/f5_vc3d_glob";

const SideBar = observer((props) => {
  let rootElement = props.rootElement;
  const { device } = useContext(Context);
  const history = useHistory();

  useEffect(() => {
    fetchRacktype({
      page: device.getRacktypePage,
      limit: device.getRacktypeLimit,
    }).then((data) => {
      device.setRacktype(data.rows);
      device.setRacktypeTotal(data.count);
    });
  }, [device.getRacktypePage]);

  function DELETE() {
    try {
    } catch (e) {
      console.error("ERRR del==", e);
    }
  }
  function SAVE() {
    try {
      let DCOne = vc3d_glob.device.getDCOne;
      let { id, name, adress, model3d, params1, params2, params3, updatedAt } =
        device.getDCOne;

      //console.log("DCOne", DCOne);

      var JSON_params2, JSON_params3;
      try {
        JSON_params2 = eval("(" + params2 + ")");
      } catch (e) {
        JSON_params2 = [];
      }
      try {
        JSON_params3 = eval("(" + params3 + ")");
      } catch (e) {
        JSON_params3 = [];
      }
      if (JSON_params2 == {}) {
        JSON_params2 = [];
      }
      if (JSON_params3 == {}) {
        JSON_params3 = [];
      }

      console.log("44444 JSON_params3 = ", JSON_params3);

      //console.log("params3", params3);
      //console.log("vc3d_glob.SCENE", vc3d_glob.SCENE);

      for (var i = vc3d_glob.SCENE.children.length - 1; i >= 0; i--) {
        if (vc3d_glob.SCENE.children[i].MODEL3D) {
          let model = vc3d_glob.SCENE.children[i];
          //console.log("model = ", model.position);
          //console.log("model = ", model);
          //console.log("model.m = ", model.m);
          let found;
          for (let j = 0; j < JSON_params3.length; j++) {
            if (JSON_params3[j].m == model.m) {
              console.log("@@@@@@@@@ model.m = ", model.m);
              console.log("position = ", model.position);
              JSON_params3[j].x = model.position.x;
              JSON_params3[j].y = model.position.y;
              JSON_params3[j].z = model.position.z;
              // JSON_params3.rx = model.rotation.x
              // JSON_params3.ry = model.rotation.y
              // JSON_params3.rz = model.rotation.z
              found = true;
            }
          }
          if (!found) {
            JSON_params3.push({
              m: model.m,
              x: model.position.x,
              y: model.position.y,
              z: model.position.z,
            });
          }
          //setOneValue({ ...oneValue, model3d: e.target.value })
          //vc3d_glob.device.setDCOne(data);
        }
      }
      JSON_params2.cx = vc3d_glob.CAMERA.position.x;
      JSON_params2.cy = vc3d_glob.CAMERA.position.y;
      JSON_params2.cz = vc3d_glob.CAMERA.position.z;
      params2 = JSON.stringify(JSON_params2);
      DCOne = { ...DCOne, params2: params2 };

      //console.log("JSON_params3 = ", JSON_params3);
      params3 = JSON.stringify(JSON_params3);
      DCOne = { ...DCOne, params3: params3 };
      console.log("========== DCOne = ", DCOne);
      console.log("cam = ", vc3d_glob.CAMERA.position);

      fetchDCUpdate(DCOne);
    } catch (e) {
      console.error("ERRR sidebar ==", e);
    }
  }

  return (
    <nav id="sidebar" className={device.isActive ? "active" : null}>
      <div id="sidebar2scroll" className="p-3 pt-1 ">
        {device.getActive3dModel &&
        device.getActive3dModel.rt > 0 &&
        device.getActive3dModel.dc &&
        device.getActive3dModel.x &&
        device.getActive3dModel.z ? (
          <Alert
            style={{ cursor: "pointer" }}
            onClick={() =>
              history.push(
                RACK3D_ROUTE +
                  "/" +
                  device.getActive3dModel.dc +
                  "_" +
                  device.getActive3dModel.rt +
                  "_" +
                  device.getActive3dModel.x +
                  "_" +
                  device.getActive3dModel.z
              )
            }
            variant={"primary"}
          >
            <strong>
              {device.getActive3dModel.rt}.{device.getActive3dModel.name}, (
              {device.getActive3dModel.x}, {device.getActive3dModel.z})
            </strong>
          </Alert>
        ) : (
          ""
        )}

        {device.getActive3dElement != undefined &&
        device.getActive3dElement.elementName &&
        device.getActive3dModel ? (
          <div>
            <Alert variant={"info"}>
              <strong>
                {" "}
                {device.getActive3dModel.name} -{" "}
                {device.getActive3dElement.elementName}
              </strong>
            </Alert>

            {device.getActive3dElement.pt === 2 ? (
              <Alert style={{ background: vc3d_glob.rack_repair2_color }}>
                <strong>need to repair</strong>
              </Alert>
            ) : (
              ""
            )}
            {device.getActive3dElement.pt === 3 ? (
              <Alert style={{ background: vc3d_glob.rack_change3_color }}>
                <strong>need to change</strong>
              </Alert>
            ) : (
              ""
            )}

            {/* <Button
              className="mr-1"
              onClick={(e) => {
                repair_change(2);
              }}
            >
              {device.getActive3dElement.pt === 2 ? "CANCEL REPAIR" : "REPAIR"}
            </Button>

            <Button
              className="mr-1"
              onClick={(e) => {
                repair_change(3);
              }}
            >
              {device.getActive3dElement.pt === 3 ? "CANCEL CHANGE" : "CHANGE"}
            </Button> */}
          </div>
        ) : (
          ""
        )}

        {device.getActiveRackType != undefined &&
        device.getActiveRackType.id ? (
          <Alert variant={"danger"}>
            <strong>
              {device.getActiveRackType.id}. {device.getActiveRackType.name}
            </strong>
          </Alert>
        ) : (
          ""
        )}

        <div className="work_page navbar1 ">
          <Container>
            <Tabs
              className="mt-3 work_page_content"
              defaultActiveKey="tab_page_1"
              id="uncontrolled-tab-example"
            >
              <Tab className="p-0" eventKey="tab_page_1" title="M">
                <h4>
                  <strong>3D Модели</strong>
                </h4>

                <Row className="mt-2">
                  <Col md={12}>
                    <PagesRacktype />
                    <RacktypeList short={true} />
                  </Col>
                </Row>
              </Tab>
              <Tab className="p-0" eventKey="tab_page_2" title="A">
                <Container>
                  <br></br>
                  <h4>
                    <strong>A</strong>
                  </h4>
                </Container>
              </Tab>
              <Tab className="p-1" eventKey="tab_page_3" title="B">
                <h4>
                  <strong>B</strong>
                </h4>
              </Tab>
            </Tabs>
          </Container>

          <Button
            className="mr-1"
            onClick={(e) => {
              SAVE();
            }}
          >
            SAVE
          </Button>
        </div>
      </div>
    </nav>
  );
});

export default SideBar;
