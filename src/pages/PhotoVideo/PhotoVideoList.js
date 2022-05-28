import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../../index";
import PhotoVideoItemTr from "./PhotoVideoItemTr";
import { react3d } from "../../3d/react3d";
import styles from "./PhotoVideoPage.module.css";

const PhotoVideoList = observer(({ short }) => {
  const { device } = useContext(Context);

  if (short) {
    return (
      <>
        <table>
          <tbody>
            {device.getPhotoVideo.map((obj) => {
              if (!obj.params3) {
                obj.params3 = "[]";
              }
              const params3_JSON = JSON.parse(obj.params3);
              obj.params3Array = params3_JSON.map((item, idx) => {
                return (
                  process.env.REACT_APP_API_URL +
                  `user${obj.user}/img${obj.id}/${item}`
                );
              });
              // return (
              //   <tr key={obj.id}>
              //     {/* <td key={obj.id}>{obj.id}</td> */}
              //     <td>
              //       {obj.params3Array.map((item, idx) => {
              //         return (
              //           <img
              //             onClick={() => react3d.ADD_IMAGE(obj.id, device)}
              //             className={styles.imgList}
              //             src={item}
              //             alt={item}
              //             key={item + idx}
              //           ></img>
              //         );
              //       })}
              //     </td>
              //   </tr>
              // );
              return <PhotoVideoItemTr key={obj.id} obj={obj} short={true} />;
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
            <th>name</th>
            <th>pv</th>
          </tr>
        </thead>
        <tbody>
          {device.getPhotoVideo.map((obj) => {
            if (!obj.params3) {
              obj.params3 = "[]";
            }
            const params3_JSON = JSON.parse(obj.params3);
            obj.params3Array = params3_JSON.map((item, idx) => {
              return (
                process.env.REACT_APP_API_URL +
                `user${obj.user}/img${obj.id}/${item}`
              );
            });
            return <PhotoVideoItemTr key={obj.id} obj={obj} />;
          })}
        </tbody>
      </table>
    </>
  );
});

export default PhotoVideoList;
