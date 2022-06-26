import React, { useContext } from "react"
import { observer } from "mobx-react-lite"
import { Context } from "../../index"
import PhotoItemTr from "./PhotoItemTr"
import { react3d } from "../../3d/react3d"
import styles from "./PhotoPage.module.css"

const PhotoList = observer(({ short }) => {
  const { device } = useContext(Context)

  if (short) {
    return (
      <>
        <table>
          <tbody>
            {device.getPhoto.map((obj) => {
              if (!obj.params3) {
                obj.params3 = "[]"
              }
              const params3_JSON = JSON.parse(obj.params3)
              obj.params3Array = params3_JSON.map((item, idx) => {
                return (
                  //process.env.REACT_APP_API_URL +
                  `user${obj.user}/img${obj.id}/${item}`
                )
              })

              if (!obj.params2) {
                obj.params2 = "[]"
              }
              const params2_JSON = JSON.parse(obj.params2)
              obj.params2Array = params2_JSON.map((item, idx) => {
                return (
                  //process.env.REACT_APP_API_URL +
                  `user${obj.user}/video${obj.id}/${item}`
                )
              })

              return <PhotoItemTr key={obj.id} obj={obj} short={true} />
            })}
          </tbody>
        </table>
      </>
    )
  }
  return (
    <>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>name</th>
            <th>pv</th>
          </tr>
        </thead>
        <tbody>
          {device.getPhoto.map((obj) => {
            if (!obj.params3) {
              obj.params3 = "[]"
            }
            const params3_JSON = JSON.parse(obj.params3)
            obj.params3Array = params3_JSON.map((item, idx) => {
              return (
                //process.env.REACT_APP_API_URL +
                `user${obj.user}/img${obj.id}/${item}`
              )
            })
            const params2_JSON = JSON.parse(obj.params2)
            obj.params2Array = params2_JSON.map((item, idx) => {
              return (
                //process.env.REACT_APP_API_URL +
                `user${obj.user}/video${obj.id}/${item}`
              )
            })

            return <PhotoItemTr key={obj.id} obj={obj} />
          })}
        </tbody>
      </table>
    </>
  )
})

export default PhotoList
