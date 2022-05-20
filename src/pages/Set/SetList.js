import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../../index";

import DCItemTr from "./SetItemTr";

//import DataGrid from 'react-data-grid';

const DCList = observer(() => {
  const { device } = useContext(Context);

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>name</th>
            <th>adress</th>
            <th>model3d</th>
            <th>updatedAt</th>
          </tr>
        </thead>
        <tbody>
          {device.getDC.map((obj) => (
            <DCItemTr key={obj.id} obj={obj} />
          ))}
        </tbody>
      </table>
    </>
  );
});

/**

*/

export default DCList;
