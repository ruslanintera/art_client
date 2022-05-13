import React, { useContext, useEffect } from "react";
import { Container } from "react-bootstrap";

import { observer } from "mobx-react-lite";
import { Context } from "../index";

const Home = observer(() => {
  const { device } = useContext(Context);

  return <Container></Container>;
});

export default Home;
