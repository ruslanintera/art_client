import * as THREE from "three";
import { i3d_ao3 } from "./f8_ao3.js";
import { i3d_down_up } from "./f88_down.js";
import { i3d_events_func } from "./f8_events_func.js";
import { i3d_mats } from "./f2_mats.js";
import { app } from "./f9_appvue.js";
import { i3d_all } from "./f7_assist.js";
import { i3d_app_sets } from "./f3_apparat_sets.js";
import { vc3d_glob } from "./f5_vc3d_glob.js";

class i3d_Dop {
  addCubeNew(selected_obj, color) {
    //if(vc3d_glob.red_cube) { vc3d_glob.SCENE.remove(vc3d_glob.red_cube); }

    var geo_selected = new THREE.BoxBufferGeometry(16, 16, 16);

    var geometry_selected = geo_selected.clone();

    let x1 = selected_obj.position.x;
    let z1 = selected_obj.position.z;
    let y1 = selected_obj.position.y + 8;

    geometry_selected.translate(x1, y1, z1);
    vc3d_glob.red_cube = new THREE.Mesh(
      geo_selected,
      new THREE.MeshBasicMaterial({ visible: true, color: color })
    );
    //vc3d_glob.red_cube.rotation.x = -90 * Math.PI / 180;
    vc3d_glob.red_cube.position.x = x1;
    vc3d_glob.red_cube.position.y = y1;
    vc3d_glob.red_cube.position.z = z1;

    if (vc3d_glob.device.getActiveRackType.id) {
      vc3d_glob.red_cubes.push(vc3d_glob.red_cube);
    }

    vc3d_glob.red_cube.wtype = "rack"; //
    vc3d_glob.red_cube.MODEL3D = 1; //
    vc3d_glob.SCENE.add(vc3d_glob.red_cube);
  }

  mouse_DOWN676778(event) {
    vc3d_glob.raycaster.setFromCamera(vc3d_glob.mouse, vc3d_glob.CAMERA);

    var intersects = vc3d_glob.raycaster.intersectObjects(
      vc3d_glob.ray_objects,
      true
    ); // true - чтобы пересекать внешние объекты типа .obj
    var intersects_movedBy = vc3d_glob.raycaster.intersectObjects(
      vc3d_glob.ray_objects_movedBy,
      true
    ); // true - чтобы пересекать внешние объекты типа .obj

    vc3d_glob.MouseUp = false; // пока MouseUp == false есть возможность срабатывания событий для длительного нажатия отменяем

    vc3d_glob.isDown = true;

    if (intersects && intersects.length > 0) {
      var intersects_0 = intersects[0];
      vc3d_glob.curr_obj = intersects_0.object; // выбрали объект - элемент модели!

      // определим элемент в таблице элементов 3Д модели
      i3d_events_func.temp_mat_record_2021(
        vc3d_glob.curr_obj.model_unid,
        vc3d_glob.curr_obj.name
      );

      if (vc3d_glob.curr_obj.wtype === "gltf") {
        const active3dElement = {
          elementName: vc3d_glob.curr_obj.name,
          rackName: vc3d_glob.currentRT.name,
          dc: vc3d_glob.currentRT.Set.id,
          cx: Math.ceil(intersects_0.point.x * 1000) / 1000,
          cy: Math.ceil(intersects_0.point.y * 1000) / 1000,
          cz: Math.ceil(intersects_0.point.z * 1000) / 1000,
          model_unid: vc3d_glob.curr_obj.model_unid,
          model_name: vc3d_glob.curr_obj.model_name,
          el_name: vc3d_glob.curr_obj.el_name,
        };
        //console.log("CLICK active3dElement = ", { ...active3dElement });
        //console.log("getActive3dElement", vc3d_glob.device.getActive3dElement);

        vc3d_glob.device.setActive3dElement(active3dElement);
      }

      var bf = true; // найдем главного родителя объекта, но не сцену. Другими словами найдем комнату при щелчке на стену
      vc3d_glob.curr_obj_all = Object.create(vc3d_glob.curr_obj); // пока это текущий объект на который указали лучом. СТЕНА

      if (!vc3d_glob.curr_obj.square) {
        var inter_i = 0;
        do {
          if (
            vc3d_glob.curr_obj_all &&
            vc3d_glob.curr_obj_all.parent &&
            vc3d_glob.curr_obj_all.parent.type !== "Scene"
          ) {
            vc3d_glob.curr_obj_all = vc3d_glob.curr_obj_all.parent;

            if (!vc3d_glob.curr_obj_all.visible) {
              //c("DOWN Элемент не виден!!!  vc3d_glob.curr_obj_all.name = " + vc3d_glob.curr_obj_all.name + ", vc3d_glob.curr_obj_all.visible = " + vc3d_glob.curr_obj_all.visible);
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

        //console.log("CLICK vc3d_glob.curr_obj_all = ", vc3d_glob.curr_obj_all);
        //console.log("CLICK vc3d_glob.curr_obj = ", vc3d_glob.curr_obj);

        if (false && vc3d_glob.curr_obj_all.fix === 2) {
          //if (vc3d_glob.curr_obj_all.fix === 2) {
          //console.log("222 fix", vc3d_glob.curr_obj_all.fix);
          var intersects_1 = intersects[2];
          if (intersects_1) {
            //console.log("444 intersects_1", intersects_1);
            vc3d_glob.curr_obj_all.position.x = intersects_1.point.x;
            vc3d_glob.curr_obj_all.position.y = intersects_1.point.y;
            vc3d_glob.curr_obj_all.position.z = intersects_1.point.z;

            //console.log(
            //   "intersects_0:",
            //   intersects_0.point.x,
            //   intersects_0.point.y,
            //   intersects_0.point.z
            // );
            //console.log(
            //   "intersects_1:",
            //   intersects_1.point.x,
            //   intersects_1.point.y,
            //   intersects_1.point.z
            // );

            this.objNormal_2({ intersects_N: intersects_1 });
          }
        }
        /*****22222222******************************* */
        if (vc3d_glob.curr_obj_all.fix == 2) {
          //vc3d_glob.curr_obj_all_PICTURE = { ...vc3d_glob.curr_obj_all };
          // vc3d_glob.curr_obj_all_PICTURE = JSON.parse(
          //   JSON.stringify(vc3d_glob.curr_obj_all)
          // );
          vc3d_glob.curr_obj_all_PICTURE = Object.create(
            vc3d_glob.curr_obj_all
          ); // пока это текущий объект на который указали лучом. СТЕНА

          //console.log("curr_obj_all_PICTURE =", vc3d_glob.curr_obj_all_PICTURE);
        } else {
          var intersects_11 = intersects[0];
          if (intersects_11) {
            this.objNormal_2({ intersects_N: intersects_11 });
          }
        }
        /************************************ */
      } else {
        //c("square!")
      }

      //////////////////////////////////////////////////////////////////////////////////////////////////////////
      // временно или "постоянно" назначим материал выбранному объекту !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      if (vc3d_glob.delete_elem_selection_when_click_white_area) {
        i3d_events_func.temp_mat_curr_obj_2021(vc3d_glob.curr_obj);
      }
      //////////////////////////////////////////////////////////////////////////////////////////////////////////

      vc3d_glob.last_intersects_0 = null;

      i3d_ao3.move_model(); // во время щелчка по элементу посчитаем значения vc3d_glob.raznica_inter. x,y,z для расчета движения элемента
    } else {
      i3d_ao3.click_white_area();
      vc3d_glob.isDown_SKLAD_type = "";
      vc3d_glob.isDown_SKLAD_RUN = false;
    }
  }
  mouse_UP_obj(curr_obj) {
    //var time_UP = performance.now();
    vc3d_glob.count = 0; //

    app.model_unid_in_ge = curr_obj.model_unid_in_ge;

    //console.log("41 curr_obj =", curr_obj);

    if (vc3d_glob.apparatNEW) {
      app.v_messages_erase(); // удалим сообщения об элементах

      // if(YES) значит выбираем цель для итерации режима элемента
      if (i3d_ao3.check_if_we_in_editor_mode()) {
      } else {
        // все остальное ниже делаем если только НЕ находимся в режиме выбора целей - обычных или регуляторных таргетов

        for (var j = 0; j < app.all.elems.length; j++) {
          //
          // найдем элемент в списке app.all.elems, который соответствует выбранному элементу 3Д модели
          if (
            curr_obj.model_unid_in_ge == app.all.elems[j].model_unid_in_ge &&
            curr_obj.name == app.all.elems[j].name
          ) {
            // выясним какой из триггеров выбран пользователем

            app.editor.all_elems_activeIndex = j; // выделим цветом запись в списке ALL.ELEMS

            app.messages.elem_name1 = app.all.elems[j].name1; // выведем сообщение которое описывает этот элемент
            app.messages.elem_mess = app.all.elems[j].mess;
            app.mess_if = true;

            break;
          }
        }
      }
    }
    //time_UP = performance.now() - time_UP; //console.log('Время выполнения = mouse_UP_obj = ', time_UP);
  }
}
export let i3d_dop = new i3d_Dop(); // i3d_Events.
