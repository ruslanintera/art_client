import React, { useContext, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { observer } from "mobx-react-lite";
import { Context } from "../../index";

import {
  fetchRack,
  fetchRackCreate,
  fetchRackUpdate,
  fetchOneRack,
  fetchRackDelete,
} from "../../http/commAPI";

import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { RACK_ROUTE } from "../../utils/consts";

const Obj = observer(() => {
  const history = useHistory();
  const { device } = useContext(Context);
  const { id } = useParams();
  const [oneValue, setOneValue] = useState({ name: "" });

  useEffect(() => {
    fetchOneRack(id).then((data) => {
      device.setRackOne(data);
      if (!device.getRackOne) return;

      const { id, name } = device.getRackOne;
      //console.log({id, name})
      setOneValue({ id, name });
    });
  }, [id]);

  function DELETE(event) {
    fetchRackDelete(oneValue.id);
    history.push(RACK_ROUTE + "/");
  }
  function UPDATE(event) {
    fetchRackUpdate(oneValue);
  }
  async function CREATE(event) {
    const data = await fetchRackCreate(oneValue); //
    //console.log("CREATE data = =  = = =", data, "CREATE data.id = =  = = =", data.id)

    device.setRackOne(data);
    const { id, name } = device.getRackOne;
    //console.log({id, name})
    setOneValue({ id, name });

    history.push(RACK_ROUTE + "/" + data.id);
  }
  //function fClassName(pad1_true) { if (pad1_true) { return "form-control" + " pad1"; } else return "form-control" }

  if (!device.getRackOne) {
    return <div className="work_page navbar">Данные отсутствуют</div>;
  }

  return (
    <div className="work_page navbar1">
      <Container>
        <Row className="mt-2">
          <h4>
            <strong>Comm PAGE!</strong>
          </h4>
        </Row>

        <Row className="mt-2">
          <Col md={3}></Col>
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
                  <td>{device.getRackOne.id}</td>
                  <td></td>
                </tr>
                <tr>
                  <td>name</td>
                  <td>{oneValue.name}</td>
                  <td>
                    <input
                      type="text"
                      value={oneValue.name}
                      onChange={(e) =>
                        setOneValue({ ...oneValue, name: e.target.value })
                      }
                      className="form-control pad1"
                      id="first_name"
                      name="first_name"
                    />
                  </td>
                </tr>

                {/* <tr><td>RS_ID</td><td>{oneValue.RS_ID}</td><td>
                            <select value={oneValue.RS_ID} 
                                onChange={(e) => { 
                                    //console.log("!!!!!! e.target.value = ", e.target.value, {...oneValue, RS_ID: e.target.value}); 
                                    return setCommOneValue({...commOneValue, RS_ID: e.target.value})}} name="room" id="room" 
                                className={fClassName(true)}>
                                <option value="-1" defaultValue>RS not selected</option>
                                {device.getRS.map((rs, index) =>
                                    <option key={rs.RS_ID} value={rs.RS_ID}> {rs.RS_ID + " " + rs.Realm + " " + rs.Province + " " + rs.Biome} </option>
                                )}
                            </select>
                        </td></tr> */}
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
