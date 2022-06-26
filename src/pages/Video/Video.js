import io from "socket.io-client"

import React, { useContext, useEffect, useState } from "react"

import { Container, Row, Col, Tabs, Tab, Button } from "react-bootstrap"
//import Button from "react-bootstrap/Button"

import { useHistory } from "react-router-dom"

import { observer } from "mobx-react-lite"
import { Context } from "../../index"

import { fetchVideo, fetchVideoCreate } from "../../http/commAPI"
import VideoList from "./VideoList"
import PagesVideo from "./PagesVideo"
import { PHOTO_ROUTE } from "../../utils/consts"

const Video = observer(() => {
  const { device } = useContext(Context)
  const history = useHistory()
  const [oneValue, setOneValue] = useState({ name: "" })

  useEffect(() => {
    fetchVideo({
      page: device.getVideoPage,
      limit: device.getVideoLimit,
    }).then((data) => {
      device.setVideo(data.rows)
      device.setVideoTotal(data.count)
    })
  }, [device.getVideoPage])

  async function CREATE(event) {
    const data = await fetchVideoCreate(oneValue) //
    history.push(PHOTO_ROUTE + "/" + data.id)
  }

  return (
    <div className="work_page navbar1 ">
      <Container>
        <Tabs
          className="mt-3 work_page_content"
          defaultActiveKey="tab_page_1"
          id="uncontrolled-tab-example"
        >
          <Tab className="p-1" eventKey="tab_page_1" title="Video">
            <h4>
              <strong>3D Модели</strong>
            </h4>

            <Row className="mt-2">
              {/* <Col md={3}></Col> */}
              <Col md={12}>
                <PagesVideo />
                <VideoList />
              </Col>
            </Row>
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

      <Button className="mt-1 ml-1 danger" onClick={(e) => CREATE(e)}>
        CREATE
      </Button>
    </div>
  )
})

export default Video
