//import io from 'socket.io-client';
import React, { useContext, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { Row, Col, Tabs, Tab, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Context } from "../../index";
import { fetchSet, fetchSetCreate } from "../../http/commAPI";
import DCList from "./SetList";
import PagesDC from "./PagesSet";
import { SET_ROUTE } from "../../utils/consts";

const Set = observer(() => {
  const { device } = useContext(Context);
  const history = useHistory();
  const [oneValue, setOneValue] = useState({
    name: "",
    adress: "",
    model3d: "",
    color: "",
    params1: "",
    params2: "",
    params3: "",
  });

  useEffect(() => { 
    fetchSet({ page: device.getDCPage, limit: device.getDCLimit}).then((data) => {
      device.setDC(data.rows);
      device.setDCTotal(data.count);
    });
  }, []);

  useEffect(() => {
    fetchSet({ page: device.getDCPage, limit: device.getDCLimit}).then((data) => {
      device.setDC(data.rows);
      device.setDCTotal(data.count);
    });
  }, [device.getDCPage]);

  async function CREATE(event) {
    const data = await fetchSetCreate(oneValue); //
    history.push(SET_ROUTE + "/" + data.id);
  }

  return (
    <div className="work_page navbar1 ">
      <Container>
        <Tabs
          className="mt-0 work_page_content"
          defaultActiveKey="tab_page_1"
          id="uncontrolled-tab-example"
        >
          <Tab className="p-1" eventKey="tab_page_1" title="Set">
            <h4>
              <strong>DCS</strong>
            </h4>

            <Row className="mt-2">
              <Col md={3}></Col>
              <Col md={9}>
                <PagesDC />
                <DCList />
              </Col>
            </Row>
          </Tab>
          <Tab className="p-1" eventKey="tab_page_2" title="Tab2">
            <Container>
              <h4>Tab2</h4>
            </Container>
          </Tab>
          <Tab className="p-1" eventKey="tab_page_3" title="Tab3">
            <h4>Tab3</h4>
          </Tab>
        </Tabs>
      </Container>

      <Button className="mt-1 ml-1 danger" onClick={(e) => CREATE(e)}>
        CREATE
      </Button>
    </div>
  );
});

export default Set;
