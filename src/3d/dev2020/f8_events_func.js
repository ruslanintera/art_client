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
    //console.log("1");

    vc3d_glob.raycaster.setFromCamera(vc3d_glob.mouse, vc3d_glob.CAMERA);
    if (!vc3d_glob.plane) {
      return;
    }
    //console.log("2");

    var intersects = vc3d_glob.raycaster.intersectObject(vc3d_glob.plane);
    if (!intersects) {
      return;
    }
    //console.log("3");

    //vc3d_glob.raycaster.setFromCamera(vc3d_glob.mouse, vc3d_glob.CAMERA);
    var intersectsOBJ = vc3d_glob.raycaster.intersectObjects(
      vc3d_glob.ray_objects,
      true
    ); // true - чтобы пересекать внешние объекты типа .obj
    var intersects_11 = intersectsOBJ[0];
    //console.log("intersects_11?.object?.fix", intersects_11?.object?.fix);
    //this.objNormal_3({ intersects });
    this.objNormal_4({ intersects: intersectsOBJ });

    // if (vc3d_glob.curr_obj_all?.fix == 0 && vc3d_glob.curr_obj_all_PICTURE) {
    //   //console.log("3334444");
    //   var intersects_11 = intersectsOBJ[0];
    //   //console.log("9090 intersects_11 = ", intersects_11);
    //   if (intersects_11) {
    //     //console.log("9091 intersects_11 = ", intersects_11);
    //     this.objNormal_2({ intersects_N: intersects_11 });
    //   }
    //   return;
    // }

    //var intersects_11 = intersectsOBJ[0];
    var intersects_11 = intersects[0];
    //console.log("9090 intersects_11 = ", intersects_11);
    if (intersects_11?.object?.fix === 1) {
      //console.log("99091 intersects_11 = ", intersects_11?.object?.fix);
      //this.objNormal_3({ intersects_N: intersects_11 });
      //this.objNormal_3({ intersects });
    }

    //if (vc3d_glob.selected_to_move && vc3d_glob.curr_obj_all) {
    if (
      vc3d_glob.selected_to_move &&
      vc3d_glob.curr_obj_all &&
      (vc3d_glob.curr_obj_all.fix == 0 || vc3d_glob.curr_obj_all.fix == 2)
    ) {
      //if (vc3d_glob.curr_obj_all && vc3d_glob.curr_obj_all) {
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

        // if (vc3d_glob.curr_obj_all?.fix == 0) {
        //   var intersects_11 = intersectsOBJ[0];
        //   if (intersects_11) {
        //     this.objNormal_2({ intersects_N: intersects_11 });
        //   }
        // }

        //if (true || vc3d_glob.curr_obj_all.fix == 2) {
        //if (false && vc3d_glob.curr_obj_all.fix == 2) {
        if (vc3d_glob.curr_obj_all?.fix == 2) {
          //console.log("4 fff", vc3d_glob.curr_obj_all.fix);
          // vc3d_glob.curr_obj_all.position.x =
          // intersects[0].point.x - vc3d_glob.raznica_inter.x;
          // //vc3d_glob.curr_obj_all.position.y = intersects[0].point.y - vc3d_glob.raznica_inter.y;
          // vc3d_glob.curr_obj_all.position.z =
          // intersects[0].point.z - vc3d_glob.raznica_inter.z;

          //console.log("4 intersectsOBJ", intersectsOBJ);

          const interObjFix = intersectsOBJ.filter((item) => {
            //console.log("item.object?.fix", item.object?.fix);
            return item.object?.fix === 1;
          });
          //console.log("4 interObjFix", interObjFix);

          //var intersects_1 = intersectsOBJ[2];
          var intersects_1 = interObjFix[0];
          if (intersects_1) {
            //console.log("4 interObjFix", interObjFix);
            //console.log("444 intersects_1", intersects_1);
            // vc3d_glob.curr_obj_all.position.x = intersects_1.point.x;
            // vc3d_glob.curr_obj_all.position.y = intersects_1.point.y;
            // vc3d_glob.curr_obj_all.position.z = intersects_1.point.z;

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

            //this.objNormal({ intersects });
            this.objNormal_2({
              intersects_N: intersects_1,
              curr_obj_all: vc3d_glob.curr_obj_all,
            });
          }
        } else {
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
      default:
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

  getObjALL_111(intersects) {
    vc3d_glob.curr_obj_all = Object.create(vc3d_glob.curr_obj); // пока это текущий объект на который указали лучом. СТЕНА

    var bf = true; // найдем главного родителя объекта, но не сцену. Другими словами найдем комнату при щелчке на стену
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
  }
  getObjParent(intersects) {
    let curr_obj_all = Object.create(vc3d_glob.curr_obj); // пока это текущий объект на который указали лучом. СТЕНА

    var bf = true; // найдем главного родителя объекта, но не сцену. Другими словами найдем комнату при щелчке на стену
    var inter_i = 0;
    do {
      if (
        curr_obj_all &&
        curr_obj_all.parent &&
        curr_obj_all.parent.type !== "Scene"
      ) {
        curr_obj_all = curr_obj_all.parent;

        if (!curr_obj_all.visible) {
          //c("DOWN Элемент не виден!!!  curr_obj_all.name = " + curr_obj_all.name + ", curr_obj_all.visible = " + curr_obj_all.visible);
          inter_i++;
          if (intersects[inter_i] && intersects[inter_i].object) {
            vc3d_glob.curr_obj = intersects[inter_i].object;
            curr_obj_all = Object.create(vc3d_glob.curr_obj);
          }
        }
      } else {
        bf = false;
        break;
      }
    } while (bf);

    return curr_obj_all;
  }

  mouse_DOWN(event) {
    vc3d_glob.raycaster.setFromCamera(vc3d_glob.mouse, vc3d_glob.CAMERA);

    var intersects = vc3d_glob.raycaster.intersectObjects(
      vc3d_glob.ray_objects,
      true
    ); // true - чтобы пересекать внешние объекты типа .obj

    // var intersects_movedBy = vc3d_glob.raycaster.intersectObjects(
    //   vc3d_glob.ray_objects_movedBy,
    //   true
    // ); // true - чтобы пересекать внешние объекты типа .obj
    // vc3d_glob.curr_obj_all_PICTURE = this.getObjParent(intersects_movedBy);

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

      //vc3d_glob.curr_obj_all = Object.create(vc3d_glob.curr_obj); // пока это текущий объект на который указали лучом. СТЕНА

      if (!vc3d_glob.curr_obj.square) {
        vc3d_glob.curr_obj_all = this.getObjParent(intersects);

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

            //this.objNormal({ intersects });
            this.objNormal_2({ intersects_N: intersects_1 });
          }
        }
        /*****22222222******************************* */
        if (vc3d_glob.curr_obj_all.fix == 2) {
          //console.log("rot", vc3d_glob.curr_obj_all.rotation);
          if (vc3d_glob.curr_obj_all_PICTURE) {
            vc3d_glob.curr_obj_all_PICTURE = null;
          } else {
            vc3d_glob.curr_obj_all_PICTURE = Object.create(
              vc3d_glob.curr_obj_all
            ); // пока это текущий объект на который указали лучом. СТЕНА
            //console.log(1);
            if (
              vc3d_glob.curr_obj?.material &&
              vc3d_glob.curr_obj.materialParams?.video
            ) {
              /** */
              const video = document.getElementById("video");
              if (vc3d_glob.curr_obj.video === "play") {
                video.pause();
                vc3d_glob.curr_obj.video = "paused";
              } else {
                //video.src = "http://localhost:5001/user1/video1/sintel.mp4";
                video.src = vc3d_glob.curr_obj.materialParams?.video;
                //console.log(video);
                // console.log(
                //   "vc3d_glob.curr_obj.materialParams?.video",
                //   vc3d_glob.curr_obj.materialParams?.video
                // );
                //console.log("vc3d_glob.curr_obj_all", vc3d_glob.curr_obj_all);
                //console.log("vc3d_glob.curr_obj", vc3d_glob.curr_obj);
                video.play();
                const texture = new THREE.VideoTexture(video);
                texture.needsUpdate = true;
                texture.onUpdate = (item) => {
                  if (!vc3d_glob.animate) {
                    //i3d_all.animate4();
                    i3d_all.animate1();
                    //vc3d_glob.renderer.render(vc3d_glob.SCENE, vc3d_glob.CAMERA);
                  }
                  //console.log("item 88899", item);
                  //console.log("render");
                };
                //console.log("texture", texture);
                const material1 = new THREE.MeshBasicMaterial({ map: texture });
                //console.log("material1", material1);
                //vc3d_glob.curr_obj_all_PICTURE.material = material1;
                vc3d_glob.curr_obj.material = material1;
                vc3d_glob.curr_obj.video = "play";
              }
              /** * /
              if (vc3d_glob.curr_obj.video) {
              } else {
                const video = document.createElement("video");
                video.src = vc3d_glob.curr_obj.materialParams?.video;
                //video.poster ='https://peach.blender.org/wp-content/uploads/title_anouncement.jpg?x11217';

                //video.autoplay = false;
                video.controls = true;
                video.muted = false;
                //video.height = 240; // 👈️ in px
                //video.width = 320; // 👈️ in px

                const box = document.getElementById("video_box");

                box.appendChild(video);

                video.play();
                const texture = new THREE.VideoTexture(video);
                texture.needsUpdate = true;
                texture.onUpdate = (item) => {
                  if (!vc3d_glob.animate) {
                    //i3d_all.animate4();
                    i3d_all.animate1();
                    //vc3d_glob.renderer.render(vc3d_glob.SCENE, vc3d_glob.CAMERA);
                  }
                  //console.log("item 88899", item);
                  console.log("render");
                };
                //console.log("texture", texture);
                const material1 = new THREE.MeshBasicMaterial({ map: texture });
                console.log("@#$ material1", material1);
                //vc3d_glob.curr_obj_all_PICTURE.material = material1;
                vc3d_glob.curr_obj.material = material1;
              }
                /**/
            }
          }

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

  objNormal({ intersects }) {
    if (vc3d_glob.curr_obj) {
      if (intersects && intersects.length > 0) {
        //var intersects_0 = intersects[0];
        var point = intersects[0].point;

        //console.log("point = ", point);

        //22222222222222222222222222222222222222222222222222222222222222
        const p = intersects[0].point;
        vc3d_glob.mouseHelper.position.copy(p);
        vc3d_glob.intersection.point.copy(p);

        const n = intersects[0].face.normal.clone();
        n.transformDirection(vc3d_glob.curr_obj.matrixWorld);
        n.multiplyScalar(10);
        n.add(intersects[0].point);

        const okr = 1;
        //console.log(
        //   "n:  x",
        //   Math.ceil(n.x * okr) / okr,
        //   ",y",
        //   Math.ceil(n.y * okr) / okr,
        //   ",z",
        //   Math.ceil(n.z * okr) / okr
        // );
        //console.log(
        //   "point:  x",
        //   Math.ceil(point.x * okr) / okr,
        //   ",y",
        //   Math.ceil(point.y * okr) / okr,
        //   ",z",
        //   Math.ceil(point.z * okr) / okr
        // );

        vc3d_glob.intersection.normal.copy(intersects[0].face.normal);
        vc3d_glob.mouseHelper.lookAt(n);

        const positions = vc3d_glob.line.geometry.attributes.position;
        positions.setXYZ(0, p.x, p.y, p.z);
        positions.setXYZ(1, n.x, n.y, n.z);
        positions.needsUpdate = true;

        vc3d_glob.intersection.intersects = true;
        /** */

        if (!vc3d_glob.animate) {
          i3d_all.animate2();
        }
      }
    }
  }
  objNormal_2_ERR({ intersects_N, curr_obj_all }) {
    //console.log("445 intersects_N", intersects_N);
    if (vc3d_glob.curr_obj) {
      if (intersects_N) {
        //var intersects_0 = intersects_N;
        var point = intersects_N.point;

        //console.log("point = ", point);
        //console.log("CLICK vc3d_glob.curr_obj_all = ", vc3d_glob.curr_obj_all);

        //22222222222222222222222222222222222222222222222222222222222222
        const p = intersects_N.point;
        vc3d_glob.mouseHelper.position.copy(p);
        vc3d_glob.intersection.point.copy(p);
        //curr_obj_all.position.copy(p);
        if (vc3d_glob.curr_obj_all_PICTURE) {
          //console.log("PICTURE =", vc3d_glob.curr_obj_all_PICTURE);
          vc3d_glob.curr_obj_all_PICTURE.position.copy(p);
        }

        const n = intersects_N.face.normal.clone();
        n.transformDirection(vc3d_glob.curr_obj.matrixWorld);
        n.multiplyScalar(10);
        n.add(intersects_N.point);

        const okr = 1;
        //console.log(
        //   "n:  x",
        //   Math.ceil(n.x * okr) / okr,
        //   ",y",
        //   Math.ceil(n.y * okr) / okr,
        //   ",z",
        //   Math.ceil(n.z * okr) / okr
        // );
        //console.log(
        //   "point:  x",
        //   Math.ceil(point.x * okr) / okr,
        //   ",y",
        //   Math.ceil(point.y * okr) / okr,
        //   ",z",
        //   Math.ceil(point.z * okr) / okr
        // );

        vc3d_glob.intersection.normal.copy(intersects_N.face.normal);
        vc3d_glob.mouseHelper.lookAt(n);
        //curr_obj_all.lookAt(n);
        if (vc3d_glob.curr_obj_all_PICTURE) {
          vc3d_glob.curr_obj_all_PICTURE.lookAt(n);
        }

        const positions = vc3d_glob.line.geometry.attributes.position;
        positions.setXYZ(0, p.x, p.y, p.z);
        positions.setXYZ(1, n.x, n.y, n.z);
        positions.needsUpdate = true;

        vc3d_glob.intersection.intersects = true;
        /** */

        if (!vc3d_glob.animate) {
          i3d_all.animate2();
        }
      }
    }
  }
  objNormal_2({ intersects_N, curr_obj_all }) {
    //console.log("4=45 intersects_N", intersects_N);
    if (vc3d_glob.curr_obj) {
      if (intersects_N) {
        //var intersects_0 = intersects_N;
        var point = intersects_N.point;

        //console.log("point = ", point);
        //console.log("CLICK vc3d_glob.curr_obj_all = ", vc3d_glob.curr_obj_all);

        //22222222222222222222222222222222222222222222222222222222222222
        const p = intersects_N.point;
        vc3d_glob.mouseHelper.position.copy(p);
        vc3d_glob.intersection.point.copy(p);
        //curr_obj_all.position.copy(p);
        if (vc3d_glob.curr_obj_all_PICTURE) {
          //console.log("PICTURE =", vc3d_glob.curr_obj_all_PICTURE);
          vc3d_glob.curr_obj_all_PICTURE.position.copy(p);
        }

        const n = intersects_N.face.normal.clone();
        n.transformDirection(vc3d_glob.curr_obj.matrixWorld);
        n.multiplyScalar(10);
        n.add(intersects_N.point);

        const okr = 1;
        //console.log(
        //   "n:  x",
        //   Math.ceil(n.x * okr) / okr,
        //   ",y",
        //   Math.ceil(n.y * okr) / okr,
        //   ",z",
        //   Math.ceil(n.z * okr) / okr
        // );
        //console.log(
        //   "point:  x",
        //   Math.ceil(point.x * okr) / okr,
        //   ",y",
        //   Math.ceil(point.y * okr) / okr,
        //   ",z",
        //   Math.ceil(point.z * okr) / okr
        // );

        vc3d_glob.intersection.normal.copy(intersects_N.face.normal);
        vc3d_glob.mouseHelper.lookAt(n);
        //curr_obj_all.lookAt(n);
        if (vc3d_glob.curr_obj_all_PICTURE) {
          vc3d_glob.curr_obj_all_PICTURE.lookAt(n);
        }

        const positions = vc3d_glob.line.geometry.attributes.position;
        positions.setXYZ(0, p.x, p.y, p.z);
        positions.setXYZ(1, n.x, n.y, n.z);
        positions.needsUpdate = true;

        vc3d_glob.intersection.intersects = true;
        /** */

        if (!vc3d_glob.animate) {
          i3d_all.animate2();
        }
      }
    }
  }
  //objNormal_3({ intersects_N, curr_obj_all }) {

  getParent(curr_obj) {
    let curr_obj_all = Object.create(curr_obj); // пока это текущий объект на который указали лучом. СТЕНА
    var bf = true; // найдем главного родителя объекта, но не сцену. Другими словами найдем комнату при щелчке на стену
    do {
      if (curr_obj_all?.parent?.type !== "Scene") {
        curr_obj_all = curr_obj_all.parent;
      } else {
        bf = false;
        break;
      }
    } while (bf);
    return curr_obj_all;
  }

  objNormal_3({ intersects }) {
    if (intersects && intersects.length > 0) {
      var intersects_N = intersects[0];

      if (intersects_N) {
        vc3d_glob.curr_obj = intersects_N.object; // выбрали объект - элемент модели!

        if (vc3d_glob.curr_obj) {
          vc3d_glob.curr_obj_all = this.getParent(vc3d_glob.curr_obj);
          //console.log("44==");

          //var intersects_0 = intersects_N;
          var point = intersects_N.point;

          //console.log("point = ", point);
          //console.log("CLICK vc3d_glob.curr_obj_all = ", vc3d_glob.curr_obj_all);

          //22222222222222222222222222222222222222222222222222222222222222
          const p = intersects_N.point;
          vc3d_glob.mouseHelper.position.copy(p);
          vc3d_glob.intersection.point.copy(p);
          //curr_obj_all.position.copy(p);
          if (vc3d_glob.curr_obj_all_PICTURE) {
            //console.log("PICTURE =", vc3d_glob.curr_obj_all_PICTURE);
            vc3d_glob.curr_obj_all_PICTURE.position.copy(p);
          }

          const n = intersects_N.face.normal.clone();
          n.transformDirection(vc3d_glob.curr_obj.matrixWorld);
          n.multiplyScalar(10);
          n.add(intersects_N.point);

          const okr = 1;
          //console.log(
          //   "n:  x",
          //   Math.ceil(n.x * okr) / okr,
          //   ",y",
          //   Math.ceil(n.y * okr) / okr,
          //   ",z",
          //   Math.ceil(n.z * okr) / okr
          // );
          //console.log(
          //   "point:  x",
          //   Math.ceil(point.x * okr) / okr,
          //   ",y",
          //   Math.ceil(point.y * okr) / okr,
          //   ",z",
          //   Math.ceil(point.z * okr) / okr
          // );

          vc3d_glob.intersection.normal.copy(intersects_N.face.normal);
          vc3d_glob.mouseHelper.lookAt(n);
          //curr_obj_all.lookAt(n);
          if (vc3d_glob.curr_obj_all_PICTURE) {
            vc3d_glob.curr_obj_all_PICTURE.lookAt(n);
          }

          const positions = vc3d_glob.line.geometry.attributes.position;
          positions.setXYZ(0, p.x, p.y, p.z);
          positions.setXYZ(1, n.x, n.y, n.z);
          positions.needsUpdate = true;

          vc3d_glob.intersection.intersects = true;
          /** */

          if (!vc3d_glob.animate) {
            i3d_all.animate2();
          }
        }
      }
    }
  }
  objNormal_4({ intersects }) {
    //console.log("intersects", intersects);
    if (!vc3d_glob.curr_obj_all_PICTURE) {
      return;
    }

    if (intersects && intersects.length > 0) {
      //var intersects_N = intersects[0];
      var intersects_fix = intersects.filter((item) => item?.object?.fix === 1);
      if (!intersects_fix) {
        return;
      }
      var intersects_N = intersects_fix[0];

      if (intersects_N) {
        const curr_obj = intersects_N.object; // выбрали объект - элемент модели!

        if (curr_obj) {
          const curr_obj_all = this.getParent(curr_obj);
          //console.log("44==");

          //var intersects_0 = intersects_N;
          var point = intersects_N.point;

          //console.log("point = ", point);
          //console.log("CLICK curr_obj_all = ", curr_obj_all);

          //22222222222222222222222222222222222222222222222222222222222222
          const p = intersects_N.point;
          vc3d_glob.mouseHelper.position.copy(p);
          vc3d_glob.intersection.point.copy(p);
          //curr_obj_all.position.copy(p);
          if (vc3d_glob.curr_obj_all_PICTURE) {
            //console.log("PICTURE =", vc3d_glob.curr_obj_all_PICTURE);
            vc3d_glob.curr_obj_all_PICTURE.position.copy(p);
          }

          const n = intersects_N.face.normal.clone();
          n.transformDirection(curr_obj.matrixWorld);
          n.multiplyScalar(10);
          n.add(intersects_N.point);

          const okr = 1;
          //console.log(
          //   "n:  x",
          //   Math.ceil(n.x * okr) / okr,
          //   ",y",
          //   Math.ceil(n.y * okr) / okr,
          //   ",z",
          //   Math.ceil(n.z * okr) / okr
          // );
          //console.log(
          //   "point:  x",
          //   Math.ceil(point.x * okr) / okr,
          //   ",y",
          //   Math.ceil(point.y * okr) / okr,
          //   ",z",
          //   Math.ceil(point.z * okr) / okr
          // );

          vc3d_glob.intersection.normal.copy(intersects_N.face.normal);
          vc3d_glob.mouseHelper.lookAt(n);
          //curr_obj_all.lookAt(n);
          if (vc3d_glob.curr_obj_all_PICTURE) {
            vc3d_glob.curr_obj_all_PICTURE.lookAt(n);
          }

          const positions = vc3d_glob.line.geometry.attributes.position;
          positions.setXYZ(0, p.x, p.y, p.z);
          positions.setXYZ(1, n.x, n.y, n.z);
          positions.needsUpdate = true;

          vc3d_glob.intersection.intersects = true;
          /** */

          if (!vc3d_glob.animate) {
            i3d_all.animate2();
          }
        }
      }
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

  MouseUp8_1(event) {
    event.preventDefault();
    //console.log("MouseUp8");
    vc3d_glob.MouseUp = true; // MouseUp сработало значит события для длительного нажатия отменяем
    vc3d_glob.isDown = false;
  }

  MouseUp8(event) {
    //_WORK
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
