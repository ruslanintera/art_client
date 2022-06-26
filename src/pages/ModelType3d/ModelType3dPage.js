import React, { useContext, useEffect, useState } from "react"
import { Container } from "react-bootstrap"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"
//import { Button, Dropdown, Form, Row, Col } from "react-bootstrap"
import { Form } from "react-bootstrap"

import { observer } from "mobx-react-lite"
import { Context } from "../../index"

import {
  fetchModelType3d,
  fetchManufacturer,
  fetchModelType3dCreate,
  fetchModelType3dUpdate,
  fetchOneModelType3d,
  fetchModelType3dDelete,
  fetchModelType3dUploadGLB,
} from "../../http/commAPI"

import { useParams } from "react-router-dom"
import { useHistory } from "react-router-dom"
import { MODEL_ROUTE } from "../../utils/consts"
import { HexColorPicker } from "react-colorful"

const Obj = observer(() => {
  const history = useHistory()
  const { device } = useContext(Context)
  const { id } = useParams()
  const [oneValue, setOneValue] = useState({
    id: "",
    name: "",
    manufacturer: 0,
    model3d: "",
    color: "",
    params1: "",
    params2: "",
    params3: "",
    dts: "",
    dt: "",
    user: 0,
  })
  const [color, setColor] = useState("#fff")
  const [fileGLB, setFileGLB] = useState(null)
  const [filesJPG, setFilesJPG] = useState(null)
  const [params3Array, setParams3Array] = useState([])

  const selectFileGLB = (e) => {
    setFileGLB(e.target.files[0])
  }
  const selectFilesJPG = (e) => {
    setFilesJPG(e.target.files[0])
  }

  useEffect(() => {
    fetchOneModelType3d(id).then((data) => {
      device.setModelType3dOne(data)
      if (!device.getModelType3dOne) return

      const { id, name, manufacturer, model3d, color, params1, params2, params3, dts, dt, user } = device.getModelType3dOne
      setOneValue({ id, name, manufacturer, model3d, color, params1, params2, params3, dts, dt, user })
      if (color) setColor(color)

      fetchManufacturer(null, null, 1, 999).then((data) => {
        device.setManufacturer(data.rows)
        device.setManufacturerTotal(data.count)
      })

      // const params3_JSON = JSON.parse(params3)
      // const imgPathArray = params3_JSON.map((item, idx) => {
      //   return (process.env.REACT_APP_API_URL +`user${user}/img${id}/${item}`)
      // })
      // setParams3Array(imgPathArray)
      console.log('oneValue = ', oneValue);
      console.log('oneValue.params3 = ', oneValue.params3);

      if (params3) {
        const imgPathArray = []
        imgPathArray.push(process.env.REACT_APP_API_URL + params3)
        setParams3Array(imgPathArray)
      } else {
        setParams3Array([])
      }

    })
  }, [id])

  function DELETE(event) {
    fetchModelType3dDelete(oneValue.id)
    history.push(MODEL_ROUTE + "/")
  }
  function UPDATE(event) {
    fetchModelType3dUpdate(oneValue)
  }
  function UPDATE_2(event) {
    //console.log("UPDATE_2 oneValue ===", oneValue)
    //{id, name } = oneValue
    const oneValue_2 = { id: oneValue.id, name: oneValue.name }
    fetchModelType3dUpdate(oneValue_2)
  }
  const onDone = (data) => {
    console.log("MODEL udated data=", data)
      const { id, name, manufacturer, model3d, color, params1, params2, params3, dts, dt, user } = data.record
      console.log('id >>>>>>>>>>>>>>>>>', id);
      setOneValue({ id, name, manufacturer, model3d, color, params1, params2, params3, dts, dt, user })

    //if (data?.record?.params3) {
    if (params3) {
      // setOneValue({ ...oneValue, params3: data.record.params3 })

      // const params3_JSON = JSON.parse(data.record.params3)
      // const imgPathArray = params3_JSON.map((item, idx) => {
      //   return (process.env.REACT_APP_API_URL +`user${data.record.user}/model${id}/${item}`)
      // })
      // setParams3Array(imgPathArray)
      const imgPathArray = []
      imgPathArray.push(process.env.REACT_APP_API_URL + params3)
      setParams3Array(imgPathArray)

    } else {
      setParams3Array([])
    }

  }
  const uploadGLBJPG = () => {
    const formData = new FormData()
    formData.append("id", oneValue.id)
    formData.append("name", oneValue.name)
    formData.append("manufacturer", oneValue.manufacturer)
    formData.append("model3d", oneValue.model3d)
    formData.append("color", oneValue.color)
    formData.append("params1", oneValue.params1)
    formData.append("params2", oneValue.params2)
    formData.append("params3", oneValue.params3)
    formData.append("dts", oneValue.dts)
    formData.append("dt", oneValue.dt)
    formData.append("user", oneValue.user)

    formData.append("glb", fileGLB)
    formData.append("imgs", filesJPG)
    fetchModelType3dUploadGLB(formData, oneValue.id).then((data) =>
      onDone(data)
    )
  }

  async function CREATE(event) {
    const data = await fetchModelType3dCreate(oneValue) //
    device.setModelType3dOne(data)
    const { id, name, manufacturer, model3d, color, params1, params2, params3, dts, dt, user } = device.getModelType3dOne
    setOneValue({ id, name, manufacturer, model3d, color, params1, params2, params3, dts, dt, user })
    history.push(MODEL_ROUTE + "/" + data.id)
  }

  if (!device.getModelType3dOne) {
    return <h1 className="work_page navbar">Данные отсутствуют</h1>
  }

  return (
    <div className="work_page navbar1">
      <Container>
        <Row className="mt-2">
          <h4>
            <strong>3D модель. {oneValue.name}</strong>
          </h4>
        </Row>

        <Row className="mt-2">
          <Col md={3}>
            <HexColorPicker
              color={color}
              onChange={(e) => {
                setColor(e)
                setOneValue({ ...oneValue, color: e })
              }}
            />

            {params3Array.map((item, idx) => {
              return (<img src={item} alt={item} key={item + idx + Date.now()}></img>)
            })}

            {/* { oneValue.params3 
              ? <img src={process.env.REACT_APP_API_URL + oneValue.params3} alt={oneValue.params3}></img>
              : 'no pics'
            } */}

          </Col>
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
                  <td>{device.getModelType3dOne.id}</td>
                  <td></td>
                </tr>
                <tr>
                  <td>name</td>
                  <td>{oneValue.name}</td>
                  <td>
                    <input
                      type="text"
                      className="form-control pad1"
                      value={oneValue.name}
                      onChange={(e) =>
                        setOneValue({ ...oneValue, name: e.target.value })
                      }
                    />
                  </td>
                </tr>

                <tr>
                  <td>manufacturer</td>
                  <td>{oneValue.manufacturer}</td>
                  <td>
                    <select
                      value={oneValue.manufacturer}
                      onChange={(e) => {
                        //console.log("!!!!!! e.target.value = ", e.target.value, {...oneValue, manufacturer: e.target.value})
                        return setOneValue({
                          ...oneValue,
                          manufacturer: e.target.value,
                        })
                      }}
                      // className={fClassName(true)}
                    >
                      <option value="-1" defaultValue>
                        Производитель не выбран
                      </option>
                      {device.getManufacturer.map((objselect, index) => (
                        <option key={objselect.id} value={objselect.id}>
                          {" "}
                          {objselect.id + " " + objselect.name}{" "}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>

                <tr>
                  <td>model3d</td>
                  <td>{oneValue.model3d}</td>
                  <td>
                    <input
                      type="text"
                      className="form-control pad1"
                      value={oneValue.model3d}
                      onChange={(e) =>
                        setOneValue({ ...oneValue, model3d: e.target.value })
                      }
                    />
                  </td>
                </tr>

                <tr>
                  <td>color</td>
                  <td>{oneValue.color}</td>
                  <td>
                    <input
                      type="text"
                      className="form-control pad1"
                      value={oneValue.color}
                      onChange={(e) => {
                        setOneValue({ ...oneValue, color: e.target.value })
                        setColor(e.target.value)
                      }}
                    />
                  </td>
                </tr>

                <tr>
                  <td>params1</td>
                  <td>{oneValue.params1}</td>
                  <td>
                    <input
                      type="textarea"
                      className="form-control pad1"
                      value={oneValue.params1}
                      onChange={(e) =>
                        setOneValue({ ...oneValue, params1: e.target.value })
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td>params2</td>
                  <td>{oneValue.params2}</td>
                  <td>
                    <input
                      type="text"
                      className="form-control pad1"
                      value={oneValue.params2}
                      onChange={(e) =>
                        setOneValue({ ...oneValue, params2: e.target.value })
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td>params3</td>
                  <td>{oneValue.params3}</td>
                  <td>
                    <input
                      type="text"
                      className="form-control pad1"
                      value={oneValue.params3}
                      onChange={(e) =>
                        setOneValue({ ...oneValue, params3: e.target.value })
                      }
                    />
                  </td>
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
            <Button className="mt-1 ml-1 danger" onClick={(e) => UPDATE_2(e)}>
              UPDATE_2
            </Button>
            <hr />
            GLB
            <Form.Control
              className="mt-3"
              type="file"
              accept=".glb"
              onChange={selectFileGLB}
            />
            <hr />
            JPG
            <Form.Control
              className="mt-3"
              type="file"
              // multiple
              onChange={selectFilesJPG}
            />
            <hr />
            <Button
              className="mt-1 ml-1 danger"
              onClick={(e) => uploadGLBJPG(e)}
            >
              UPDATE & UPLOAD
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  )
})

export default Obj
