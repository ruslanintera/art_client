import React, {
  Component,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { Link } from "react-router-dom";

import { observer } from "mobx-react-lite";
import { Context } from "../../index";
import { ROUTE_3D } from "../../utils/consts";
import { Alert, Container, Row, Col, Tabs, Tab, Button } from "react-bootstrap";
import { fetchModelType3d } from "../../http/commAPI";
import ModelType3dList from "../../pages/ModelType3d/ModelType3dList";
import PagesModelType3d from "../../pages/ModelType3d/PagesModelType3d";
import { useHistory } from "react-router-dom";
import { vc3d_glob } from "../../3d/dev2020/f5_vc3d_glob";

import JoyStick from "../joyStick/joyStick";
import RangeSlider from "../rangeSlider/rangeSlider";
import { react3d } from "../../3d/react3d";

const SideBar = observer((props) => {
  let rootElement = props.rootElement;
  const { device } = useContext(Context);
  const history = useHistory();

  const [parentVal, setParentVal] = useState(10);

  const sliderValueChanged = useCallback((val) => {
    console.log("NEW VALUE", val);
    setParentVal(val);
  });

  const sliderProps = useMemo(
    () => ({
      min: 0,
      max: 100,
      value: parentVal,
      step: 2,
      label: "This is a reusable slider",
      onChange: (e) => sliderValueChanged(e),
    }),
    [parentVal]
  );

  useEffect(() => {
    fetchModelType3d({
      page: device.getModelType3dPage,
      limit: device.getModelType3dLimit,
    }).then((data) => {
      device.setModelType3d(data.rows);
      device.setModelType3dTotal(data.count);
    });
  }, [device.getModelType3dPage]);

  function DELETE() {
    try {
    } catch (e) {
      console.error("ERRR del==", e);
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
                ROUTE_3D +
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
          </div>
        ) : (
          ""
        )}

        {device.getActiveModel != undefined && device.getActiveModel.id ? (
          <Alert variant={"danger"}>
            <strong>
              {device.getActiveModel.id}. {device.getActiveModel.name}
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
                    <PagesModelType3d />
                    <ModelType3dList short={true} />
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
              react3d.SAVE(device);
            }}
          >
            SAVE
          </Button>
        </div>

        <div>
          <h1>PARENT VALUE: {parentVal}</h1>
          <RangeSlider {...sliderProps} classes="additional-css-classes" />
        </div>

        <JoyStick />
      </div>
    </nav>
  );
});

export default SideBar;
