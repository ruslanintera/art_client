import React, { useState } from "react";
import { Button, Container } from "react-bootstrap";
import CreateBrand from "../components/modals/CreateBrand";
import CreateDevice from "../components/modals/CreateDevice";
import CreateType from "../components/modals/CreateType";
import CreateCommunity from "../components/modals/CreateCommunity";

const Admin = () => {
  const [brandVisible, setBrandVisible] = useState(false);
  const [typeVisible, setTypeVisible] = useState(false);
  const [deviceVisible, setDeviceVisible] = useState(false);
  const [communityVisible, setCommunityVisible] = useState(false);

  return (
    <div className="work_page navbar">
      <Container
        className=" navbar d-flex justify-content-center align-items-center  navbar"
        style={{ height: window.innerHeight - 54, zIndex: 55 }}
      >
        <Button
          variant={"outline-dark"}
          className="mt-4 p-2"
          onClick={() => setCommunityVisible(true)}
        >
          Добавить Community
        </Button>
        <Button
          variant={"outline-dark"}
          className="mt-4 p-2"
          onClick={() => setTypeVisible(true)}
        >
          Добавить тип
        </Button>
        <Button
          variant={"outline-dark"}
          className="mt-4 p-2"
          onClick={() => setBrandVisible(true)}
        >
          Добавить бренд
        </Button>
        <Button
          variant={"outline-dark"}
          className="mt-4 p-2"
          onClick={() => setDeviceVisible(true)}
        >
          Добавить устройство
        </Button>
        <CreateBrand
          show={brandVisible}
          onHide={() => setBrandVisible(false)}
        />
        <CreateDevice
          show={deviceVisible}
          onHide={() => setDeviceVisible(false)}
        />
        <CreateType show={typeVisible} onHide={() => setTypeVisible(false)} />
        <CreateCommunity
          show={communityVisible}
          onHide={() => setCommunityVisible(false)}
        />
      </Container>
    </div>
  );
};

export default Admin;
