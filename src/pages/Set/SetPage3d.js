import React, { useContext, useEffect, useState } from "react"
import { Container } from "react-bootstrap"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"
import { observer } from "mobx-react-lite"
import { Context } from "../../index"
import { vc3d_glob } from "../../3d/dev2020/f5_vc3d_glob"
import objLoaders from "../../3d/obj-loaders.js"
import { common } from "../../common/common"
import { i3d_all } from "../../3d/dev2020/f7_assist.js"

import { fetchOneModelType3d, fetchOneDC } from "../../http/commAPI"

import { useParams } from "react-router-dom"
import { useHistory } from "react-router-dom"
import { Set_ROUTE } from "../../utils/consts"
import { i3d_base } from "../../3d/dev2020/f4_base"

const Obj = observer(() => {
  const history = useHistory()
  const { device } = useContext(Context)
  const { id } = useParams()
  const [oneValue, setOneValue] = useState({
    name: "",
    adress: "",
    model3d: "",
    params1: "",
    params2: "",
    params3: "",
    updatedAt: "",
  })
  const [xzValue, setXZValue] = useState({ x: 90, z: 50 })

  useEffect(() => {
    vc3d_glob.device.setActive3dElement({})

    fetchOneDC(id).then((data) => {
      device.setSetOne(data)
      if (!device.getSetOne) return

      let { id, name, adress, model3d, params1, params2, params3, updatedAt } =
        device.getSetOne
      setOneValue({
        id,
        name,
        adress,
        model3d,
        params1,
        params2,
        params3,
        updatedAt,
      })
      //console.log("dc = ", id)

      try {
        common.clear3dscene() // очистим сцену

        if (!params3) {
          params3 = "[]"
        }
        var JSON_params2, JSON_params3
        try {
          JSON_params2 = eval("(" + params2 + ")")
        } catch (e) {
          JSON_params2 = []
        }
        try {
          JSON_params3 = eval("(" + params3 + ")")
        } catch (e) {
          JSON_params3 = []
        }
        if (JSON_params2 === {}) {
          JSON_params2 = []
        }
        if (JSON_params3 === {}) {
          JSON_params3 = []
        }

        const cx = common.valOrDefault(JSON_params2.cx, 0)
        const cy = common.valOrDefault(JSON_params2.cy, 1000)
        const cz = common.valOrDefault(JSON_params2.cz, 500)
        vc3d_glob.CAMERA.position.set(cx, cy, cz)
        vc3d_glob.CAMERA.updateProjectionMatrix()
        vc3d_glob.CONTROLS.update()
        if (!vc3d_glob.animate) {
          i3d_all.animate3()
        }

        if (params3 && typeof params3 === "string") {
          //var JSON_params3 = eval("(" + params3 + ")")
          //console.log("JSON_params3 = ", JSON_params3)
          let set = id

          for (let i = 0; i < JSON_params3.length; i++) {
            let m = JSON_params3[i].m
            let x = JSON_params3[i].x || 0
            let y = JSON_params3[i].y || 0
            let z = JSON_params3[i].z || 0
            let rx = JSON_params3[i].rx || 0
            let ry = JSON_params3[i].ry || 0
            let rz = JSON_params3[i].rz || 0
            let s = JSON_params3[i].s || 1
            let fix = JSON_params3[i].fix || 0
            let matsArray = JSON_params3[i].matsArray || []
            //console.log("================= matsArray", matsArray)

            if (!m) {
              return
            }
            fetchOneModelType3d(m).then((data) => {
              device.setModelType3dOne(data)
              //console.log("rt================= data", data)
              if (!device.getModelType3dOne) return
              vc3d_glob.currentRT = device.getModelType3dOne

              const Set = { dc: 1, x: 1, z: 1 } //device.getSetOne    dc, x, z
              //console.log("Set", Set)
              vc3d_glob.currentRT.Set = Set //{ dc, x, z } //device.getSetOne

              if (vc3d_glob.currentRT && vc3d_glob.SCENE) {
                vc3d_glob.device = device

                i3d_base.load_gltf_2021_params({
                  m,
                  x,
                  y,
                  z,
                  rx,
                  ry,
                  rz,
                  s,
                  set,
                  data,
                  matsArray,
                  fix,
                })
              }
            })
          }
        } else {
          console.error("ERRRR no params3")
        }
      } catch (e) {
        console.error("ERRRR params3", e, "params3 = ", params3)
      }
    })
  }, [id])

  if (!device.getSetOne) {
    return <div className="work_page navbar">Данные отсутствуют</div>
  }

  return <div className="work_page navbar1"></div>
})

export default Obj
