import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../../index";
import ModelType3dItemTr from "./ModelType3dItemTr";
import styles from "./ModelType3d.module.css"
console.log('0990 ===', styles, '====', styles.tbl)

const ModelType3dList = observer(({ short }) => {
  const { device } = useContext(Context);

  if (short) {
    return (
      <>555555555555555555555555
        <table className={styles.tbl}>
          <thead className="tbl">
            <tr>
              <th>#</th>
              <th>A</th>
              <th>name</th>
              <th>+</th>
            </tr>
          </thead>
          <tbody>
            {device.getModelType3d.map((obj) => {
              return <ModelType3dItemTr key={obj.id} obj={obj} short={short} />;
            })}
          </tbody>
        </table>
      </>
    );
  }
  return (
    <>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>activate</th>
            <th>name</th>
            <th>manufacturer</th>
            <th>model3d</th>
            <th>color</th>
            <th>model3d</th>
          </tr>
        </thead>
        <tbody>
          {device.getModelType3d.map((obj) => {
            return <ModelType3dItemTr key={obj.id} obj={obj} />;
          })}
        </tbody>
      </table>
    </>
  );
});

export default ModelType3dList;
