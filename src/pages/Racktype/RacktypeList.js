import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../../index";

import RacktypeItemTr from "./RacktypeItemTr";

//import DataGrid from 'react-data-grid';

const CommunityList = observer(({ short }) => {
  const { device } = useContext(Context);

  if (short) {
    return (
      <>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>A</th>
              <th>name</th>
              <th>+</th>
            </tr>
          </thead>
          <tbody>
            {device.getRacktype.map((obj) => {
              return <RacktypeItemTr key={obj.id} obj={obj} short={short} />;
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
            {/* <th>params1</th>
                <th>params2</th> */}
          </tr>
        </thead>
        <tbody>
          {device.getRacktype.map((obj) => {
            //obj.active = 0;
            return <RacktypeItemTr key={obj.id} obj={obj} />;
          })}
        </tbody>
      </table>
    </>
  );
});

/**

*/

export default CommunityList;
