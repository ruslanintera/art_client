import * as THREE from "three";

import { i3d_ao3 } from "./f8_ao3.js";
import { i3d_mats } from "./f2_mats.js";
import { app } from "./f9_appvue.js";
import { i3d_all } from "./f7_assist.js";

import { i3d_app_sets } from "./f3_apparat_sets.js";
import { vc3d_glob } from "./f5_vc3d_glob.js";
import { i3d_base } from "./f4_base.js";
import { i3d_windows, i3d_windows1, windArray } from "./f10_windows.js";

class i3d_Down_up {
  //!!! ЭТО ДЛЯ ОКОН - СПЕЦИАЛЬНЫХ ЭКРАНОВ ДЛЯ ИМИТАЦИИ ПАНЕЛЕЙ ПРИБОРОВ
  onlongtouch_reg_iter_WIND() {
    //i3d_all.c("1 o nlongtouch_reg_iter_WIND");
    if (vc3d_glob.isDown && vc3d_glob.curr_obj) {
      // не удалять это для вращения
      //if (!vc3d_glob.rot_counter) { vc3d_glob.rot_counter = 0; } vc3d_glob.rot_counter += trigger.sign; //c("vc3d_glob.rot_counter = " + vc3d_glob.rot_counter);

      if (vc3d_glob.i3d_windows) {
        //console.log("000000000000000000000000000000000000000000000000000000 1")
        windArray.forEach((element) => {
          if (element.area1.model_unid == vc3d_glob.curr_obj.model_unid) {
            if (vc3d_glob.curr_obj.f == "turnCurrentRightInArea") {
              element.turnCurrentRightInArea(1);
            } else if (vc3d_glob.curr_obj.f == "turnCurrentLeftInArea") {
              element.turnCurrentLeftInArea(1);
              //c("turnCurrentLeftInArea");
            }
          } else if (
            element.area2.model_unid == vc3d_glob.curr_obj.model_unid
          ) {
            if (vc3d_glob.curr_obj.f == "turnCurrentRightInArea") {
              element.turnCurrentRightInArea(1);
            } else if (vc3d_glob.curr_obj.f == "turnCurrentLeftInArea") {
              element.turnCurrentLeftInArea(1);
            }
          }
        });
      }

      if (!vc3d_glob.animate) {
        i3d_all.animate2();
      }

      setTimeout(
        i3d_down_up.onlongtouch_reg_iter_WIND,
        vc3d_glob.touchduration_reg_iter
      );
    } else {
      if (vc3d_glob.timer) {
        //clearTimeout(vc3d_glob.timer);
        if (vc3d_glob.test_works) {
        }
      }
    }
  }

  // UP =============================
  mouse_UP(event, click_type) {
    vc3d_glob.raycaster.setFromCamera(vc3d_glob.mouse, vc3d_glob.CAMERA);
    var intersects = vc3d_glob.raycaster.intersectObjects(
      vc3d_glob.ray_objects,
      true
    ); // true - чтобы пересекать внешние объекты типа .obj

    if (intersects && intersects.length > 0) {
      var intersects_0 = intersects[0];
      vc3d_glob.curr_obj = intersects_0.object; // выбрали объект - элемент модели!

      vc3d_glob.isDown_SKLAD_type = "";
      vc3d_glob.isDown_SKLAD_RUN = false;

      var bf = true; // найдем главного родителя объекта, но не сцену. Другими словами найдем комнату при щелчке на стену
      vc3d_glob.curr_obj_all = Object.create(vc3d_glob.curr_obj); // пока это текущий объект на который указали лучом. СТЕНА

      var inter_i = 0;
      do {
        if (
          vc3d_glob.curr_obj_all &&
          vc3d_glob.curr_obj_all.parent &&
          vc3d_glob.curr_obj_all.parent.type !== "Scene"
        ) {
          vc3d_glob.curr_obj_all = vc3d_glob.curr_obj_all.parent;

          if (!vc3d_glob.curr_obj_all.visible) {
            //c("UP Элемент не виден!!!  vc3d_glob.curr_obj_all.name = " + vc3d_glob.curr_obj_all.name + ", vc3d_glob.curr_obj_all.visible = " + vc3d_glob.curr_obj_all.visible);
            inter_i++;
            if (intersects[inter_i] && intersects[inter_i].object) {
              vc3d_glob.curr_obj = intersects[inter_i].object;
              vc3d_glob.curr_obj_all = Object.create(vc3d_glob.curr_obj);
            }
          }
        } else {
          bf = false;
          break;
        }
      } while (bf);

      //i3d_down_up.mouse_UP_obj(vc3d_glob.curr_obj);
    } else {
      vc3d_glob.isDown_SKLAD = false;
      vc3d_glob.isDown_SKLAD_left = false;
      vc3d_glob.isDown_SKLAD_right = false;
      vc3d_glob.isDown_SKLAD_RUN = false;
    }
  }
}

export let i3d_down_up = new i3d_Down_up(); // i3d_down_up.

// f88_down.js
