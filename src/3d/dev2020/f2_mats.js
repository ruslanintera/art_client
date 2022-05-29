import * as THREE from "three";

import { app } from "./f9_appvue.js";
// import {vi3d_app_sets } from "./f3_apparat_sets.js";
import { i3d_all } from "./f7_assist.js";
import { vc3d_glob } from "./f5_vc3d_glob.js";

class Mats {
  // РАСКРАСИМ МОДЕЛИ
  find_obj_and_set_material_elems(
    node,
    model_unid_in_ge,
    child_number,
    name,
    mat_params
  ) {
    //temp_set_mat = true когда временно назначаем синий цвет выделения объекту
    var self = this;
    var found = false;
    vc3d_glob.count++; //c("f ind_obj_and_set_material_elems:      vc3d_glob.count = " + vc3d_glob.count);
    if (node.model_unid_in_ge == model_unid_in_ge) {
      //

      var el_name_or_ch_number_match = false;
      if (vc3d_glob.el_name) {
        el_name_or_ch_number_match = node.name == name;
      } else {
        el_name_or_ch_number_match = node.child_number == child_number;
      }

      if (el_name_or_ch_number_match) {
        if (node.obj_type == "gltf") {
          //self.gltf_set_map(mat_params, node);
          i3d_mats.gltf_set_map(mat_params, node);
        } else {
          //self.gltf_set_map2(mat_params, node);
          i3d_mats.gltf_set_map2(mat_params, node);
        }
        node.mat_params = mat_params; // каждый элемент должен иметь список параметров своего текущего материала
      }
    }
    if (
      (node.type == "Scene" ||
        node.type == "Group" ||
        node.type == "Mesh" ||
        node.type == "Object3D") &&
      node.children
    ) {
      for (var i = 0; i < node.children.length; i++) {
        i3d_mats.find_obj_and_set_material_elems(
          node.children[i],
          model_unid_in_ge,
          child_number,
          name,
          mat_params
        );
      }
    }
  }

  // вытащим и библиотеки и материалы для выбраного элемента
  get_mats_and_clicks(vc3d___curr_obj) {
    if (!vc3d___curr_obj.light_sphere) {
      var libs = [];
      var mat_id = 0,
        mat_img = "",
        mat_name = "",
        mat_price = 0,
        mat_descr = "",
        mat_params = {};
      if (app.all.elems) {
        for (var i = 0; i < app.all.elems.length; i++) {
          if (
            app.all.elems[i].model_unid_in_ge ==
            vc3d___curr_obj.model_unid_in_ge
          ) {
            //

            var el_name_or_ch_number_match = false;
            if (vc3d_glob.el_name) {
              el_name_or_ch_number_match =
                app.all.elems[i].name == vc3d___curr_obj.name;
            } else {
              el_name_or_ch_number_match =
                app.all.elems[i].child_number == vc3d___curr_obj.child_number;
            }

            if (el_name_or_ch_number_match) {
              libs = app.all.elems[i].libs;

              if (app.all.elems[i] && app.all.elems[i].mat_params) {
                mat_id = app.all.elems[i].mat_params.mat_id;
                mat_img = app.all.elems[i].mat_params.img;
                mat_name = app.all.elems[i].mat_params.name;
                mat_price = app.all.elems[i].mat_params.price;
                mat_descr = app.all.elems[i].mat_params.descr;

                mat_params = app.all.elems[i].mat_params;
              }
            }
          }
        }
      }
    }
  }

  function_result_mats(result) {
    //получаем список материалов и заполняем "карусель материалов"

    var goods_elements_materials = eval("(" + result + ")");

    // goods_elements_materials - здесь у нас список материалов и их параметров. НО! Часть параметров записана просто goods_elements_materials[i], а другая часть в goods_elements_materials[i].mat_params
    // приведем все к единому виду, чтобы все параметры были записаны в goods_elements_materials[i]. И тогда mat_params нам совсем не нужен.
    for (var i = 0; i < goods_elements_materials.length; i++) {
      goods_elements_materials[i].mat_params = JSON.parse(
        goods_elements_materials[i].mat_params
      );

      goods_elements_materials[i].mat_params.mat_id =
        goods_elements_materials[i].mat_id;
      goods_elements_materials[i].mat_params.mat_razdel =
        goods_elements_materials[i].mat_razdel;
      goods_elements_materials[i].mat_params.mat_name =
        goods_elements_materials[i].mat_name;
      goods_elements_materials[i].mat_params.mat_libs_id =
        goods_elements_materials[i].mat_libs_id;
      goods_elements_materials[i].mat_params.mat_users_id =
        goods_elements_materials[i].mat_users_id;
      goods_elements_materials[i].mat_params.img =
        goods_elements_materials[i].img;
      goods_elements_materials[i].mat_params.bumpmap =
        goods_elements_materials[i].bumpmap;

      goods_elements_materials[i] = goods_elements_materials[i].mat_params;
    }

    if (vc3d_glob.carousel) {
      i3d_mats.function_result_mats2(goods_elements_materials);
    }

    //razmer_kartinok();
  }

  // заполним материалы в карусель owlCarousel
  function_result_mats2(goods_elements_materials) {
    //получаем список материалов и заполняем "карусель материалов"

    //добавим найденные материалы в vc3d_glob.materials
    for (var i = 0; i < goods_elements_materials.length; i++) {
      var found = false;
      for (var j = 0; j < vc3d_glob.materials.length; j++) {
        if (
          goods_elements_materials[i].mat_id == vc3d_glob.materials[j].mat_id
        ) {
          found = true;
          break;
        }
      }
      if (!found) {
        //заполним map в vc3d_glob.m aterials
        this.gltf_set_map_fill_materials(
          goods_elements_materials[i],
          goods_elements_materials[i]
        ); //if_true_absolute_reference

        vc3d_glob.materials.push(goods_elements_materials[i]);
      }
    }

    app.mats_dwnldbl[vc3d_glob.libs_id] = vc3d_glob.materials; // app.all.mats_dwnldbl - тут будем сохранять списки материалов для выбранных библиотек  vc3d_glob.libs_id

    var sss = "";

    this.mats_total = goods_elements_materials.length - 1;
    this.mats_last = goods_elements_materials.length - 1;

    vc3d_glob.curr_mats = [];

    for (var i = 0; i < goods_elements_materials.length; i++) {
      var name = "" + goods_elements_materials[i].mat_name + "";

      if (vc3d_glob.curr_obj && vc3d_glob.curr_obj.obj_type == "gltf") {
        sss +=
          '<div class="carousel-element"><span class="span_img1"><img class="img1" id="nd_mat_' +
          i +
          '" data-id="nd_mat_' +
          goods_elements_materials[i].mat_id +
          '" onclick="i3d_mats.change_mat_gltf(' +
          goods_elements_materials[i].mat_id +
          ')"' +
          ' src="' +
          app.pics_dir +
          goods_elements_materials[i].img +
          '" alt="' +
          name +
          '" title="' +
          name +
          '"/></span></div>';
      } else {
        sss +=
          '<div class="carousel-element"><span class="span_img1"><img class="img1" id="nd_mat_' +
          i +
          '" data-id="nd_mat_' +
          goods_elements_materials[i].mat_id +
          '" onclick="i3d_mats.change_mat_gltf2(' +
          goods_elements_materials[i].mat_id +
          ')"' +
          ' src="' +
          app.pics_dir +
          goods_elements_materials[i].img +
          '" alt="' +
          name +
          '" title="' +
          name +
          '"/></span></div>';
      }
      /**/
    }
  }

  //это новая раскраска материалами/ она не занимается тем, что постоянно с нуля создает новый материал,
  //а записывает материалы в v c3d.materials[j].m aterial.map и при запросе в базу данных и потом берет оттуда готовый материал
  gltf_set_map_t(
    mat_choosed,
    node,
    if_true_absolute_reference,
    if_false_animate4
  ) {
    //c("g ltf_set_map_t node.name = " + node.name + ", node.mat_params.mat_id = " + node.mat_params.mat_id + ", child_number = " + node.child_number);
    //coi(mat_choosed, "node.child_number = " + node.child_number + ", mat_choosed")
    if (!node || !node.material) {
      return;
    }

    if (
      mat_choosed.material &&
      mat_choosed.material.map &&
      node &&
      node.material
    ) {
      // вот именно тут назначаем материал!
      //if (mat_choosed && mat_choosed.material && mat_choosed.material.map && node && node.material) {    // вот именно тут назначаем материал!

      node.material.map = mat_choosed.material.map;

      //node.material.shininess = shininess;
      node.material.color = mat_choosed.material.color; //new THREE.Color(color);
      //node.material.transparent = true;
      node.material.alphaTest = 0.01;

      node.mat_params = mat_choosed; // каждый элемент должен иметь список параметров своего текущего материала

      //c("node.mat_params.mat_id = " + node.mat_params.mat_id);

      if (!if_false_animate4) {
        if (!vc3d_glob.animate) {
          i3d_all.animate4();
        }
      }
      //========== ДОБАВИМ МАТЕРИАЛ В СПИСОК МАТЕРИАЛОВ ДЛЯ СОХРАНЕНИЯ В ПАЛИТРЕ ===========================================================================
      //this.vc3d_mats_push(mat_id, vc3d_glob.curr_obj);
      this.vc3d_mats_push(mat_choosed.mat_id, node);
      //=====================================================================================
    }
  }

  //заполним map в v c3d.materials
  gltf_set_map_fill_materials(
    mat_choosed,
    materials_j,
    if_true_absolute_reference
  ) {
    vc3d_glob.APImat = {
      offsetX: parseFloat(mat_choosed.offsetx),
      offsetY: parseFloat(mat_choosed.offsety),
      repeatX: parseFloat(mat_choosed.repx),
      repeatY: parseFloat(mat_choosed.repy),
      rotation: parseFloat(mat_choosed.rotation),
      centerX: parseFloat(mat_choosed.centerx),
      centerY: parseFloat(mat_choosed.centery),
    };
    if (if_true_absolute_reference) {
      var map_ref = materials_j.img;
    } else {
      var map_ref = "" + app.pics_dir + materials_j.img;
    }

    var map = this.get_texture1(map_ref, vc3d_glob.APImat);

    var shininess = mat_choosed.shininess; //if (shininess) { mat.shininess = shininess; };
    var color = mat_choosed.color;
    if (color) {
      if (color.charAt(0) !== "#") {
        color = "#" + color;
      }
      mat_choosed.color = color;
    }

    /**/
    if (map && materials_j) {
      // вот именно тут назначаем материал!

      if (!materials_j.material) {
        materials_j.material = {};
      }

      materials_j.material.map = map;
      materials_j.material.color = new THREE.Color(color);
      //materials_j.material.transparent = true;
      materials_j.material.alphaTest = 0.01;

      if (vc3d_glob.mat_envMap === true) {
        materials_j.material.needsUpdate = true;
        materials_j.material.envMap = vc3d_glob.envMap; //side = THREE.DoubleSide   // - нужно назначать при загрузке объекта, так как карта окружения не меняется
        materials_j.material.roughness = 0.5;
        materials_j.material.metalness = 0.6;

        //materials_j.material.transparent = true;
        materials_j.material.alphaTest = 0.01;
      }
    }
  }

  change_mat_gltf(mat_id) {
    if (!vc3d_glob.curr_obj) {
      return;
    }

    var mat_choosed = this.get_mat_choosed(mat_id); // найдем параметры материала с таким id из vc3d_glob.m aterials (список материалов для выбранного элемента)

    this.gltf_set_map(mat_choosed, vc3d_glob.curr_obj);

    //alert(2);
    // ========== ДОБАВИМ МАТЕРИАЛ В СПИСОК МАТЕРИАЛОВ ДЛЯ СОХРАНЕНИЯ В ПАЛИТРЕ ===========================================================================
    this.vc3d_mats_push(mat_id, vc3d_glob.curr_obj);
    // =====================================================================================

    // заполним поля с данными выбранного материала
    if (vc3d_glob.curr_obj) {
      //p_input_curr(vc3d_glob.curr_obj, vc3d_glob.curr_obj_all); // на клиенте
      //if (vc3d_glob.parent) { vc3d_glob.parent.p_input_curr(vc3d_glob.curr_obj, vc3d_glob.curr_obj_all); }; // в админке
    }
  }
  get_mat_choosed(mat_id) {
    //когда мы кликаем на элементе, мы получаем список материалов для него, эти мат-лы с параметрами мы записываем в vc3d_glob.m aterials.ТЕПЕРЬ мы получаем параметры из списка по mat_id
    var mat_choosed;
    for (var i = 0; i < vc3d_glob.materials.length; i++) {
      //vc3d_glob.m aterials -тут храним список материалов для выбранного элемента, соответственно когда выбираем другой элемент или библиотеку этот список перезаписывается
      if (mat_id == vc3d_glob.materials[i].mat_id) {
        mat_choosed = vc3d_glob.materials[i];
        break; // m at_choosed - тут будет список всех параметров материала
      }
    }
    return mat_choosed;
  }

  // не удалять это расширенная версия g ltf_set_map_BIG
  gltf_set_map_BIG(mat_choosed, node, if_true_absolute_reference) {
    if (!node || !node.material) {
      return;
    }

    vc3d_glob.APImat = {
      offsetX: parseFloat(mat_choosed.offsetx),
      offsetY: parseFloat(mat_choosed.offsety),
      repeatX: parseFloat(mat_choosed.repx),
      repeatY: parseFloat(mat_choosed.repy),
      rotation: parseFloat(mat_choosed.rotation),
      centerX: parseFloat(mat_choosed.centerx),
      centerY: parseFloat(mat_choosed.centery),
    };

    if (if_true_absolute_reference) {
      var map_ref = mat_choosed.img;
    } else {
      var map_ref = "" + app.pics_dir + mat_choosed.img;
    }

    var map = this.get_texture1(map_ref, vc3d_glob.APImat);

    var shininess = mat_choosed.shininess; //if (shininess) { mat.shininess = shininess; };
    var color = mat_choosed.color;
    if (color) {
      if (color.charAt(0) !== "#") {
        color = "#" + color;
      }
      mat_choosed.color = color;
    }

    /**/
    if (map && node && node.material) {
      // вот именно тут назначаем материал!

      //texture.wrapS = THREE.RepeatWrapping; texture.repeat.x = - 1;
      //map.wrapS = THREE.RepeatWrapping; map.repeat.x = - 1; map.repeat.y = - 1;

      node.material.map = map;

      node.material.color = new THREE.Color(color);
      node.material.transparent = true;
      node.material.alphaTest = 0.01;

      if (vc3d_glob.mat_envMap === true) {
        //if (true) {
        //c("vc3d_glob.mat_envMap =" + vc3d_glob.mat_envMap);
        node.material.needsUpdate = true;
        node.material.envMap = vc3d_glob.envMap; //side = THREE.DoubleSide   // - нужно назначать при загрузке объекта, так как карта окружения не меняется
        node.material.roughness = 0.5;
        node.material.metalness = 0.6;

        node.material.transparent = true;
        node.material.alphaTest = 0.01;
      }
    }

    node.mat_params = mat_choosed; // каждый элемент должен иметь список параметров своего текущего материала

    if (!vc3d_glob.animate) {
      i3d_all.animate4();
    }
  }

  // меняем материал только если mat_id не совпадает
  gltf_set_map(mat_choosed, node, if_true_absolute_reference) {
    //c("g ltf_set_map")
    var color;
    if (!node || !node.material) {
      return;
    }

    if (node.mat_params) {
      if (mat_choosed.mat_id == node.mat_params.mat_id) {
        //c("совпадают материалы");
        return;
      }
    }

    if (!node.visible) {
      //c("!node.visible !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      return;
    }

    /** */
    vc3d_glob.APImat = {
      offsetX: parseFloat(mat_choosed.offsetx),
      offsetY: parseFloat(mat_choosed.offsety),
      repeatX: parseFloat(mat_choosed.repx),
      repeatY: parseFloat(mat_choosed.repy),
      rotation: parseFloat(mat_choosed.rotation),
      centerX: parseFloat(mat_choosed.centerx),
      centerY: parseFloat(mat_choosed.centery),
    };
    /** */

    if (if_true_absolute_reference) {
      var map_ref = mat_choosed.img;
    } else {
      var map_ref = "" + app.pics_dir + mat_choosed.img;
    }

    var map = this.get_texture1(map_ref, vc3d_glob.APImat);
    //var map = this.get_texture1(map_ref, {});

    //var shininess = mat_choosed.shininess; //if (shininess) { mat.shininess = shininess; };
    color = mat_choosed.color;
    if (color) {
      if (color.charAt(0) !== "#") {
        color = "#" + color;
      }
      mat_choosed.color = color;
    }

    /**/
    if (map && node && node.material) {
      // вот именно тут назначаем материал!

      //texture.wrapS = THREE.RepeatWrapping; texture.repeat.x = - 1;
      //map.wrapS = THREE.RepeatWrapping; map.repeat.x = - 1; map.repeat.y = - 1;

      node.material.map = map;

      /** */
      //node.material.shininess = shininess;
      if (color) node.material.color = new THREE.Color(color);
      //node.material.transparent = true; // ДЕЛАЕТ МАТЕРИАЛ НЕ ТОЛЬКО ПРОЗРАЧНЫМ, НО И ВИДИМЫМ СКВОЗЬ ДРУГИЕ ОБЪЕКТЫ
      node.material.alphaTest = 0.01;

      if (vc3d_glob.mat_envMap === true) {
        node.material.needsUpdate = true;
        node.material.envMap = vc3d_glob.envMap; //side = THREE.DoubleSide   // - нужно назначать при загрузке объекта, так как карта окружения не меняется
        node.material.roughness = 0.5;
        node.material.metalness = 0.6;

        node.material.transparent = true;
        node.material.alphaTest = 0.01;
      }
      /** */
    }

    node.mat_params = mat_choosed; // каждый элемент должен иметь список параметров своего текущего материала

    if (!vc3d_glob.animate) {
      i3d_all.animate4();
    }
  }

  change_mat_gltf2(mat_id) {
    //c("c hange_mat_gltf2");
    if (!vc3d_glob.curr_obj) {
      return;
    }

    var mat_choosed = this.get_mat_choosed(mat_id); // найдем параметры материала с таким id из vc3d_glob.m aterials (список материалов для выбранного элемента)

    this.gltf_set_map2_new(mat_id, mat_choosed, vc3d_glob.curr_obj); // а здесь назначим текстуру элементу после того как произошла полная загрузка текстуры, чтобы знать высоту и ширину текстуры
  }

  // назначим текстуру как обычно
  gltf_set_map2(mat_choosed, node, if_true_absolute_reference) {
    //c("g ltf_set_map2")
    if (!node || !node.material) {
      return;
    }

    vc3d_glob.APImat = {
      offsetX: parseFloat(mat_choosed.offsetx),
      offsetY: parseFloat(mat_choosed.offsety),
      repeatX: parseFloat(mat_choosed.repx),
      repeatY: parseFloat(mat_choosed.repy),
      rotation: parseFloat(mat_choosed.rotation),
      centerX: parseFloat(mat_choosed.centerx),
      centerY: parseFloat(mat_choosed.centery),
    };
    if (if_true_absolute_reference) {
      var map_ref = mat_choosed.img;
    } else {
      var map_ref = app.pics_dir + mat_choosed.img;
    }
    //else { var map_ref = "../../" + mat_choosed.img; }

    var map = this.get_texture1(map_ref, vc3d_glob.APImat);

    /** /
        var shininess = mat_choosed.shininess; //if (shininess) { mat.shininess = shininess; };
        var color = mat_choosed.color;
        if (color) {
            if (color.charAt(0) !== '#') { color = "#" + color; };
            mat_choosed.color = color;
        };
        //c("map_ref = " + map_ref + ", mat_choosed.img = " + mat_choosed.img);
        /**/
    //mat = { color: 0xffffff, map: map, side: THREE.DoubleSide, transparent: true, alphaTest: 0.01 }
    let mat = {
      color: 0xffffff,
      map: map,
      side: THREE.DoubleSide,
      transparent: true,
      alphaTest: 0.01,
    };

    if (vc3d_glob.apparat || vc3d_glob.mat_type === "fashion") {
      var materialPainting = new THREE.MeshBasicMaterial(mat);
      //c("!!!!!!!!!!!!!!!!!!!!!!!!!!!!! THREE.MeshBasicMaterial ")
      //var materialPainting = new THREE.MeshLambertMaterial(mat);
    } else {
      var materialPainting = new THREE.MeshStandardMaterial(mat);
    }

    //vc3d_glob.curr_obj.material = materialPainting; // назначим материал текущему элементу
    //vc3d_glob.curr_obj.mat_params = mat_choosed; // каждый элемент должен иметь список параметров своего текущего материала
    node.material = materialPainting; // назначим материал текущему элементу
    node.mat_params = mat_choosed; // каждый элемент должен иметь список параметров своего текущего материала

    // z - высота, x - ширина
    //node.scale.

    if (vc3d_glob.texture_type === "FF") {
    }

    if (!vc3d_glob.animate) {
      i3d_all.animate4();
    }

    //========== ДОБАВИМ МАТЕРИАЛ В СПИСОК МАТЕРИАЛОВ ДЛЯ СОХРАНЕНИЯ В ПАЛИТРЕ ===========================================================================
    //this.vc3d_mats_push(mat_id, node);
    //=====================================================================================
  }
  // а здесь назначим текстуру элементу после того как произошла полная загрузка текстуры, чтобы знать высоту и ширину текстуры!
  gltf_set_map2_new(mat_id, mat_choosed, node, if_true_absolute_reference) {
    //c("g ltf_set_map2_new");
    if (!node || !node.material) {
      return;
    }

    vc3d_glob.APImat = {
      offsetX: parseFloat(mat_choosed.offsetx),
      offsetY: parseFloat(mat_choosed.offsety),
      repeatX: parseFloat(mat_choosed.repx),
      repeatY: parseFloat(mat_choosed.repy),
      rotation: parseFloat(mat_choosed.rotation),
      centerX: parseFloat(mat_choosed.centerx),
      centerY: parseFloat(mat_choosed.centery),
    };
    if (if_true_absolute_reference) {
      var map_ref = mat_choosed.img;
    } else {
      var map_ref = app.pics_dir + mat_choosed.img;
    }
    //else { var map_ref = "../../" + mat_choosed.img; }

    var map = this.get_texture1_new(
      map_ref,
      vc3d_glob.APImat,
      node,
      mat_choosed,
      mat_id
    );
  }
  // ПОЛУЧЕНИЕ ТЕКСТУРЫ ДЛЯ obj, НЕ ДЛЯ gltf
  get_texture1_new(img_txt, API_1, node, mat_choosed, mat_id) {
    var maxAnisotropy = vc3d_glob.renderer.capabilities.getMaxAnisotropy();
    var loader = new THREE.TextureLoader(); //loader.crossOrigin = ''; loader.setCrossOrigin(''); loader.setCrossOrigin("anonymous");
    //var alphaMap = new THREE.TextureLoader().load('../data/img1/alpha.png'); //var texture = loader.load('../data/img1/alpha.png'); //oi1(texture, "555 img_txt = " + img_txt + ", texture = "); //console.log("repeate_x = " + repeate_x + ",  repeate_y = " + repeate_x);

    var texture = loader.load(img_txt, function (tex) {
      if (vc3d_glob.texture_type === "FF") {
        // Fashion Factory
        var height = tex.image.height;
        var width = tex.image.width;
        if (width) {
          vc3d_glob.height_bolshe_width = height / width;
        } // потом так height = width * vc3d_glob.height_bolshe_width
      }

      texture.anisotropy = maxAnisotropy;
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

      texture.matrixAutoUpdate = true;

      if (API_1.repeatX && API_1.repeatY) {
        texture.repeat.set(API_1.repeatX, API_1.repeatY);
      }
      if (API_1.offsetX && API_1.offsetY) {
        texture.offset.set(API_1.offsetX, API_1.offsetY);
      }
      if (API_1.centerX && API_1.centerY) {
        texture.center.set(API_1.centerX, API_1.centerY);
      }
      if (API_1.rotation) {
        texture.rotation = API_1.rotation;
      }

      var mat = {
        color: 0xffffff,
        map: tex,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.01,
      };
      var materialPainting = new THREE.MeshBasicMaterial(mat);

      //vc3d_glob.curr_obj.material = materialPainting; // назначим материал текущему элементу
      //vc3d_glob.curr_obj.mat_params = mat_choosed; // каждый элемент должен иметь список параметров своего текущего материала
      node.material = materialPainting; // назначим материал текущему элементу
      node.mat_params = mat_choosed; // каждый элемент должен иметь список параметров своего текущего материала

      // обновим данные материала для вкладки: Информация - > Картинки (фото и материалы товаров)
      app.curr_obj_data.mat_params = mat_choosed; // ПРОБЛЕМА !!!  тут не проблема, просто нужно сделать также для GLTF

      // меняем высоту рамки, чтобы рамка соответствовала картинке
      if (vc3d_glob.texture_type === "FF") {
        // Fashion Factory

        // z - высота, x - ширина

        if (vc3d_glob.curr_obj_all.mod_name === "Рамка") {
          vc3d_glob.curr_obj_all.scale.z =
            vc3d_glob.curr_obj_all.scale.x * vc3d_glob.height_bolshe_width; // то есть меняем высоту рамки, чтобы рамка соответствовала картинке

          if (app.all && app.all.ge && app.all.ge.length > 0) {
            for (var i = 0; i < app.all.ge.length; i++) {
              if (
                app.all.ge[i].model_unid_in_ge ==
                vc3d_glob.curr_obj_all.model_unid_in_ge
              ) {
                //c("found!   app.all.ge[i].model_unid_in_ge = " + app.all.ge[i].model_unid_in_ge);
                //c("111111111111111115 app.all.ge[i].scalez = " + app.all.ge[i].scalez + ", app.curr_obj_scale_z = " + app.curr_obj_scale_z);

                app.all.ge[i].scalez = vc3d_glob.curr_obj_all.scale.z;
                app.curr_obj_scale_z = vc3d_glob.curr_obj_all.scale.z;

                break;
              }
            }
          }
        }
      }

      if (!vc3d_glob.animate) {
        i3d_all.animate4();
      }
      //========== ДОБАВИМ МАТЕРИАЛ В СПИСОК МАТЕРИАЛОВ ДЛЯ СОХРАНЕНИЯ В ПАЛИТРЕ===========================================================================
      i3d_mats.vc3d_mats_push(mat_id, node);
      //=====================================================================================
    });
    return texture;
  }

  // ТУТ ПОЛУЧАЕМ ТЕКСТУРУ ИЗ ФАЙЛА КАРТИНКИ. ДЛЯ GLTF
  get_texture1(img_txt, API_1) {
    var maxAnisotropy = vc3d_glob.renderer.capabilities.getMaxAnisotropy();
    var loader = new THREE.TextureLoader();

    var texture = loader.load(img_txt);

    texture.anisotropy = maxAnisotropy;
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

    //!
    texture.matrixAutoUpdate = true;

    /** */
    if (API_1.repeatX && API_1.repeatY) {
      texture.repeat.set(API_1.repeatX, API_1.repeatY);
    }
    if (API_1.offsetX && API_1.offsetY) {
      texture.offset.set(API_1.offsetX, API_1.offsetY);
    }
    if (API_1.centerX && API_1.centerY) {
      texture.center.set(API_1.centerX, API_1.centerY);
    }
    if (API_1.rotation) {
      texture.rotation = API_1.rotation;
    }
    /** */

    //texture.repeat.set(1, 1);
    return texture;
  }

  //========== ДОБАВИМ МАТЕРИАЛ В СПИСОК МАТЕРИАЛОВ ДЛЯ СОХРАНЕНИЯ В ПАЛИТРЕ===========================================================================
  // ЗДЕСЬ МЫ СИНХРОНИЗИРУЕМ СПИСКИ SCENE.nodes и app.all.elems
  vc3d_mats_push(mat_id, vc3d__curr_obj) {
    // тут мы заполним a pp.all.e lems[i].mat_params. ЭТО ОБЩАЯ ФУНКЦИЯ ДЛЯ c hange_mat_gltf2 И ДЛЯ c hange_mat_gltf
    var i = vc3d__curr_obj.child_number;

    //c("v c3d_mats_push!!!!!!!!!!!! name = " + vc3d__curr_obj.name + ", mat_id = " + vc3d__curr_obj.mat_params.mat_id + ", i = " + i);

    if (!app.all.elems[i]) {
      i3d_all.c_sys("Error не найден элемент с номером " + i);
      return;
    }

    app.all.elems[i].mat_id = mat_id;
    //! if(!app.all.elems[i].mat_params) { app.all.elems[i].mat_params = {}; }
    app.all.elems[i].mat_params = {};

    app.all.elems[i].mat_params.mat_id = vc3d__curr_obj.mat_params.mat_id;
    app.all.elems[i].mat_params.libs_id = vc3d__curr_obj.mat_params.libs_id;
    app.all.elems[i].mat_params.img = vc3d__curr_obj.mat_params.img;
    app.all.elems[i].mat_params.bumpmap = vc3d__curr_obj.mat_params.bumpmap;
    app.all.elems[i].mat_params.color = vc3d__curr_obj.mat_params.color;
    app.all.elems[i].mat_params.repx = vc3d__curr_obj.mat_params.repx;
    app.all.elems[i].mat_params.repy = vc3d__curr_obj.mat_params.repy;
    app.all.elems[i].mat_params.centerx = vc3d__curr_obj.mat_params.centerx;
    app.all.elems[i].mat_params.centery = vc3d__curr_obj.mat_params.centery;
    app.all.elems[i].mat_params.offsetx = vc3d__curr_obj.mat_params.offsetx;
    app.all.elems[i].mat_params.offsety = vc3d__curr_obj.mat_params.offsety;
    app.all.elems[i].mat_params.opacity = vc3d__curr_obj.mat_params.opacity;
    app.all.elems[i].mat_params.rotation = vc3d__curr_obj.mat_params.rotation;
    app.all.elems[i].mat_params.specular = vc3d__curr_obj.mat_params.specular;
  }

  set_timeout_material(light) {
    i3d_all.c("111678 s et_timeout_material       light = " + light);

    if (!vc3d_glob.curr_obj) return;

    light = 0;
    if (light == 1) {
      return;
    } // light == app.all.elems[j].light    - if =1 - то не нужно подсвечивать элемент

    var found = false;
    for (var i = 0; i < vc3d_glob.clicked_elems_list.length; i++) {
      if (
        vc3d_glob.clicked_elems_list[i].ge_i === vc3d_glob.curr_obj.ge_i &&
        vc3d_glob.clicked_elems_list[i].name === vc3d_glob.curr_obj.name
      ) {
        found = true;
        break;
      }
    }
    if (!found) {
      vc3d_glob.mat_current = vc3d_glob.curr_obj.material;

      // var material = new THREE.MeshBasicMaterial({
      //     color: "#00f",
      //     transparent: true,
      //     opacity: 0.8
      // });
      // vc3d_glob.curr_obj.material = material;

      vc3d_glob.curr_obj.material = vc3d_glob.temp_material;

      vc3d_glob.clicked_elems_list.push({
        ge_i: vc3d_glob.curr_obj.ge_i,
        name: vc3d_glob.curr_obj.name,
      });

      if (!vc3d_glob.animate) {
        i3d_all.animate3();
      }

      i3d_mats.curr_mat_from_glow(vc3d_glob.curr_obj, vc3d_glob.mat_current); // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!    setTimeOUT !!!!
    }
  }

  //временно назначим материал выбранному объекту
  curr_mat_from_glow(curr_obj, material) {
    setTimeout(function () {
      curr_obj.material = material;
      if (!vc3d_glob.animate) {
        i3d_all.animate3();
      }

      for (var i = 0; i < vc3d_glob.clicked_elems_list.length; i++) {
        if (
          vc3d_glob.clicked_elems_list[i].ge_i === curr_obj.ge_i &&
          vc3d_glob.clicked_elems_list[i].name === curr_obj.name
        ) {
          vc3d_glob.clicked_elems_list.splice(i, 1);
          break;
        }
      }
    }, 500);
  }
}

export let i3d_mats = new Mats();

// f2_mats.js
