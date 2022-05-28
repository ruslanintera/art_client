import React, { useContext, useState, useEffect } from "react";
import { Card, Col } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import star from "../../assets/star.png";
import { useHistory } from "react-router-dom";
import { PHOTO_ROUTE, ROUTE_3D } from "../../utils/consts";

import { observer } from "mobx-react-lite";
import { Context } from "../../index";

import { vc3d_glob } from "../../3d/dev2020/f5_vc3d_glob";
import { react3d } from "../../3d/react3d";
import styles from "./PhotoVideoPage.module.css";

const PhotoVideoItem = observer(({ obj, short }) => {
  //console.log("objobjobjobjobjobjobjo ", { ...obj });
  const history = useHistory();
  const { device } = useContext(Context);
  const { store } = useContext(Context);
  //const [imgItemValue, setImgItemValue] = useState({});
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(obj.params3Array.map((item) => item)); // How to fix cannot update a component while rendering a different component warning
  }, []);

  if (short) {
    return (
      <tr>
        <td>
          {items.map((item) => {
            return (
              <img
                onClick={() => react3d.ADD_IMAGE(obj, item, device)}
                className={styles.imgList}
                src={item}
                alt={item}
                key={item}
              ></img>
            );
          })}
        </td>
      </tr>
    );
  }

  return (
    <tr>
      <td
        className={"mt-3 comm_num"}
        onClick={() => history.push(PHOTO_ROUTE + "/" + obj.id)}
      >
        {obj.id}
      </td>

      <td className="community_name">{obj.name}</td>
      {/* <td className="community_name">{obj.manufacturer}</td>
      <td className="community_name">{obj.pathimg}</td>
      <td className="community_name">{obj.color}</td>
      <td className="community_name">{obj.type}</td> */}
      <td>
        {items.map((item) => {
          return (
            <img
              className={styles.imgList}
              src={item}
              alt={item}
              key={item}
            ></img>
          );
        })}
      </td>
    </tr>
  );
});

export default PhotoVideoItem;
