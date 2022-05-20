import io from "socket.io-client";

import { i3d_all } from "./f7_assist.js";
import { app } from "./f9_appvue.js";
import { i3d_app_sets } from "./f3_apparat_sets.js";
//import { i3d_tween } from "./f6_tween.js";
import { i3d_events } from "./f8_events.js";
import { i3d_events_func } from "./f8_events_func.js";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
//import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

import { vc3d_glob } from "./f5_vc3d_glob.js";
import { common } from "../../common/common";
import { fetchOneModelType3d, fetchOneDC } from "../../http/commAPI";

class i3d_Base {
  make_test1() {
    alert("m ake_test1");

    var goods_set = i3d_all.getParam("set"); //

    if (!goods_set) {
      goods_set = "z";
    }

    if (goods_set) {
      vc3d_glob.set = goods_set;
      var data = {
        table: "goods_elements_by_set_and_libs",
        n: "true",
        goods_set: goods_set,
        offset: 0,
        record_qty: 100,
      }; //var data = { table: 'goods_name', goods_name: "sabotage" };
      //!!!

      i3d_base.socket_init();
      vc3d_glob.socket.emit("get_base_1", "8=777777777=888");
    }
  }

  add_model_to_scene(i, wl_1) {
    //2019 добавляем модель к сцене
    switch (wl_1.mod_type) {
      case "1": // obj
        vc3d_glob.loaded_objects_count++;
        wl_1.obj_type = "obj";
        this.obj(i, wl_1);
        break;
      case "2": // gltf
        vc3d_glob.loaded_objects_count++;
        wl_1.obj_type = "gltf";
        this.load_gltf(i, wl_1);
        break;
      case "3": // dae
        vc3d_glob.loaded_objects_count++;
        wl_1.obj_type = "dae";
        //dae(p, wl_1, goods_or_set_list);
        break;
      default:
        break;
    }
  }

  obj(ge_i, wl_1) {
    // wl_1  =  это данные модели - элемента списка goods_or_set_list = app.all.ge из таблицы sets.   !!! wl_1 - ЭТО ССЫЛКА НА app.all.ge[i] !!!

    //try {
    var onProgress = function (xhr) {
      if (xhr.lengthComputable) {
        var xhr_total = xhr.total;
      } else {
        if (wl_1.size_bites) {
          var xhr_total = wl_1.size_bites;
        } else {
          var xhr_total = 12000000;
        }
      }
      //i3d_all.load_indicator4(xhr.loaded, xhr_total); //индикатор загрузки
    };
    var onError_obj = function (xhr) {
      vc3d_glob.loaded_objects_count--;
      i3d_all.c_sys("Ошибка при загрузке одной или нескольких моделей (obj)");
    };
    var onError_mtl = function (xhr) {
      vc3d_glob.loaded_objects_count--;
      i3d_all.c_sys("Ошибка при загрузке одной или нескольких моделей (mtl)");
    };
    var mtlLoader = new MTLLoader();

    wl_1.mtl_path = app.pics_dir + wl_1.mtl_path;

    mtlLoader.load(
      wl_1.mtl_path,
      function (materials) {
        var z = wl_1.mtl_path.substring(wl_1.mtl_path.lastIndexOf("/") + 1);
        var y = wl_1.mtl_path.replace(z, "");

        materials.baseUrl = y;
        materials.preload();
        var objLoader = new OBJLoader();

        objLoader.setMaterials(materials);
        wl_1.mtl_path = app.pics_dir + wl_1.mtl_path;
        wl_1.obj_path = app.pics_dir + wl_1.obj_path; //   ТУТ КАКАЯ ТО ПРОБЛЕМА! wl_1.mtl_path ПЕРЕЗАПИСЫВАЕТСЯ !!!!!!!!!!!!!!!!!!!!

        objLoader.load(
          wl_1.obj_path,
          function (object) {
            i3d_base.get_obj_gltf_dae(ge_i, object, wl_1);
          },
          onProgress,
          onError_obj
        );
      },
      onProgress,
      onError_mtl
    );
  }

  load_gltf() {
    let wl_1 = {};
    var onProgress = function (xhr) {
      //console.log( `${( xhr.loaded / xhr.total * 100 )}% loaded` );
    };
    var onError_gltf = function (error) {
      console.error("An error happened", error);
    };

    //wl_1.obj_path = "../etYoTBaStlPEYbOD/5d.gltf";
    //wl_1.obj_path = "../models3d/11d.glb";

    wl_1.obj_path = "../models3d/2d.glb";
    //wl_1.obj_path = "../models3d/sss1.glb";

    //wl_1.obj_path = "../o4bVjzEGtvIxEZUq/ikrand1.gltf";

    var loader = new GLTFLoader();

    //loader.load('../o4bVjzEGtvIxEZUq/ikrand1.gltf',function (gltf) {
    loader.load(wl_1.obj_path, function (gltf) {
      var gltf_model = gltf.scene;

      const boundingBox = new THREE.Box3().setFromObject(gltf.scene);
      let size = boundingBox.getSize();
      //console.log("4444444444      =                size", size)

      vc3d_glob.ray_objects.push(gltf.scene); // тут те модели, которые можно выбирать r aycaster-ом

      gltf.scene.move_type = 1; //parseInt(wl_1.move_type); //нужно ли двигать объект?
      gltf.scene.MODEL3D = 1; //
      gltf.scene.wtype = "gltf"; //

      const rrrs = 6;
      gltf.scene.scale.set(rrrs, rrrs, rrrs);
      gltf.scene.position.set(0, -100, 0); //

      gltf.scene.model_unid =
        wl_1.model_unid || i3d_all.gener_name_to_input(16, "#aA");

      let data_rows = [],
        data_count = 1; // список элементов модели

      gltf.scene.traverse(function (child) {
        if (child.isMesh) {
          if (vc3d_glob.shadow) {
            child.castShadow = true;
            child.receiveShadow = true;
          }

          vc3d_glob.ray_objects.push(child); // тут те модели, которые можно выбирать r aycaster-ом

          child.material.needsUpdate = true;
          child.model_unid = gltf.scene.model_unid;

          //console.log("444444444 child.name = ", child.name, "child = ", child)

          // заполняем список элементов модели:
          // if(data_count === 11) { data_rows.push({id: data_count, model_unid: gltf.scene.model_unid
          //     , name: child.name, active: 1, el: child });}
          // else { data_rows.push({id: data_count, model_unid: gltf.scene.model_unid
          //     , name: child.name, active: 0, el: child }); }
          data_rows.push({
            id: data_count,
            model_unid: gltf.scene.model_unid,
            name: child.name,
            active: 0,
            el: child,
          });

          data_count++;

          /*==== Раскрасим модель просто цветом =========================================================*/
          if (wl_1.colored == "1") {
            child.material.color = new THREE.Color("#00f"); //0x444444
            child.material.emissive = new THREE.Color("#00f");
            child.material.emissiveIntensity = 1;
          }
        }
      });

      // заполняем список элементов модели:
      vc3d_glob.device.setModelRack3d(data_rows);
      vc3d_glob.device.setModelRack3dTotal(data_count);

      vc3d_glob.SCENE.add(gltf.scene);
      //vc3d_glob.CAMERA.updateProjectionMatrix();

      //!!!!!!!!!!!!!!!!
      i3d_all.onWindowResize_AO();

      //console.log("===============1==================vc3d_glob.SCENE.children = ", vc3d_glob.SCENE.children);

      //if (!vc3d_glob.animate) { i3d_all.animate3(); }

      /**/
      //vc3d_glob.SCENE.add(gltf_model);

      //}, onProgress, onError_gltf);
      //}, onProgress);
    });
  }

  load_gltf_2021() {
    try {
      console.log("9900 load_gltf_2021=", vc3d_glob.currentRT.model3d);

      if (!vc3d_glob.currentRT) {
        return;
      }

      let wl_1 = {};
      var onProgress = function (xhr) {
        //console.log( `${( xhr.loaded / xhr.total * 100 )}% loaded` );
      };
      var onError_gltf = function (error) {
        console.error("An error happened", error);
      };

      var loader = new GLTFLoader();
      const model_URL =
        process.env.REACT_APP_API_URL + vc3d_glob.currentRT.model3d;
      //console.log("$$$ model_URL = ", model_URL);
      loader.load(model_URL, function (gltf) {
        var gltf_model = gltf.scene;

        //console.log("gltf = ", gltf);
        //! const boundingBox = new THREE.Box3().setFromObject(gltf.scene); let size = boundingBox.getSize(); //console.log("4444444444      =                size", size)

        vc3d_glob.ray_objects.push(gltf.scene); // тут те модели, которые можно выбирать r aycaster-ом

        gltf.scene.move_type = 1; //parseInt(wl_1.move_type); //нужно ли двигать объект?
        gltf.scene.MODEL3D = 1; //
        gltf.scene.wtype = "gltf"; //
        if (vc3d_glob.currentRT.Set) {
          gltf.scene.Set = vc3d_glob.currentRT.Set;
        }

        // PARAMS ////////////////////////////////////////////////////////////////////
        if (!vc3d_glob.currentRT.params1) vc3d_glob.currentRT.params1 = "{}";
        if (!vc3d_glob.currentRT.params2) vc3d_glob.currentRT.params2 = "{}";

        try {
          if (
            typeof vc3d_glob.currentRT.params1 === "string" &&
            typeof vc3d_glob.currentRT.params2 === "string"
          ) {
            var JSON_params1 = eval("(" + vc3d_glob.currentRT.params1 + ")"); //console.log("JSON_params1 = ", JSON_params1)
            if (JSON_params1.size) {
              gltf.scene.scale.set(
                JSON_params1.size,
                JSON_params1.size,
                JSON_params1.size
              );
            }
            const x = JSON_params1.x || 0;
            const y = JSON_params1.y || 0;
            const z = JSON_params1.z || 0;
            gltf.scene.position.set(x, y, z);

            var JSON_params2 = eval("(" + vc3d_glob.currentRT.params2 + ")"); //console.log("JSON_params2 = ", JSON_params2)
            const cx = common.valOrDefault(JSON_params2.cx, 0);
            const cy = common.valOrDefault(JSON_params2.cy, 1000);
            const cz = common.valOrDefault(JSON_params2.cz, 500);
            vc3d_glob.CAMERA.position.set(cx, cy, cz);
            vc3d_glob.CAMERA.updateProjectionMatrix();
          } else {
            console.error(
              "ERRRR params12 NOT STRING !!!! typeof vc3d_glob.currentRT.params1 = ",
              typeof vc3d_glob.currentRT.params1,
              "typeof vc3d_glob.currentRT.params2 = ",
              typeof vc3d_glob.currentRT.params2
            );
          }
        } catch (e) {
          console.error("ERRRR params12", e);
        }

        gltf.scene.model_unid =
          vc3d_glob.currentRT.id || i3d_all.gener_name_to_input(16, "#aA");

        let data_rows = [],
          data_count = 1; // список элементов модели

        gltf.scene.traverse(function (child) {
          if (child.isMesh) {
            if (vc3d_glob.shadow) {
              child.castShadow = true;
              child.receiveShadow = true;
            }

            vc3d_glob.ray_objects.push(child); // тут те модели, которые можно выбирать r aycaster-ом

            child.material.needsUpdate = true;
            child.model_unid = gltf.scene.model_unid;
            child.wtype = "gltf";
            if (vc3d_glob.currentRT.Set) {
              gltf.scene.Set = vc3d_glob.currentRT.Set;
            }

            // заполняем список элементов модели:
            data_rows.push({
              id: data_count,
              model_unid: gltf.scene.model_unid,
              name: child.name,
              active: 0,
              el: child,
            });

            data_count++;

            /*==== Раскрасим модель просто цветом =========================================================*/
            //wl_1.colored = "1"
            if (wl_1.colored == "1") {
              child.material.color = new THREE.Color("#00f"); //0x444444
              child.material.emissive = new THREE.Color("#00f");
              child.material.emissiveIntensity = 1;
            }
          }
        });

        // заполняем список элементов модели:
        vc3d_glob.device.setModelRack3d(data_rows);
        vc3d_glob.device.setModelRack3dTotal(data_count);

        // vc3d_glob.currentRT - rack 3d model    has Set = {dc, x, z }

        vc3d_glob.device.setActive3dElement({});
        gltf.scene.position.y += 1;
        vc3d_glob.SCENE.add(gltf.scene);
        //vc3d_glob.CAMERA.updateProjectionMatrix();
        //alert(94)

        //!!!!!!!!!!!!!!!!
        i3d_all.onWindowResize_AO();

        if (!vc3d_glob.animate) {
          i3d_all.animate3();
        }

        /**/
        //vc3d_glob.SCENE.add(gltf_model);

        //}, onProgress, onError_gltf);
        //}, onProgress);
      });
    } catch (e) {
      i3d_all.c_sys("ERROR mess: " + e.name + ": " + e.message, "e = ", e);
    }
  }
  load_gltf_2021_params({
    m,
    x = 0,
    y = 0,
    z = 0,
    rx = 0,
    ry = 0,
    rz = 0,
    s = 1,
    set = 1,
    data,
  }) {
    try {
      //console.log("m, x, y, z, rx, ry, rz, s", m, x, y, z, rx, ry, rz, s, set);
      console.log("3424242 44343 data", data);
      //if (!m || !data) {
      if (!m) {
        return;
      }
      if (!vc3d_glob.device) {
        console.error("!vc3d_glob.device");
        return;
      }

      let wl_1 = {};
      var onProgress = function (xhr) {
        //console.log( `${( xhr.loaded / xhr.total * 100 )}% loaded` );
      };
      var onError_gltf = function (error) {
        console.error("An error happened", error);
      };

      var loader = new GLTFLoader();
      const model_URL = process.env.REACT_APP_API_URL + data.model3d;
      //console.log("$$$ model_URL = ", model_URL);
      loader.load(model_URL, function (gltf) {
        var gltf_model = gltf.scene;

        vc3d_glob.ray_objects.push(gltf.scene); // тут те модели, которые можно выбирать r aycaster-ом
        gltf.scene.move_type = 1; //parseInt(wl_1.move_type); //нужно ли двигать объект?
        gltf.scene.MODEL3D = 1; //
        gltf.scene.wtype = "gltf"; //
        // if (data.Set) {
        //   gltf.scene.Set = data.Set;
        // }

        gltf.scene.m = m;
        gltf.scene.scale.set(s, s, s);
        gltf.scene.position.set(x, y, z);

        gltf.scene.model_id = data.id;
        gltf.scene.model_name = data.name;
        gltf.scene.model_unid = i3d_all.gener_name_to_input(16, "#aA");

        const cx = x || 0;
        const cy = y || 0;
        const cz = z || 0;
        console.log("cx, cy, cz ====", cx, cy, cz);
        gltf.scene.position.set(cx, cy, cz);

        let data_rows = [],
          data_count = 1; // список элементов модели

        gltf.scene.traverse(function (child) {
          if (child.isMesh) {
            if (vc3d_glob.shadow) {
              child.castShadow = true;
              child.receiveShadow = true;
            }

            vc3d_glob.ray_objects.push(child); // тут те модели, которые можно выбирать r aycaster-ом

            child.material.needsUpdate = true;
            child.model_unid = gltf.scene.model_unid;
            child.wtype = "gltf";
            // if (vc3d_glob.currentRT.Set) {
            //   gltf.scene.Set = vc3d_glob.currentRT.Set;
            // }

            // заполняем список элементов модели:
            data_rows.push({
              id: data_count,
              model_unid: gltf.scene.model_unid,
              name: child.name,
              active: 0,
              el: child,
            });

            data_count++;

            /*==== Раскрасим модель просто цветом =========================================================*/
            //wl_1.colored = "1"
            if (wl_1.colored == "1") {
              child.material.color = new THREE.Color("#00f"); //0x444444
              child.material.emissive = new THREE.Color("#00f");
              child.material.emissiveIntensity = 1;
            }
          }
        });

        vc3d_glob.SCENE.add(gltf.scene);
        i3d_all.onWindowResize_AO();

        if (!vc3d_glob.animate) {
          i3d_all.animate3();
        }

        /**/
        //vc3d_glob.SCENE.add(gltf_model);
        //}, onProgress, onError_gltf);
        //}, onProgress);
      });
    } catch (e) {
      i3d_all.c_sys("ERROR mess: " + e.name + ": " + e.message, "e = ", e);
    }
  }

  get_obj_gltf_dae(ge_i, object, wl_1) {
    // wl_1  =  это данные модели - элемента списка goods_or_set_list = app.all.ge из таблицы sets

    switch (vc3d_glob.add_text) {
      case "no":
        break;
      default:
        //i3d_tween.elems_add_text(); // тут добавляем интерактив
        break;
    }
    i3d_all.coi(
      wl_1,
      "2 get_obj_gltf_dae =================== wl_1 =========================="
    );

    var child_number = 0;
    object.traverse(function (child) {
      if (child.isMesh) {
        if (vc3d_glob.shadow) {
          child.castShadow = true;
          child.receiveShadow = true;
        }

        child.child_number = -1; //child_number; //присвоим порядковый номер          !!!!!!!!  по нему будем находить связь между vc3d_glob.curr_obj (элемент 3Д модели) и app.all.ge[i].elems[child_number]

        child.ge_i = ge_i; // vc3d_glob.curr_obj_all.ge_i = ge_i   = порядковый номер модели из массива app.all.ge !!!!!!!!!!!!!!!!!!!!!!!!!
        child.model_unid_in_ge = wl_1.model_unid_in_ge; // model_unid_in_ge   = "УНИКАЛЬНЫЙ" номер модели из массива app.all.ge !!!!!!!!!!!!!!!!!!!!!!!!!

        // if (child.ge_i == undefined || child.child_number == undefined || child.ge_i === "" || child.child_number === ""
        //     || child.model_unid_in_ge == undefined || child.model_unid_in_ge === "" || !child.model_unid_in_ge) {
        //         i3d_all.alert_sys("Ошибка при добавлении модели. Попробуйте еще раз."); return;
        // }

        child.obj_type = wl_1.obj_type; // = "gltf"
        child.mod_type = wl_1.mod_type; // = "gltf"
        child.mod_name = wl_1.mod_name; //
        vc3d_glob.ray_objects.push(child); // тут те модели, которые можно выбирать r aycaster-ом

        child.material.needsUpdate = true;

        /*==== Раскрасим модель просто цветом =========================================================*/
        if (wl_1.colored == "1") {
          child.material.color = new THREE.Color("#00f"); //0x444444
          child.material.emissive = new THREE.Color("#00f");
          child.material.emissiveIntensity = 1;
        }

        ///  Тут мы в app.all.elems дописываем элементы из модели (если они там отсуствуют)  //////////////
        var found = false;
        for (var e = 0; e < app.all.elems.length; e++) {
          if (
            app.all.elems[e].model_unid_in_ge == child.model_unid_in_ge &&
            app.all.elems[e].name == child.name
          ) {
            app.all.elems[e].child_number = e;
            child.child_number = e;
            if (app.all.elems[e].hide) {
              child.visible = false;
            } //hide if hide !
            found = true;
          }
        }
        if (!found) {
          app.all.elems.push({
            model_unid_in_ge: child.model_unid_in_ge,
            child_number: app.all.elems.length,
            libs: [],
            name: child.name,
          });
          child.child_number = app.all.elems.length - 1;
        }
        //c("BASE child.name = " + child.name + ", child.child_number = " + child.child_number + ", child_number = " + child_number);

        child_number++;
      }
    });

    object.ge_i = ge_i; // vc3d_glob.curr_obj_all.ge_i = ge_i   = порядковый номер модели из массива app.all.ge !!!!!!!!!!!!!!!!!!!!!!!!!

    //object.model_unid_in_ge = wl_1.model_unid_in_ge; // model_unid_in_ge   = "УНИКАЛЬНЫЙ" номер модели из массива app.all.ge !!!!!!!!!!!!!!!!!!!!!!!!!
    object.model_unid =
      wl_1.model_unid || i3d_all.gener_name_to_input(16, "#aA");

    object.obj_type = wl_1.obj_type; // = "gltf"
    object.mod_type = wl_1.mod_type; // = "gltf"
    object.mod_name = wl_1.mod_name; //

    object.scale.x = wl_1.scalex;
    object.scale.y = wl_1.scaley;
    object.scale.z = wl_1.scalez;
    object.scalex_orig = wl_1.scalex;
    object.scaley_orig = wl_1.scaley;
    object.scalez_orig = wl_1.scalez;

    object.position.set(wl_1.allx, wl_1.ally, wl_1.allz);
    object.rotation.set(
      (wl_1.rotx * Math.PI) / 180,
      (wl_1.roty * Math.PI) / 180,
      (wl_1.rotz * Math.PI) / 180
    );

    object.move_type = 1; //parseInt(wl_1.move_type); //нужно ли двигать объект?
    object.sc_object3d = true;

    vc3d_glob.SCENE.add(object);

    i3d_all.coi(
      object,
      "3 get_obj_gltf_dae =================== object =========================="
    );

    vc3d_glob.loaded_objects_count--;

    if (vc3d_glob.loaded_objects_count <= 0) {
      //document.querySelector('#loader4').style.display = 'none'; //выключим значок загрузки
    }
  }

  // == RENDER =================================================================
  SCENE_PARAMS() {
    var sd = app.all.set[0];
    if (!sd) {
      return;
    }

    if (sd.fon_setClearColor != undefined) {
      vc3d_glob.renderer.setClearColor(sd.fon_setClearColor, 1);
    } else {
      vc3d_glob.renderer.setClearColor("#E9EAEE", 1);
    }

    // TEXT SPRITES
    //if(vc3d_glob.add_stext) i3d_tween.main_text(); // draw text   !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    vc3d_glob.CAMERA.position.x = sd.set_camera_x;
    vc3d_glob.CAMERA.position.y = sd.set_camera_y;
    vc3d_glob.CAMERA.position.z = sd.set_camera_z;
    vc3d_glob.CAMERA.lookAt(vc3d_glob.SCENE.position);

    if (sd.zoom_speed != undefined) {
      vc3d_glob.CONTROLS.zoomSpeed = parseInt(sd.zoom_speed);
      if (vc3d_glob.CONTROLS.zoomSpeed === 0) {
        vc3d_glob.CONTROLS.noZoom = true;
      }
    } else {
      vc3d_glob.CONTROLS.zoomSpeed = 10;
    }
    if (sd.rotate_speed != undefined) {
      vc3d_glob.CONTROLS.rotateSpeed = parseInt(sd.rotate_speed);
      if (vc3d_glob.CONTROLS.rotateSpeed === 0) {
        vc3d_glob.CONTROLS.noRotate = true;
      }
    } else {
      vc3d_glob.CONTROLS.rotateSpeed = 10;
    }

    //!!!
    if (sd.pan_speed != undefined) {
      if (!vc3d_glob.panSpeed_not_count) {
        vc3d_glob.CONTROLS.panSpeed = parseInt(sd.pan_speed);
        if (vc3d_glob.CONTROLS.panSpeed === 0) {
          vc3d_glob.CONTROLS.noPan = true;
        }
      }
    } else {
      vc3d_glob.CONTROLS.panSpeed = 10;
    }

    if (sd.controls_maxDistance != undefined) {
      vc3d_glob.CONTROLS.maxDistance = parseInt(sd.controls_maxDistance);
    } else {
      vc3d_glob.CONTROLS.maxDistance = 19000;
    }

    if (sd.controls_minDistance != undefined) {
      vc3d_glob.CONTROLS.minDistance = parseInt(sd.controls_minDistance);
    } else {
      vc3d_glob.CONTROLS.minDistance = 50;
    }

    var controls_maxPolarAngle = parseInt(sd.controls_maxPolarAngle);
    if (controls_maxPolarAngle > 0) {
      vc3d_glob.CONTROLS.maxPolarAngle = Math.PI / controls_maxPolarAngle;
    } else {
      vc3d_glob.CONTROLS.maxPolarAngle = Math.PI / 2;
    }

    /*=======================================================*/
    if (sd.controls_type != "3") {
      if (sd.controls_target_x != undefined) {
        vc3d_glob.CONTROLS.target.x = parseInt(sd.controls_target_x);
      } else {
        vc3d_glob.CONTROLS.target.x = 0;
      }
      if (sd.controls_target_y != undefined) {
        vc3d_glob.CONTROLS.target.y = parseInt(sd.controls_target_y);
      } else {
        vc3d_glob.CONTROLS.target.y = 0;
      }
      if (sd.controls_target_z != undefined) {
        vc3d_glob.CONTROLS.target.z = parseInt(sd.controls_target_z);
      } else {
        vc3d_glob.CONTROLS.target.z = 0;
      }
    }

    vc3d_glob.CONTROLS.staticMoving = true;
    vc3d_glob.CONTROLS.dynamicDampingFactor = 0.3;
    /*======================================================================================================================================================================*/
  }

  add_only_plane_and_mouse_move() {
    vc3d_glob.plane = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(1200000, 1200000, 1, 1),
      new THREE.MeshBasicMaterial({ visible: false, color: "#0f0" })
    );
    vc3d_glob.plane.not_3d_model = true;
    vc3d_glob.plane.name1 = "plane";
    vc3d_glob.SCENE.add(vc3d_glob.plane);

    /***************************************************************************************8 */

    if (vc3d_glob && vc3d_glob.floor) {
      switch (vc3d_glob.floor) {
        case "floor":
          vc3d_glob.plane.rotation.x = (-90 * Math.PI) / 180; // это нормальная плоскость - пол
          break;
        case "wall":
          break;
      }
    } else {
      vc3d_glob.plane.rotation.x = (-90 * Math.PI) / 180; // это нормальная плоскость - пол
    }
  }

  add_only_light_and_shadow() {
    var set = app.all.set[0];
    if (!set) {
      return;
    }

    set.ambient_color = "#fff";

    if (set.ambient_color) {
      var ambient = new THREE.AmbientLight(set.ambient_color);
      vc3d_glob.SCENE.add(ambient);
    }

    var particleLight = new THREE.Mesh(
      new THREE.SphereBufferGeometry(4, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    particleLight.position.x = 0;
    particleLight.position.y = 900240;
    particleLight.position.z = 0;
    vc3d_glob.SCENE.add(particleLight);
    particleLight.add(new THREE.PointLight(0xffffff, 1));

    /*======================================================*/
    if (vc3d_glob.shadow) {
      vc3d_glob.renderer.shadowMap.enabled = true;
      vc3d_glob.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      vc3d_glob.renderer.gammaInput = true;
      vc3d_glob.renderer.gammaOutput = true;
    }
    /*======================================================*/
  }
  render() {
    //if (vc3d_glob.renderer && vc3d_glob.SCENE && vc3d_glob.CAMERA)
    vc3d_glob.renderer.render(vc3d_glob.SCENE, vc3d_glob.CAMERA);
  }
  RENDER() {
    alert("RENDER");

    //var container = document.getElementById('ThreeJS');
    //vc3d_glob.SCREEN_WIDTH = window.innerWidth; vc3d_glob.SCREEN_HEIGHT = window.innerHeight;

    vc3d_glob.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    vc3d_glob.renderer.setPixelRatio(window.devicePixelRatio);
    vc3d_glob.renderer.setSize(window.innerWidth, window.innerHeight);

    vc3d_glob.renderer.gammaOutput = true;

    vc3d_glob.SCENE = new THREE.Scene();
    var VIEW_ANGLE = 60,
      ASPECT = vc3d_glob.SCREEN_WIDTH / vc3d_glob.SCREEN_HEIGHT,
      NEAR = 1,
      FAR = 100000;
    vc3d_glob.CAMERA = new THREE.PerspectiveCamera(
      VIEW_ANGLE,
      ASPECT,
      NEAR,
      FAR
    );
    vc3d_glob.SCENE.add(vc3d_glob.CAMERA);
    vc3d_glob.CAMERA.position.set(0, 1000, 500);

    var textureLoader = new THREE.TextureLoader();

    vc3d_glob.raycaster = new THREE.Raycaster();

    vc3d_glob.clock = new THREE.Clock();

    var controls_type = "2";
    if (controls_type) {
      switch (controls_type) {
        case "1":
          //vc3d_glob.CONTROLS = new THREE.TrackballControls(vc3d_glob.CAMERA);
          break;
        case "2":
          vc3d_glob.CONTROLS = new OrbitControls(
            vc3d_glob.CAMERA,
            vc3d_glob.renderer.domElement
          );

          break;
        case "3":
          //vc3d_glob.CONTROLS = new THREE.FirstPersonControls(vc3d_glob.CAMERA);
          break;
        default:
          //vc3d_glob.CONTROLS = new THREE.TrackballControls(vc3d_glob.CAMERA);
          break;
      }
    } else {
      //vc3d_glob.CONTROLS = new THREE.TrackballControls(vc3d_glob.CAMERA);
    }

    vc3d_glob.listen = false;
    if (vc3d_glob.listen) {
      //alert(555)
      //i3d_all.c("vc3d_glob.listen = " + vc3d_glob.listen);

      window.addEventListener("resize", i3d_all.onWindowResize_AO, false);

      vc3d_glob.renderer.domElement.addEventListener(
        "pointermove",
        i3d_events.onDocumentMouseMove8,
        false
      );
      vc3d_glob.renderer.domElement.addEventListener(
        "pointerdown",
        i3d_events.onDocumentMouseDown8,
        false
      ); //alert(777)
      vc3d_glob.renderer.domElement.addEventListener(
        "pointerup",
        i3d_events.onDocumentMouseUp8,
        false
      );
      vc3d_glob.renderer.domElement.addEventListener(
        "touchstart",
        i3d_events.onDocumentTouchStart,
        false
      );
      vc3d_glob.renderer.domElement.addEventListener(
        "touchend",
        i3d_events.onDocumentMouseUp8,
        false
      );
      vc3d_glob.renderer.domElement.addEventListener(
        "touchmove",
        i3d_events.onDocumentTouchMove,
        false
      );
      vc3d_glob.CONTROLS.addEventListener("change", this.render); //! если Orbit или другой Control изменяется, тогда перерендерим всю сцену, это если animate () не включено
      document.addEventListener(
        "keydown",
        i3d_events.onDocument_keydown,
        false
      );

      /** /
        if (vc3d_glob.ao) {
            vc3d_glob.CONTROLS.addEventListener('change', render_AO); //! если Orbit или другой Control изменяется, тогда перерендерим всю сцену, это если animate () не включено
        } else {
            vc3d_glob.CONTROLS.addEventListener('change', render); //! если Orbit или другой Control изменяется, тогда перерендерим всю сцену, это если animate () не включено
        }
        /**/
      // !!!
      //renderer.domElement.addEventListener('message', this.get_message_from_parent, false);
      //window.addEventListener('message', handlerMessage); //coi("window.addEventListener");
    }
    /**/

    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        let textSprite = i3d_base.makeTextSprite("ffffffff3");
        //textSprite.position.set(i*30, 300, j*30)
        textSprite.position.set(i * 3, 30, j * 3);
        vc3d_glob.SCENE.add(textSprite);
      }
    }
    //console.log("vc3d_glob.SCENE", vc3d_glob.SCENE)

    /**/
  }

  RENDER2() {
    //c("RENDER");

    //var container = document.getElementById('ThreeJS');
    //vc3d_glob.SCREEN_WIDTH = window.innerWidth; vc3d_glob.SCREEN_HEIGHT = window.innerHeight;

    var textureLoader = new THREE.TextureLoader();

    vc3d_glob.raycaster = new THREE.Raycaster();

    vc3d_glob.clock = new THREE.Clock();

    vc3d_glob.listen = false;
    if (vc3d_glob.listen) {
      //alert(555)
      //i3d_all.c("vc3d_glob.listen = " + vc3d_glob.listen);

      window.addEventListener("resize", i3d_all.onWindowResize_AO, false);

      vc3d_glob.renderer.domElement.addEventListener(
        "pointermove",
        i3d_events.onDocumentMouseMove8,
        false
      );
      vc3d_glob.renderer.domElement.addEventListener(
        "pointerdown",
        i3d_events.onDocumentMouseDown8,
        false
      ); //alert(777)
      vc3d_glob.renderer.domElement.addEventListener(
        "pointerup",
        i3d_events.onDocumentMouseUp8,
        false
      );
      vc3d_glob.renderer.domElement.addEventListener(
        "touchstart",
        i3d_events.onDocumentTouchStart,
        false
      );
      vc3d_glob.renderer.domElement.addEventListener(
        "touchend",
        i3d_events.onDocumentMouseUp8,
        false
      );
      vc3d_glob.renderer.domElement.addEventListener(
        "touchmove",
        i3d_events.onDocumentTouchMove,
        false
      );
      vc3d_glob.CONTROLS.addEventListener("change", this.render); //! если Orbit или другой Control изменяется, тогда перерендерим всю сцену, это если animate () не включено
      document.addEventListener(
        "keydown",
        i3d_events.onDocument_keydown,
        false
      );
    }
    /**/

    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        let textSprite = i3d_base.makeTextSprite("ffffffff3");
        //textSprite.position.set(i*30, 300, j*30)
        textSprite.position.set(i * 3, 30, j * 3);
        vc3d_glob.SCENE.add(textSprite);
      }
    }
    //console.log("vc3d_glob.SCENE", vc3d_glob.SCENE)

    /**/
  }

  makeTextSprite_material(message, parameters) {
    if (parameters === undefined) parameters = {};
    var fontface = parameters.hasOwnProperty("fontface")
      ? parameters["fontface"]
      : "Arial";
    var fontsize = parameters.hasOwnProperty("fontsize")
      ? parameters["fontsize"]
      : 118;
    var borderThickness = parameters.hasOwnProperty("borderThickness")
      ? parameters["borderThickness"]
      : 4;
    var borderColor = parameters.hasOwnProperty("borderColor")
      ? parameters["borderColor"]
      : { r: 250, g: 0, b: 0, a: 1.0 };
    var backgroundColor = parameters.hasOwnProperty("backgroundColor")
      ? parameters["backgroundColor"]
      : { r: 200, g: 100, b: 170, a: 1.0 };
    var textColor = parameters.hasOwnProperty("textColor")
      ? parameters["textColor"]
      : { r: 0, g: 0, b: 0, a: 1.0 };

    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");
    context.font = "Bold " + fontsize + "px " + fontface;
    var metrics = context.measureText(message);
    var textWidth = metrics.width;

    //context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + "," + backgroundColor.b + "," + backgroundColor.a + ")";
    context.strokeStyle =
      "rgba(" +
      borderColor.r +
      "," +
      borderColor.g +
      "," +
      borderColor.b +
      "," +
      borderColor.a +
      ")";
    context.fillStyle = "green";

    context.lineWidth = borderThickness;
    //roundRect(context, borderThickness/2, borderThickness/2, (textWidth + borderThickness) * 1.1, fontsize * 1.4 + borderThickness, 8);

    //context.fillStyle = "rgba("+textColor.r+", "+textColor.g+", "+textColor.b+", 1.0)";
    context.fillStyle = "rgba(255, 0, 0, 1.0)";
    context.fillText(message, borderThickness, fontsize + borderThickness);

    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    //var spriteMaterial = new THREE.SpriteMaterial( { map: texture, useScreenCoordinates: false } );
    //var spriteMaterial = new THREE.MeshPhongMaterial( { map: texture, color: "#0f0", useScreenCoordinates: false } );

    var spriteMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      color: "#0f0",
      useScreenCoordinates: false,
    });

    //var sprite = new THREE.Sprite( spriteMaterial );
    //sprite.scale.set(0.5 * fontsize, 0.25 * fontsize, 0.75 * fontsize);
    //sprite.scale.set(10.5 * fontsize, 10.25 * fontsize, 10.75 * fontsize);

    //console.log("sprite", sprite);

    //return sprite;
    return spriteMaterial;
  }

  makeTextSprite_material_11(val, parameters) {
    var textCanvas = document.createElement("canvas");
    var context = textCanvas.getContext("2d");

    //var context = textCanvas.getContext("2d");
    context.font = "100px Arial";
    context.shadowColor = "red";
    context.fillStyle = "green";
    context.textAlign = "center";
    //context.textBaseline = "middle";

    //this.draw3dText(context, val, 70, 70, 1);
    context.fillText(val, 0, 99);
    context.fillText(val, 70, 70);

    //console.log("context", context)

    //var texture = new THREE.Texture(textCanvas)
    var texture = new THREE.Texture();
    texture.image = textCanvas;
    texture.needsUpdate = true;

    //var spriteMaterial = new THREE.SpriteMaterial( { map: texture, useScreenCoordinates: false } );
    //var spriteMaterial = new THREE.MeshPhongMaterial( { map: texture, color: "#0f0", useScreenCoordinates: false } );

    var spriteMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      color: "#0f0",
      useScreenCoordinates: false,
    });

    //var sprite = new THREE.Sprite( spriteMaterial );
    //sprite.scale.set(0.5 * fontsize, 0.25 * fontsize, 0.75 * fontsize);
    //sprite.scale.set(10.5 * fontsize, 10.25 * fontsize, 10.75 * fontsize);

    //console.log("sprite", sprite);

    //return sprite;
    return spriteMaterial;
  }

  makeTextSprite(message, parameters) {
    if (parameters === undefined) parameters = {};
    var fontface = parameters.hasOwnProperty("fontface")
      ? parameters["fontface"]
      : "Arial";
    var fontsize = parameters.hasOwnProperty("fontsize")
      ? parameters["fontsize"]
      : 18;
    var borderThickness = parameters.hasOwnProperty("borderThickness")
      ? parameters["borderThickness"]
      : 4;
    var borderColor = parameters.hasOwnProperty("borderColor")
      ? parameters["borderColor"]
      : { r: 0, g: 0, b: 0, a: 1.0 };
    var backgroundColor = parameters.hasOwnProperty("backgroundColor")
      ? parameters["backgroundColor"]
      : { r: 200, g: 100, b: 170, a: 1.0 };
    var textColor = parameters.hasOwnProperty("textColor")
      ? parameters["textColor"]
      : { r: 0, g: 0, b: 0, a: 1.0 };

    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");
    context.font = "Bold " + fontsize + "px " + fontface;
    var metrics = context.measureText(message);
    var textWidth = metrics.width;

    context.fillStyle =
      "rgba(" +
      backgroundColor.r +
      "," +
      backgroundColor.g +
      "," +
      backgroundColor.b +
      "," +
      backgroundColor.a +
      ")";
    context.strokeStyle =
      "rgba(" +
      borderColor.r +
      "," +
      borderColor.g +
      "," +
      borderColor.b +
      "," +
      borderColor.a +
      ")";

    context.lineWidth = borderThickness;
    //roundRect(context, borderThickness/2, borderThickness/2, (textWidth + borderThickness) * 1.1, fontsize * 1.4 + borderThickness, 8);

    context.fillStyle =
      "rgba(" +
      textColor.r +
      ", " +
      textColor.g +
      ", " +
      textColor.b +
      ", 1.0)";
    context.fillText(message, borderThickness, fontsize + borderThickness);

    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    var spriteMaterial = new THREE.SpriteMaterial({
      map: texture,
      useScreenCoordinates: false,
    });
    var sprite = new THREE.Sprite(spriteMaterial);
    //sprite.scale.set(0.5 * fontsize, 0.25 * fontsize, 0.75 * fontsize);

    //console.log("sprite", sprite);

    return sprite;
  }

  //engraveTextOnWatch(val = document.querySelector("#engtxt").value) {
  engraveTextOnWatch(val) {
    // add text upon watch's back dial
    //clearCanvas();

    var textCanvas = document.createElement("canvas");
    var context = textCanvas.getContext("2d");

    //var context = textCanvas.getContext("2d");
    context.font = "100px Arial";
    context.shadowColor = "red";
    context.fillStyle = "green";
    context.textAlign = "center";
    //context.textBaseline = "middle";
    this.draw3dText(context, val, 70, 70, 1);
    //context.fillText( val, 4, 122);

    var engravedText = new THREE.Texture();
    engravedText.image = textCanvas;
    engravedText.needsUpdate = true;

    var backPlateMaterial = new THREE.MeshBasicMaterial({
      map: engravedText,
    });

    //object3d.children[49].material = backPlateMaterial;
    //object3d.children[49].material.needsUpdate = true;
    // although text gets printed on canvas but it's not getting reflected on
    // back dial geometry instead lines are drawn

    return backPlateMaterial;
  }

  draw3dText(context, text, x, y, textDepth) {
    var n;
    // draw bottom layers
    for (n = 0; n < textDepth; n++) {
      context.fillText(
        text.split("").join(String.fromCharCode(46)),
        x - n,
        y - n
      );
    }
  }

  socket_init() {
    //REACT_APP_API_URL='http://s1.instr3d.com:5000/'

    //vc3d_glob.socket = io("http://localhost:5000/");
    //vc3d_glob.socket = io("http://s1.instr3d.com:5000/");
    vc3d_glob.socket = io(process.env.REACT_APP_API_URL);

    var form = document.getElementById("form");
    var input = document.getElementById("input");
    var button = document.getElementById("button");
    //console.log("button", button)

    vc3d_glob.socket.on("chat message", function (msg) {
      var item = document.createElement("li");
      item.textContent = msg;
      //messages.appendChild(item);
      //window.scrollTo(0, document.body.scrollHeight);
    });
    vc3d_glob.socket.on("function_result_123", function (result) {
      //console.log("vc3d_glob.onlyOneRender ========", vc3d_glob.onlyOneRender)

      //vc3d_glob.onlyOneRender = 0

      //console.log("ТУТ ЗАПРЕЩАЕМ НЕСКОЛЬКО РАЗ ЗАГРУЖАТЬ МОДЕЛЬ ПО СОКЕТУ.  vc3d_glob.onlyOneRender =", vc3d_glob.onlyOneRender)
      if (vc3d_glob.onlyOneRender === 0) {
        //if(vc3d_glob.onlyOneRender === 0 || vc3d_glob.onlyOneRender === 1) {
        //alert(955)
        i3d_base.function_result_123(result);
        vc3d_glob.onlyOneRender = 1; //
      }
    });
    /**/
  }

  function_result_123(result) {
    //console.log("function_result_12 3                           result", result)
    app.all = {};

    let json_result,
      local = true;

    json_result = result;

    //i3d_all.coi(json_result, "json_result =")
    var eval_result = json_result.json2[0];

    // Если ошибка загрузки данных то выход
    if (
      !eval_result ||
      !eval_result[0] ||
      !eval_result[0].set_ge ||
      !eval_result[0].set_set
    ) {
      i3d_all.c_sys("Ошибка данных");
      document.querySelector("#loader4").style.display = "none"; //выключим значок загрузки
      return;
    }

    if (local) {
      app.all.ge = JSON.parse(eval_result[0].set_ge);
    } else {
      app.all.ge = eval_result[0].set_ge;
    }

    //console.log("app.all.ge", app.all.ge)

    if (local) {
      app.all.set = JSON.parse(eval_result[0].set_set);
    } else {
      app.all.set = eval_result[0].set_set;
    }

    //, libs: [] // список номеров библиотек для записи в sets[0].libs
    app.editor.libs = app.all.set[0].libs;

    // числовые итерации регуляторов - колёсиков
    if (app.all.set[0].iterations == undefined) {
      app.all.set[0].iterations = [];
    }
    app.editor.regular_iterations = app.all.set[0].iterations;

    // цифры для числовых итераций регуляторов
    if (app.all.set[0].regular_iter_digits_mats_id == undefined) {
      app.all.set[0].regular_iter_digits_mats_id = [
        806, 807, 808, 809, 810, 811, 812, 813, 814, 815,
      ];
    }
    app.editor.regular_iter_digits_mats_id =
      app.all.set[0].regular_iter_digits_mats_id;

    if (app.all.set[0].regular_iter_digits2_mats_id == undefined) {
      app.all.set[0].regular_iter_digits2_mats_id = [
        806, 807, 808, 809, 810, 811, 812, 813, 814, 815,
      ];
    }
    app.editor.regular_iter_digits2_mats_id =
      app.all.set[0].regular_iter_digits2_mats_id;

    // цифры для числовых итераций регуляторов
    if (app.all.set[0].regular_iter_digit_plus_minus == undefined) {
      app.all.set[0].regular_iter_digit_plus_minus = [868, 867];
    }
    app.editor.regular_iter_digit_plus_minus =
      app.all.set[0].regular_iter_digit_plus_minus;

    //!!! ORIGINAL !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    if (local) {
      app.all.elems = JSON.parse(eval_result[0].set_elems);
    } else {
      app.all.elems = eval_result[0].set_elems;
    }

    app.all.set_id = eval_result[0].set_id;
    app.all.set_unid = eval_result[0].set_unid;
    app.all.set_name = eval_result[0].set_name;
    app.all.set_owner_unid = eval_result[0].set_owner_unid;
    app.all.set_users_id = eval_result[0].set_users_id;
    app.all.set_owner_id = eval_result[0].set_owner_id;

    app.all.set_user_name = eval_result[0].set_user_name;
    app.all.set_user_tel = eval_result[0].set_user_tel;
    app.all.set_user_email = eval_result[0].set_user_email;
    app.all.set_user_adress = eval_result[0].set_user_adress;
    app.all.set_user_descr = eval_result[0].set_user_descr;

    app.all.set_user_name_new = eval_result[0].set_user_name;
    app.all.set_user_tel_new = eval_result[0].set_user_tel;
    app.all.set_user_email_new = eval_result[0].set_user_email;
    app.all.set_user_adress_new = eval_result[0].set_user_adress;
    app.all.set_user_descr_new = eval_result[0].set_user_descr;

    app.all.set_img = eval_result[0].set_img;
    app.all.set_val = eval_result[0].set_val;
    app.all.timestamp = eval_result[0].timestamp;

    vc3d_glob.curr_set = app.all;

    app.all_ge = app.all.ge;

    var goods_or_set_list = app.all.ge;

    switch (vc3d_glob.init_num) {
      case "ao3":
        //if(!vc3d_glob.no_SCENE_PARAMS) { i3d_base.SCENE_PARAMS(); }
        i3d_base.add_only_plane_and_mouse_move(); // тут добавляем интерактив
        //i3d_base.add_only_light_and_shadow();
        break;
    }

    //if(vc3d_glob.add_text == "text") i3d_tween.add_text("Inter 3D");

    vc3d_glob.set_custom_users_id = app.all.set[0].set_custom_users_id; // пользователь не владелец, но он создал копию сцены и моделей

    var obj_length = goods_or_set_list.length;

    var last_obj_in_query = false;
    vc3d_glob.loaded_objects_count = 0;

    for (var i = 0; i < obj_length; i++) {
      if (i === obj_length - 1) {
        last_obj_in_query = true;
      } //значит это последний объект в запросе и после него запускаем аутентификацию через соц.сети и потом перекрашивание объектов в соответствии с сохраненными данными

      var wl_1 = goods_or_set_list[i]; //это данные модели - элемента списка app.all.ge из таблицы sets.  !!! wl_1 - ЭТО ССЫЛКА НА app.all.ge[i] !!!

      i3d_base.add_model_to_scene(i, wl_1); //2019 добавляем модель к сцене
    }
  }

  function_result_123_2021(result) {
    // vc3d_glob.set_custom_users_id = app.all.set[0].set_custom_users_id; // пользователь не владелец, но он создал копию сцены и моделей
    // var obj_length = goods_or_set_list.length;
    // var last_obj_in_query = false;
    // vc3d_glob.loaded_objects_count = 0;
    // for (var i = 0; i < obj_length; i++) {
    //     if (i === obj_length - 1) { last_obj_in_query = true; }; //значит это последний объект в запросе и после него запускаем аутентификацию через соц.сети и потом перекрашивание объектов в соответствии с сохраненными данными
    //     var wl_1 = goods_or_set_list[i]; //это данные модели - элемента списка app.all.ge из таблицы sets.  !!! wl_1 - ЭТО ССЫЛКА НА app.all.ge[i] !!!
    //     i3d_base.add_model_to_scene(i, wl_1); //2019 добавляем модель к сцене
    // }

    i3d_base.add_model_to_scene(1, { mod_type: 2 }); //2019 добавляем модель к сцене
  }

  // "[{"rotx":355,"roty":0,"rotz":0,"x":0,"y":0,"z":0,"allx":"0.00","ally":"0.00","allz":"860.00","scalex":10,"scaley":10,"scalez":10,"move_type":0,"elems":[],"colored":0,"mod_id":"329","mod_unid":"o4bVjzEGtvIxEZUq","obj_path":"upload18/1/models/o4bVjzEGtvIxEZUq/ikrand1.gltf","mtl_path":"data/m.mtl","size_bites":"2654534","mod_img":"","mod_name":"ikran_el007","mod_type":"2","mod_shared":"-1","model_unid_in_ge":"TbIBUDbWwGbD9K9Y","obj_type":"gltf"}]"

  function_result_123_no_socket(result) {
    //console.log("result", result)
    app.all = {};

    //let json_result, local = true;

    //json_result = result;

    //i3d_all.coi(json_result, "json_result =")
    //var eval_result = json_result.json2[0];

    // Если ошибка загрузки данных то выход
    // if (!eval_result || !eval_result[0] || !eval_result[0].set_ge || !eval_result[0].set_set) {
    //     i3d_all.c_sys("Ошибка данных");
    //     document.querySelector('#loader4').style.display = 'none'; //выключим значок загрузки
    //     return;
    // }

    //if(local) { app.all.ge = JSON.parse(eval_result[0].set_ge); }
    //else { app.all.ge = eval_result[0].set_ge; }

    //console.log("11111111111111111==========================");

    // app.all.ge = JSON.parse(`[{"rotx":355,"roty":0,"rotz":0,"x":0,"y":0,"z":0
    // ,"allx":"0.00","ally":"0.00","allz":"860.00","scalex":10,"scaley":10,"scalez":10
    // ,"move_type":0,"elems":[],"colored":0,"mod_id":"329","mod_unid":"o4bVjzEGtvIxEZUq"
    // ,"obj_path":"upload18/1/models/o4bVjzEGtvIxEZUq/ikrand1.gltf","mtl_path":"data/m.mtl"
    // ,"size_bites":"2654534","mod_img":"","mod_name":"ikran_el007","mod_type":"2","mod_shared":"-1"
    // ,"model_unid_in_ge":"TbIBUDbWwGbD9K9Y","obj_type":"gltf"}]`);

    app.all.ge = JSON.parse(`[{}]`);

    //console.log("app.all.ge", app.all.ge)

    // if(local) { app.all.set = JSON.parse(eval_result[0].set_set); }
    // else { app.all.set = eval_result[0].set_set; }

    // app.all.set = JSON.parse(`[{\"set_camera_x\":12.248474651627772,\"set_camera_y\":2273.5634364554544,\"set_camera_z\":389.6514792498004,\"pan_speed\":\"0\",\"zoom_speed\":\"1\",\"rotate_speed\":\"1\",\"movexz\":\"0\",\"fon_setClearColor\":\"#fff\",\"controls_type\":\"2\",\"controls_target_x\":\"0\",\"controls_target_y\":\"0\",\"controls_target_z\":\"0\",\"controls_maxDistance\":\"20000\",\"controls_minDistance\":\"20\",\"shadow\":\"0\",\"controls_maxPolarAngle\":\"2\",\"ambient_color\":\"#ffffff\",\"set_custom_users_id\":\"0\",\"light1_type\":\"1\",\"light1_x\":0,\"light1_y\":3000,\"light1_z\":0,\"light1_color\":\"#ffffff\",\"client_ref\":\"\",\"iterations\":[{\"name\":\"RDyGdUKQU0ownD9z\",\"txt\":\"Рег.динамики\",\"counter\":0,\"min\":-9,\"max\":9,\"targets\":[{\"target_num\":0,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_01\",\"mat\":-1,\"mode_num\":0,\"reg_iter_txt\":\"\",\"type\":\"0\"},{\"target_num\":6,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_01002\",\"mat\":-1,\"mode_num\":0,\"reg_iter_txt\":\"\",\"rules\":[{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"-2\",\"counter_max\":\"-1\",\"mat\":\"1208\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"-4\",\"counter_max\":\"-3\",\"mat\":\"1210\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"-6\",\"counter_max\":\"-5\",\"mat\":\"1212\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"-9\",\"counter_max\":\"-7\",\"mat\":\"1214\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":0,\"counter_max\":0,\"mat\":\"1186\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0}],\"type\":\"11\"},{\"target_num\":5,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_01001\",\"mat\":-1,\"mode_num\":0,\"reg_iter_txt\":\"\",\"rules\":[{\"txt\":\"\",\"counter_val\":0,\"counter_min\":0,\"counter_max\":\"2\",\"mat\":\"1208\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"3\",\"counter_max\":\"4\",\"mat\":\"1210\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"5\",\"counter_max\":\"6\",\"mat\":\"1211\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"7\",\"counter_max\":\"9\",\"mat\":\"1214\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":0,\"counter_max\":0,\"mat\":\"1186\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0}],\"type\":\"11\"}],\"notes\":[],\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"plus_minus_name\":\"simvol15\",\"target_num\":-1,\"plus_minus\":50},{\"name\":\"oBDnAwsUbDDxya0T\",\"txt\":\"Рег. проволоки (m.min)\",\"counter\":110,\"min\":19,\"max\":150,\"targets\":[{\"target_num\":14,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_08\",\"mat\":-1,\"mode_num\":0,\"reg_iter_txt\":\"\",\"type\":\"0\"},{\"target_num\":25,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_07\",\"mat\":-1,\"mode_num\":0,\"reg_iter_txt\":\"\",\"type\":\"1\"},{\"target_num\":26,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_06\",\"mat\":-1,\"mode_num\":0,\"reg_iter_txt\":\"\",\"type\":\"2\"},{\"target_num\":48,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol1\",\"mat\":-1,\"mode_num\":0,\"reg_iter_txt\":\"\",\"rules\":[{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"0\",\"counter_max\":\"8\",\"mat\":\"1174\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"9\",\"counter_max\":\"16\",\"mat\":\"1175\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"17\",\"counter_max\":\"24\",\"mat\":\"1176\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"25\",\"counter_max\":\"32\",\"mat\":\"1177\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"33\",\"counter_max\":\"40\",\"mat\":\"1178\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"41\",\"counter_max\":\"48\",\"mat\":\"1179\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"49\",\"counter_max\":\"56\",\"mat\":\"1180\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"57\",\"counter_max\":\"64\",\"mat\":\"1181\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"65\",\"counter_max\":\"73\",\"mat\":\"1182\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"74\",\"counter_max\":\"82\",\"mat\":\"1183\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"83\",\"counter_max\":\"91\",\"mat\":\"1184\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"92\",\"counter_max\":\"100\",\"mat\":\"1185\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0}],\"type\":\"33\"},{\"target_num\":24,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"tavor\",\"mat\":-1,\"mode_num\":0,\"reg_iter_txt\":\"\",\"rules\":[{\"txt\":\"\",\"counter_val\":0,\"counter_min\":0,\"counter_max\":\"12\",\"mat\":\"1215\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"13\",\"counter_max\":\"24\",\"mat\":\"1216\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"25\",\"counter_max\":\"36\",\"mat\":\"1217\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"37\",\"counter_max\":\"48\",\"mat\":\"1218\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"49\",\"counter_max\":\"61\",\"mat\":\"1219\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"62\",\"counter_max\":\"74\",\"mat\":\"1220\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"75\",\"counter_max\":\"87\",\"mat\":\"1221\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"88\",\"counter_max\":\"100\",\"mat\":\"1222\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0}],\"type\":\"33\"},{\"target_num\":-1,\"model_unid_in_ge\":\"\",\"target\":\"\",\"mat\":-1,\"mode_num\":0,\"reg_iter_txt\":\"Рег.толщина тавра\",\"reg_iter_name\":\"mmjhgYlCyaHSDit3\",\"rules\":[{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"19\",\"counter_max\":\"150\",\"mat\":-1,\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0}],\"type\":\"44\"},{\"target_num\":-1,\"model_unid_in_ge\":\"\",\"target\":\"\",\"mat\":-1,\"mode_num\":0,\"reg_iter_txt\":\"Рег.напряжения\",\"type\":\"22\",\"reg_iter_name\":\"z1K7PRAHYHF4REfI\",\"rules\":[{\"txt\":\"\",\"counter_val\":\"48\",\"counter_min\":0,\"counter_max\":\"500\",\"mat\":-1,\"mode_num\":0,\"type\":0,\"range_min\":\"-40\",\"range_max\":\"40\"}]}],\"notes\":[],\"plus_minus_name\":\"\",\"target_num\":-1},{\"name\":\"isWbYkpAmRrcpuoO\",\"txt\":\"Рег. проволоки (Amper)\",\"counter\":102,\"min\":19,\"max\":120,\"targets\":[{\"target_num\":14,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_08\",\"mat\":-1,\"mode_num\":0,\"reg_iter_txt\":\"\",\"type\":\"0\"},{\"target_num\":25,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_07\",\"mat\":-1,\"mode_num\":0,\"reg_iter_txt\":\"\",\"type\":\"1\"},{\"target_num\":26,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_06\",\"mat\":-1,\"mode_num\":0,\"reg_iter_txt\":\"\",\"type\":\"2\"},{\"target_num\":48,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol1\",\"mat\":-1,\"mode_num\":0,\"reg_iter_txt\":\"\",\"type\":\"33\",\"rules\":[{\"txt\":\"\",\"counter_val\":0,\"counter_min\":0,\"counter_max\":\"8\",\"mat\":\"1174\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"9\",\"counter_max\":\"16\",\"mat\":\"1175\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"17\",\"counter_max\":\"24\",\"mat\":\"1176\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"25\",\"counter_max\":\"32\",\"mat\":\"1177\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"33\",\"counter_max\":\"40\",\"mat\":\"1178\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"41\",\"counter_max\":\"48\",\"mat\":\"1179\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"49\",\"counter_max\":\"56\",\"mat\":\"1180\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"57\",\"counter_max\":\"64\",\"mat\":\"1181\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"65\",\"counter_max\":\"73\",\"mat\":\"1182\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"74\",\"counter_max\":\"82\",\"mat\":\"1183\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"83\",\"counter_max\":\"91\",\"mat\":\"1184\"
    // ,\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"92\"
    // ,\"counter_max\":\"100\",\"mat\":\"1185\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0}]}
    // ,{\"target_num\":24,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"tavor\",\"mat\":-1,\"mode_num\":0
    // ,\"reg_iter_txt\":\"\",\"type\":\"33\",\"rules\":[{\"txt\":\"\",\"counter_val\":0,\"counter_min\":0
    // ,\"counter_max\":\"12\",\"mat\":\"1215\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0}
    // ,{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"13\",\"counter_max\":\"24\",\"mat\":\"1216\",\"mode_num\":0
    // ,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"25\"
    // ,\"counter_max\":\"36\",\"mat\":\"1217\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0}
    // ,{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"37\",\"counter_max\":\"48\",\"mat\":\"1218\",\"mode_num\":0
    // ,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"49\"
    // ,\"counter_max\":\"61\",\"mat\":\"1219\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0}
    // ,{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"62\",\"counter_max\":\"74\",\"mat\":\"1220\"
    // ,\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"75\",\"counter_max\":\"87\",\"mat\":\"1221\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"88\",\"counter_max\":\"100\",\"mat\":\"1222\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0}]},{\"target_num\":-1,\"model_unid_in_ge\":\"\",\"target\":\"\",\"mat\":-1,\"mode_num\":0,\"reg_iter_txt\":\"Рег.толщина тавра 2\",\"type\":\"44\",\"reg_iter_name\":\"HQ1oUDIxLXtjSWhD\",\"rules\":[{\"txt\":\"\",\"counter_val\":0,\"counter_min\":0,\"counter_max\":\"120\",\"mat\":-1,\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0}]},{\"target_num\":-1,\"model_unid_in_ge\":\"\",\"target\":\"\",\"mat\":-1,\"mode_num\":0,\"reg_iter_txt\":\"Рег.напряжения\",\"type\":\"22\",\"reg_iter_name\":\"z1K7PRAHYHF4REfI\",\"rules\":[{\"txt\":\"\",\"counter_val\":\"78\",\"counter_min\":0,\"counter_max\":\"500\",\"mat\":-1,\"mode_num\":0,\"type\":0,\"range_min\":\"-40\",\"range_max\":\"40\"}]}],\"notes\":[],\"model_unid_in_ge\":\"\",\"plus_minus_name\":\"\"},{\"name\":\"z1K7PRAHYHF4REfI\",\"txt\":\"Рег.напряжения\",\"counter\":158,\"min\":118,\"max\":198,\"targets\":[{\"target_num\":2,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_011\",\"mat\":-1,\"mode_num\":0,\"reg_iter_txt\":\"\",\"type\":\"0\"},{\"target_num\":30,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_10\",\"mat\":-1,\"mode_num\":0,\"reg_iter_txt\":\"\",\"type\":\"1\"},{\"target_num\":32,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_09\",\"mat\":-1,\"mode_num\":0,\"reg_iter_txt\":\"\",\"type\":\"2\"},{\"target_num\":47,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol1001\",\"mat\":-1,\"mode_num\":0,\"reg_iter_txt\":\"\",\"type\":\"33\",\"rules\":[{\"txt\":\"\",\"counter_val\":0,\"counter_min\":0,\"counter_max\":\"8\",\"mat\":\"1174\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"9\",\"counter_max\":\"16\",\"mat\":\"1175\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"17\",\"counter_max\":\"24\",\"mat\":\"1176\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"25\",\"counter_max\":\"32\",\"mat\":\"1177\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"33\",\"counter_max\":\"40\",\"mat\":\"1178\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"41\",\"counter_max\":\"48\",\"mat\":\"1179\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"49\",\"counter_max\":\"56\",\"mat\":\"1180\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"57\",\"counter_max\":\"64\",\"mat\":\"1181\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"65\",\"counter_max\":\"73\",\"mat\":\"1182\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"74\",\"counter_max\":\"82\",\"mat\":\"1183\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"83\",\"counter_max\":\"91\",\"mat\":\"1184\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"92\",\"counter_max\":\"100\",\"mat\":\"1185\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0}]},{\"target_num\":51,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"Plane\",\"mat\":-1,\"mode_num\":0,\"reg_iter_txt\":\"\",\"type\":\"33\",\"rules\":[{\"txt\":\"\",\"counter_val\":0,\"counter_min\":0,\"counter_max\":\"33\",\"mat\":\"1189\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"34\",\"counter_max\":\"66\",\"mat\":\"1187\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"67\",\"counter_max\":\"100\",\"mat\":\"1188\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0}]}],\"notes\":[],\"model_unid_in_ge\":\"\",\"plus_minus_name\":\"\"},{\"name\":\"mmjhgYlCyaHSDit3\",\"txt\":\"Рег.толщина тавра\",\"counter\":22,\"min\":5,\"max\":30,\"targets\":[{\"target_num\":31,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_03\",\"mat\":-1,\"mode_num\":0,\"reg_iter_txt\":\"\",\"type\":\"0\"},{\"target_num\":1,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_02\",\"mat\":-1,\"mode_num\":0,\"reg_iter_txt\":\"\",\"type\":\"1\"}],\"notes\":[],\"plus_minus_name\":\"\",\"target_num\":-1},{\"name\":\"HQ1oUDIxLXtjSWhD\",\"txt\":\"Рег.толщина тавра 2\",\"counter\":26,\"min\":5,\"max\":30,\"targets\":[{\"target_num\":31,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_03\",\"mat\":-1,\"mode_num\":0,\"reg_iter_txt\":\"\",\"type\":\"0\"},{\"target_num\":1,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_02\",\"mat\":-1,\"mode_num\":0,\"reg_iter_txt\":\"\",\"type\":\"1\"}],\"notes\":[],\"model_unid_in_ge\":\"\",\"plus_minus_name\":\"\"},{\"name\":\"sPW00cLSBxXaYg1v\",\"txt\":\"Pause Time\",\"counter\":1,\"min\":1,\"max\":99,\"targets\":[{\"target_num\":2,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_011\",\"mat\":-1,\"mode_num\":0,\"reg_iter_txt\":\"\",\"type\":\"0\"},{\"target_num\":30,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_10\",\"mat\":-1,\"mode_num\":0,\"reg_iter_txt\":\"\",\"type\":\"1\"}],\"notes\":[],\"model_unid_in_ge\":\"\",\"plus_minus_name\":\"\"},{\"name\":\"NJNST9xCW26umZND\",\"txt\":\"Spot Time\",\"counter\":1,\"min\":1,\"max\":30,\"targets\":[{\"target_num\":2,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_011\",\"mat\":-1,\"mode_num\":0,\"reg_iter_txt\":\"\",\"type\":\"0\"},{\"target_num\":30,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_10\",\"mat\":-1,\"mode_num\":0,\"reg_iter_txt\":\"\",\"type\":\"1\"}],\"notes\":[],\"model_unid_in_ge\":\"\",\"plus_minus_name\":\"\"},{\"name\":\"dumcjuEv9IrjG5NS\",\"txt\":\"Рег. пров (m.min) MANUAL\",\"counter\":152,\"min\":10,\"max\":200,\"targets\":[{\"target_num\":14,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_08\",\"mat\":-1,\"mode_num\":0,\"reg_iter_txt\":\"\",\"type\":\"0\"},{\"target_num\":25,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_07\",\"mat\":-1,\"mode_num\":0,\"reg_iter_txt\":\"\",\"type\":\"1\"},{\"target_num\":26,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_06\",\"mat\":-1,\"mode_num\":0,\"reg_iter_txt\":\"\",\"type\":\"2\"},{\"target_num\":48,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol1\",\"mat\":-1,\"mode_num\":0,\"reg_iter_txt\":\"\",\"type\":\"33\",\"rules\":[{\"txt\":\"\",\"counter_val\":0,\"counter_min\":0,\"counter_max\":\"8\",\"mat\":\"1174\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"9\",\"counter_max\":\"16\",\"mat\":\"1175\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"17\",\"counter_max\":\"24\",\"mat\":\"1176\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"25\",\"counter_max\":\"32\",\"mat\":\"1177\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"33\",\"counter_max\":\"40\",\"mat\":\"1178\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"41\",\"counter_max\":\"48\",\"mat\":\"1179\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"49\",\"counter_max\":\"56\",\"mat\":\"1180\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"57\",\"counter_max\":\"64\",\"mat\":\"1181\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"65\",\"counter_max\":\"73\",\"mat\":\"1182\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"74\",\"counter_max\":\"82\",\"mat\":\"1183\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"83\",\"counter_max\":\"91\",\"mat\":\"1184\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"92\",\"counter_max\":\"100\",\"mat\":\"1185\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0}]}],\"notes\":[],\"model_unid_in_ge\":\"\",\"plus_minus_name\":\"\"},{\"name\":\"oZCaG8AUJjYCwKza\",\"txt\":\"Рег. пров (Amper) MANUAL\",\"counter\":\"10\",\"min\":\"10\",\"max\":\"200\",\"targets\":[{\"target_num\":14,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_08\",\"mat\":-1,\"mode_num\":0,\"reg_iter_txt\":\"\",\"type\":\"0\"},{\"target_num\":25,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_07\",\"mat\":-1,\"mode_num\":0,\"reg_iter_txt\":\"\",\"type\":\"1\"},{\"target_num\":26,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_06\",\"mat\":-1,\"mode_num\":0,\"reg_iter_txt\":\"\",\"type\":\"2\"},{\"target_num\":48,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol1\",\"mat\":-1,\"mode_num\":0,\"reg_iter_txt\":\"\",\"type\":\"33\",\"rules\":[{\"txt\":\"\",\"counter_val\":0,\"counter_min\":0,\"counter_max\":\"8\",\"mat\":\"1174\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"9\",\"counter_max\":\"16\",\"mat\":\"1175\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"17\"
    // ,\"counter_max\":\"24\",\"mat\":\"1176\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"25\",\"counter_max\":\"32\",\"mat\":\"1177\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"33\",\"counter_max\":\"40\",\"mat\":\"1178\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"41\",\"counter_max\":\"48\",\"mat\":\"1179\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"49\",\"counter_max\":\"56\",\"mat\":\"1180\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"57\",\"counter_max\":\"64\",\"mat\":\"1181\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"65\",\"counter_max\":\"73\",\"mat\":\"1182\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"74\",\"counter_max\":\"82\",\"mat\":\"1183\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"83\",\"counter_max\":\"91\",\"mat\":\"1184\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"92\",\"counter_max\":\"100\",\"mat\":\"1185\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0}]}],\"notes\":[],\"model_unid_in_ge\":\"\",\"plus_minus_name\":\"\"},{\"name\":\"eB21I8ZcWqZXsDay\",\"txt\":\"Рег.напряжения MANUAL\",\"counter\":279,\"min\":80,\"max\":325,\"targets\":[{\"target_num\":2,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_011\",\"mat\":-1,\"mode_num\":0,\"reg_iter_txt\":\"\",\"type\":\"0\"},{\"target_num\":30,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_10\",\"mat\":-1,\"mode_num\":0,\"reg_iter_txt\":\"\",\"type\":\"1\"},{\"target_num\":32,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_09\",\"mat\":-1,\"mode_num\":0,\"reg_iter_txt\":\"\",\"type\":\"2\"},{\"target_num\":47,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol1001\",\"mat\":-1,\"mode_num\":0,\"reg_iter_txt\":\"\",\"type\":\"33\",\"rules\":[{\"txt\":\"\",\"counter_val\":0,\"counter_min\":0,\"counter_max\":\"8\",\"mat\":\"1174\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"9\",\"counter_max\":\"16\",\"mat\":\"1175\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"17\",\"counter_max\":\"24\",\"mat\":\"1176\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"25\",\"counter_max\":\"32\",\"mat\":\"1177\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"33\",\"counter_max\":\"40\",\"mat\":\"1178\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"41\",\"counter_max\":\"48\",\"mat\":\"1179\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"49\",\"counter_max\":\"56\",\"mat\":\"1180\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"57\",\"counter_max\":\"64\",\"mat\":\"1181\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"65\",\"counter_max\":\"73\",\"mat\":\"1182\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"74\",\"counter_max\":\"82\",\"mat\":\"1183\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"83\",\"counter_max\":\"91\",\"mat\":\"1184\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0},{\"txt\":\"\",\"counter_val\":0,\"counter_min\":\"92\",\"counter_max\":\"100\",\"mat\":\"1185\",\"mode_num\":0,\"type\":0,\"range_min\":0,\"range_max\":0}]}],\"notes\":[],\"model_unid_in_ge\":\"\",\"plus_minus_name\":\"\"},{\"name\":\"eq2uXpRGTsgyaByw\",\"txt\":\"Рег 1 - 4 (Hotspot)\",\"counter\":2,\"min\":1,\"max\":4,\"targets\":[{\"target_num\":14,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_08\",\"mat\":-1,\"mode_num\":0,\"reg_iter_txt\":\"\",\"type\":\"0\"}],\"notes\":[],\"model_unid_in_ge\":\"\",\"plus_minus_name\":\"\"}],\"regular_iter_digits_mats_id\":[\"1153\",\"1154\",\"1155\",\"1156\",\"1157\",\"1158\",\"1159\",\"1160\",\"1161\",\"1162\"],\"regular_iter_digit_plus_minus\":[\"1169\"
    // ,\"1167\"],\"set_dostupno_vsem\":false,\"libs\":[78]}]`);

    app.all.set = JSON.parse(`[{}]`);

    //console.log("app.all.set", app.all.set)

    //, libs: [] // список номеров библиотек для записи в sets[0].libs
    app.editor.libs = []; // app.all.set[0].libs;

    // числовые итерации регуляторов - колёсиков
    if (app.all.set[0].iterations == undefined) {
      app.all.set[0].iterations = [];
    }
    app.editor.regular_iterations = app.all.set[0].iterations;

    // цифры для числовых итераций регуляторов
    if (app.all.set[0].regular_iter_digits_mats_id == undefined) {
      app.all.set[0].regular_iter_digits_mats_id = [
        806, 807, 808, 809, 810, 811, 812, 813, 814, 815,
      ];
    }
    app.editor.regular_iter_digits_mats_id =
      app.all.set[0].regular_iter_digits_mats_id;

    if (app.all.set[0].regular_iter_digits2_mats_id == undefined) {
      app.all.set[0].regular_iter_digits2_mats_id = [
        806, 807, 808, 809, 810, 811, 812, 813, 814, 815,
      ];
    }
    app.editor.regular_iter_digits2_mats_id =
      app.all.set[0].regular_iter_digits2_mats_id;

    // цифры для числовых итераций регуляторов
    if (app.all.set[0].regular_iter_digit_plus_minus == undefined) {
      app.all.set[0].regular_iter_digit_plus_minus = [868, 867];
    }
    app.editor.regular_iter_digit_plus_minus =
      app.all.set[0].regular_iter_digit_plus_minus;

    //!!! ORIGINAL !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // if(local) { app.all.elems = JSON.parse(eval_result[0].set_elems); }
    // else { app.all.elems = eval_result[0].set_elems; }

    // app.all.elems = JSON.parse(`[{\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"child_number\":0,\"libs\":[78],\"name\":\"cifra_01\",\"light\":\"1\",\"mode_num\":0,\"modes\":[{\"iteration\":0,\"sound\":\"\",\"mess\":\"\",\"iters\":[],\"hide\":0}],\"mat_params\":{\"users_id\":\"1\",\"offsetx\":0,\"offsety\":0,\"rotation\":0,\"centerx\":0,\"centery\":0,\"shininess\":\"3\",\"color\":\"#fff\",\"side\":\"0\",\"skinning\":\"0\",\"opacity\":\"0\",\"reflectivity\":\"0\",\"refractionRatio\":\"0\",\"metal\":\"0\",\"visible\":\"1\",\"wireframe\":\"0\",\"specular\":\"#444\",\"name\":\"\",\"price\":\"0\",\"descr\":\"\",\"repx\":\"1\",\"repy\":\"1\",\"libs_id\":\"78\",\"mat_id\":\"1153\",\"mat_razdel\":\"0\",\"mat_name\":\"\",\"mat_libs_id\":\"78\",\"mat_users_id\":\"1\",\"img\":\"upload18/1/mats/matlib_78/cifra0.png\",\"bumpmap\":\"upload18/1/mats/matlib_78/cifra0.png\"}},{\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"child_number\":0,\"libs\":[78],\"name\":\"cifra_02\",\"light\":\"1\",\"mode_num\":0,\"modes\":[{\"iteration\":0,\"sound\":\"\",\"mess\":\"\",\"iters\":[],\"hide\":0}],\"mat_params\":{\"users_id\":\"1\",\"offsetx\":0,\"offsety\":0,\"rotation\":0,\"centerx\":0,\"centery\":0,\"shininess\":\"3\",\"color\":\"#fff\",\"side\":\"0\",\"skinning\":\"0\",\"opacity\":\"0\",\"reflectivity\":\"0\",\"refractionRatio\":\"0\",\"metal\":\"0\",\"visible\":\"1\",\"wireframe\":\"0\",\"specular\":\"#444\",\"name\":\"\",\"price\":\"0\",\"descr\":\"\",\"repx\":\"1\",\"repy\":\"1\",\"libs_id\":\"78\",\"mat_id\":\"1155\",\"mat_razdel\":\"0\",\"mat_name\":\"\",\"mat_libs_id\":\"78\",\"mat_users_id\":\"1\",\"img\":\"upload18/1/mats/matlib_78/cifra2.png\",\"bumpmap\":\"upload18/1/mats/matlib_78/cifra2.png\"}},{\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"child_number\":0,\"libs\":[78],\"name\":\"cifra_011\",\"light\":\"1\",\"mode_num\":0,\"modes\":[{\"iteration\":0,\"sound\":\"\",\"mess\":\"\",\"iters\":[],\"hide\":0}],\"mat_params\":{\"users_id\":\"1\",\"offsetx\":0,\"offsety\":0,\"rotation\":0,\"centerx\":0,\"centery\":0,\"shininess\":\"3\",\"color\":\"#fff\",\"side\":\"0\",\"skinning\":\"0\",\"opacity\":\"0\",\"reflectivity\":\"0\",\"refractionRatio\":\"0\",\"metal\":\"0\",\"visible\":\"1\",\"wireframe\":\"0\",\"specular\":\"#444\",\"name\":\"\",\"price\":\"0\",\"descr\":\"\",\"repx\":\"1\",\"repy\":\"1\",\"libs_id\":\"78\",\"mat_id\":\"1154\",\"mat_razdel\":\"0\",\"mat_name\":\"\",\"mat_libs_id\":\"78\",\"mat_users_id\":\"1\",\"img\":\"upload18/1/mats/matlib_78/cifra1.png\",\"bumpmap\":\"upload18/1/mats/matlib_78/cifra1.png\"}},{\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"child_number\":0,\"libs\":[78],\"name\":\"cifra_05\",\"light\":\"1\",\"mode_num\":0,\"modes\":[{\"iteration\":0,\"sound\":\"\",\"mess\":\"\",\"iters\":[],\"hide\":0}],\"mat_params\":{\"users_id\":\"1\",\"offsetx\":0,\"offsety\":0,\"rotation\":0,\"centerx\":0,\"centery\":0,\"shininess\":\"3\",\"color\":\"#fff\",\"side\":\"0\",\"skinning\":\"0\",\"opacity\":\"0\",\"reflectivity\":\"0\",\"refractionRatio\":\"0\",\"metal\":\"0\",\"visible\":\"1\",\"wireframe\":\"0\",\"specular\":\"#444\",\"name\":\"\",\"price\":\"0\",\"descr\":\"\",\"repx\":\"1\",\"repy\":\"1\",\"libs_id\":\"78\",\"mat_id\":\"1161\",\"mat_razdel\":\"0\",\"mat_name\":\"\",\"mat_libs_id\":\"78\",\"mat_users_id\":\"1\",\"img\":\"upload18/1/mats/matlib_78/cifra8.png\",\"bumpmap\":\"upload18/1/mats/matlib_78/cifra8.png\"}},{\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"child_number\":0,\"libs\":[78],\"name\":\"simvol12\",\"light\":\"1\",\"mode_num\":0,\"modes\":[{\"iteration\":0,\"sound\":\"\",\"mess\":\"\",\"iters\":[],\"hide\":0}],\"mat_params\":{\"users_id\":\"1\",\"offsetx\":0,\"offsety\":0,\"rotation\":0,\"centerx\":0,\"centery\":0,\"shininess\":\"3\",\"color\":\"#fff\",\"side\":\"0\",\"skinning\":\"0\",\"opacity\":\"0\",\"reflectivity\":\"0\",\"refractionRatio\":\"0\",\"metal\":\"0\",\"visible\":\"1\",\"wireframe\":\"0\",\"specular\":\"#444\",\"name\":\"\",\"price\":\"0\",\"descr\":\"\",\"repx\":\"1\",\"repy\":\"1\",\"libs_id\":\"78\",\"mat_id\":\"1186\",\"mat_razdel\":\"0\",\"mat_name\":\"\",\"mat_libs_id\":\"78\",\"mat_users_id\":\"1\",\"img\":\"upload18/1/mats/matlib_78/pusta.png\",\"bumpmap\":\"upload18/1/mats/matlib_78/pusta.png\"}},{\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"child_number\":0,\"libs\":[78],\"name\":\"cifra_01001\",\"light\":\"1\",\"mode_num\":0,\"modes\":[{\"iteration\":0,\"sound\":\"\",\"mess\":\"\",\"iters\":[],\"hide\":0}],\"mat_params\":{\"users_id\":\"1\",\"offsetx\":0,\"offsety\":0,\"rotation\":0,\"centerx\":0,\"centery\":0,\"shininess\":\"3\",\"color\":\"#fff\",\"side\":\"0\",\"skinning\":\"0\",\"opacity\":\"0\",\"reflectivity\":\"0\",\"refractionRatio\":\"0\",\"metal\":\"0\",\"visible\":\"1\",\"wireframe\":\"0\",\"specular\":\"#444\",\"name\":\"\",\"price\":\"0\",\"descr\":\"\",\"repx\":\"1\",\"repy\":\"1\",\"libs_id\":\"78\",\"mat_id\":\"1186\",\"mat_razdel\":\"0\",\"mat_name\":\"\",\"mat_libs_id\":\"78\",\"mat_users_id\":\"1\",\"img\":\"upload18/1/mats/matlib_78/pusta.png\",\"bumpmap\":\"upload18/1/mats/matlib_78/pusta.png\"}},{\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"child_number\":0,\"libs\":[78],\"name\":\"cifra_01002\",\"light\":\"1\",\"mode_num\":0,\"modes\":[{\"iteration\":0,\"sound\":\"\",\"mess\":\"\",\"iters\":[],\"hide\":0}],\"mat_params\":{\"users_id\":\"1\",\"offsetx\":0,\"offsety\":0,\"rotation\":0,\"centerx\":0,\"centery\":0,\"shininess\":\"3\",\"color\":\"#fff\",\"side\":\"0\",\"skinning\":\"0\",\"opacity\":\"0\",\"reflectivity\":\"0\",\"refractionRatio\":\"0\",\"metal\":\"0\",\"visible\":\"1\",\"wireframe\":\"0\",\"specular\":\"#444\",\"name\":\"\",\"price\":\"0\",\"descr\":\"\",\"repx\":\"1\",\"repy\":\"1\",\"libs_id\":\"78\",\"mat_id\":\"1186\",\"mat_razdel\":\"0\",\"mat_name\":\"\",\"mat_libs_id\":\"78\",\"mat_users_id\":\"1\",\"img\":\"upload18/1/mats/matlib_78/pusta.png\",\"bumpmap\":\"upload18/1/mats/matlib_78/pusta.png\"}},{\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"child_number\":0,\"libs\":[78],\"name\":\"cifra_01003\",\"light\":\"1\",\"mode_num\":0,\"modes\":[{\"iteration\":0,\"sound\":\"\",\"mess\":\"\",\"iters\":[],\"hide\":0}],\"mat_params\":{\"users_id\":\"1\",\"offsetx\":0,\"offsety\":0,\"rotation\":0,\"centerx\":0,\"centery\":0,\"shininess\":\"3\",\"color\":\"#fff\",\"side\":\"0\",\"skinning\":\"0\",\"opacity\":\"0\",\"reflectivity\":\"0\",\"refractionRatio\":\"0\",\"metal\":\"0\",\"visible\":\"1\",\"wireframe\":\"0\",\"specular\":\"#444\",\"name\":\"\",\"price\":\"0\",\"descr\":\"\",\"repx\":\"1\",\"repy\":\"1\",\"libs_id\":\"78\",\"mat_id\":\"1168\",\"mat_razdel\":\"0\",\"mat_name\":\"\",\"mat_libs_id\":\"78\",\"mat_users_id\":\"1\",\"img\":\"upload18/1/mats/matlib_78/mmin.png\",\"bumpmap\":\"upload18/1/mats/matlib_78/mmin.png\"}},{\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"child_number\":0,\"libs\":[78],\"name\":\"cifra_01006\",\"light\":\"1\"},{\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"child_number\":0,\"libs\":[78],\"name\":\"cifra_04\",\"light\":\"1\",\"mode_num\":0,\"modes\":[{\"iteration\":0,\"sound\":\"\",\"mess\":\"\",\"iters\":[],\"hide\":0}],\"mat_params\":{\"users_id\":\"1\",\"offsetx\":0,\"offsety\":0,\"rotation\":0,\"centerx\":0,\"centery\":0,\"shininess\":\"3\",\"color\":\"#fff\",\"side\":\"0\",\"skinning\":\"0\",\"opacity\":\"0\",\"reflectivity\":\"0\",\"refractionRatio\":\"0\",\"metal\":\"0\",\"visible\":\"1\",\"wireframe\":\"0\",\"specular\":\"#444\",\"name\":\"\",\"price\":\"0\",\"descr\":\"\",\"repx\":\"1\",\"repy\":\"1\",\"libs_id\":\"78\",\"mat_id\":\"1153\",\"mat_razdel\":\"0\",\"mat_name\":\"\",\"mat_libs_id\":\"78\",\"mat_users_id\":\"1\",\"img\":\"upload18/1/mats/matlib_78/cifra0.png\",\"bumpmap\":\"upload18/1/mats/matlib_78/cifra0.png\"}},{\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"child_number\":0,\"libs\":[78],\"name\":\"cifra_01007\",\"light\":\"1\",\"mode_num\":0,\"modes\":[{\"iteration\":0,\"sound\":\"\",\"mess\":\"\",\"iters\":[],\"hide\":0}],\"mat_params\":{\"users_id\":\"1\",\"offsetx\":0,\"offsety\":0,\"rotation\":0,\"centerx\":0,\"centery\":0,\"shininess\":\"3\",\"color\":\"#fff\",\"side\":\"0\",\"skinning\":\"0\",\"opacity\":\"0\",\"reflectivity\":\"0\",\"refractionRatio\":\"0\",\"metal\":\"0\",\"visible\":\"1\",\"wireframe\":\"0\",\"specular\":\"#444\",\"name\":\"\",\"price\":\"0\",\"descr\":\"\",\"repx\":\"1\",\"repy\":\"1\",\"libs_id\":\"78\",\"mat_id\":\"1186\",\"mat_razdel\":\"0\",\"mat_name\":\"\",\"mat_libs_id\":\"78\",\"mat_users_id\":\"1\",\"img\":\"upload18/1/mats/matlib_78/pusta.png\",\"bumpmap\":\"upload18/1/mats/matlib_78/pusta.png\"}},{\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"child_number\":0,\"libs\":[78],\"name\":\"cifra_01005\",\"light\":\"1\",\"mode_num\":0,\"modes\":[{\"iteration\":0,\"sound\":\"\",\"mess\":\"\",\"iters\":[],\"hide\":0,\"iteration_1\":0}],\"mat_params\":{\"users_id\":\"1\",\"offsetx\":0,\"offsety\":0,\"rotation\":0,\"centerx\":0,\"centery\":0,\"shininess\":\"3\",\"color\":\"#fff\",\"side\":\"0\",\"skinning\":\"0\",\"opacity\":\"0\",\"reflectivity\":\"0\",\"refractionRatio\":\"0\",\"metal\":\"0\",\"visible\":\"1\",\"wireframe\":\"0\",\"specular\":\"#444\",\"name\":\"\",\"price\":\"0\",\"descr\":\"\",\"repx\":\"1\",\"repy\":\"1\",\"libs_id\":\"78\",\"mat_id\":\"1186\",\"mat_razdel\":\"0\",\"mat_name\":\"\",\"mat_libs_id\":\"78\",\"mat_users_id\":\"1\",\"img\":\"upload18/1/mats/matlib_78/pusta.png\",\"bumpmap\":\"upload18/1/mats/matlib_78/pusta.png\"}},{\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"child_number\":0,\"libs\":[78],\"name\":\"cifra_01004\",\"light\":\"1\",\"mode_num\":0,\"modes\":[{\"iteration\":0,\"sound\":\"\",\"mess\":\"\",\"iters\":[],\"hide\":0,\"iteration_1\":0}],\"mat_params\":{\"users_id\":\"1\",\"offsetx\":0,\"offsety\":0,\"rotation\":0,\"centerx\":0,\"centery\":0,\"shininess\":\"3\",\"color\":\"#fff\",\"side\":\"0\",\"skinning\":\"0\",\"opacity\":\"0\",\"reflectivity\":\"0\",\"refractionRatio\":\"0\",\"metal\":\"0\",\"visible\":\"1\",\"wireframe\":\"0\",\"specular\":\"#444\",\"name\":\"\",\"price\":\"0\",\"descr\":\"\"
    // ,\"repx\":\"1\",\"repy\":\"1\",\"libs_id\":\"78\",\"mat_id\":\"1186\",\"mat_razdel\":\"0\",\"mat_name\":\"\",\"mat_libs_id\":\"78\",\"mat_users_id\":\"1\",\"img\":\"upload18/1/mats/matlib_78/pusta.png\",\"bumpmap\":\"upload18/1/mats/matlib_78/pusta.png\"}},{\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"child_number\":0,\"libs\":[78],\"name\":\"simvol2\",\"light\":\"1\",\"mode_num\":0,\"modes\":[{\"iteration\":0,\"sound\":\"\",\"mess\":\"\",\"iters\":[],\"hide\":0}],\"mat_params\":{\"users_id\":\"1\",\"offsetx\":0,\"offsety\":0,\"rotation\":0,\"centerx\":0,\"centery\":0,\"shininess\":\"3\",\"color\":\"#fff\",\"side\":\"0\",\"skinning\":\"0\",\"opacity\":\"0\",\"reflectivity\":\"0\",\"refractionRatio\":\"0\",\"metal\":\"0\",\"visible\":\"1\",\"wireframe\":\"0\",\"specular\":\"#444\",\"name\":\"\",\"price\":\"0\",\"descr\":\"\",\"repx\":\"1\",\"repy\":\"1\",\"libs_id\":\"78\",\"mat_id\":\"1186\",\"mat_razdel\":\"0\",\"mat_name\":\"\",\"mat_libs_id\":\"78\",\"mat_users_id\":\"1\",\"img\":\"upload18/1/mats/matlib_78/pusta.png\",\"bumpmap\":\"upload18/1/mats/matlib_78/pusta.png\"}},{\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"child_number\":0,\"libs\":[78],\"name\":\"cifra_08\",\"light\":\"1\",\"mode_num\":0,\"modes\":[{\"iteration\":0,\"sound\":\"\",\"mess\":\"\",\"iters\":[],\"hide\":0,\"iteration_1\":0}],\"mat_params\":{\"users_id\":\"1\",\"offsetx\":0,\"offsety\":0,\"rotation\":0,\"centerx\":0,\"centery\":0,\"shininess\":\"3\",\"color\":\"#fff\",\"side\":\"0\",\"skinning\":\"0\",\"opacity\":\"0\",\"reflectivity\":\"0\",\"refractionRatio\":\"0\",\"metal\":\"0\",\"visible\":\"1\",\"wireframe\":\"0\",\"specular\":\"#444\",\"name\":\"\",\"price\":\"0\",\"descr\":\"\",\"repx\":\"1\",\"repy\":\"1\",\"libs_id\":\"78\",\"mat_id\":\"1156\",\"mat_razdel\":\"0\",\"mat_name\":\"\",\"mat_libs_id\":\"78\",\"mat_users_id\":\"1\",\"img\":\"upload18/1/mats/matlib_78/cifra3.png\",\"bumpmap\":\"upload18/1/mats/matlib_78/cifra3.png\"}},{\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"child_number\":0,\"libs\":[78],\"name\":\"simvol5\",\"light\":\"1\",\"mode_num\":0,\"modes\":[{\"iteration\":0,\"sound\":\"\",\"mess\":\"\",\"iters\":[],\"hide\":0}],\"mat_params\":{\"users_id\":\"1\",\"offsetx\":0,\"offsety\":0,\"rotation\":0,\"centerx\":0,\"centery\":0,\"shininess\":\"3\",\"color\":\"#fff\",\"side\":\"0\",\"skinning\":\"0\",\"opacity\":\"0\",\"reflectivity\":\"0\",\"refractionRatio\":\"0\",\"metal\":\"0\",\"visible\":\"1\",\"wireframe\":\"0\",\"specular\":\"#444\",\"name\":\"\",\"price\":\"0\",\"descr\":\"\",\"repx\":\"1\",\"repy\":\"1\",\"libs_id\":\"78\",\"mat_id\":\"1195\",\"mat_razdel\":\"0\",\"mat_name\":\"\",\"mat_libs_id\":\"78\",\"mat_users_id\":\"1\",\"img\":\"upload18/1/mats/matlib_78/simvol5.png\",\"bumpmap\":\"upload18/1/mats/matlib_78/simvol5.png\"}},{\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"child_number\":0,\"libs\":[78],\"name\":\"simvol4\",\"light\":\"1\",\"mode_num\":0,\"modes\":[{\"iteration\":0,\"sound\":\"\",\"mess\":\"\",\"iters\":[],\"hide\":0}],\"mat_params\":{\"users_id\":\"1\",\"offsetx\":0,\"offsety\":0,\"rotation\":0,\"centerx\":0,\"centery\":0,\"shininess\":\"3\",\"color\":\"#fff\",\"side\":\"0\",\"skinning\":\"0\",\"opacity\":\"0\",\"reflectivity\":\"0\",\"refractionRatio\":\"0\",\"metal\":\"0\",\"visible\":\"1\",\"wireframe\":\"0\",\"specular\":\"#444\",\"name\":\"\",\"price\":\"0\",\"descr\":\"\",\"repx\":\"1\",\"repy\":\"1\",\"libs_id\":\"78\",\"mat_id\":\"1193\",\"mat_razdel\":\"0\",\"mat_name\":\"\",\"mat_libs_id\":\"78\",\"mat_users_id\":\"1\",\"img\":\"upload18/1/mats/matlib_78/simvol4.png\",\"bumpmap\":\"upload18/1/mats/matlib_78/simvol4.png\"}},{\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"child_number\":0,\"libs\":[78],\"name\":\"simvol14\",\"light\":\"1\",\"mode_num\":0,\"modes\":[{\"iteration\":0,\"sound\":\"\",\"mess\":\"\",\"iters\":[],\"hide\":0}],\"mat_params\":{\"users_id\":\"1\",\"offsetx\":0,\"offsety\":0,\"rotation\":0,\"centerx\":0,\"centery\":0,\"shininess\":\"3\",\"color\":\"#fff\",\"side\":\"0\",\"skinning\":\"0\",\"opacity\":\"0\",\"reflectivity\":\"0\",\"refractionRatio\":\"0\",\"metal\":\"0\",\"visible\":\"1\",\"wireframe\":\"0\",\"specular\":\"#444\",\"name\":\"\",\"price\":\"0\",\"descr\":\"\",\"repx\":\"1\",\"repy\":\"1\",\"libs_id\":\"78\",\"mat_id\":\"1204\",\"mat_razdel\":\"0\",\"mat_name\":\"\",\"mat_libs_id\":\"78\",\"mat_users_id\":\"1\",\"img\":\"upload18/1/mats/matlib_78/simvol14.png\",\"bumpmap\":\"upload18/1/mats/matlib_78/simvol14.png\"}},{\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"child_number\":0,\"libs\":[78],\"name\":\"simvol7\",\"light\":\"1\",\"mode_num\":0,\"modes\":[{\"iteration\":0,\"sound\":\"\",\"mess\":\"\",\"iters\":[],\"hide\":0}],\"mat_params\":{\"users_id\":\"1\",\"offsetx\":0,\"offsety\":0,\"rotation\":0,\"centerx\":0,\"centery\":0,\"shininess\":\"3\",\"color\":\"#fff\",\"side\":\"0\",\"skinning\":\"0\",\"opacity\":\"0\",\"reflectivity\":\"0\",\"refractionRatio\":\"0\",\"metal\":\"0\",\"visible\":\"1\",\"wireframe\":\"0\",\"specular\":\"#444\",\"name\":\"\",\"price\":\"0\",\"descr\":\"\",\"repx\":\"1\",\"repy\":\"1\",\"libs_id\":\"78\",\"mat_id\":\"1191\",\"mat_razdel\":\"0\",\"mat_name\":\"\",\"mat_libs_id\":\"78\",\"mat_users_id\":\"1\",\"img\":\"upload18/1/mats/matlib_78/simvol2t.png\",\"bumpmap\":\"upload18/1/mats/matlib_78/simvol2t.png\"}},{\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"child_number\":0,\"libs\":[78],\"name\":\"simvol13\",\"light\":\"1\",\"mode_num\":0,\"modes\":[{\"iteration\":0,\"sound\":\"\",\"mess\":\"\",\"iters\":[],\"hide\":0}],\"mat_params\":{\"users_id\":\"1\",\"offsetx\":0,\"offsety\":0,\"rotation\":0,\"centerx\":0,\"centery\":0,\"shininess\":\"3\",\"color\":\"#fff\",\"side\":\"0\",\"skinning\":\"0\",\"opacity\":\"0\",\"reflectivity\":\"0\",\"refractionRatio\":\"0\",\"metal\":\"0\",\"visible\":\"1\",\"wireframe\":\"0\",\"specular\":\"#444\",\"name\":\"\",\"price\":\"0\",\"descr\":\"\",\"repx\":\"1\",\"repy\":\"1\",\"libs_id\":\"78\",\"mat_id\":\"1203\",\"mat_razdel\":\"0\",\"mat_name\":\"\",\"mat_libs_id\":\"78\",\"mat_users_id\":\"1\",\"img\":\"upload18/1/mats/matlib_78/simvol13.png\",\"bumpmap\":\"upload18/1/mats/matlib_78/simvol13.png\"}},{\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"child_number\":0,\"libs\":[78],\"name\":\"simvol9\",\"light\":\"1\",\"mode_num\":0,\"modes\":[{\"iteration\":0,\"sound\":\"\",\"mess\":\"\",\"iters\":[],\"hide\":0}],\"mat_params\":{\"users_id\":\"1\",\"offsetx\":0,\"offsety\":0,\"rotation\":0,\"centerx\":0,\"centery\":0,\"shininess\":\"3\",\"color\":\"#fff\",\"side\":\"0\",\"skinning\":\"0\",\"opacity\":\"0\",\"reflectivity\":\"0\",\"refractionRatio\":\"0\",\"metal\":\"0\",\"visible\":\"1\",\"wireframe\":\"0\",\"specular\":\"#444\",\"name\":\"\",\"price\":\"0\",\"descr\":\"\",\"repx\":\"1\",\"repy\":\"1\",\"libs_id\":\"78\",\"mat_id\":\"1199\",\"mat_razdel\":\"0\",\"mat_name\":\"\",\"mat_libs_id\":\"78\",\"mat_users_id\":\"1\",\"img\":\"upload18/1/mats/matlib_78/simvol9.png\",\"bumpmap\":\"upload18/1/mats/matlib_78/simvol9.png\"}},{\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"child_number\":0,\"libs\":[78],\"name\":\"simvol3\",\"light\":\"1\",\"mode_num\":0,\"modes\":[{\"iteration\":0,\"sound\":\"\",\"mess\":\"\",\"iters\":[],\"hide\":0}],\"mat_params\":{\"users_id\":\"1\",\"offsetx\":0,\"offsety\":0,\"rotation\":0,\"centerx\":0,\"centery\":0,\"shininess\":\"3\",\"color\":\"#fff\",\"side\":\"0\",\"skinning\":\"0\",\"opacity\":\"0\",\"reflectivity\":\"0\",\"refractionRatio\":\"0\",\"metal\":\"0\",\"visible\":\"1\",\"wireframe\":\"0\",\"specular\":\"#444\",\"name\":\"\",\"price\":\"0\",\"descr\":\"\",\"repx\":\"1\",\"repy\":\"1\",\"libs_id\":\"78\",\"mat_id\":\"1192\",\"mat_razdel\":\"0\",\"mat_name\":\"\",\"mat_libs_id\":\"78\",\"mat_users_id\":\"1\",\"img\":\"upload18/1/mats/matlib_78/simvol3nov.png\",\"bumpmap\":\"upload18/1/mats/matlib_78/simvol3nov.png\"}},{\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"child_number\":0,\"libs\":[78],\"name\":\"tochka\",\"light\":\"1\"},{\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"child_number\":0,\"libs\":[78],\"name\":\"simvol8\",\"light\":\"1\",\"mode_num\":0,\"modes\":[{\"iteration\":0,\"sound\":\"\",\"mess\":\"\",\"iters\":[],\"hide\":0,\"iteration_1\":0}],\"mat_params\":{\"users_id\":\"1\",\"offsetx\":0,\"offsety\":0,\"rotation\":0,\"centerx\":0,\"centery\":0,\"shininess\":\"3\",\"color\":\"#fff\",\"side\":\"0\",\"skinning\":\"0\",\"opacity\":\"0\",\"reflectivity\":\"0\",\"refractionRatio\":\"0\",\"metal\":\"0\",\"visible\":\"1\",\"wireframe\":\"0\",\"specular\":\"#444\",\"name\":\"\",\"price\":\"0\",\"descr\":\"\",\"repx\":\"1\",\"repy\":\"1\",\"libs_id\":\"78\",\"mat_id\":\"1165\",\"mat_razdel\":\"0\",\"mat_name\":\"\",\"mat_libs_id\":\"78\",\"mat_users_id\":\"1\",\"img\":\"upload18/1/mats/matlib_78/manual.png\",\"bumpmap\":\"upload18/1/mats/matlib_78/manual.png\"}},{\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"child_number\":0,\"libs\":[78],\"name\":\"tavor\",\"light\":\"1\",\"mode_num\":0,\"modes\":[{\"iteration\":0,\"sound\":\"\",\"mess\":\"\",\"iters\":[],\"hide\":0,\"iteration_1\":0}],\"mat_params\":{\"users_id\":\"1\",\"offsetx\":0,\"offsety\":0,\"rotation\":0,\"centerx\":0,\"centery\":0,\"shininess\":\"3\",\"color\":\"#fff\",\"side\":\"0\",\"skinning\":\"0\",\"opacity\":\"0\",\"reflectivity\":\"0\",\"refractionRatio\":\"0\",\"metal\":\"0\",\"visible\":\"1\",\"wireframe\":\"0\",\"specular\":\"#444\",\"name\":\"\",\"price\":\"0\",\"descr\":\"\",\"repx\":\"1\",\"repy\":\"1\",\"libs_id\":\"78\",\"mat_id\":\"1220\",\"mat_razdel\":\"0\",\"mat_name\":\"\",\"mat_libs_id\":\"78\",\"mat_users_id\":\"1\",\"img\":\"upload18/1/mats/matlib_78/tavor_6.png\",\"bumpmap\":\"upload18/1/mats/matlib_78/tavor_6.png\"}},{\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"child_number\":0,\"libs\":[78],\"name\":\"cifra_07\",\"light\":\"1\",\"mode_num\":0,\"modes\":[{\"iteration\":0,\"sound\":\"\",\"mess\":\"\",\"iters\":[],\"hide\":0,\"iteration_1\":0}],\"mat_params\":{\"users_id\":\"1\",\"offsetx\":0,\"offsety\":0,\"rotation\":0,\"centerx\":0,\"centery\":0
    // ,\"shininess\":\"3\",\"color\":\"#fff\",\"side\":\"0\",\"skinning\":\"0\",\"opacity\":\"0\",\"reflectivity\":\"0\",\"refractionRatio\":\"0\",\"metal\":\"0\",\"visible\":\"1\",\"wireframe\":\"0\",\"specular\":\"#444\",\"name\":\"\",\"price\":\"0\",\"descr\":\"\",\"repx\":\"1\",\"repy\":\"1\",\"libs_id\":\"78\",\"mat_id\":\"1158\",\"mat_razdel\":\"0\",\"mat_name\":\"\",\"mat_libs_id\":\"78\",\"mat_users_id\":\"1\",\"img\":\"upload18/1/mats/matlib_78/cifra5.png\",\"bumpmap\":\"upload18/1/mats/matlib_78/cifra5.png\"}},{\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"child_number\":0,\"libs\":[78],\"name\":\"cifra_06\",\"light\":\"1\",\"mode_num\":0,\"modes\":[{\"iteration\":0,\"sound\":\"\",\"mess\":\"\",\"iters\":[],\"hide\":0,\"iteration_1\":0}],\"mat_params\":{\"users_id\":\"1\",\"offsetx\":0,\"offsety\":0,\"rotation\":0,\"centerx\":0,\"centery\":0,\"shininess\":\"3\",\"color\":\"#fff\",\"side\":\"0\",\"skinning\":\"0\",\"opacity\":\"0\",\"reflectivity\":\"0\",\"refractionRatio\":\"0\",\"metal\":\"0\",\"visible\":\"1\",\"wireframe\":\"0\",\"specular\":\"#444\",\"name\":\"\",\"price\":\"0\",\"descr\":\"\",\"repx\":\"1\",\"repy\":\"1\",\"libs_id\":\"78\",\"mat_id\":\"1154\",\"mat_razdel\":\"0\",\"mat_name\":\"\",\"mat_libs_id\":\"78\",\"mat_users_id\":\"1\",\"img\":\"upload18/1/mats/matlib_78/cifra1.png\",\"bumpmap\":\"upload18/1/mats/matlib_78/cifra1.png\"}},{\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"child_number\":0,\"libs\":[78],\"name\":\"simvol6\",\"light\":\"1\",\"mode_num\":0,\"modes\":[{\"iteration\":0,\"sound\":\"\",\"mess\":\"\",\"iters\":[],\"hide\":0}],\"mat_params\":{\"users_id\":\"1\",\"offsetx\":0,\"offsety\":0,\"rotation\":0,\"centerx\":0,\"centery\":0,\"shininess\":\"3\",\"color\":\"#fff\",\"side\":\"0\",\"skinning\":\"0\",\"opacity\":\"0\",\"reflectivity\":\"0\",\"refractionRatio\":\"0\",\"metal\":\"0\",\"visible\":\"1\",\"wireframe\":\"0\",\"specular\":\"#444\",\"name\":\"\",\"price\":\"0\",\"descr\":\"\",\"repx\":\"1\",\"repy\":\"1\",\"libs_id\":\"78\",\"mat_id\":\"1198\",\"mat_razdel\":\"0\",\"mat_name\":\"\",\"mat_libs_id\":\"78\",\"mat_users_id\":\"1\",\"img\":\"upload18/1/mats/matlib_78/simvol6.png\",\"bumpmap\":\"upload18/1/mats/matlib_78/simvol6.png\"}},{\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"child_number\":0,\"libs\":[78],\"name\":\"simvol11\",\"light\":\"1\",\"mode_num\":0,\"modes\":[{\"iteration\":0,\"sound\":\"\",\"mess\":\"\",\"iters\":[],\"hide\":0}],\"mat_params\":{\"users_id\":\"1\",\"offsetx\":0,\"offsety\":0,\"rotation\":0,\"centerx\":0,\"centery\":0,\"shininess\":\"3\",\"color\":\"#fff\",\"side\":\"0\",\"skinning\":\"0\",\"opacity\":\"0\",\"reflectivity\":\"0\",\"refractionRatio\":\"0\",\"metal\":\"0\",\"visible\":\"1\",\"wireframe\":\"0\",\"specular\":\"#444\",\"name\":\"\",\"price\":\"0\",\"descr\":\"\",\"repx\":\"1\",\"repy\":\"1\",\"libs_id\":\"78\",\"mat_id\":\"1201\",\"mat_razdel\":\"0\",\"mat_name\":\"\",\"mat_libs_id\":\"78\",\"mat_users_id\":\"1\",\"img\":\"upload18/1/mats/matlib_78/simvol11.png\",\"bumpmap\":\"upload18/1/mats/matlib_78/simvol11.png\"}},{\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"child_number\":0,\"libs\":[78],\"name\":\"simvol10\",\"light\":\"1\",\"mode_num\":0,\"modes\":[{\"iteration\":0,\"sound\":\"\",\"mess\":\"\",\"iters\":[],\"hide\":0}],\"mat_params\":{\"users_id\":\"1\",\"offsetx\":0,\"offsety\":0,\"rotation\":0,\"centerx\":0,\"centery\":0,\"shininess\":\"3\",\"color\":\"#fff\",\"side\":\"0\",\"skinning\":\"0\",\"opacity\":\"0\",\"reflectivity\":\"0\",\"refractionRatio\":\"0\",\"metal\":\"0\",\"visible\":\"1\",\"wireframe\":\"0\",\"specular\":\"#444\",\"name\":\"\",\"price\":\"0\",\"descr\":\"\",\"repx\":\"1\",\"repy\":\"1\",\"libs_id\":\"78\",\"mat_id\":\"1200\",\"mat_razdel\":\"0\",\"mat_name\":\"\",\"mat_libs_id\":\"78\",\"mat_users_id\":\"1\",\"img\":\"upload18/1/mats/matlib_78/simvol10.png\",\"bumpmap\":\"upload18/1/mats/matlib_78/simvol10.png\"}},{\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"child_number\":0,\"libs\":[78],\"name\":\"cifra_10\",\"light\":\"1\",\"mode_num\":0,\"modes\":[{\"iteration\":0,\"sound\":\"\",\"mess\":\"\",\"iters\":[],\"hide\":0}],\"mat_params\":{\"users_id\":\"1\",\"offsetx\":0,\"offsety\":0,\"rotation\":0,\"centerx\":0,\"centery\":0,\"shininess\":\"3\",\"color\":\"#fff\",\"side\":\"0\",\"skinning\":\"0\",\"opacity\":\"0\",\"reflectivity\":\"0\",\"refractionRatio\":\"0\",\"metal\":\"0\",\"visible\":\"1\",\"wireframe\":\"0\",\"specular\":\"#444\",\"name\":\"\",\"price\":\"0\",\"descr\":\"\",\"repx\":\"1\",\"repy\":\"1\",\"libs_id\":\"78\",\"mat_id\":\"1153\",\"mat_razdel\":\"0\",\"mat_name\":\"\",\"mat_libs_id\":\"78\",\"mat_users_id\":\"1\",\"img\":\"upload18/1/mats/matlib_78/cifra0.png\",\"bumpmap\":\"upload18/1/mats/matlib_78/cifra0.png\"}},{\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"child_number\":0,\"libs\":[78],\"name\":\"cifra_03\",\"light\":\"1\",\"mode_num\":0,\"modes\":[{\"iteration\":0,\"sound\":\"\",\"mess\":\"\",\"iters\":[],\"hide\":0}],\"mat_params\":{\"users_id\":\"1\",\"offsetx\":0,\"offsety\":0,\"rotation\":0,\"centerx\":0,\"centery\":0,\"shininess\":\"3\",\"color\":\"#fff\",\"side\":\"0\",\"skinning\":\"0\",\"opacity\":\"0\",\"reflectivity\":\"0\",\"refractionRatio\":\"0\",\"metal\":\"0\",\"visible\":\"1\",\"wireframe\":\"0\",\"specular\":\"#444\",\"name\":\"\",\"price\":\"0\",\"descr\":\"\",\"repx\":\"1\",\"repy\":\"1\",\"libs_id\":\"78\",\"mat_id\":\"1155\",\"mat_razdel\":\"0\",\"mat_name\":\"\",\"mat_libs_id\":\"78\",\"mat_users_id\":\"1\",\"img\":\"upload18/1/mats/matlib_78/cifra2.png\",\"bumpmap\":\"upload18/1/mats/matlib_78/cifra2.png\"}},{\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"child_number\":0,\"libs\":[78],\"name\":\"cifra_09\",\"light\":\"1\",\"mode_num\":0,\"modes\":[{\"iteration\":0,\"sound\":\"\",\"mess\":\"\",\"iters\":[],\"hide\":0}],\"mat_params\":{\"users_id\":\"1\",\"offsetx\":0,\"offsety\":0,\"rotation\":0,\"centerx\":0,\"centery\":0,\"shininess\":\"3\",\"color\":\"#fff\",\"side\":\"0\",\"skinning\":\"0\",\"opacity\":\"0\",\"reflectivity\":\"0\",\"refractionRatio\":\"0\",\"metal\":\"0\",\"visible\":\"1\",\"wireframe\":\"0\",\"specular\":\"#444\",\"name\":\"\",\"price\":\"0\",\"descr\":\"\",\"repx\":\"1\",\"repy\":\"1\",\"libs_id\":\"78\",\"mat_id\":\"1153\",\"mat_razdel\":\"0\",\"mat_name\":\"\",\"mat_libs_id\":\"78\",\"mat_users_id\":\"1\",\"img\":\"upload18/1/mats/matlib_78/cifra0.png\",\"bumpmap\":\"upload18/1/mats/matlib_78/cifra0.png\"}},{\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"child_number\":0,\"libs\":[78],\"name\":\"os_ruchki\",\"light\":\"1\"},{\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"child_number\":0,\"libs\":[78],\"name\":\"os_ruchki1\",\"light\":\"1\"},{\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"child_number\":0,\"libs\":[78],\"name\":\"os_ruchki2\",\"light\":\"1\"},{\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"child_number\":0,\"libs\":[],\"name\":\"noda001\",\"name1\":\"Material\",\"mode_num\":0,\"modes\":[{\"iteration\":1,\"sound\":\"../upload18/1/audio/audiolib_1/material2.mp3\",\"mess\":\"Материал\",\"iters\":[{\"targets\":[{\"target_num\":16,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol4\",\"mat\":\"1193\",\"mode_num\":0},{\"target_num\":37,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"noda002\",\"mat\":-1,\"mode_num\":\"1\"},{\"target_num\":39,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"noda009\",\"mat\":-1,\"mode_num\":\"3\"},{\"target_num\":9,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_04\",\"mat\":\"1154\",\"mode_num\":0},{\"target_num\":3,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_05\",\"mat\":\"1153\",\"mode_num\":0},{\"target_num\":15,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol5\",\"mat\":\"1195\",\"mode_num\":0}],\"message\":\"BRAZING\",\"reg_iter_name\":\"\",\"reg_iter_txt\":\"Назв.рег.итер.\",\"plus_minus\":1,\"click_type\":\"0\"},{\"targets\":[{\"target_num\":16,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol4\",\"mat\":\"1225\",\"mode_num\":0},{\"target_num\":37,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"noda002\",\"mat\":-1,\"mode_num\":\"2\"},{\"target_num\":39,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"noda009\",\"mat\":-1,\"mode_num\":\"2\"},{\"target_num\":9,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_04\",\"mat\":\"1154\",\"mode_num\":0},{\"target_num\":3,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_05\",\"mat\":\"1155\",\"mode_num\":0},{\"target_num\":15,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol5\",\"mat\":\"1196\",\"mode_num\":0}],\"message\":\"FCAW\",\"reg_iter_name\":\"\",\"reg_iter_txt\":\"Назв.рег.итер.\",\"plus_minus\":1,\"click_type\":\"0\"},{\"targets\":[{\"target_num\":16,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol4\",\"mat\":\"1166\",\"mode_num\":0},{\"target_num\":37,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"noda002\",\"mat\":-1,\"mode_num\":\"3\"},{\"target_num\":39,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"noda009\",\"mat\":-1,\"mode_num\":\"3\"},{\"target_num\":9,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_04\",\"mat\":\"1154\",\"mode_num\":0},{\"target_num\":3,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_05\",\"mat\":\"1155\",\"mode_num\":0},{\"target_num\":15,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol5\",\"mat\":\"1196\",\"mode_num\":0}],\"message\":\"MCAW\",\"reg_iter_name\":\"\",\"reg_iter_txt\":\"Назв.рег.итер.\",\"plus_minus\":1,\"click_type\":\"0\"},{\"targets\":[{\"target_num\":16,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol4\",\"mat\":\"1163\",\"mode_num\":0},{\"target_num\":37,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"noda002\",\"mat\":-1,\"mode_num\":0},{\"target_num\":39,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"noda009\",\"mat\":-1,\"mode_num\":0},{\"target_num\":9,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_04\",\"mat\":\"1153\",\"mode_num\":0},
    // {\"target_num\":3,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_05\",\"mat\":\"1159\",\"mode_num\":0},{\"target_num\":15,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol5\",\"mat\":\"1196\",\"mode_num\":0}],\"message\":\"FE\",\"reg_iter_name\":\"\",\"reg_iter_txt\":\"Назв.рег.итер.\",\"plus_minus\":1,\"click_type\":\"0\"},{\"targets\":[{\"target_num\":54,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"ruchka_pravaya001\",\"mat\":-1,\"mode_num\":\"1\"},{\"target_num\":55,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"ruchka_levaya\",\"mat\":-1,\"mode_num\":\"1\"},{\"target_num\":7,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_01003\",\"mat\":\"1151\",\"mode_num\":0},{\"target_num\":49,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol00\",\"mat\":\"1226\",\"mode_num\":0}],\"message\":\"Скор.Под.Проволоки (Ампер)\",\"reg_iter_name\":\"\",\"reg_iter_txt\":\"Назв.рег.итер.\",\"plus_minus\":1,\"click_type\":\"1\"},{\"targets\":[{\"target_num\":54,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"ruchka_pravaya001\",\"mat\":-1,\"mode_num\":0},{\"target_num\":55,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"ruchka_levaya\",\"mat\":-1,\"mode_num\":0},{\"target_num\":7,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_01003\",\"mat\":\"1168\",\"mode_num\":0},{\"target_num\":49,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol00\",\"mat\":\"1190\",\"mode_num\":0}],\"message\":\"Скор.Под.Проволоки (Метры в минуту)\",\"reg_iter_name\":\"\",\"reg_iter_txt\":\"Назв.рег.итер.\",\"plus_minus\":1,\"click_type\":\"1\"}],\"hide\":0,\"sound_name\":\"material2\",\"iteration_1\":0}]},{\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"child_number\":0,\"libs\":[],\"name\":\"noda002\",\"name1\":\"Wire\",\"mode_num\":\"1\",\"modes\":[{\"iteration\":0,\"sound\":\"../upload18/1/audio/audiolib_1/wire2.mp3\",\"mess\":\"Толщина проволоки (FE)\",\"iters\":[{\"targets\":[{\"target_num\":9,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_04\",\"mat\":\"1153\",\"mode_num\":0},{\"target_num\":3,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_05\",\"mat\":\"1161\",\"mode_num\":0},{\"target_num\":39,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"noda009\",\"mat\":-1,\"mode_num\":\"1\"},{\"target_num\":15,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol5\",\"mat\":\"1196\",\"mode_num\":0}],\"message\":\"0.8\",\"reg_iter_name\":\"\",\"reg_iter_txt\":\"Назв.рег.итер.\",\"plus_minus\":1},{\"targets\":[{\"target_num\":9,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_04\",\"mat\":\"1153\",\"mode_num\":0},{\"target_num\":3,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_05\",\"mat\":\"1162\",\"mode_num\":0},{\"target_num\":39,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"noda009\",\"mat\":-1,\"mode_num\":\"1\"},{\"target_num\":15,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol5\",\"mat\":\"1196\",\"mode_num\":0}],\"message\":\"0.9\",\"reg_iter_name\":\"\",\"reg_iter_txt\":\"Назв.рег.итер.\",\"plus_minus\":1},{\"targets\":[{\"target_num\":9,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_04\",\"mat\":\"1154\",\"mode_num\":0},{\"target_num\":3,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_05\",\"mat\":\"1153\",\"mode_num\":0},{\"target_num\":39,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"noda009\",\"mat\":-1,\"mode_num\":\"1\"},{\"target_num\":15,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol5\",\"mat\":\"1196\",\"mode_num\":0}],\"message\":\"1.0\",\"reg_iter_name\":\"\",\"reg_iter_txt\":\"Назв.рег.итер.\",\"plus_minus\":1},{\"targets\":[{\"target_num\":9,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_04\",\"mat\":\"1154\",\"mode_num\":0},{\"target_num\":3,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_05\",\"mat\":\"1155\",\"mode_num\":0},{\"target_num\":39,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"noda009\",\"mat\":-1,\"mode_num\":\"2\"},{\"target_num\":15,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol5\",\"mat\":\"1197\",\"mode_num\":0}],\"message\":\"1.2\",\"reg_iter_name\":\"\",\"reg_iter_txt\":\"Назв.рег.итер.\",\"plus_minus\":1},{\"targets\":[{\"target_num\":9,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_04\",\"mat\":\"1153\",\"mode_num\":0},{\"target_num\":3,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_05\",\"mat\":\"1159\",\"mode_num\":0},{\"target_num\":39,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"noda009\",\"mat\":-1,\"mode_num\":0},{\"target_num\":15,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol5\",\"mat\":\"1196\",\"mode_num\":0}],\"message\":\"0.6\",\"reg_iter_name\":\"\",\"reg_iter_txt\":\"Назв.рег.итер.\",\"plus_minus\":1}],\"hide\":0,\"iteration_1\":0,\"sound_name\":\"wire2\"},{\"iteration\":0,\"sound\":\"../upload18/1/audio/audiolib_1/wire2.mp3\",\"mess\":\"Толщина проволоки (BRAZING)\",\"iters\":[{\"targets\":[{\"target_num\":9,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_04\",\"mat\":\"1154\",\"mode_num\":0},{\"target_num\":3,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_05\",\"mat\":\"1153\",\"mode_num\":0}],\"message\":\"1.0\",\"reg_iter_name\":\"\",\"reg_iter_txt\":\"Назв.рег.итер.\",\"plus_minus\":1},{\"targets\":[{\"target_num\":9,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_04\",\"mat\":\"1153\",\"mode_num\":0},{\"target_num\":3,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_05\",\"mat\":\"1161\",\"mode_num\":0}],\"message\":\"0.8\",\"reg_iter_name\":\"\",\"reg_iter_txt\":\"Назв.рег.итер.\",\"plus_minus\":1}],\"hide\":0,\"sound_name\":\"wire2\",\"iteration_1\":0},{\"iteration\":0,\"sound\":\"../upload18/1/audio/audiolib_1/wire2.mp3\",\"mess\":\"Толщина проволоки (FCAW)\",\"iters\":[{\"targets\":[{\"target_num\":9,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_04\",\"mat\":\"1154\",\"mode_num\":0},{\"target_num\":3,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_05\",\"mat\":\"1155\",\"mode_num\":0},{\"target_num\":15,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol5\",\"mat\":\"1196\",\"mode_num\":0}],\"message\":\"1.2\",\"reg_iter_name\":\"\",\"reg_iter_txt\":\"Назв.рег.итер.\",\"plus_minus\":1}],\"hide\":0,\"iteration_1\":0,\"sound_name\":\"wire2\"},{\"iteration\":0,\"sound\":\"../upload18/1/audio/audiolib_1/wire2.mp3\",\"mess\":\"Толщина проволоки (MCAW)\",\"iters\":[],\"hide\":0,\"iteration_1\":0,\"sound_name\":\"wire2\"}]},{\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"child_number\":0,\"libs\":[],\"name\":\"noda008\",\"name1\":\"Memory 1\",\"mode_num\":0,\"modes\":[{\"iteration\":0,\"sound\":\"../upload18/1/audio/audiolib_1/memory2.mp3\",\"mess\":\"\",\"iters\":[],\"hide\":0,\"iteration_1\":0,\"sound_name\":\"memory2\"}]},{\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"child_number\":0,\"libs\":[],\"name\":\"noda009\",\"name1\":\"Gas\",\"mode_num\":\"3\",\"modes\":[{\"iteration\":0,\"sound\":\"../upload18/1/audio/audiolib_1/gaz2.mp3\",\"mess\":\"Газ (FE 0.6)\",\"iters\":[{\"targets\":[{\"target_num\":15,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol5\",\"mat\":\"1196\",\"mode_num\":0}],\"message\":\"AR CO2\",\"reg_iter_name\":\"\",\"reg_iter_txt\":\"Назв.рег.итер.\",\"plus_minus\":1}],\"hide\":0,\"iteration_1\":0,\"sound_name\":\"gaz2\"},{\"iteration\":1,\"sound\":\"../upload18/1/audio/audiolib_1/gaz2.mp3\",\"mess\":\"Газ (FE 0.8, 0.9, 1.0; FCAW/MCAW 1.2 )\",\"iters\":[{\"targets\":[{\"target_num\":15,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol5\",\"mat\":\"1196\",\"mode_num\":0}],\"message\":\"AR CO2\",\"reg_iter_name\":\"\",\"reg_iter_txt\":\"Назв.рег.итер.\",\"plus_minus\":1},{\"targets\":[{\"target_num\":15,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol5\",\"mat\":\"1197\",\"mode_num\":0}],\"message\":\"CO2\",\"reg_iter_name\":\"\",\"reg_iter_txt\":\"Назв.рег.итер.\",\"plus_minus\":1}],\"hide\":0,\"sound_name\":\"gaz2\"},{\"iteration\":0,\"sound\":\"../upload18/1/audio/audiolib_1/gaz2.mp3\",\"mess\":\"Газ (FE 1.2)\",\"iters\":[{\"targets\":[{\"target_num\":15,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol5\",\"mat\":\"1197\",\"mode_num\":0}],\"message\":\"CO2\",\"reg_iter_name\":\"\",\"reg_iter_txt\":\"Назв.рег.итер.\",\"plus_minus\":1},{\"targets\":[{\"target_num\":15,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol5\",\"mat\":\"1196\",\"mode_num\":0}],\"message\":\"AR CO2\",\"reg_iter_name\":\"\",\"reg_iter_txt\":\"Назв.рег.итер.\",\"plus_minus\":1}],\"hide\":0,\"sound_name\":\"gaz2\"},{\"iteration\":0,\"sound\":\"../upload18/1/audio/audiolib_1/gaz2.mp3\",\"mess\":\"Газ (BRAZING 0.8, 1.0)\",\"iters\":[{\"targets\":[{\"target_num\":15,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol5\",\"mat\":\"1195\",\"mode_num\":0}],\"message\":\"AR\",\"reg_iter_name\":\"\",\"reg_iter_txt\":\"Назв.рег.итер.\",\"plus_minus\":1}],\"hide\":0,\"iteration_1\":0,\"sound_name\":\"gaz2\"}]},{\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"child_number\":0,\"libs\":[],\"name\":\"noda010\",\"name1\":\"Mode\",\"mode_num\":0,\"modes\":[{\"iteration\":1,\"sound\":\"../upload18/1/audio/audiolib_1/hotspot2.mp3\",\"mess\":\"\",\"iters\":[{\"targets\":[{\"target_num\":23,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol8\",\"mat\":\"1165\",\"mode_num\":0},{\"target_num\":16,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol4\",\"mat\":-1,\"mode_num\":0,\"hide\":\"1\"},{\"target_num\":9,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_04\",\"mat\":-1,\"mode_num\":0,\"hide\":\"1\"},{\"target_num\":3,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_05\",\"mat\":-1,\"mode_num\":0,\"hide\":\"1\"},{\"target_num\":27,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol6\",\"mat\":-1,\"mode_num\":0,\"hide\":\"1\"},{\"target_num\":13
    // ,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol2\",\"mat\":\"1186\",\"mode_num\":0,\"hide\":\"0\"},{\"target_num\":24,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"tavor\",\"mat\":-1,\"mode_num\":0,\"hide\":\"1\"},{\"target_num\":51,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"Plane\",\"mat\":-1,\"mode_num\":0,\"hide\":\"1\"},{\"target_num\":21,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol3\",\"mat\":-1,\"mode_num\":0,\"hide\":\"1\"},{\"target_num\":1,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_02\",\"mat\":-1,\"mode_num\":0,\"hide\":\"1\"},{\"target_num\":31,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_03\",\"mat\":-1,\"mode_num\":0,\"hide\":\"1\"},{\"target_num\":12,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_01004\",\"mat\":-1,\"mode_num\":0,\"hide\":\"1\"},{\"target_num\":11,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_01005\",\"mat\":-1,\"mode_num\":0,\"hide\":\"1\"},{\"target_num\":57,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"ruchka_levaya2\",\"mat\":-1,\"mode_num\":\"3\",\"hide\":\"0\"},{\"target_num\":53,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"ruchka_pravaya2\",\"mat\":-1,\"mode_num\":\"3\"},{\"target_num\":55,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"ruchka_levaya\",\"mat\":-1,\"mode_num\":\"2\"},{\"target_num\":54,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"ruchka_pravaya001\",\"mat\":-1,\"mode_num\":\"2\"},{\"target_num\":6,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_01002\",\"mat\":-1,\"mode_num\":0,\"hide\":\"0\"},{\"target_num\":50,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol15\",\"mat\":-1,\"mode_num\":0,\"hide\":\"0\"},{\"target_num\":0,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_01\",\"mat\":-1,\"mode_num\":0,\"hide\":\"0\"},{\"target_num\":5,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_01001\",\"mat\":-1,\"mode_num\":0,\"hide\":\"0\"},{\"target_num\":26,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_06\",\"mat\":-1,\"mode_num\":0,\"hide\":\"0\"},{\"target_num\":25,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_07\",\"mat\":-1,\"mode_num\":0,\"hide\":\"0\"},{\"target_num\":32,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_09\",\"mat\":-1,\"mode_num\":0,\"hide\":\"0\"},{\"target_num\":30,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_10\",\"mat\":-1,\"mode_num\":0,\"hide\":\"0\"},{\"target_num\":2,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_011\",\"mat\":-1,\"mode_num\":0,\"hide\":\"0\"},{\"target_num\":19,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol13\",\"mat\":-1,\"mode_num\":0,\"hide\":\"0\"},{\"target_num\":48,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol1\",\"mat\":-1,\"mode_num\":0,\"hide\":\"0\"},{\"target_num\":20,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol9\",\"mat\":-1,\"mode_num\":0,\"hide\":\"0\"},{\"target_num\":47,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol1001\",\"mat\":-1,\"mode_num\":0,\"hide\":\"0\"},{\"target_num\":7,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_01003\",\"mat\":-1,\"mode_num\":0,\"hide\":\"0\"},{\"target_num\":59,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_01009\",\"mat\":-1,\"mode_num\":0,\"hide\":\"1\"},{\"target_num\":14,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_08\",\"mat\":-1,\"mode_num\":0,\"hide\":\"0\"}],\"message\":\"MANUAL\",\"reg_iter_name\":\"\",\"reg_iter_txt\":\"Назв.рег.итер.\",\"plus_minus\":1,\"click_type\":0},{\"targets\":[{\"target_num\":23,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol8\",\"mat\":\"1152\",\"mode_num\":0},{\"target_num\":16,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol4\",\"mat\":-1,\"mode_num\":0,\"hide\":\"0\"},{\"target_num\":24,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"tavor\",\"mat\":-1,\"mode_num\":0,\"hide\":\"0\"},{\"target_num\":51,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"Plane\",\"mat\":-1,\"mode_num\":0,\"hide\":\"0\"},{\"target_num\":21,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol3\",\"mat\":-1,\"mode_num\":0,\"hide\":\"0\"},{\"target_num\":1,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_02\",\"mat\":-1,\"mode_num\":0,\"hide\":\"0\"},{\"target_num\":31,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_03\",\"mat\":-1,\"mode_num\":0,\"hide\":\"0\"},{\"target_num\":9,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_04\",\"mat\":-1,\"mode_num\":0,\"hide\":\"0\"},{\"target_num\":3,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_05\",\"mat\":-1,\"mode_num\":0,\"hide\":\"0\"},{\"target_num\":15,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol5\",\"mat\":-1,\"mode_num\":0,\"hide\":\"0\"},{\"target_num\":27,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol6\",\"mat\":-1,\"mode_num\":0,\"hide\":\"0\"},{\"target_num\":13,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol2\",\"mat\":\"1173\",\"mode_num\":0,\"hide\":\"0\"},{\"target_num\":55,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"ruchka_levaya\",\"mat\":-1,\"mode_num\":0},{\"target_num\":54,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"ruchka_pravaya001\",\"mat\":-1,\"mode_num\":0},{\"target_num\":57,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"ruchka_levaya2\",\"mat\":-1,\"mode_num\":0},{\"target_num\":53,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"ruchka_pravaya2\",\"mat\":-1,\"mode_num\":0},{\"target_num\":6,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_01002\",\"mat\":-1,\"mode_num\":0,\"hide\":\"0\"},{\"target_num\":50,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol15\",\"mat\":-1,\"mode_num\":0,\"hide\":\"0\"},{\"target_num\":0,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_01\",\"mat\":-1,\"mode_num\":0,\"hide\":\"0\"},{\"target_num\":5,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_01001\",\"mat\":-1,\"mode_num\":0,\"hide\":\"0\"},{\"target_num\":48,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol1\",\"mat\":-1,\"mode_num\":0,\"hide\":\"0\"},{\"target_num\":26,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_06\",\"mat\":-1,\"mode_num\":0,\"hide\":\"0\"},{\"target_num\":25,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_07\",\"mat\":-1,\"mode_num\":0,\"hide\":\"0\"},{\"target_num\":32,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_09\",\"mat\":-1,\"mode_num\":0,\"hide\":\"0\"},{\"target_num\":47,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol1001\",\"mat\":-1,\"mode_num\":0,\"hide\":\"0\"},{\"target_num\":30,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_10\",\"mat\":-1,\"mode_num\":0,\"hide\":\"0\"},{\"target_num\":2,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_011\",\"mat\":-1,\"mode_num\":0,\"hide\":\"0\"},{\"target_num\":19,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol13\",\"mat\":-1,\"mode_num\":0,\"hide\":\"0\"},{\"target_num\":20,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol9\",\"mat\":-1,\"mode_num\":0,\"hide\":\"0\"},{\"target_num\":7,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_01003\",\"mat\":-1,\"mode_num\":0,\"hide\":\"0\"},{\"target_num\":12,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_01004\",\"mat\":-1,\"mode_num\":0,\"hide\":\"0\"},{\"target_num\":11,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_01005\",\"mat\":-1,\"mode_num\":0,\"hide\":\"0\"},{\"target_num\":59,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_01009\",\"mat\":-1,\"mode_num\":0,\"hide\":\"1\"},{\"target_num\":14,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_08\",\"mat\":-1,\"mode_num\":0,\"hide\":\"0\"}],\"message\":\"AUTOMATIC\",\"reg_iter_name\":\"\",\"reg_iter_txt\":\"Назв.рег.итер.\",\"plus_minus\":1,\"click_type\":0},{\"targets\":[{\"target_num\":23,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol8\",\"mat\":\"1164\",\"mode_num\":0},{\"target_num\":54,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"ruchka_pravaya001\",\"mat\":-1,\"mode_num\":\"4\"},{\"target_num\":55,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"ruchka_levaya\",\"mat\":-1,\"mode_num\":\"4\"},{\"target_num\":16,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol4\",\"mat\":-1,\"mode_num\":0,\"hide\":\"1\"},{\"target_num\":9,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_04\",\"mat\":-1,\"mode_num\":0,\"hide\":\"1\"},{\"target_num\":3,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_05\",\"mat\":-1,\"mode_num\":0,\"hide\":\"1\"},{\"target_num\":15,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol5\",\"mat\":-1,\"mode_num\":0,\"hide\":\"1\"},{\"target_num\":27,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol6\",\"mat\":-1,\"mode_num\":0,\"hide\":\"1\"},{\"target_num\":13,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol2\",\"mat\":-1,\"mode_num\":0,\"hide\":\"1\"},{\"target_num\":24,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"tavor\",\"mat\":-1,\"mode_num\":0,\"hide\":\"1\"},{\"target_num\":21,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol3\",\"mat\":-1,\"mode_num\":0,\"hide\":\"1\"},{\"target_num\":51,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"Plane\",\"mat\":-1,\"mode_num\":0,\"hide\":\"1\"},{\"target_num\":1,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_02\",\"mat\":-1,\"mode_num\":0,\"hide\":\"1\"},{\"target_num\":31,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_03\",\"mat\":-1,\"mode_num\":0,\"hide\":\"1\"},{\"target_num\":6,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_01002\",\"mat\":-1,\"mode_num\":0,\"hide\":\"1\"},
    // {\"target_num\":50,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol15\",\"mat\":-1,\"mode_num\":0,\"hide\":\"1\"},{\"target_num\":0,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_01\",\"mat\":-1,\"mode_num\":0,\"hide\":\"1\"},{\"target_num\":5,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_01001\",\"mat\":-1,\"mode_num\":0,\"hide\":\"1\"},{\"target_num\":48,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol1\",\"mat\":-1,\"mode_num\":0,\"hide\":\"1\"},{\"target_num\":7,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_01003\",\"mat\":-1,\"mode_num\":0,\"hide\":\"1\"},{\"target_num\":26,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_06\",\"mat\":-1,\"mode_num\":0,\"hide\":\"1\"},{\"target_num\":25,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_07\",\"mat\":-1,\"mode_num\":0,\"hide\":\"1\"},{\"target_num\":32,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_09\",\"mat\":-1,\"mode_num\":0,\"hide\":\"1\"},{\"target_num\":30,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_10\",\"mat\":-1,\"mode_num\":0,\"hide\":\"1\"},{\"target_num\":2,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_011\",\"mat\":-1,\"mode_num\":0,\"hide\":\"1\"},{\"target_num\":19,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol13\",\"mat\":-1,\"mode_num\":0,\"hide\":\"1\"},{\"target_num\":47,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol1001\",\"mat\":-1,\"mode_num\":0,\"hide\":\"1\"},{\"target_num\":20,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol9\",\"mat\":-1,\"mode_num\":0,\"hide\":\"1\"},{\"target_num\":14,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_08\",\"mat\":\"1156\",\"mode_num\":0},{\"target_num\":59,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_01009\",\"mat\":-1,\"mode_num\":0,\"hide\":\"1\"},{\"target_num\":59,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_01009\",\"mat\":-1,\"mode_num\":0,\"hide\":\"0\"}],\"message\":\"HOTSPOT\",\"reg_iter_name\":\"\",\"reg_iter_txt\":\"Назв.рег.итер.\",\"plus_minus\":1,\"click_type\":\"1\"}],\"hide\":0,\"iteration_1\":0,\"sound_name\":\"hotspot2\"}]},{\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"child_number\":0,\"libs\":[],\"name\":\"noda011\",\"name1\":\"Crater Fill\",\"mode_num\":0,\"modes\":[{\"iteration\":0,\"sound\":\"../upload18/1/audio/audiolib_1/crater2.mp3\",\"mess\":\"\",\"iters\":[{\"targets\":[{\"target_num\":27,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol6\",\"mat\":\"1186\",\"mode_num\":0}],\"message\":\"\",\"reg_iter_name\":\"\",\"reg_iter_txt\":\"Назв.рег.итер.\",\"plus_minus\":1,\"click_type\":0},{\"targets\":[{\"target_num\":27,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol6\",\"mat\":\"1198\",\"mode_num\":0}],\"message\":\"\",\"reg_iter_name\":\"\",\"reg_iter_txt\":\"Назв.рег.итер.\",\"plus_minus\":1,\"click_type\":0}],\"hide\":0,\"iteration_1\":0,\"sound_name\":\"crater2\"}]},{\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"child_number\":0,\"libs\":[],\"name\":\"noda012\",\"name1\":\"Spot / Cycle\",\"mode_num\":0,\"modes\":[{\"iteration\":0,\"sound\":\"../upload18/1/audio/audiolib_1/spot.mp3\",\"mess\":\"\",\"iters\":[{\"targets\":[{\"target_num\":13,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol2\",\"mat\":\"1173\",\"mode_num\":0},{\"target_num\":12,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_01004\",\"mat\":\"1205\",\"mode_num\":0},{\"target_num\":4,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol12\",\"mat\":\"1202\",\"mode_num\":0},{\"target_num\":16,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol4\",\"mat\":-1,\"mode_num\":0,\"hide\":\"1\"},{\"target_num\":9,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_04\",\"mat\":-1,\"mode_num\":0,\"hide\":\"1\"},{\"target_num\":3,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_05\",\"mat\":-1,\"mode_num\":0,\"hide\":\"1\"},{\"target_num\":15,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol5\",\"mat\":-1,\"mode_num\":0,\"hide\":\"1\"},{\"target_num\":27,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol6\",\"mat\":-1,\"mode_num\":0,\"hide\":\"1\"},{\"target_num\":18,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol7\",\"mat\":-1,\"mode_num\":0,\"hide\":\"1\"},{\"target_num\":24,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"tavor\",\"mat\":-1,\"mode_num\":0,\"hide\":\"1\"},{\"target_num\":51,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"Plane\",\"mat\":-1,\"mode_num\":0,\"hide\":\"1\"},{\"target_num\":1,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_02\",\"mat\":-1,\"mode_num\":0,\"hide\":\"1\"},{\"target_num\":31,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_03\",\"mat\":-1,\"mode_num\":0,\"hide\":\"1\"},{\"target_num\":21,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol3\",\"mat\":-1,\"mode_num\":0,\"hide\":\"1\"},{\"target_num\":6,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_01002\",\"mat\":-1,\"mode_num\":0,\"hide\":\"1\"},{\"target_num\":50,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol15\",\"mat\":-1,\"mode_num\":0,\"hide\":\"1\"},{\"target_num\":0,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_01\",\"mat\":-1,\"mode_num\":0,\"hide\":\"1\"},{\"target_num\":5,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_01001\",\"mat\":-1,\"mode_num\":0,\"hide\":\"1\"},{\"target_num\":48,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol1\",\"mat\":-1,\"mode_num\":0,\"hide\":\"1\"},{\"target_num\":7,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_01003\",\"mat\":-1,\"mode_num\":0,\"hide\":\"1\"},{\"target_num\":26,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_06\",\"mat\":-1,\"mode_num\":0,\"hide\":\"1\"},{\"target_num\":25,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_07\",\"mat\":-1,\"mode_num\":0,\"hide\":\"1\"},{\"target_num\":14,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_08\",\"mat\":-1,\"mode_num\":0,\"hide\":\"1\"},{\"target_num\":47,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol1001\",\"mat\":-1,\"mode_num\":0,\"hide\":\"1\"},{\"target_num\":19,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol13\",\"mat\":-1,\"mode_num\":0,\"hide\":\"1\"},{\"target_num\":29,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol10\",\"mat\":-1,\"mode_num\":0,\"hide\":\"1\"},{\"target_num\":17,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol14\",\"mat\":-1,\"mode_num\":0,\"hide\":\"1\"},{\"target_num\":28,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol11\",\"mat\":-1,\"mode_num\":0,\"hide\":\"1\"},{\"target_num\":11,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_01005\",\"mat\":-1,\"mode_num\":0,\"hide\":\"1\"},{\"target_num\":53,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"ruchka_pravaya2\",\"mat\":-1,\"mode_num\":\"1\"},{\"target_num\":57,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"ruchka_levaya2\",\"mat\":-1,\"mode_num\":\"1\"},{\"target_num\":32,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_09\",\"mat\":\"1186\",\"mode_num\":0},{\"target_num\":30,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_10\",\"mat\":\"1153\",\"mode_num\":0},{\"target_num\":2,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_011\",\"mat\":\"1154\",\"mode_num\":0},{\"target_num\":59,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_01009\",\"mat\":-1,\"mode_num\":0,\"hide\":\"1\"}],\"message\":\"Pause Time\",\"reg_iter_name\":\"\",\"reg_iter_txt\":\"Назв.рег.итер.\",\"plus_minus\":1,\"click_type\":0},{\"targets\":[{\"target_num\":12,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_01004\",\"mat\":\"1186\",\"mode_num\":0},{\"target_num\":11,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_01005\",\"mat\":\"1206\",\"mode_num\":0},{\"target_num\":53,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"ruchka_pravaya2\",\"mat\":-1,\"mode_num\":\"2\"},{\"target_num\":57,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"ruchka_levaya2\",\"mat\":-1,\"mode_num\":\"2\"},{\"target_num\":13,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol2\",\"mat\":\"1170\",\"mode_num\":0},{\"target_num\":30,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_10\",\"mat\":\"1153\",\"mode_num\":0},{\"target_num\":2,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_011\",\"mat\":\"1154\",\"mode_num\":0},{\"target_num\":59,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_01009\",\"mat\":-1,\"mode_num\":0,\"hide\":\"1\"}],\"message\":\"Spot Time\",\"reg_iter_name\":\"\",\"reg_iter_txt\":\"Назв.рег.итер.\",\"plus_minus\":1,\"click_type\":0},{\"targets\":[{\"target_num\":12,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_01004\",\"mat\":\"1186\",\"mode_num\":0},{\"target_num\":11,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_01005\",\"mat\":\"1186\",\"mode_num\":0},{\"target_num\":4,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol12\",\"mat\":\"1186\",\"mode_num\":0},{\"target_num\":16,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol4\",\"mat\":-1,\"mode_num\":0,\"hide\":\"0\"},{\"target_num\":9,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_04\",\"mat\":-1,\"mode_num\":0,\"hide\":\"0\"},{\"target_num\":3,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_05\",\"mat\":-1,\"mode_num\":0,\"hide\":\"0\"},{\"target_num\":15,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol5\",\"mat\":-1,\"mode_num\":0,\"hide\":\"0\"},{\"target_num\":27,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol6\",\"mat\":-1,\"mode_num\":0,\"hide\":\"0\"},{\"target_num\":18,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol7\",\"mat\":-1
    // ,\"mode_num\":0,\"hide\":\"0\"},{\"target_num\":24,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"tavor\",\"mat\":-1,\"mode_num\":0,\"hide\":\"0\"},{\"target_num\":51,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"Plane\",\"mat\":-1,\"mode_num\":0,\"hide\":\"0\"},{\"target_num\":21,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol3\",\"mat\":-1,\"mode_num\":0,\"hide\":\"0\"},{\"target_num\":1,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_02\",\"mat\":-1,\"mode_num\":0,\"hide\":\"0\"},{\"target_num\":31,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_03\",\"mat\":-1,\"mode_num\":0,\"hide\":\"0\"},{\"target_num\":50,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol15\",\"mat\":-1,\"mode_num\":0,\"hide\":\"0\"},{\"target_num\":6,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_01002\",\"mat\":-1,\"mode_num\":0,\"hide\":\"0\"},{\"target_num\":0,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_01\",\"mat\":-1,\"mode_num\":0,\"hide\":\"0\"},{\"target_num\":5,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_01001\",\"mat\":-1,\"mode_num\":0,\"hide\":\"0\"},{\"target_num\":48,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol1\",\"mat\":-1,\"mode_num\":0,\"hide\":\"0\"},{\"target_num\":26,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_06\",\"mat\":-1,\"mode_num\":0,\"hide\":\"0\"},{\"target_num\":25,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_07\",\"mat\":-1,\"mode_num\":0,\"hide\":\"0\"},{\"target_num\":14,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_08\",\"mat\":-1,\"mode_num\":0,\"hide\":\"0\"},{\"target_num\":7,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_01003\",\"mat\":-1,\"mode_num\":0,\"hide\":\"0\"},{\"target_num\":47,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol1001\",\"mat\":-1,\"mode_num\":0,\"hide\":\"0\"},{\"target_num\":19,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol13\",\"mat\":-1,\"mode_num\":0,\"hide\":\"0\"},{\"target_num\":28,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol11\",\"mat\":-1,\"mode_num\":0,\"hide\":\"0\"},{\"target_num\":53,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"ruchka_pravaya2\",\"mat\":-1,\"mode_num\":0},{\"target_num\":57,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"ruchka_levaya2\",\"mat\":-1,\"mode_num\":0},{\"target_num\":32,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_09\",\"mat\":\"1153\",\"mode_num\":0},{\"target_num\":59,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"cifra_01009\",\"mat\":-1,\"mode_num\":0,\"hide\":\"1\"}],\"message\":\"\",\"reg_iter_name\":\"\",\"reg_iter_txt\":\"Назв.рег.итер.\",\"plus_minus\":1,\"click_type\":0}],\"hide\":0,\"iteration_1\":0,\"sound_name\":\"spot\"}]},{\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"child_number\":0,\"libs\":[],\"name\":\"noda013\",\"name1\":\"2T / 4T\",\"mode_num\":0,\"modes\":[{\"iteration\":0,\"sound\":\"../upload18/1/audio/audiolib_1/2t4t_2.mp3\",\"mess\":\"\",\"iters\":[{\"targets\":[{\"target_num\":18,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol7\",\"mat\":\"1194\",\"mode_num\":0}],\"message\":\"\",\"reg_iter_name\":\"\",\"reg_iter_txt\":\"Назв.рег.итер.\",\"plus_minus\":1,\"click_type\":0},{\"targets\":[{\"target_num\":18,\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"target\":\"simvol7\",\"mat\":\"1191\",\"mode_num\":0}],\"message\":\"\",\"reg_iter_name\":\"\",\"reg_iter_txt\":\"Назв.рег.итер.\",\"plus_minus\":1,\"click_type\":0}],\"hide\":0,\"iteration_1\":0,\"sound_name\":\"2t4t_2\"}]},{\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"child_number\":0,\"libs\":[],\"name\":\"noda014\",\"name1\":\"Memory 2\",\"mode_num\":0,\"modes\":[{\"iteration\":0,\"sound\":\"../upload18/1/audio/audiolib_1/memory2.mp3\",\"mess\":\"\",\"iters\":[],\"hide\":0,\"iteration_1\":0,\"sound_name\":\"memory2\"}]},{\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"child_number\":0,\"libs\":[],\"name\":\"noda015\",\"name1\":\"Memory 3\",\"mode_num\":0,\"modes\":[{\"iteration\":0,\"sound\":\"../upload18/1/audio/audiolib_1/memory2.mp3\",\"mess\":\"\",\"iters\":[],\"hide\":0,\"iteration_1\":0,\"sound_name\":\"memory2\"}]},{\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"child_number\":0,\"libs\":[],\"name\":\"noda016\",\"name1\":\"Memory 4\",\"mode_num\":0,\"modes\":[{\"iteration\":0,\"sound\":\"../upload18/1/audio/audiolib_1/memory2.mp3\",\"mess\":\"\",\"iters\":[],\"hide\":0,\"iteration_1\":0,\"sound_name\":\"memory2\"}]},{\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"child_number\":0,\"libs\":[78],\"name\":\"simvol1001\",\"light\":\"1\",\"mode_num\":0,\"modes\":[{\"iteration\":0,\"sound\":\"\",\"mess\":\"\",\"iters\":[],\"hide\":0}],\"mat_params\":{\"users_id\":\"1\",\"offsetx\":0,\"offsety\":0,\"rotation\":0,\"centerx\":0,\"centery\":0,\"shininess\":\"3\",\"color\":\"#fff\",\"side\":\"0\",\"skinning\":\"0\",\"opacity\":\"0\",\"reflectivity\":\"0\",\"refractionRatio\":\"0\",\"metal\":\"0\",\"visible\":\"1\",\"wireframe\":\"0\",\"specular\":\"#444\",\"name\":\"\",\"price\":\"0\",\"descr\":\"\",\"repx\":\"1\",\"repy\":\"1\",\"libs_id\":\"78\",\"mat_id\":\"1183\",\"mat_razdel\":\"0\",\"mat_name\":\"\",\"mat_libs_id\":\"78\",\"mat_users_id\":\"1\",\"img\":\"upload18/1/mats/matlib_78/poloska9.png\",\"bumpmap\":\"upload18/1/mats/matlib_78/poloska9.png\"}},{\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"child_number\":0,\"libs\":[78],\"name\":\"simvol1\",\"light\":\"1\",\"mode_num\":0,\"modes\":[{\"iteration\":0,\"sound\":\"\",\"mess\":\"\",\"iters\":[],\"hide\":0}],\"mat_params\":{\"users_id\":\"1\",\"offsetx\":0,\"offsety\":0,\"rotation\":0,\"centerx\":0,\"centery\":0,\"shininess\":\"3\",\"color\":\"#fff\",\"side\":\"0\",\"skinning\":\"0\",\"opacity\":\"0\",\"reflectivity\":\"0\",\"refractionRatio\":\"0\",\"metal\":\"0\",\"visible\":\"1\",\"wireframe\":\"0\",\"specular\":\"#444\",\"name\":\"\",\"price\":\"0\",\"descr\":\"\",\"repx\":\"1\",\"repy\":\"1\",\"libs_id\":\"78\",\"mat_id\":\"1183\",\"mat_razdel\":\"0\",\"mat_name\":\"\",\"mat_libs_id\":\"78\",\"mat_users_id\":\"1\",\"img\":\"upload18/1/mats/matlib_78/poloska9.png\",\"bumpmap\":\"upload18/1/mats/matlib_78/poloska9.png\"}},{\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"child_number\":0,\"libs\":[78],\"name\":\"simvol00\",\"light\":\"1\",\"mode_num\":0,\"modes\":[{\"iteration\":0,\"sound\":\"\",\"mess\":\"\",\"iters\":[],\"hide\":0,\"iteration_1\":0}],\"mat_params\":{\"users_id\":\"1\",\"offsetx\":0,\"offsety\":0,\"rotation\":0,\"centerx\":0,\"centery\":0,\"shininess\":\"3\",\"color\":\"#fff\",\"side\":\"0\",\"skinning\":\"0\",\"opacity\":\"0\",\"reflectivity\":\"0\",\"refractionRatio\":\"0\",\"metal\":\"0\",\"visible\":\"1\",\"wireframe\":\"0\",\"specular\":\"#444\",\"name\":\"\",\"price\":\"0\",\"descr\":\"\",\"repx\":\"1\",\"repy\":\"1\",\"libs_id\":\"78\",\"mat_id\":\"1190\",\"mat_razdel\":\"0\",\"mat_name\":\"\",\"mat_libs_id\":\"78\",\"mat_users_id\":\"1\",\"img\":\"upload18/1/mats/matlib_78/simvol0.png\",\"bumpmap\":\"upload18/1/mats/matlib_78/simvol0.png\"}},{\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"child_number\":0,\"libs\":[78],\"name\":\"simvol15\",\"light\":\"1\",\"mode_num\":0,\"modes\":[{\"iteration\":0,\"sound\":\"\",\"mess\":\"\",\"iters\":[],\"hide\":0}],\"mat_params\":{\"users_id\":\"1\",\"offsetx\":0,\"offsety\":0,\"rotation\":0,\"centerx\":0,\"centery\":0,\"shininess\":\"3\",\"color\":\"#fff\",\"side\":\"0\",\"skinning\":\"0\",\"opacity\":\"0\",\"reflectivity\":\"0\",\"refractionRatio\":\"0\",\"metal\":\"0\",\"visible\":\"1\",\"wireframe\":\"0\",\"specular\":\"#444\",\"name\":\"\",\"price\":\"0\",\"descr\":\"\",\"repx\":\"1\",\"repy\":\"1\",\"libs_id\":\"78\",\"mat_id\":\"1169\",\"mat_razdel\":\"0\",\"mat_name\":\"\",\"mat_libs_id\":\"78\",\"mat_users_id\":\"1\",\"img\":\"upload18/1/mats/matlib_78/plus.png\",\"bumpmap\":\"upload18/1/mats/matlib_78/plus.png\"}},{\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"child_number\":0,\"libs\":[78],\"name\":\"Plane\",\"light\":\"1\",\"mode_num\":0,\"modes\":[{\"iteration\":0,\"sound\":\"\",\"mess\":\"\",\"iters\":[],\"hide\":0}],\"mat_params\":{\"users_id\":\"1\",\"offsetx\":0,\"offsety\":0,\"rotation\":0,\"centerx\":0,\"centery\":0,\"shininess\":\"3\",\"color\":\"#fff\",\"side\":\"0\",\"skinning\":\"0\",\"opacity\":\"0\",\"reflectivity\":\"0\",\"refractionRatio\":\"0\",\"metal\":\"0\",\"visible\":\"1\",\"wireframe\":\"0\",\"specular\":\"#444\",\"name\":\"\",\"price\":\"0\",\"descr\":\"\",\"repx\":\"1\",\"repy\":\"1\",\"libs_id\":\"78\",\"mat_id\":\"1187\",\"mat_razdel\":\"0\",\"mat_name\":\"\",\"mat_libs_id\":\"78\",\"mat_users_id\":\"1\",\"img\":\"upload18/1/mats/matlib_78/shov_2.png\",\"bumpmap\":\"upload18/1/mats/matlib_78/shov_2.png\"}},{\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"child_number\":0,\"libs\":[],\"name\":\"ruchka_pravaya1\",\"mode_num\":0,\"sign\":1,\"modes\":[{\"iteration\":0,\"sound\":\"../upload18/1/audio/audiolib_1/circle1_4.mp3\",\"mess\":\"\",\"iters\":[{\"targets\":[],\"message\":\"\",\"reg_iter_name\":\"RDyGdUKQU0ownD9z\",\"reg_iter_txt\":\"Рег.динамики\",\"plus_minus\":1}],\"hide\":0,\"sign\":1,\"iteration_1\":0,\"sound_name\":\"circle1_4\"}]},{\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"child_number\":0,\"libs\":[],\"name\":\"ruchka_pravaya2\",\"mode_num\":\"3\",\"sign\":-1,\"modes\":[{\"iteration\":0,\"sound\":\"../upload18/1/audio/audiolib_1/circle3_3.mp3\",\"mess\":\"\",\"iters\":[{\"targets\":[],\"message\":\"\",\"reg_iter_txt\":\"Рег.напряжения\",\"plus_minus\":\"1\",\"reg_iter_name\":\"z1K7PRAHYHF4REfI\"}],\"hide\":0,\"sound_name\":\"circle3_3\",\"sign\":1,\"iteration_1\":0},{\"iteration\":0,\"sound\":\"../upload18/1/audio/audiolib_1/circle3_3.mp3\",\"mess\":\"\",\"iters\":[{\"targets\":[],\"message\":\"\",\"reg_iter_name\":\"sPW00cLSBxXaYg1v\",\"reg_iter_txt\":\"Pause Time\",\"plus_minus\":1,\"click_type\":0}],\"hide\":0,\"sign\":1,\"iteration_1\":0,\"sound_name\":\"circle3_3\"},{\"iteration\":0
    // ,\"sound\":\"../upload18/1/audio/audiolib_1/circle3_3.mp3\",\"mess\":\"\",\"iters\":[{\"targets\":[],\"message\":\"\",\"reg_iter_name\":\"NJNST9xCW26umZND\",\"reg_iter_txt\":\"Spot Time\",\"plus_minus\":1,\"click_type\":0}],\"hide\":0,\"sign\":1,\"iteration_1\":0,\"sound_name\":\"circle3_3\"},{\"iteration\":0,\"sound\":\"../upload18/1/audio/audiolib_1/circle3_3.mp3\",\"mess\":\"\",\"iters\":[{\"targets\":[],\"message\":\"\",\"reg_iter_name\":\"eB21I8ZcWqZXsDay\",\"reg_iter_txt\":\"Рег.напряжения MANUAL\",\"plus_minus\":1,\"click_type\":0}],\"hide\":0,\"sign\":1,\"iteration_1\":0,\"sound_name\":\"circle3_3\"}]},{\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"child_number\":0,\"libs\":[],\"name\":\"ruchka_pravaya001\",\"mode_num\":\"2\",\"sign\":1,\"modes\":[{\"iteration\":0,\"sound\":\"../upload18/1/audio/audiolib_1/circle2_2.mp3\",\"mess\":\"\",\"iters\":[{\"targets\":[],\"message\":\"\",\"reg_iter_name\":\"oBDnAwsUbDDxya0T\",\"reg_iter_txt\":\"Рег. проволоки (m.min)\",\"plus_minus\":1}],\"hide\":0,\"sign\":1,\"iteration_1\":0,\"sound_name\":\"circle2_2\"},{\"iteration\":0,\"sound\":\"../upload18/1/audio/audiolib_1/circle2_2.mp3\",\"mess\":\"\",\"iters\":[{\"targets\":[],\"message\":\"\",\"reg_iter_name\":\"isWbYkpAmRrcpuoO\",\"reg_iter_txt\":\"Рег. проволоки (Amper)\",\"plus_minus\":1,\"click_type\":0}],\"hide\":0,\"sign\":1,\"iteration_1\":0,\"sound_name\":\"circle2_2\"},{\"iteration\":0,\"sound\":\"../upload18/1/audio/audiolib_1/circle2_2.mp3\",\"mess\":\"\",\"iters\":[{\"targets\":[],\"message\":\"\",\"reg_iter_name\":\"dumcjuEv9IrjG5NS\",\"reg_iter_txt\":\"Рег. пров (m.min) MANUAL\",\"plus_minus\":1,\"click_type\":0}],\"hide\":0,\"sign\":1,\"iteration_1\":0,\"sound_name\":\"circle2_2\"},{\"iteration\":0,\"sound\":\"../upload18/1/audio/audiolib_1/circle2_2.mp3\",\"mess\":\"\",\"iters\":[{\"targets\":[],\"message\":\"\",\"reg_iter_name\":\"oZCaG8AUJjYCwKza\",\"reg_iter_txt\":\"Рег. пров (Amper) MANUAL\",\"plus_minus\":1,\"click_type\":0}],\"hide\":0,\"sound_name\":\"circle2_2\"},{\"iteration\":0,\"sound\":\"../upload18/1/audio/audiolib_1/circle2_2.mp3\",\"mess\":\"Рег 1 - 4 (Hotspot)\",\"iters\":[{\"targets\":[],\"message\":\"\",\"reg_iter_name\":\"eq2uXpRGTsgyaByw\",\"reg_iter_txt\":\"Рег 1 - 4 (Hotspot)\",\"plus_minus\":1,\"click_type\":0}],\"hide\":0,\"sign\":1,\"sound_name\":\"circle2_2\"}]},{\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"child_number\":0,\"libs\":[],\"name\":\"ruchka_levaya\",\"mode_num\":\"2\",\"sign\":-1,\"modes\":[{\"iteration\":0,\"sound\":\"../upload18/1/audio/audiolib_1/circle2_2.mp3\",\"mess\":\"\",\"iters\":[{\"targets\":[],\"message\":\"\",\"reg_iter_name\":\"oBDnAwsUbDDxya0T\",\"reg_iter_txt\":\"Рег. проволоки (m.min)\",\"plus_minus\":\"-1\"}],\"hide\":0,\"sign\":-1,\"iteration_1\":0,\"sound_name\":\"circle2_2\"},{\"iteration\":0,\"sound\":\"../upload18/1/audio/audiolib_1/circle2_2.mp3\",\"mess\":\"\",\"iters\":[{\"targets\":[],\"message\":\"iter_mess\",\"reg_iter_name\":\"isWbYkpAmRrcpuoO\",\"reg_iter_txt\":\"Рег. проволоки (Amper)\",\"plus_minus\":\"-1\",\"click_type\":0}],\"hide\":0,\"sign\":-1,\"iteration_1\":0,\"sound_name\":\"circle2_2\"},{\"iteration\":0,\"sound\":\"../upload18/1/audio/audiolib_1/circle2_2.mp3\",\"mess\":\"\",\"iters\":[{\"targets\":[],\"message\":\"\",\"reg_iter_name\":\"dumcjuEv9IrjG5NS\",\"reg_iter_txt\":\"Рег. пров (m.min) MANUAL\",\"plus_minus\":\"-1\",\"click_type\":0}],\"hide\":0,\"sign\":-1,\"iteration_1\":0,\"sound_name\":\"circle2_2\"},{\"iteration\":0,\"sound\":\"../upload18/1/audio/audiolib_1/circle2_2.mp3\",\"mess\":\"\",\"iters\":[{\"targets\":[],\"message\":\"\",\"reg_iter_name\":\"oZCaG8AUJjYCwKza\",\"reg_iter_txt\":\"Рег. пров (Amper) MANUAL\",\"plus_minus\":\"-1\",\"click_type\":0}],\"hide\":0,\"sound_name\":\"circle2_2\"},{\"iteration\":0,\"sound\":\"../upload18/1/audio/audiolib_1/circle2_2.mp3\",\"mess\":\"Рег 1 - 4 (Hotspot)\",\"iters\":[{\"targets\":[],\"message\":\"\",\"reg_iter_name\":\"eq2uXpRGTsgyaByw\",\"reg_iter_txt\":\"Рег 1 - 4 (Hotspot)\",\"plus_minus\":\"-1\",\"click_type\":0}],\"hide\":0,\"sign\":-1,\"sound_name\":\"circle2_2\"}]},{\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"child_number\":0,\"libs\":[],\"name\":\"ruchka_levaya1\",\"mode_num\":0,\"sign\":-1,\"modes\":[{\"iteration\":0,\"sound\":\"../upload18/1/audio/audiolib_1/circle1_4.mp3\",\"mess\":\"\",\"iters\":[{\"targets\":[],\"message\":\"\",\"reg_iter_name\":\"RDyGdUKQU0ownD9z\",\"reg_iter_txt\":\"Рег.динамики\",\"plus_minus\":\"-1\"}],\"hide\":0,\"sign\":-1,\"iteration_1\":0,\"sound_name\":\"circle1_4\"}]},{\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"child_number\":0,\"libs\":[],\"name\":\"ruchka_levaya2\",\"mode_num\":\"3\",\"modes\":[{\"iteration\":0,\"sound\":\"../upload18/1/audio/audiolib_1/circle3_3.mp3\",\"mess\":\"\",\"iters\":[{\"targets\":[],\"message\":\"\",\"reg_iter_name\":\"z1K7PRAHYHF4REfI\",\"reg_iter_txt\":\"Рег.напряжения\",\"plus_minus\":\"-1\",\"click_type\":0}],\"hide\":0,\"sign\":-1,\"sound_name\":\"circle3_3\",\"iteration_1\":0},{\"iteration\":0,\"sound\":\"../upload18/1/audio/audiolib_1/circle3_3.mp3\",\"mess\":\"\",\"iters\":[{\"targets\":[],\"message\":\"\",\"reg_iter_name\":\"sPW00cLSBxXaYg1v\",\"reg_iter_txt\":\"Pause Time\",\"plus_minus\":\"-1\",\"click_type\":0}],\"hide\":0,\"sign\":-1,\"iteration_1\":0,\"sound_name\":\"circle3_3\"},{\"iteration\":0,\"sound\":\"../upload18/1/audio/audiolib_1/circle3_3.mp3\",\"mess\":\"\",\"iters\":[{\"targets\":[],\"message\":\"\",\"reg_iter_name\":\"NJNST9xCW26umZND\",\"reg_iter_txt\":\"Spot Time\",\"plus_minus\":\"-1\",\"click_type\":0}],\"hide\":0,\"sign\":-1,\"iteration_1\":0,\"sound_name\":\"circle3_3\"},{\"iteration\":0,\"sound\":\"../upload18/1/audio/audiolib_1/circle3_3.mp3\",\"mess\":\"\",\"iters\":[{\"targets\":[],\"message\":\"\",\"reg_iter_name\":\"eB21I8ZcWqZXsDay\",\"reg_iter_txt\":\"Рег.напряжения MANUAL\",\"plus_minus\":\"-1\",\"click_type\":0}],\"hide\":0,\"sign\":-1,\"iteration_1\":0,\"sound_name\":\"circle3_3\"}]},{\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"child_number\":0,\"libs\":[],\"name\":\"panel\",\"light\":\"1\",\"mode_num\":0,\"modes\":[{\"iteration\":0,\"sound\":\"\",\"mess\":\"\",\"iters\":[],\"hide\":0,\"iteration_1\":0}]},{\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"child_number\":0,\"libs\":[78],\"name\":\"cifra_01009\",\"light\":\"1\",\"mode_num\":0,\"modes\":[{\"iteration\":0,\"sound\":\"\",\"mess\":\"\",\"iters\":[],\"hide\":0,\"iteration_1\":0}],\"mat_params\":{\"users_id\":\"1\",\"offsetx\":0,\"offsety\":0,\"rotation\":0,\"centerx\":0,\"centery\":0,\"shininess\":\"3\",\"color\":\"#fff\",\"side\":\"0\",\"skinning\":\"0\",\"opacity\":\"0\",\"reflectivity\":\"0\",\"refractionRatio\":\"0\",\"metal\":\"0\",\"visible\":\"1\",\"wireframe\":\"0\",\"specular\":\"#444\",\"name\":\"\",\"price\":\"0\",\"descr\":\"\",\"repx\":\"1\",\"repy\":\"1\",\"libs_id\":\"78\",\"mat_id\":\"1230\",\"mat_razdel\":\"0\",\"mat_name\":\"\",\"mat_libs_id\":\"78\",\"mat_users_id\":\"1\",\"img\":\"upload18/1/mats/matlib_78/strannaiahtuka.png\",\"bumpmap\":\"upload18/1/mats/matlib_78/strannaiahtuka.png\"}},{\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"child_number\":0,\"libs\":[78],\"name\":\"cifra_01013\",\"light\":\"1\",\"mode_num\":0,\"modes\":[{\"iteration\":0,\"sound\":\"\",\"mess\":\"\",\"iters\":[],\"hide\":0,\"iteration_1\":0}],\"mat_params\":{\"users_id\":\"1\",\"offsetx\":0,\"offsety\":0,\"rotation\":0,\"centerx\":0,\"centery\":0,\"shininess\":\"3\",\"color\":\"#fff\",\"side\":\"0\",\"skinning\":\"0\",\"opacity\":\"0\",\"reflectivity\":\"0\",\"refractionRatio\":\"0\",\"metal\":\"0\",\"visible\":\"1\",\"wireframe\":\"0\",\"specular\":\"#444\",\"name\":\"\",\"price\":\"0\",\"descr\":\"\",\"repx\":\"1\",\"repy\":\"1\",\"libs_id\":\"78\",\"mat_id\":\"1186\",\"mat_razdel\":\"0\",\"mat_name\":\"\",\"mat_libs_id\":\"78\",\"mat_users_id\":\"1\",\"img\":\"upload18/1/mats/matlib_78/pusta.png\",\"bumpmap\":\"upload18/1/mats/matlib_78/pusta.png\"}},{\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"child_number\":0,\"libs\":[78],\"name\":\"cifra_01012\",\"light\":\"1\",\"mode_num\":0,\"modes\":[{\"iteration\":0,\"sound\":\"\",\"mess\":\"\",\"iters\":[],\"hide\":0,\"iteration_1\":0}],\"mat_params\":{\"users_id\":\"1\",\"offsetx\":0,\"offsety\":0,\"rotation\":0,\"centerx\":0,\"centery\":0,\"shininess\":\"3\",\"color\":\"#fff\",\"side\":\"0\",\"skinning\":\"0\",\"opacity\":\"0\",\"reflectivity\":\"0\",\"refractionRatio\":\"0\",\"metal\":\"0\",\"visible\":\"1\",\"wireframe\":\"0\",\"specular\":\"#444\",\"name\":\"\",\"price\":\"0\",\"descr\":\"\",\"repx\":\"1\",\"repy\":\"1\",\"libs_id\":\"78\",\"mat_id\":\"1186\",\"mat_razdel\":\"0\",\"mat_name\":\"\",\"mat_libs_id\":\"78\",\"mat_users_id\":\"1\",\"img\":\"upload18/1/mats/matlib_78/pusta.png\",\"bumpmap\":\"upload18/1/mats/matlib_78/pusta.png\"}},{\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"child_number\":0,\"libs\":[78],\"name\":\"cifra_01010\",\"light\":\"1\",\"mode_num\":0,\"modes\":[{\"iteration\":0,\"sound\":\"\",\"mess\":\"\",\"iters\":[],\"hide\":0,\"iteration_1\":0}],\"mat_params\":{\"users_id\":\"1\",\"offsetx\":0,\"offsety\":0,\"rotation\":0,\"centerx\":0,\"centery\":0,\"shininess\":\"3\",\"color\":\"#fff\",\"side\":\"0\",\"skinning\":\"0\",\"opacity\":\"0\",\"reflectivity\":\"0\",\"refractionRatio\":\"0\",\"metal\":\"0\",\"visible\":\"1\",\"wireframe\":\"0\",\"specular\":\"#444\",\"name\":\"\",\"price\":\"0\",\"descr\":\"\",\"repx\":\"1\",\"repy\":\"1\",\"libs_id\":\"78\",\"mat_id\":\"1186\",\"mat_razdel\":\"0\",\"mat_name\":\"\",\"mat_libs_id\":\"78\",\"mat_users_id\":\"1\",\"img\":\"upload18/1/mats/matlib_78/pusta.png\",\"bumpmap\":\"upload18/1/mats/matlib_78/pusta.png\"}},{\"model_unid_in_ge\":\"TbIBUDbWwGbD9K9Y\",\"child_number\":0,\"libs\":[78],\"name\":\"cifra_01011\",\"light\":\"1\",\"mode_num\":0,\"modes\":[{\"iteration\":0,\"sound\":\"\",\"mess\":\"\",\"iters\":[],\"hide\":0,\"iteration_1\":0}],\"mat_params\":{\"users_id\":\"1\",\"offsetx\":0,\"offsety\":0,\"rotation\":0,\"centerx\":0,\"centery\":0,\"shininess\":\"3\"
    // ,\"color\":\"#fff\",\"side\":\"0\",\"skinning\":\"0\",\"opacity\":\"0\",\"reflectivity\":\"0\",\"refractionRatio\":\"0\",\"metal\":\"0\",\"visible\":\"1\",\"wireframe\":\"0\",\"specular\":\"#444\",\"name\":\"\",\"price\":\"0\",\"descr\":\"\",\"repx\":\"1\",\"repy\":\"1\",\"libs_id\":\"78\",\"mat_id\":\"1186\",\"mat_razdel\":\"0\",\"mat_name\":\"\",\"mat_libs_id\":\"78\",\"mat_users_id\":\"1\",\"img\":\"upload18/1/mats/matlib_78/pusta.png\"
    // ,\"bumpmap\":\"upload18/1/mats/matlib_78/pusta.png\"}}]`);

    app.all.elems = JSON.parse(`[{}]`);

    //console.log("app.all.elems", app.all.elems)
    //alert("RT!!!!!!!! app.all.elems" + app.all.elems)

    app.all.set_id = 1; //eval_result[0].set_id;
    app.all.set_unid = "k323a_new2_v2"; //eval_result[0].set_unid;
    app.all.set_name = "k323a_new2_v2"; // eval_result[0].set_name;
    app.all.set_owner_unid = "k323a_new2_v2"; //eval_result[0].set_owner_unid;
    app.all.set_users_id = 1; //eval_result[0].set_users_id;
    app.all.set_owner_id = 1; //eval_result[0].set_owner_id;

    app.all.set_user_name = ""; // eval_result[0].set_user_name;
    app.all.set_user_tel = ""; //  eval_result[0].set_user_tel;
    app.all.set_user_email = ""; //  eval_result[0].set_user_email;
    app.all.set_user_adress = ""; //  eval_result[0].set_user_adress;
    app.all.set_user_descr = ""; //  eval_result[0].set_user_descr;

    app.all.set_user_name_new = ""; //  eval_result[0].set_user_name;
    app.all.set_user_tel_new = ""; //  eval_result[0].set_user_tel;
    app.all.set_user_email_new = ""; //  eval_result[0].set_user_email;
    app.all.set_user_adress_new = ""; //  eval_result[0].set_user_adress;
    app.all.set_user_descr_new = ""; //  eval_result[0].set_user_descr;

    app.all.set_img = ""; //  eval_result[0].set_img;
    app.all.set_val = ""; //  eval_result[0].set_val;
    app.all.timestamp = ""; //  eval_result[0].timestamp;

    vc3d_glob.curr_set = app.all;

    app.all_ge = app.all.ge;

    var goods_or_set_list = app.all.ge;

    switch (vc3d_glob.init_num) {
      case "ao3":
        // alert(vc3d_glob.no_SCENE_PARAMS)
        // if(!vc3d_glob.no_SCENE_PARAMS) { i3d_base.SCENE_PARAMS(); }
        // i3d_base.add_only_plane_and_mouse_move(); // тут добавляем интерактив
        // i3d_base.add_only_light_and_shadow();
        break;
    }

    //if(vc3d_glob.add_text == "text") i3d_tween.add_text("Inter 3D");

    vc3d_glob.set_custom_users_id = app.all.set[0].set_custom_users_id; // пользователь не владелец, но он создал копию сцены и моделей

    var obj_length = goods_or_set_list.length;

    var last_obj_in_query = false;
    vc3d_glob.loaded_objects_count = 0;

    for (var i = 0; i < obj_length; i++) {
      if (i === obj_length - 1) {
        last_obj_in_query = true;
      } //значит это последний объект в запросе и после него запускаем аутентификацию через соц.сети и потом перекрашивание объектов в соответствии с сохраненными данными

      var wl_1 = goods_or_set_list[i]; //это данные модели - элемента списка app.all.ge из таблицы sets.  !!! wl_1 - ЭТО ССЫЛКА НА app.all.ge[i] !!!

      i3d_base.add_model_to_scene(i, wl_1); //2019 добавляем модель к сцене
    }
  }
}

export let i3d_base = new i3d_Base();

// f4_base.js
