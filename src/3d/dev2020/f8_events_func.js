import * as THREE from "three";
import { Vector3 } from "three";
//import { Vector3 } from '.  ./build/three.module.js';

import { i3d_ao3 } from "./f8_ao3.js";
import { i3d_down_up } from "./f88_down.js";
import { i3d_all } from "./f7_assist.js";
import { i3d_tween } from "./f6_tween.js";
import { i3d_mats } from "./f2_mats.js";
import { app } from "./f9_appvue.js";
import { i3d_windows, i3d_windows1, windArray } from "./f10_windows.js";
import { vc3d_glob } from "./f5_vc3d_glob.js";
import { common } from "../../common/common";

class i3d_Events_func {
  MouseMove8(event) {
    event.preventDefault();

    // vc3d_glob.mouse.x = (event.clientX / vc3d_glob.SCREEN_WIDTH) * 2 - 1;
    // vc3d_glob.mouse.y = -((event.clientY + 0) / vc3d_glob.SCREEN_HEIGHT) * 2 + 1;
    vc3d_glob.mouse.x =
      ((event.clientX - vc3d_glob.canvas_left) / vc3d_glob.SCREEN_WIDTH) * 2 -
      1;
    vc3d_glob.mouse.y =
      -((event.clientY - vc3d_glob.canvas_top) / vc3d_glob.SCREEN_HEIGHT) * 2 +
      1;

    vc3d_glob.raycaster.setFromCamera(vc3d_glob.mouse, vc3d_glob.CAMERA);
    if (!vc3d_glob.plane) {
      return;
    }
    var intersects = vc3d_glob.raycaster.intersectObject(vc3d_glob.plane);
    if (!intersects) {
      return;
    }

    /*********************************************************************** */

    //vc3d_glob.selected_to_move = 1
    if (vc3d_glob.selected_to_move && vc3d_glob.curr_obj_all) {
      if (intersects && intersects.length > 0) {
        vc3d_glob.CONTROLS.enabled = false; // отключает OrbitControl

        var intersects_0 = intersects[0];
        var point = intersects_0.point;

        if (vc3d_glob.turn_obj) {
          if (vc3d_glob.last_intersects_0) {
            var axis = new Vector3(0, 1, 0);
            var left =
              intersects_0.point.x - vc3d_glob.last_intersects_0.point.x;

            var ang_cos = i3d_events_func.find_angle_XZ(
              vc3d_glob.last_intersects_0.point,
              vc3d_glob.curr_obj_all.position,
              intersects_0.point
            );
            if (ang_cos.angle && ang_cos.cos) {
              if (ang_cos.KOSOE_multiply_v_2D < 0) {
                ang_cos.angle = -ang_cos.angle;
              } // ang_cos.angle всегда положительный, поэтому если косинус < 0 меняем знак
              vc3d_glob.curr_obj.rotateOnAxis(axis, ang_cos.angle);
              vc3d_glob.renderer.render(vc3d_glob.SCENE, vc3d_glob.CAMERA);
            }
          }
          vc3d_glob.last_intersects_0 = intersects_0;

          return;
        }

        switch (vc3d_glob.floor) {
          case "floor":
            vc3d_glob.curr_obj_all.position.x =
              intersects[0].point.x - vc3d_glob.raznica_inter.x;
            //vc3d_glob.curr_obj_all.position.y = intersects[0].point.y - vc3d_glob.raznica_inter.y;
            vc3d_glob.curr_obj_all.position.z =
              intersects[0].point.z - vc3d_glob.raznica_inter.z;
            break;
          case "wall":
            vc3d_glob.curr_obj_all.position.x =
              intersects[0].point.x - vc3d_glob.raznica_inter.x;
            vc3d_glob.curr_obj_all.position.y =
              intersects[0].point.y - vc3d_glob.raznica_inter.y;
            //vc3d_glob.curr_obj_all.position.z = intersects[0].point.z - vc3d_glob.raznica_inter.z;
            break;

          default: //case "floor":
            vc3d_glob.curr_obj_all.position.x =
              intersects[0].point.x - vc3d_glob.raznica_inter.x;
            //vc3d_glob.curr_obj_all.position.y = intersects[0].point.y - vc3d_glob.raznica_inter.y;
            vc3d_glob.curr_obj_all.position.z =
              intersects[0].point.z - vc3d_glob.raznica_inter.z;
            break;
        }

        if (vc3d_glob.curr_obj_all.light_sphere == true) {
          //если это light sphere тогда вместе с шариком лампы передвинем и сам источник света:
          vc3d_glob["light_" + vc3d_glob.curr_obj_all.light_num].position.set(
            vc3d_glob.curr_obj_all.position.x,
            vc3d_glob.curr_obj_all.position.y,
            vc3d_glob.curr_obj_all.position.z
          );
          if (vc3d_glob["light_helper" + vc3d_glob.curr_obj_all.light_num]) {
            vc3d_glob[
              "light_helper" + vc3d_glob.curr_obj_all.light_num
            ].update();
          }
        }

        vc3d_glob.renderer.render(vc3d_glob.SCENE, vc3d_glob.CAMERA);
      }
    }
  }

  getOffsetSum(elem) {
    var top = 0,
      left = 0;
    while (elem) {
      //console.log("elem ============", elem, ", elem.offsetTop = ", elem.offsetTop)
      top = top + parseFloat(elem.offsetTop);
      left = left + parseFloat(elem.offsetLeft);
      elem = elem.offsetParent;
    }

    return { top: Math.round(top), left: Math.round(left) };
  }

  MouseDown8(event) {
    event.preventDefault();

    vc3d_glob.mouse.x =
      ((event.clientX - vc3d_glob.canvas_left) / vc3d_glob.SCREEN_WIDTH) * 2 -
      1;
    vc3d_glob.mouse.y =
      -((event.clientY - vc3d_glob.canvas_top) / vc3d_glob.SCREEN_HEIGHT) * 2 +
      1;

    switch (vc3d_glob.touch_type) {
      case 2:
        i3d_events_func.mouse_DOWN(event);
        break;
    }
  }

  find_obj(node, model_unid, name, callbackfunc) {
    //temp_set_mat = true когда временно назначаем синий цвет выделения объекту

    if (node.model_unid == model_unid && node.name == name) {
      //

      vc3d_glob.curr_obj = node;
      callbackfunc(node); // в коллбэк функции что-то делаем с эементом, обычно перекрашиваем его
      return node;
    }
    if (
      (node.type == "Scene" ||
        node.type == "Group" ||
        node.type == "Mesh" ||
        node.type == "Object3D") &&
      node.children
    ) {
      for (var i = 0; i < node.children.length; i++) {
        this.find_obj(node.children[i], model_unid, name, callbackfunc);
      }
    }
  }

  // тут мы  назначаем материал (временный или постоянный) выбранному объекту
  // i3d_events_func.temp_mat_curr_obj_2021(vc3d_glob.curr_obj)
  temp_mat_curr_obj_2021(vc3d_glob_curr_obj, mat) {
    if (!vc3d_glob_curr_obj) {
      //console.log("temp_mat_curr_obj_2021 : NO OBJECT ")
      return;
    }
    if (vc3d_glob.set_temp_mat) {
      i3d_mats.set_timeout_material(11);
      //vc3d_glob.mat_current = vc3d_glob.curr_obj.material;
    } else {
      // или постоянно назначим материал выбранному объекту
      if (vc3d_glob.current2021) {
        vc3d_glob.current2021.obj.material = vc3d_glob.current2021.mat;
      }

      vc3d_glob.current2021 = {
        obj: vc3d_glob_curr_obj,
        mat: vc3d_glob_curr_obj.material,
      }; // текущий выбранный объект! чтобы потом вернуть его исходный материал

      vc3d_glob_curr_obj.material = mat || vc3d_glob.temp_material;

      //const rrr1 = .21; vc3d_glob_curr_obj.scale.set(rrr1, rrr1, rrr1);

      //console.log("MMMMMMMMMMMMM ", vc3d_glob_curr_obj.material, "vc3d_glob_curr_obj = ", vc3d_glob_curr_obj)

      if (!vc3d_glob.animate) {
        i3d_all.animate2();
      }
    }
  }

  temp_mat_record_2021(model_unid, name) {
    // определим элемент в таблице элементов 3Д модели
    //console.log("t emp_mat_record_2021    vc3d_glob.curr_obj = ", vc3d_glob.curr_obj, "vc3d_glob.curr_obj,name = ", vc3d_glob.curr_obj.name)
    let selectedNum = 0;
    vc3d_glob.device.getModelRack3d.map((obj) => {
      //console.log("vc3d_glob.curr_obj = ", vc3d_glob.curr_obj, "vc3d_glob.curr_obj,name = ", vc3d_glob.curr_obj.name)

      //if(obj.model_unid === model_unid && obj.name === name) { selectedNum = obj.id; obj.active = 1;
      if (obj.model_unid === model_unid && obj.name === name) {
        selectedNum = obj.id;
        obj.active = 1;
      } else {
        obj.active = 0;
      }
    });
    // определим номер страницы в таблице элементов 3Д модели
    const pageCount = Math.ceil(
      selectedNum / vc3d_glob.device.getModelRack3dLimit
    );
    vc3d_glob.device.setModelRack3dPage(pageCount);
  }
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
    //vc3d_glob.red_cube.move_type = 1; //нужно ли двигать объект?
    //vc3d_glob.red_cube.RACK = 1; //
    //vc3d_glob.ray_objects.push(vc3d_glob.red_cube);  // тут те модели, которые можно выбирать r aycaster-ом

    if (vc3d_glob.device.getActiveRackType.id) {
      vc3d_glob.red_cubes.push(vc3d_glob.red_cube);
    }

    vc3d_glob.red_cube.wtype = "rack"; //
    vc3d_glob.red_cube.MODEL3D = 1; //
    vc3d_glob.SCENE.add(vc3d_glob.red_cube);
  }

  mouse_DOWN(event) {
    vc3d_glob.raycaster.setFromCamera(vc3d_glob.mouse, vc3d_glob.CAMERA);
    var intersects = vc3d_glob.raycaster.intersectObjects(
      vc3d_glob.ray_objects,
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

      console.log("CLICK vc3d_glob.curr_obj = ", vc3d_glob.curr_obj);
      console.log(
        "CLICK intersects_0 = ",
        Math.ceil(intersects_0.point.x * 100) / 100,
        Math.ceil(intersects_0.point.y * 100) / 100,
        Math.ceil(intersects_0.point.z * 100) / 100
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
        console.log("CLICK active3dElement = ", { ...active3dElement });
        console.log("34 CLICK getActive3dElement = ", {
          ...vc3d_glob.device.getActive3dElement,
        });

        vc3d_glob.device.setActive3dElement(active3dElement);
      }

      var bf = true; // найдем главного родителя объекта, но не сцену. Другими словами найдем комнату при щелчке на стену
      vc3d_glob.curr_obj_all = Object.create(vc3d_glob.curr_obj); // пока это текущий объект на который указали лучом. СТЕНА

      if (!vc3d_glob.curr_obj.square) {
        //if(true) {
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
      } else {
        //c("square!")
      }

      //////////////////////////////////////////////////////////////////////////////////////////////////////////
      // временно или "постоянно" назначим материал выбранному объекту !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      i3d_events_func.temp_mat_curr_obj_2021(vc3d_glob.curr_obj);
      //////////////////////////////////////////////////////////////////////////////////////////////////////////

      vc3d_glob.last_intersects_0 = null;

      i3d_ao3.move_model(); // во время щелчка по элементу посчитаем значения vc3d_glob.raznica_inter. x,y,z для расчета движения элемента
    } else {
      i3d_ao3.click_white_area();
      vc3d_glob.isDown_SKLAD_type = "";
      vc3d_glob.isDown_SKLAD_RUN = false;
    }
  }

  mouse_DOWN_Audio_Anim_Tween() {
    /*==== ЭТО НУЖНО ЧТОБЫ ПРЕРЫВАТЬ АУДИО ПРИВЯЗАННОЕ К ПРЕДЫДУЩЕЙ КНОПКЕ КОГДА НАЖАТА НОВАЯ КНОПКА: vc3d_glob.audio.stop(); ====*/
    vc3d_glob.new_true_old_false = true;
    if (
      app.curr_obj_data &&
      app.curr_obj_data.ge_i === vc3d_glob.curr_obj.ge_i &&
      app.curr_obj_data.child_number === vc3d_glob.curr_obj.child_number &&
      app.curr_obj_data.name === vc3d_glob.curr_obj.name &&
      app.curr_obj_data.model_unid_in_ge === vc3d_glob.curr_obj.model_unid_in_ge
    ) {
      vc3d_glob.new_true_old_false = false; // значит это "старый объект" то есть на него мы уже щелкнули в предыдущий раз
    }

    i3d_mats.get_mats_and_clicks(vc3d_glob.curr_obj); // вытащим и библиотеки и материалы для выбраного элемента

    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //if (vc3d_glob.tween) { i3d_tween.TWEEN_begin(); } // TWEEN     !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // ANIMATIONS !!! если модель gltf анимирована, то при клике по ней запускаем анимацию mixer mix
    // if(vc3d_glob.curr_obj_all.actions && vc3d_glob.curr_obj_all.actions.length && vc3d_glob.curr_obj_all.action_num != undefined ){
    //     vc3d_glob.curr_obj_all.actions[vc3d_glob.curr_obj_all.action_num].stop(); vc3d_glob.curr_obj_all.action_num++;
    //     if(vc3d_glob.curr_obj_all.action_num >= vc3d_glob.curr_obj_all.actions.length) {
    //         vc3d_glob.curr_obj_all.action_num = 0;
    //     }
    //     vc3d_glob.curr_obj_all.actions[vc3d_glob.curr_obj_all.action_num].play();
    // }
  }

  MouseUp8(event) {
    event.preventDefault();
    vc3d_glob.MouseUp = true; // MouseUp сработало значит события для длительного нажатия отменяем

    if (vc3d_glob.touch_type == 2) {
      if (vc3d_glob.onlongtouch_time <= vc3d_glob.onlongtouch_times) {
        // vc3d_glob.onlongtouch_time < 5, значит это короткое нажатие на кнопку и тогда не надо запускать mouse_UP (event)
        i3d_down_up.mouse_UP(event, 1); //click_type     // 1 - значит игнорируем все итерации у которых click_type == 1
      } else {
        // значит это длительное нажатие на кнопку и тогда надо запускать
        // 0 - значит игнорируем все итерации у которых click_type == 0
        //trigger_when_m____ouse_UP(vc3d_glob.trigger, 0); //click_type = 0, значит 0 пропускаем! 1 - это длительное нажатие, click_type = 0 - обычное нажатие
        //!!!mo____use_UP(event, 0); //click_type
      }
    }

    // опять обнулим vc3d_glob.onlongtouch_time
    vc3d_glob.onlongtouch_time = 0; //c("vc3d_glob.onlongtouch_time = " + vc3d_glob.onlongtouch_time); // счетчик количества срабатываний onlongtouch

    if (vc3d_glob.CONTROLS) {
      vc3d_glob.CONTROLS.enabled = true;
    }
    vc3d_glob.selected_to_move = false;

    vc3d_glob.isDown = false;
    vc3d_glob.trigger = null;
  }

  TouchMove(event) {
    event.preventDefault();
    event = event.changedTouches[0];

    var rect = vc3d_glob.renderer.domElement.getBoundingClientRect();

    vc3d_glob.mouse.x = (event.clientX / vc3d_glob.SCREEN_WIDTH) * 2 - 1;
    vc3d_glob.mouse.y =
      -((event.clientY + 0) / vc3d_glob.SCREEN_HEIGHT) * 2 + 1;

    var mouse_touch = {};
    mouse_touch.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse_touch.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    vc3d_glob.raycaster.setFromCamera(vc3d_glob.mouse, vc3d_glob.CAMERA);
    var intersects = vc3d_glob.raycaster.intersectObject(vc3d_glob.plane);

    if (vc3d_glob.selected_to_move && vc3d_glob.curr_obj_all) {
      if (intersects && intersects.length > 0) {
        vc3d_glob.CONTROLS.enabled = false; // отключает OrbitControl

        vc3d_glob.curr_obj_all.position.x =
          intersects[0].point.x - vc3d_glob.raznica_inter.x;
        vc3d_glob.curr_obj_all.position.y =
          intersects[0].point.y - vc3d_glob.raznica_inter.y; // y изменяется когда двигаемся по СТЕНЕ
        vc3d_glob.curr_obj_all.position.z =
          intersects[0].point.z - vc3d_glob.raznica_inter.z; // z изменяется когда двигаемся по полу

        if (vc3d_glob.curr_obj_all.light_sphere == true) {
          //если это light sphere тогда вместе с шариком лампы передвинем и сам источник света:
          vc3d_glob["light_" + vc3d_glob.curr_obj_all.light_num].position.set(
            vc3d_glob.curr_obj_all.position.x,
            vc3d_glob.curr_obj_all.position.y,
            vc3d_glob.curr_obj_all.position.z
          );
          if (vc3d_glob["light_helper" + vc3d_glob.curr_obj_all.light_num]) {
            vc3d_glob[
              "light_helper" + vc3d_glob.curr_obj_all.light_num
            ].update();
          }
        }

        vc3d_glob.renderer.render(vc3d_glob.SCENE, vc3d_glob.CAMERA);
      }
    }
  }
  TouchStart(event) {
    event.preventDefault();
    event = event.changedTouches[0];

    vc3d_glob.mouse.x = (event.clientX / vc3d_glob.SCREEN_WIDTH) * 2 - 1;
    vc3d_glob.mouse.y =
      -((event.clientY + 0) / vc3d_glob.SCREEN_HEIGHT) * 2 + 1;
    i3d_events_func.mouse_DOWN(event);
  }

  update_keydown(event) {
    if (!vc3d_glob.MovingCube) {
      return;
    }

    var delta = vc3d_glob.clock.getDelta(); // seconds.
    var moveDistance = 200 * delta; // 200 pixels per second
    var rotateAngle = ((Math.PI / 2) * delta) / 5; // pi/2 radians (90 degrees) per second

    // move forwards/backwards/left/right
    if (event.code == "KeyW") {
      vc3d_glob.MovingCube.translateZ(-moveDistance);
    }

    if (event.code == "KeyS") vc3d_glob.MovingCube.translateZ(moveDistance);
    if (event.code == "KeyQ") vc3d_glob.MovingCube.translateX(-moveDistance);
    if (event.code == "KeyE") vc3d_glob.MovingCube.translateX(moveDistance);

    // rotate left/right/up/down
    var rotation_matrix = new THREE.Matrix4().identity();
    if (event.code == "KeyA")
      vc3d_glob.MovingCube.rotateOnAxis(
        new THREE.Vector3(0, 1, 0),
        rotateAngle
      );
    if (event.code == "KeyD")
      vc3d_glob.MovingCube.rotateOnAxis(
        new THREE.Vector3(0, 1, 0),
        -rotateAngle
      );
    if (event.code == "KeyR")
      vc3d_glob.MovingCube.rotateOnAxis(
        new THREE.Vector3(1, 0, 0),
        rotateAngle
      );
    if (event.code == "KeyF")
      vc3d_glob.MovingCube.rotateOnAxis(
        new THREE.Vector3(1, 0, 0),
        -rotateAngle
      );

    if (event.code == "KeyZ") {
      vc3d_glob.MovingCube.position.set(0, 25.1, 0);
      vc3d_glob.MovingCube.rotation.set(0, 0, 0);
    }

    if (event.code == "KeyU") {
      vc3d_glob.animate = false;
    }
    //if ( event.code == "KeyJ") { vc3d_glob.animate = true; i3d_all.animate(); }

    if (!vc3d_glob.animate) {
      i3d_all.animate2();
    }
  }
}

export let i3d_events_func = new i3d_Events_func(); // i3d_Events.
