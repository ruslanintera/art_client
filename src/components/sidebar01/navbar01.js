import React, { Component, useContext, useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Nav from "react-bootstrap/Nav"
// import Navbar from "react-bootstrap/Navbar"
// import {NavLink} from "react-router-dom"

//import './sidebar.css'
//import logo from './sidebar/images/logo.jpg'
import { observer } from "mobx-react-lite"
import { Context } from "../../index"
import {
  LOGIN_ROUTE,
  HOME_ROUTE,
  MODEL_ROUTE,
  SET_ROUTE,
  PHOTO_ROUTE,
} from "../../utils/consts"
import { useHistory } from "react-router-dom"

const SideBar = observer((props) => {
  const { device } = useContext(Context)

  const { store } = useContext(Context)
  const history = useHistory()

  const handleToggle = () => {
    device.setIsActive(!device.isActive)
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <button
          type="button"
          id="sidebarCollapse"
          onClick={handleToggle}
          className="btn btn-primary"
        >
          <i className="fa fa-bars"></i>
          <span className="sr-only">Toggle Menu</span>
        </button>
        <button
          className="btn btn-dark d-inline-block d-lg-none ml-auto"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i className="fa fa-bars"></i>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="nav navbar-nav ml-auto">
            <li className="nav-item active">
              <Link className="nav-link" to={HOME_ROUTE}>
                HOME
              </Link>
            </li>
            <li className="nav-item active">
              <Link className="nav-link" to={SET_ROUTE}>
                SETS
              </Link>
            </li>
            <li className="nav-item active">
              <Link className="nav-link" to={MODEL_ROUTE}>
                MODELS
              </Link>
            </li>
            <li className="nav-item active">
              <Link className="nav-link" to={PHOTO_ROUTE}>
                IMGS
              </Link>
            </li>

            {store.isAuth ? (
              <Nav>
                <li
                  className="nav-item"
                  // onClick={() => logOut()}
                >
                  <Link className="nav-link" to={LOGIN_ROUTE}>
                    {store.user.email}
                  </Link>
                </li>
              </Nav>
            ) : (
              <li className="nav-item">
                <Link className="nav-link" to={LOGIN_ROUTE}>
                  LOG IN
                </Link>
              </li>
            )}

            <li className="nav-item">
              <Link className="nav-link" to={LOGIN_ROUTE}>
                AUTH
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
})

export default SideBar
