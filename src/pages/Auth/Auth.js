import io from "socket.io-client";

import React, { useContext, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import {
  LOGIN_ROUTE,
  REGISTRATION_ROUTE,
  HOME_ROUTE,
} from "../../utils/consts";

import { Row, Col, Tabs, Tab, Button } from "react-bootstrap";
//import Button from "react-bootstrap/Button";

import UserService from "../../auth/services/UserService";

import { observer } from "mobx-react-lite";
import { Context } from "../../index";

import { useHistory, useLocation } from "react-router-dom";
import { fetchModelType3d, fetchModelType3dCreate } from "../../http/commAPI";
import ModelType3dList from "../ModelType3d/ModelType3dList";
import PagesModelType3d from "../ModelType3d/PagesModelType3d";
import { MODEL_ROUTE } from "../../utils/consts";

const ModelType3d = observer(() => {
  const { user } = useContext(Context);
  const location = useLocation();
  const isLogin = location.pathname === LOGIN_ROUTE;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { store } = useContext(Context);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      store.checkAuth();
    }
  }, []);

  async function getUsers() {
    try {
      //const response = await UserService.fetchUsers(email, password);
      const response = await UserService.fetchUsers();
      setUsers(response.data);
    } catch (e) {
      console.error("getUsers ERROR", e);
    }
  }

  return (
    <div className="work_page navbar1 ">
      <Container>
        <Tabs
          className="mt-3 work_page_content"
          defaultActiveKey="tab_page_1"
          id="uncontrolled-tab-example"
        >
          <Tab className="p-1" eventKey="tab_page_1" title="ModelType3d">
            <h4>
              <strong>AUTH</strong>
            </h4>

            {store.isAuth ? (
              <div>
                <Container
                  // className=" navbar d-flex justify-content-center align-items-center  navbar"
                  className=" navbar "
                  style={{ height: window.innerHeight - 54, zIndex: 55 }}
                >
                  <h5>
                    {store.isAuth
                      ? `Пользователь авторизован::: ${store.user.id}. ${store.user.email}`
                      : ""}
                  </h5>

                  <button onClick={getUsers}>Получить пользователей</button>
                  {users.map((user) => (
                    <div key={user.email}>{user.email}</div>
                  ))}

                  {/* <button onClick={() => store.logout()}>Выйти</button> */}
                  <button
                    onClick={() => {
                      store.logout();
                      users.length = 0;
                    }}
                  >
                    Выйти
                  </button>
                </Container>
              </div>
            ) : (
              <div>
                <Container
                  className=" navbar d-flex justify-content-center align-items-center  navbar"
                  style={{ height: window.innerHeight - 54, zIndex: 55 }}
                >
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    type="text"
                    placeholder="Email"
                  />
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    type="password"
                    placeholder="Пароль"
                  />
                  <button onClick={() => store.login(email, password)}>
                    Логин
                  </button>
                  <button onClick={() => store.registration(email, password)}>
                    Регистрация
                  </button>

                  <button onClick={getUsers}>Получить пользователей !!!</button>
                  {users.map((user) => (
                    <div key={user.email}>{user.email}</div>
                  ))}
                </Container>
              </div>
            )}
          </Tab>
          <Tab className="p-1" eventKey="tab_page_2" title="Profile">
            <Container>
              <br></br>
              <h4>
                <strong>
                  ffffffffff6666666666666666666666666666666666 7777
                </strong>
              </h4>

              <div>window.innerHeight = {window.innerHeight}</div>
              <div>window.innerWidth = {window.innerWidth}</div>
              <div>
                document.body.clientHeight = {document.body.clientHeight}
              </div>
              <div>document.body.clientWidth = {document.body.clientWidth}</div>
              <div> window.screen.height = {window.screen.height}</div>
              <div> window.screen.width = {window.screen.width}</div>
              <div>window.screen.availHeight = {window.screen.availHeight}</div>
              <div>window.screen.availWidth = {window.screen.availWidth}</div>
            </Container>
          </Tab>
          <Tab className="p-1" eventKey="tab_page_3" title="Contact">
            <h4>
              <strong>ffffffffff 222</strong>
            </h4>
            efwewefwefe efe
          </Tab>
        </Tabs>
      </Container>
    </div>
  );
});

export default ModelType3d;
