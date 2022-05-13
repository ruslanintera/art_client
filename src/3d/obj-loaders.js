import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { BufferGeometryUtils } from "three/examples/jsm/utils/BufferGeometryUtils";

// import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";
// import {MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
// import { app } from "./dev2020/f9_appvue.js";
// import { i3d_app_sets } from "./dev2020/f3_apparat_sets.js";
// import { i3d_tween } from "./dev2020/f6_tween.js";
// import { i3d_events_func } from "./dev2020/f8_events_func.js";

/*===========================================================================================*/
import { i3d_all } from "./dev2020/f7_assist.js";
import { i3d_events } from "./dev2020/f8_events.js";
import { i3d_base } from "./dev2020/f4_base.js";
import { vc3d_glob } from "./dev2020/f5_vc3d_glob.js";
import { i3d_windows, i3d_windows1 } from "./dev2020/f10_windows.js";
/*===========================================================================================*/
import { common } from "../common/common";

class ObjLoaders {
  load_gltf() {
    let wl_1 = {};
    var onProgress = function (xhr) {
      i3d_all.coi_sys(`${(xhr.loaded / xhr.total) * 100}% loaded`);
    };
    var onError_gltf = function (error) {
      console.error("An error happened", error);
    };
    //wl_1.obj_path = "../etYoTBaStlPEYbOD/5d.gltf";
    wl_1.obj_path = "../o4bVjzEGtvIxEZUq/ikrand1.gltf";

    var loader = new GLTFLoader();

    //loader.load('../o4bVjzEGtvIxEZUq/ikrand1.gltf',function (gltf) {
    loader.load(
      wl_1.obj_path,
      function (gltf) {
        var gltf_model = gltf.scene;
        vc3d_glob.SCENE.add(gltf_model);
        i3d_all.onWindowResize_AO();

        //}, onProgress, onError_gltf);
      },
      onProgress
    );
  }

  loadTheModel() {
    const loader = new OBJLoader();

    loader.load(
      // resource URL relative to the /public/index.html of the app
      //'obj/tree.obj',
      //'tree.obj',
      "../obj/eleph.obj",
      //'eleph.obj',
      // called when resource is loaded
      (object) => {
        vc3d_glob.ray_objects.push(object); // тут те модели, которые можно выбирать r aycaster-ом
        object.move_type = 1; //parseInt(wl_1.move_type); //нужно ли двигать объект?
        object.scale.set(7, 7, 7);

        vc3d_glob.SCENE.add(object);

        // get the newly added object by name specified in the OBJ model (that is Elephant_4 in my case)
        // you can always set c onsole.log(vc3d_glob.SCENE) and check its children to know the name of a model
        const el = vc3d_glob.SCENE.getObjectByName("Elephant_4");

        el.position.set(0, -150, 0);
        el.material.color.set(0x50c878);
        el.rotation.x = 23.5;

        // make this element available inside of the whole component to do any animation later
        vc3d_glob.model = el;

        i3d_all.onWindowResize_AO();
      },
      // called when loading is in progresses
      (xhr) => {
        const loadingPercentage = Math.ceil((xhr.loaded / xhr.total) * 100);
        i3d_all.coi_sys(loadingPercentage + "% loaded");

        // update parent react component to display loading percentage
        //t his.props.onProgress(loadingPercentage);
      },
      // called when loading has errors
      (error) => {
        i3d_all.coi_sys("An error happened:" + error);
      }
    );
  }

  sceneSetup_WORK(props) {
    const this1 = props.this1;
    vc3d_glob.SCENE = new THREE.Scene();
    vc3d_glob.SCENE.children = [];

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

    vc3d_glob.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    vc3d_glob.renderer.setPixelRatio(window.devicePixelRatio);

    let elCanvas = this1.mount.appendChild(vc3d_glob.renderer.domElement);

    vc3d_glob.renderer.setSize(window.innerWidth, window.innerHeight);
    //vc3d_glob.renderer.setSize(elCanvas.offsetWidth, elCanvas.offsetHeight);
    vc3d_glob.renderer.gammaOutput = true;

    function getOffsetSum(elem) {
      var top = 0,
        left = 0;
      while (elem) {
        top = top + parseFloat(elem.offsetTop);
        left = left + parseFloat(elem.offsetLeft);
        elem = elem.offsetParent;
      }

      return { top: Math.round(top), left: Math.round(left) };
    }
    let tl = getOffsetSum(elCanvas);
    vc3d_glob.canvas_top = tl.top;
    vc3d_glob.canvas_left = tl.left;

    vc3d_glob.CONTROLS = new OrbitControls(
      vc3d_glob.CAMERA,
      vc3d_glob.renderer.domElement
    );
    vc3d_glob.CONTROLS.update();
    /**/

    vc3d_glob.raycaster = new THREE.Raycaster();

    if (!vc3d_glob.no_SCENE_PARAMS) {
      i3d_base.SCENE_PARAMS();
    }
    i3d_base.add_only_plane_and_mouse_move(); // тут добавляем интерактив
    //i3d_base.add_only_light_and_shadow();

    var ambient = new THREE.AmbientLight("#fff");
    vc3d_glob.SCENE.add(ambient);

    i3d_base.make_test1();

    if (vc3d_glob.i3d_windows) {
      i3d_windows.createWinds();
      i3d_windows1.createWinds();
      i3d_all.onWindowResize_AO();
    }
    vc3d_glob.renderer.setClearColor("#E9EAEE", 1);

    /*********************************** * /
        // const pathFBX = require('./fbx/cloth.fbx');
        //console.log("FBX 1======================================== ", pathFBX)
        var loaderFBX1 = new FBXLoader();
        //console.log("FBX 1======================================== ", loaderFBX1)
        //loaderFBX1.load('../fbx/Samba Dancing.fbx', function (object3d) {
        loaderFBX1.load('./fbx/cloth.fbx', function (object3d) {
            
            vc3d_glob.SCENE.add(object3d);
            //console.log("object3d ======================================== ", object3d)
            var box = new THREE.Box3().setFromObject( object3d );
            //console.log( box.min, box.max, box.getSize() );

            i3d_all.onWindowResize_AO()

        },
        ( xhr ) => {
            // called while loading is progressing
            //console.log( `${( xhr.loaded / xhr.total * 100 )}% loaded` );
        },
        ( error ) => {
            // called when loading has errors
            console.error( 'An error happened', error );
        });
        /************ */
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
    vc3d_glob.CONTROLS.addEventListener("change", function () {
      //console.log("==================================6788")
      vc3d_glob.renderer.render(vc3d_glob.SCENE, vc3d_glob.CAMERA);
    }); //! если Orbit или другой Control изменяется, тогда перерендерим всю сцену, это если animate () не включено

    document.addEventListener("wheel", function (e) {
      // "wheel" OR 'scroll'
      //console.log("scroll, e = ", e)
      vc3d_glob.renderer.render(vc3d_glob.SCENE, vc3d_glob.CAMERA);
    });

    window.addEventListener("keydown", function (e) {
      //console.log("keydown, e = ", e)
      //i3d_events.onDocument_keydown
    });
  }
  getOffsetSum(elem) {
    var top = 0,
      left = 0;
    while (elem) {
      top = top + parseFloat(elem.offsetTop);
      left = left + parseFloat(elem.offsetLeft);
      elem = elem.offsetParent;
      //console.log("top = ", top, "left = ", left)
    }

    return { top: Math.round(top), left: Math.round(left) };
  }

  rt_Custom() {
    // if(!vc3d_glob.no_SCENE_PARAMS) { i3d_base.SCENE_PARAMS(); }
    // i3d_base.add_only_plane_and_mouse_move(); // тут добавляем интерактив

    // vc3d_glob.temp_material = new THREE.MeshBasicMaterial({ color: "#00f", transparent: true, opacity: 0.8 });
    // vc3d_glob.rack_empty_material = new THREE.MeshBasicMaterial({ color: "#eee", transparent: true, opacity: 0.8 });
    // vc3d_glob.rack_empty_DARK_material = new THREE.MeshBasicMaterial({ color: "#888", transparent: true, opacity: 0.8 });
    // vc3d_glob.rack_BLUE_material = new THREE.MeshBasicMaterial({ color: "#00f", transparent: true, opacity: 0.8 });
    // vc3d_glob.rack_GREEN_material = new THREE.MeshBasicMaterial({ color: "#1f1", transparent: true, opacity: 0.8 });

    // // 0 - empty, 1 - rack, 2 - ремонт, 3 - замена, 22 - 2+ ремонтов, 33 - 2+ замен, 23 - и ремонты и замены нужны
    // vc3d_glob.rack_repair2_material = new THREE.MeshBasicMaterial({ color: "#ff7", transparent: true, opacity: 0.8 });
    // vc3d_glob.rack_repair22_material = new THREE.MeshBasicMaterial({ color: "#ff0", transparent: true, opacity: 0.8 });
    // vc3d_glob.rack_change3_material = new THREE.MeshBasicMaterial({ color: "#a07", transparent: true, opacity: 0.8 });
    // vc3d_glob.rack_change33_material = new THREE.MeshBasicMaterial({ color: "#a00", transparent: true, opacity: 0.8 });
    // vc3d_glob.rack_repair_change23_material = new THREE.MeshBasicMaterial({ color: "#f00", transparent: true, opacity: 0.8 });

    // rack_empty_color: "#eee",
    // rack_empty_DARK_color: "#888",
    // rack_BLUE_color: "#00f",
    // rack_GREEN_color: "#1f1",
    // rack_repair_color: "#f50",
    // rack_change_color: "#f00",

    vc3d_glob.temp_material = new THREE.MeshBasicMaterial({
      color: vc3d_glob.rack_BLUE_color,
      transparent: true,
      opacity: 0.8,
    });
    vc3d_glob.rack_empty_material = new THREE.MeshBasicMaterial({
      color: vc3d_glob.rack_empty_color,
      transparent: true,
      opacity: 0.8,
    });
    vc3d_glob.rack_empty_DARK_material = new THREE.MeshBasicMaterial({
      color: vc3d_glob.rack_empty_DARK_color,
      transparent: true,
      opacity: 0.8,
    });
    vc3d_glob.rack_BLUE_material = new THREE.MeshBasicMaterial({
      color: vc3d_glob.rack_BLUE_color,
      transparent: true,
      opacity: 0.8,
    });
    vc3d_glob.rack_GREEN_material = new THREE.MeshBasicMaterial({
      color: vc3d_glob.rack_GREEN_color,
      transparent: true,
      opacity: 0.8,
    });

    // 0 - empty, 1 - rack, 2 - ремонт, 3 - замена, 22 - 2+ ремонтов, 33 - 2+ замен, 23 - и ремонты и замены нужны
    vc3d_glob.rack_repair2_material = new THREE.MeshBasicMaterial({
      color: vc3d_glob.rack_repair2_color,
      transparent: true,
      opacity: 0.8,
    });
    vc3d_glob.rack_repair22_material = new THREE.MeshBasicMaterial({
      color: vc3d_glob.rack_repair22_color,
      transparent: true,
      opacity: 0.8,
    });
    vc3d_glob.rack_change3_material = new THREE.MeshBasicMaterial({
      color: vc3d_glob.rack_change3_color,
      transparent: true,
      opacity: 0.8,
    });
    vc3d_glob.rack_change33_material = new THREE.MeshBasicMaterial({
      color: vc3d_glob.rack_change33_color,
      transparent: true,
      opacity: 0.8,
    });
    vc3d_glob.rack_repair_change23_material = new THREE.MeshBasicMaterial({
      color: vc3d_glob.rack_repair_change23_color,
      transparent: true,
      opacity: 0.8,
    });

    //i3d_base.make_test1();

    //vc3d_glob.i3d_windows = true;

    if (vc3d_glob.i3d_windows) {
      i3d_windows.createWinds();
      i3d_windows1.createWinds();
      i3d_all.onWindowResize_AO();
    }

    // FACE face
    // const geometry = new THREE.BufferGeometry();
    // // create a simple square shape. We duplicate the top left and bottom right
    // // vertices because each vertex needs to appear once per triangle.
    // const vertices = new Float32Array( [
    //   -1000.0, -1000.0,  1000.0,
    //    1000.0, -1000.0,  1000.0,
    //    1000.0,  1000.0,  1000.0,

    //    1000.0,  1000.0,  1000.0,
    //   -1000.0,  1000.0,  1000.0,
    //   -1000.0, -1000.0,  1000.0
    // ] );

    // // itemSize = 3 because there are 3 values (components) per vertex
    // geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
    // const material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );
    // const mesh = new THREE.Mesh( geometry, material );

    // vc3d_glob.ray_objects.push(mesh);  // тут те модели, которые можно выбирать r aycaster-ом
    // mesh.move_type = 1; //parseInt(wl_1.move_type); //нужно ли двигать объект?

    // vc3d_glob.SCENE.add(mesh)

    //objLoaders.addCubeMergeNew(1, 101, 1, 101)
  }

  getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      const rand = Math.random();
      //color += letters[Math.floor(Math.random() * 16)];
      color += letters[Math.floor(rand * 16)];
    }
    return color;
  }
  getRandomNumber(rank, digits) {
    // rank - qty of digits in number
    digits = digits || "0123456789";
    let number1 = "";
    for (var i = 0; i < rank; i++) {
      const rand = Math.random();
      if (rand != 1) number1 += digits[Math.floor(rand * digits.length)];
    }
    return parseInt(number1);
  }
  getRandomMinMax(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  addCubeMergeNew_WORK() {
    let cubes = [],
      cubes_remont = [],
      cubes_zamena = [];
    var geo_selected = new THREE.BoxBufferGeometry(16, 16, 1);
    var geo = new THREE.BoxBufferGeometry(15, 1, 15);
    let d = 50,
      k = 20; // k - шаг     d = 19  => params1 = 90 kilobite
    let kx = -d * k * 1.7; // kx - вычисляемые координаты стеллажа по x
    let kz = 0; // kz - вычисляемые координаты стеллажа по z

    let dc_params1 = {};
    dc_params1.racks = [];

    for (let x = -d; x < d; x++) {
      kx += k;
      if (Math.floor(x / 2) == x / 2) {
        kx += 30;
      } // два ряда стеллажей, значит если X делится на 2 - это следующий ряд
      kz = -d * k * 1.2; // для нового ряда вернем позицию по Z в исходное значение
      for (let z = -d; z < d; z++) {
        kz += k;
        if (Math.floor(z / 10) == z / 10) {
          kz += 30;
        } // два ряда стеллажей, значит если X делится на 2 - это следующий ряд
        var geometry = geo.clone();
        var geometry_selected = geo_selected.clone();

        //console.log("kz = " + kz);
        let x1 = kx;
        //let z1 = z * k;
        let z1 = kz;

        //let y1 = Math.sin(x)*Math.cos(z) * ky
        //let y1 = x*x/4 - z*z/9
        let y1 = 0;

        geometry.translate(x1, y1, z1);
        //geometry.rotateX(-90 * Math.PI / 180);

        geometry_selected.translate(x1, y1, z1);
        /** */
        //невидимые стеллажи, которые показываем только при клике на них
        var one_cube = new THREE.Mesh(
          geo_selected,
          new THREE.MeshBasicMaterial({
            visible: false,
            color: this.getRandomColor(),
            wireframe: true,
          })
        );
        one_cube.rotation.x = (-90 * Math.PI) / 180;
        one_cube.position.x = x1;
        one_cube.position.y = y1;
        one_cube.position.z = z1;
        //one_cube.move_type = 1; //нужно ли двигать объект?
        one_cube.RACK = 1; //
        one_cube.wtype = "rack"; //
        one_cube.MODEL3D = 1; //
        vc3d_glob.ray_objects.push(one_cube); // тут те модели, которые можно выбирать r aycaster-ом
        vc3d_glob.SCENE.add(one_cube);

        //const choose_random_type = this.getRandomNumber(1)
        const choose_random_type = this.getRandomNumber(2, "0123456789");
        //console.log(choose_random_type)

        const RandMinMax = this.getRandomMinMax(1, 55);
        //console.log("RandMinMax = " + RandMinMax)

        let problems = [];

        if (choose_random_type === 1) {
          cubes_remont.push(geometry);
          problems.push({ e: RandMinMax, pt: 1 }); // e = element of 3D model, pt - problem type
        } else if (choose_random_type === 2) {
          cubes_zamena.push(geometry);
          problems.push({ e: RandMinMax, pt: 2 }); // e = element of 3D model, pt - problem type
        } else {
          cubes.push(geometry);
        }

        // rt = rack - номер в таблице RackTypes, r - номер в таблице Rack, n - name/description
        //dc_params1.racks.push({ rt: 1, r: 1, n: '', x: x1, y: y1, z: z1, p: problems});

        //const RackObj = { rt: 1, r: 1, n: '', x: x1, y: y1, z: z1, p: problems};
        const RackObj = {
          rt: 1,
          r: 1,
          n: "",
          x: x1,
          y: y1,
          z: z1,
          p: problems,
        };

        dc_params1.racks.push(RackObj);
        if (problems.length > 0) {
          //console.log("RackObj = ", RackObj);
        }

        geometry.x1 = x1;
        geometry.y1 = y1;
        geometry.z1 = z1;
      }
    }
    //console.log("dc_params1.racks = ", dc_params1.racks)

    //vc3d_glob.device.racks = dc_params1.racks;
    vc3d_glob.dc_params1_racks = dc_params1.racks;

    if (cubes.length > 0) {
      var geometriesCubes = BufferGeometryUtils.mergeBufferGeometries(cubes);
      var mesh = new THREE.Mesh(
        geometriesCubes,
        new THREE.MeshPhongMaterial({ color: "#5f5", wireframe: false })
      );
      mesh.cubes = true;
      mesh.wtype = "rack"; //
      mesh.MODEL3D = 1; //
      vc3d_glob.SCENE.add(mesh);
    }

    if (cubes_remont.length > 0) {
      var geometriesCubes_remont =
        BufferGeometryUtils.mergeBufferGeometries(cubes_remont);
      var mesh = new THREE.Mesh(
        geometriesCubes_remont,
        new THREE.MeshPhongMaterial({ color: "#d42", wireframe: false })
      );
      mesh.cubes = true;
      mesh.wtype = "rack"; //
      mesh.MODEL3D = 1; //
      vc3d_glob.SCENE.add(mesh);
    }

    if (cubes_zamena.length > 0) {
      var geometriesCubes_zamena =
        BufferGeometryUtils.mergeBufferGeometries(cubes_zamena);
      var mesh = new THREE.Mesh(
        geometriesCubes_zamena,
        new THREE.MeshPhongMaterial({ color: "#fa0", wireframe: false })
      );
      mesh.cubes = true;
      mesh.wtype = "rack"; //
      mesh.MODEL3D = 1; //
      vc3d_glob.SCENE.add(mesh);
    }

    // now we got 1 mega big mesh with 10 000 cubes in it
    //var mesh = new THREE.Mesh(geometriesCubes, new THREE.MeshPhongMaterial( { color: "#5f5", wireframe: false, shading: THREE.SmoothShading } ));
    //mesh.move_type = 1; //parseInt(wl_1.move_type); //нужно ли двигать объект?
    //vc3d_glob.ray_objects.push(mesh);  // тут те модели, которые можно выбирать r aycaster-ом

    /**/
  }

  addCubeMergeNew_WORK_SUPER(x1, x2, z1, z2, centerX, centerY, step, boxSize) {
    let cubes = [],
      cubes_remont = [],
      cubes_zamena = [],
      cubes_empty = [];
    var geo_selected = new THREE.BoxBufferGeometry(16, 16, 1);
    var geo = new THREE.BoxBufferGeometry(15, 1, 15);
    let k = 20; // k - шаг
    let position_x = (-(x2 - x1) / 2) * k; // position_x - вычисляемые координаты стеллажа по x
    let position_z = 0; // kz - вычисляемые координаты стеллажа по z

    let empty_number1 = 2,
      empty_number2 = 3,
      empty_step = 4;

    const RacktypeLength = vc3d_glob.device.getRacktypeTotal;
    const Racktype = [...vc3d_glob.device.getRacktype3d];
    for (let c = 1; c <= Racktype.length; c++) {
      //cubes.push([])
    }
    //console.log("RacktypeLength = ", RacktypeLength, "Racktype = ", Racktype);

    let dc_params1 = {};
    dc_params1.racks = [];

    for (let x = x1; x < x2; x++) {
      let emptyX = false;
      position_x += k;
      //console.log("== x = ", x)
      if (Math.floor(x / empty_number1) === x / empty_number1) {
        emptyX = true;
        //console.log("x = ", x, "empty_number1 = ", empty_number1, "Math.floor(x / empty_number1) = ", Math.floor(x / empty_number1), "x / empty_number1 = ", x / empty_number1);
        empty_number1 += empty_step;
      } // два ряда стеллажей, значит если X делится на 2 - это следующий ряд
      if (Math.floor(x / empty_number2) === x / empty_number2) {
        emptyX = true;
        //console.log("x = ", x, "empty_number2 = ", empty_number2, "Math.floor(x / empty_number1) = ", Math.floor(x / empty_number1), "x / empty_number1 = ", x / empty_number1);
        empty_number2 += empty_step;
      } // два ряда стеллажей, значит если X делится на 2 - это следующий ряд

      //position_z = -(x2 - x1) / 2 * k; // для нового ряда вернем позицию по Z в исходное значение
      position_z = (-(z2 - z1) / 2) * k; // для нового ряда вернем позицию по Z в исходное значение

      for (let z = z1; z < z2; z++) {
        let emptyZ = false;
        position_z += k;
        if (Math.floor(z / 10) == z / 10) {
          emptyZ = true;
        } // два ряда стеллажей, значит если X делится на 2 - это следующий ряд
        var geometry = geo.clone();

        let position_y = 0;
        let type = 0; // 0 - empty, 1 - rack, 2 - ремонт, 3 - замена
        geometry.translate(position_x, position_y, position_z);

        let problems = [];
        let RandMinMax_RackType = this.getRandomMinMax(1, RacktypeLength - 1); //console.log("RandMinMax = " + RandMinMax)

        let RackObj = {};
        if (emptyZ || emptyX) {
          cubes_empty.push(geometry);
          type = 0;
        } else {
          const choose_random_type = this.getRandomNumber(2, "0123456789"); //console.log(choose_random_type)
          const RandMinMax = this.getRandomMinMax(1, 55); //console.log("RandMinMax = " + RandMinMax)
          if (choose_random_type === 2) {
            cubes_remont.push(geometry);
            problems.push({ e: RandMinMax, pt: 1 }); // e = element of 3D model, pt - problem type
            type = 2;
          } else if (choose_random_type === 3) {
            cubes_zamena.push(geometry);
            problems.push({ e: RandMinMax, pt: 2 }); // e = element of 3D model, pt - problem type
            type = 3;
          } else {
            //const RandMinMax_RackType = this.getRandomMinMax(1, RacktypeLength); //console.log("RandMinMax = " + RandMinMax)
            if (Racktype[RandMinMax_RackType]) {
              let color = "#006";
              if (!Racktype[RandMinMax_RackType].color) {
                Racktype[RandMinMax_RackType].color = color;
              }
              if (!Racktype[RandMinMax_RackType].cubes) {
                Racktype[RandMinMax_RackType].cubes = [];
              }
              Racktype[RandMinMax_RackType].cubes.push(geometry);
            } else {
              console.error(
                "ERRRRRRRRRRRRRRRRRRR RandMinMax_RackType = ",
                RandMinMax_RackType,
                "Racktype = ",
                Racktype
              );
            }
            type = 1;
            cubes.push(geometry);
          }
        }
        if (type === 0) RandMinMax_RackType = 0; // то есть если это не стеллаж, а проход, тогда RackType = 0

        //невидимые стеллажи, которые показываем только при клике на них
        //var one_cube = new THREE.Mesh(geo_selected, new THREE.MeshBasicMaterial( { visible: false, color: this.getRandomColor(), wireframe: true } ));
        var one_cube = new THREE.Mesh(
          geo_selected,
          new THREE.MeshBasicMaterial({
            visible: false,
            color: "#000",
            wireframe: true,
          })
        );
        one_cube.rotation.x = (-90 * Math.PI) / 180;
        one_cube.position.x = position_x;
        one_cube.position.y = position_y;
        one_cube.position.z = position_z;
        //one_cube.move_type = 1; //нужно ли двигать объект?
        one_cube.RACK = { type, rt: RandMinMax_RackType, x: x, z: z }; // type:  0 - empty, 1 - rack, 2 - ремонт, 3 - замена, rt - RACKTYPE

        //if(Racktype[RandMinMax_RackType] && Racktype[RandMinMax_RackType].color) { RackObj.color = Racktype[RandMinMax_RackType].color; }

        one_cube.wtype = "rack"; //
        one_cube.MODEL3D = 1; //
        vc3d_glob.ray_objects.push(one_cube); // тут те модели, которые можно выбирать r aycaster-ом
        vc3d_glob.SCENE.add(one_cube);

        // rt = rack - номер в таблице RackTypes, r - номер в таблице Rack, n - name/description
        RackObj = {
          rt: RandMinMax_RackType,
          x: x,
          z: z,
          type: type,
          px: position_x,
          pz: position_z,
        }; // type = 1 - RACK

        if (
          Racktype[RandMinMax_RackType] &&
          Racktype[RandMinMax_RackType].color
        ) {
          RackObj.color = Racktype[RandMinMax_RackType].color;
          one_cube.RACK.color = Racktype[RandMinMax_RackType].color;
        }

        //RackObj_cubes = { 'rt': 1, 'x': x, 'z': z, type: type, cube: one_cube }; // type = 1 - RACK
        if (problems.length > 0) {
          RackObj.p = problems;
          one_cube.RACK.p = problems;
        } // RackObj_cubes.p = problems;
        dc_params1.racks.push(RackObj);
      }
    }
    //console.log("dc_params1.racks = ", dc_params1.racks)
    //vc3d_glob.dc_params1_racks = dc_params1.racks;
    vc3d_glob.dc_params1 = dc_params1;

    Racktype.map((rt) => {
      if (rt.cubes && rt.cubes.length > 0) {
        var geometriesCubes = BufferGeometryUtils.mergeBufferGeometries(
          rt.cubes
        );

        if (!rt.color) {
          //console.log("================ !!! rt.color ==========================", rt);
        }

        var mesh = new THREE.Mesh(
          geometriesCubes,
          new THREE.MeshPhongMaterial({ color: rt.color, wireframe: false })
        );
        //var mesh = new THREE.Mesh(geometriesCubes, new THREE.MeshPhongMaterial( { color: "#004", wireframe: false } ));
        mesh.cubes = true;
        mesh.wtype = "rack"; //
        mesh.MODEL3D = 1; //
        vc3d_glob.SCENE.add(mesh);
        //console.log("eee44eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee rt = ", rt)
      }
    });

    //   if(cubes.length > 0) {
    //     var geometriesCubes = BufferGeometryUtils.mergeBufferGeometries(cubes);
    //     var mesh = new THREE.Mesh(geometriesCubes, new THREE.MeshPhongMaterial( { color: vc3d_glob.rack_GREEN_color, wireframe: false } ));
    //     mesh.cubes = true;
    //     mesh.wtype = "rack"; //
    //     mesh.MODEL3D = 1; //
    //     vc3d_glob.SCENE.add(mesh);
    //   }

    if (cubes_remont.length > 0) {
      var geometriesCubes_remont =
        BufferGeometryUtils.mergeBufferGeometries(cubes_remont);
      var mesh = new THREE.Mesh(
        geometriesCubes_remont,
        new THREE.MeshPhongMaterial({
          color: vc3d_glob.rack_repair_color,
          wireframe: false,
        })
      );
      mesh.cubes = true;
      mesh.wtype = "rack"; //
      mesh.MODEL3D = 1; //
      vc3d_glob.SCENE.add(mesh);
    }

    if (cubes_zamena.length > 0) {
      var geometriesCubes_zamena =
        BufferGeometryUtils.mergeBufferGeometries(cubes_zamena);
      var mesh = new THREE.Mesh(
        geometriesCubes_zamena,
        new THREE.MeshPhongMaterial({
          color: vc3d_glob.rack_change_color,
          wireframe: false,
        })
      );
      mesh.cubes = true;
      mesh.wtype = "rack"; //
      mesh.MODEL3D = 1; //
      vc3d_glob.SCENE.add(mesh);
    }

    if (cubes_empty.length > 0) {
      var geometriesCubes_zamena =
        BufferGeometryUtils.mergeBufferGeometries(cubes_empty);
      var mesh = new THREE.Mesh(
        geometriesCubes_zamena,
        new THREE.MeshPhongMaterial({
          color: vc3d_glob.rack_empty_color,
          wireframe: false,
        })
      );
      mesh.cubes = true;
      mesh.wtype = "empty_rack"; //
      mesh.MODEL3D = 1; //
      vc3d_glob.SCENE.add(mesh);
    }
  }

  addCubeMergeNew(getDCOne, x1, x2, z1, z2, centerX, centerY, step, boxSize) {
    let cubes_remont = [],
      cubes_zamena = [],
      cubes_empty = [];
    var geo_selected = new THREE.BoxBufferGeometry(16, 16, 1);
    var geo = new THREE.BoxBufferGeometry(15, 1, 15);
    let k = 20; // k - шаг
    let position_x = (-(x2 - x1) / 2) * k; // position_x - вычисляемые координаты стеллажа по x
    let position_z = 0; // kz - вычисляемые координаты стеллажа по z

    let empty_number1 = 2,
      empty_number2 = 3,
      empty_step = 4;

    //const RacktypeLength = vc3d_glob.device.getRacktypeTotal;
    //const Racktype = [...vc3d_glob.device.getRacktype3d];
    let Racktype = JSON.parse(JSON.stringify(vc3d_glob.device.getRacktype3d));
    const RacktypeLength = Racktype.length;

    console.error(
      "addCubeMergeNew    8888888888888888888888888888  Racktype = ",
      Racktype
    );
    Racktype.map((rt) => {
      rt.cubes = [];
    });

    for (let c = 1; c <= Racktype.length; c++) {
      //cubes.push([])
    }
    //console.log("RacktypeLength = ", RacktypeLength, "Racktype = ", Racktype);

    let dc_params1 = {};
    if (getDCOne && getDCOne.id) {
      dc_params1.dc = { id: getDCOne.id, name: getDCOne.name };
    } // данные РЦ
    dc_params1.racks = [];

    for (let x = x1; x < x2; x++) {
      let emptyX = false;
      position_x += k;
      //console.log("== x = ", x)
      if (Math.floor(x / empty_number1) === x / empty_number1) {
        emptyX = true;
        //console.log("x = ", x, "empty_number1 = ", empty_number1, "Math.floor(x / empty_number1) = ", Math.floor(x / empty_number1), "x / empty_number1 = ", x / empty_number1);
        empty_number1 += empty_step;
      } // два ряда стеллажей, значит если X делится на 2 - это следующий ряд
      if (Math.floor(x / empty_number2) === x / empty_number2) {
        emptyX = true;
        //console.log("x = ", x, "empty_number2 = ", empty_number2, "Math.floor(x / empty_number1) = ", Math.floor(x / empty_number1), "x / empty_number1 = ", x / empty_number1);
        empty_number2 += empty_step;
      } // два ряда стеллажей, значит если X делится на 2 - это следующий ряд

      //position_z = -(x2 - x1) / 2 * k; // для нового ряда вернем позицию по Z в исходное значение
      position_z = (-(z2 - z1) / 2) * k; // для нового ряда вернем позицию по Z в исходное значение

      for (let z = z1; z < z2; z++) {
        let emptyZ = false;
        position_z += k;
        if (Math.floor(z / 10) == z / 10) {
          emptyZ = true;
        } // два ряда стеллажей, значит если X делится на 2 - это следующий ряд
        var geometry = geo.clone();

        let position_y = 0;
        let type = 0; // 0 - empty, 1 - rack, 2 - ремонт, 3 - замена
        geometry.translate(position_x, position_y, position_z);

        let problems = [];
        let RandMinMax_RackType = this.getRandomMinMax(1, RacktypeLength - 1); //console.log("RandMinMax = " + RandMinMax)

        let RackObj = {};
        if (emptyZ || emptyX) {
          cubes_empty.push(geometry);
          type = 0;
        } else {
          // случайным образом назначим "проблему стеллажа" если 2 или 3, то добавим проблему
          //!!!const choose_random_type = this.getRandomNumber(2, "0123456789"); //console.log(choose_random_type)
          const choose_random_type = 1;

          const RandMinMax = this.getRandomMinMax(1, 55); //console.log("RandMinMax = " + RandMinMax)
          if (choose_random_type === 2) {
            cubes_remont.push(geometry);
            problems.push({ e: RandMinMax, pt: 2 }); // e = element of 3D model, pt - problem type
            type = 2;
          } else if (choose_random_type === 3) {
            cubes_zamena.push(geometry);
            problems.push({ e: RandMinMax, pt: 3 }); // e = element of 3D model, pt - problem type
            type = 3;
          } else {
            //const RandMinMax_RackType = this.getRandomMinMax(1, RacktypeLength); //console.log("RandMinMax = " + RandMinMax)
            if (Racktype[RandMinMax_RackType]) {
              let color = "#006";
              if (!Racktype[RandMinMax_RackType].color) {
                Racktype[RandMinMax_RackType].color = color;
              }
              if (!Racktype[RandMinMax_RackType].cubes) {
                Racktype[RandMinMax_RackType].cubes = [];
              }
              Racktype[RandMinMax_RackType].cubes.push(geometry);
            } else {
              console.error(
                "ERRRRRRRRRRRRRRRRRRR RandMinMax_RackType = ",
                RandMinMax_RackType,
                "Racktype = ",
                Racktype
              );
            }
            type = 1;
            //cubes.push(geometry);
          }
        }
        if (type === 0) RandMinMax_RackType = 0; // то есть если это не стеллаж, а проход, тогда RackType = 0

        //невидимые стеллажи, которые показываем только при клике на них
        //var one_cube = new THREE.Mesh(geo_selected, new THREE.MeshBasicMaterial( { visible: false, color: this.getRandomColor(), wireframe: true } ));
        var one_cube = new THREE.Mesh(
          geo_selected,
          new THREE.MeshBasicMaterial({
            visible: false,
            color: "#000",
            wireframe: true,
          })
        );
        one_cube.rotation.x = (-90 * Math.PI) / 180;
        one_cube.position.x = position_x;
        one_cube.position.y = position_y;
        one_cube.position.z = position_z;
        //one_cube.move_type = 1; //нужно ли двигать объект?
        one_cube.RACK = { type, rt: RandMinMax_RackType, x: x, z: z }; // type:  0 - empty, 1 - rack, 2 - ремонт, 3 - замена, rt - RACKTYPE

        //if(Racktype[RandMinMax_RackType] && Racktype[RandMinMax_RackType].color) { RackObj.color = Racktype[RandMinMax_RackType].color; }

        one_cube.wtype = "rack"; //
        one_cube.MODEL3D = 1; //
        vc3d_glob.ray_objects.push(one_cube); // тут те модели, которые можно выбирать r aycaster-ом
        vc3d_glob.SCENE.add(one_cube);

        // rt = rack - номер в таблице RackTypes, r - номер в таблице Rack, n - name/description
        RackObj = {
          rt: RandMinMax_RackType,
          x: x,
          z: z,
          type: type,
          px: position_x,
          pz: position_z,
        }; // type = 1 - RACK

        if (
          Racktype[RandMinMax_RackType] &&
          Racktype[RandMinMax_RackType].color
        ) {
          RackObj.color = Racktype[RandMinMax_RackType].color;
          one_cube.RACK.color = Racktype[RandMinMax_RackType].color;
        }
        if (getDCOne && getDCOne.id) {
          one_cube.RACK.dc = { id: getDCOne.id, name: getDCOne.name };
        } // данные РЦ

        //RackObj_cubes = { 'rt': 1, 'x': x, 'z': z, type: type, cube: one_cube }; // type = 1 - RACK
        if (problems.length > 0) {
          RackObj.p = problems;
          one_cube.RACK.p = problems;
        } // RackObj_cubes.p = problems;
        dc_params1.racks.push(RackObj);
      }
    }
    //console.log("dc_params1.racks = ", dc_params1.racks)
    //vc3d_glob.dc_params1_racks = dc_params1.racks;
    vc3d_glob.dc_params1 = dc_params1;

    Racktype.map((rt) => {
      if (rt.cubes && rt.cubes.length > 0) {
        var geometriesCubes = BufferGeometryUtils.mergeBufferGeometries(
          rt.cubes
        );

        if (!rt.color) {
          //console.log("================ !!! rt.color ==========================", rt);
        }

        var mesh = new THREE.Mesh(
          geometriesCubes,
          new THREE.MeshPhongMaterial({ color: rt.color, wireframe: false })
        );
        //var mesh = new THREE.Mesh(geometriesCubes, new THREE.MeshPhongMaterial( { color: "#004", wireframe: false } ));
        mesh.cubes = true;
        mesh.wtype = "rack"; //
        mesh.MODEL3D = 1; //
        vc3d_glob.SCENE.add(mesh);
        //console.log("eee44eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee rt = ", rt)
      }
    });

    if (cubes_remont.length > 0) {
      var geometriesCubes_remont =
        BufferGeometryUtils.mergeBufferGeometries(cubes_remont);
      var mesh = new THREE.Mesh(
        geometriesCubes_remont,
        new THREE.MeshPhongMaterial({
          color: vc3d_glob.rack_repair_color,
          wireframe: false,
        })
      );
      mesh.cubes = true;
      mesh.wtype = "rack"; //
      mesh.MODEL3D = 1; //
      vc3d_glob.SCENE.add(mesh);
    }

    if (cubes_zamena.length > 0) {
      var geometriesCubes_zamena =
        BufferGeometryUtils.mergeBufferGeometries(cubes_zamena);
      var mesh = new THREE.Mesh(
        geometriesCubes_zamena,
        new THREE.MeshPhongMaterial({
          color: vc3d_glob.rack_change_color,
          wireframe: false,
        })
      );
      mesh.cubes = true;
      mesh.wtype = "rack"; //
      mesh.MODEL3D = 1; //
      vc3d_glob.SCENE.add(mesh);
    }

    if (cubes_empty.length > 0) {
      var geometriesCubes_zamena =
        BufferGeometryUtils.mergeBufferGeometries(cubes_empty);
      var mesh = new THREE.Mesh(
        geometriesCubes_zamena,
        new THREE.MeshPhongMaterial({
          color: vc3d_glob.rack_empty_color,
          wireframe: false,
        })
      );
      mesh.cubes = true;
      mesh.wtype = "empty_rack"; //
      mesh.MODEL3D = 1; //
      vc3d_glob.SCENE.add(mesh);
    }
  }

  addCubeMergeNew_from_Params1(getDCOne) {
    //getDCOne - данные РЦ

    //console.log("getDCOne.params1 =====", getDCOne.params1, "getDCOne.params2 =====", getDCOne.params2)
    //console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!                       getDCOne = ", getDCOne)

    if (!getDCOne.params1) {
      getDCOne.params1 = "{}";
    }
    if (!getDCOne.params2) {
      getDCOne.params2 = "{}";
    }

    try {
      var params1_obj = eval("(" + getDCOne.params1 + ")");
      //var params2_obj = eval('(' + getDCOne.params2 + ')');
      if (params1_obj) {
        getDCOne.params1_obj = params1_obj;
      }

      var JSON_params2 = eval("(" + getDCOne.params2 + ")"); //console.log("JSON_params2 = ", JSON_params2)
      const cx = common.valOrDefault(JSON_params2.cx, 0);
      const cy = common.valOrDefault(JSON_params2.cy, 1000);
      const cz = common.valOrDefault(JSON_params2.cz, 500);
      vc3d_glob.CAMERA.position.set(cx, cy, cz);
      vc3d_glob.CAMERA.updateProjectionMatrix();
      vc3d_glob.CONTROLS.update();
      if (!vc3d_glob.animate) {
        i3d_all.animate3();
      }

      //console.log("addCubeMergeNew_from_Params1    CAMERA     cx = ", cx, "cy = ", cy, "cz = ", cz)
      //console.log("params1_obj =====", params1_obj)
    } catch (e) {
      console.error("addCubeMergeNew_from_Params1   ERRRRRORRRRR e ", e);
      return;
    }

    let cubes_remont2 = [],
      cubes_remont22 = [],
      cubes_zamena3 = [],
      cubes_zamena33 = [],
      cubes_remont_zamena33 = [],
      cubes_empty = [];
    var geo_selected = new THREE.BoxBufferGeometry(16, 16, 1);
    var geo = new THREE.BoxBufferGeometry(15, 1, 15);

    //const Racktype = [...vc3d_glob.device.getRacktype3d];
    //const Racktype = [];
    let Racktype = JSON.parse(JSON.stringify(vc3d_glob.device.getRacktype3d));
    const RacktypeLength = Racktype.length;

    //console.error("FROM PARAMS1    8888888888888888888888888888  Racktype = ", Racktype)
    Racktype.map((rt) => {
      rt.cubes = [];
    });

    if (
      params1_obj &&
      params1_obj.racks &&
      params1_obj.racks.length > 0 &&
      RacktypeLength > 0
    ) {
      if (getDCOne && getDCOne.id) {
        params1_obj.dc = { id: getDCOne.id, name: getDCOne.name };
      } // данные РЦ

      params1_obj.racks.map((rack) => {
        const RT = Racktype.find((obj, index) => {
          return obj.id === rack.rt;
        }); // найдем RackType - для определения имени типа стеллажа
        //if(!RT) { console.error("7777777777778888888888 ERRRRRRRRRRRRRRRRRRR rack.rt = ", rack.rt, "Racktype = ", Racktype) }
        //if(RT && RT.name) { //console.log("RT.name = " + RT.name); alert("RT.name = " + RT.name); }

        var geometry = geo.clone();
        let position_y = 0;
        geometry.translate(rack.px, position_y, rack.pz);

        let rack_type = 0;
        if (rack.rt > 0) rack_type = 1;

        rack_type = common.def_rack_type(rack_type, rack.p);

        if (rack_type === 0) {
          // 0 - empty, 1 - rack, 2 - ремонт, 3 - замена, 22 - 2+ ремонтов, 33 - 2+ замен, 23 - и ремонты и замены нужны
          cubes_empty.push(geometry);
        } else if (rack_type === 2) {
          cubes_remont2.push(geometry);
        } else if (rack_type === 22) {
          cubes_remont22.push(geometry);
        } else if (rack_type === 3) {
          cubes_zamena3.push(geometry);
        } else if (rack_type === 33) {
          cubes_zamena33.push(geometry);
        } else if (rack_type === 23) {
          cubes_remont_zamena33.push(geometry);
        } else if (rack_type === 1) {
          if (rack.rt != undefined && RT) {
            let color = "#006";
            if (!RT.color) {
              RT.color = color;
            }
            if (!RT.cubes) {
              RT.cubes = [];
            }
            RT.cubes.push(geometry);
          } else {
            console.error(
              "ERRRRRRRRRRRRRRRRRRR rack.rt = ",
              rack.rt,
              "Racktype = ",
              Racktype
            );
          }
        }

        //невидимые стеллажи, которые показываем только при клике на них
        var one_cube = new THREE.Mesh(
          geo_selected,
          new THREE.MeshBasicMaterial({
            visible: false,
            color: "#000",
            wireframe: true,
          })
        );
        one_cube.rotation.x = (-90 * Math.PI) / 180;
        //one_cube.position.x = position_x; one_cube.position.y = position_y; one_cube.position.z = position_z;
        one_cube.position.set(rack.px, position_y, rack.pz);
        //rt - RackType - тип стеллажа, а type показывает это проблемы стеллажа, но type - избыточен
        one_cube.RACK = { type: rack_type, rt: rack.rt, x: rack.x, z: rack.z }; // type:  0 - empty, 1 - rack, 2 - ремонт, 3 - замена, rt - RACKTYPE

        one_cube.wtype = "rack"; //
        one_cube.MODEL3D = 1; //
        vc3d_glob.ray_objects.push(one_cube); // тут те модели, которые можно выбирать r aycaster-ом
        vc3d_glob.SCENE.add(one_cube);

        if (rack.color) {
          one_cube.RACK.color = rack.color;
        }
        if (RT && RT.color) {
          one_cube.RACK.color = RT.color;
        }
        if (getDCOne && getDCOne.id) {
          one_cube.RACK.dc = { id: getDCOne.id, name: getDCOne.name };
        } // данные РЦ

        if (rack.p && rack.p.length > 0) {
          one_cube.RACK.p = rack.p;
        } //problems
      });
    }

    console.error(
      "RacktypeRacktypeRacktypeRacktypeRacktypeRacktypeRacktype = ",
      Racktype
    );
    Racktype.map((rt) => {
      if (rt.cubes && rt.cubes.length > 0) {
        //console.log("geometriesCubes = ", geometriesCubes)
        this.mergeCubes(rt.cubes, rt.color, "rack");

        // var geometriesCubes = BufferGeometryUtils.mergeBufferGeometries(rt.cubes);
        // var mesh = new THREE.Mesh(geometriesCubes, new THREE.MeshPhongMaterial( { color: rt.color, wireframe: false } ));
        // mesh.cubes = true;
        // mesh.wtype = "rack"; //
        // mesh.MODEL3D = 1; //
        // vc3d_glob.SCENE.add(mesh);

        //if(!rt.color) { //console.log("FROM PARAMS1 ================ !!! rt.color ==========================", rt); }
        //console.log("FROM PARAMS1 eee44eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee rt = ", rt)
      }
    });

    // rack_repair2_color: "#ff7",
    // rack_repair22_color: "#ff0",
    // rack_change3_color: "#a07",
    // rack_change33_color: "#a00",
    // rack_repair_change23_color: "#f00",

    if (cubes_remont2.length > 0) {
      this.mergeCubes(
        cubes_remont2,
        vc3d_glob.rack_repair2_color,
        "rack_repair2"
      );
    }
    if (cubes_remont22.length > 0) {
      this.mergeCubes(
        cubes_remont22,
        vc3d_glob.rack_repair22_color,
        "rack_repair22"
      );
    }

    if (cubes_zamena3.length > 0) {
      this.mergeCubes(
        cubes_zamena3,
        vc3d_glob.rack_change3_color,
        "rack_change3"
      );
    }
    if (cubes_zamena33.length > 0) {
      this.mergeCubes(
        cubes_zamena33,
        vc3d_glob.rack_change33_color,
        "rack_change33"
      );
    }

    if (cubes_remont_zamena33.length > 0) {
      this.mergeCubes(
        cubes_remont_zamena33,
        vc3d_glob.rack_repair_change23_color,
        "rack_repair_change23"
      );
    }

    if (cubes_empty.length > 0) {
      this.mergeCubes(cubes_empty, vc3d_glob.rack_empty_color, "empty_rack");
    }
  }

  mergeCubes(cubes_array, color, wtype) {
    var geometriesCubes_zamena =
      BufferGeometryUtils.mergeBufferGeometries(cubes_array);
    var mesh = new THREE.Mesh(
      geometriesCubes_zamena,
      new THREE.MeshPhongMaterial({ color: color, wireframe: false })
    );
    mesh.cubes = true;
    mesh.wtype = wtype; //"empty_rack"; //
    mesh.MODEL3D = 1; //
    vc3d_glob.SCENE.add(mesh);
  }

  rt_Listeners() {
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
    vc3d_glob.CONTROLS.addEventListener("change", function () {
      //console.log("==================================6788")
      vc3d_glob.renderer.render(vc3d_glob.SCENE, vc3d_glob.CAMERA);
    }); //! если Orbit или другой Control изменяется, тогда перерендерим всю сцену, это если animate () не включено

    document.addEventListener("wheel", function (e) {
      // "wheel" OR 'scroll'
      //console.log("scroll, e = ", e)
      vc3d_glob.renderer.render(vc3d_glob.SCENE, vc3d_glob.CAMERA);
    });

    window.addEventListener("keydown", function (e) {
      //console.log("keydown, e = ", e)
      //i3d_events.onDocument_keydown
    });
  }

  rt_SceneCameraLight() {
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

    vc3d_glob.raycaster = new THREE.Raycaster();
    var ambient = new THREE.AmbientLight("#fff");
    vc3d_glob.SCENE.add(ambient);

    vc3d_glob.CONTROLS = new OrbitControls(
      vc3d_glob.CAMERA,
      vc3d_glob.renderer.domElement
    );
    vc3d_glob.CONTROLS.update();
    vc3d_glob.renderer.setClearColor("#E9EAEE", 1);

    if (!vc3d_glob.no_SCENE_PARAMS) {
      i3d_base.SCENE_PARAMS();
    }
    i3d_base.add_only_plane_and_mouse_move(); // тут добавляем интерактив
  }

  createElementIn(id, ParentElement) {
    var firstElement = document.createElement("div");
    firstElement.id = id; //'firstElement';
    firstElement.style.width = "100%";
    firstElement.style.height = "100%";
    firstElement.style.marginLeft = "0px";
    firstElement.style.marginTop = "0px";
    ParentElement.appendChild(firstElement);
    return firstElement;
  }

  sceneSetup_SUPER_WORK(props) {
    const this1 = props.this1;
    vc3d_glob.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    vc3d_glob.renderer.setPixelRatio(window.devicePixelRatio);
    let elCanvas = this1.mount.appendChild(vc3d_glob.renderer.domElement);
    vc3d_glob.renderer.setSize(window.innerWidth, window.innerHeight);

    vc3d_glob.renderer.gammaOutput = true;
    let tl = objLoaders.getOffsetSum(elCanvas);
    vc3d_glob.canvas_top = tl.top;
    vc3d_glob.canvas_left = tl.left;
    objLoaders.rt_SceneCameraLight();
    objLoaders.rt_Custom();
    objLoaders.rt_Listeners();
    i3d_all.onWindowResize_AO();
  }

  //sceneSetup_SUPER (props) {
  //НЕ УДАЛЯТЬ, ТУТ МОНТИРУЕМ К ЭЛЕМЕНТУ
  sceneSetup(props) {
    const this1 = props.this1;
    vc3d_glob.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    vc3d_glob.renderer.setPixelRatio(window.devicePixelRatio);
    let elCanvas = this1.mount.appendChild(vc3d_glob.renderer.domElement);

    const width = elCanvas.clientWidth;
    const height = elCanvas.clientHeight;
    vc3d_glob.SCREEN_WIDTH = width;
    vc3d_glob.SCREEN_HEIGHT = height;
    vc3d_glob.renderer.setSize(width, height);
    //console.log("width", width, "height", height);
    vc3d_glob.renderer.gammaOutput = true;

    let tl = objLoaders.getOffsetSum(elCanvas);
    vc3d_glob.canvas_top = tl.top;
    vc3d_glob.canvas_left = tl.left;

    objLoaders.rt_SceneCameraLight();
    objLoaders.rt_Custom();
    objLoaders.rt_Listeners();

    i3d_all.onWindowResize_AO();
  }

  sceneSetup_ThreeJS___WORK() {
    vc3d_glob.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    vc3d_glob.renderer.setPixelRatio(window.devicePixelRatio);

    var container = document.getElementById("ThreeJS");

    //let elCanvas = this1.mount.appendChild( vc3d_glob.renderer.domElement );
    let elCanvas = container.appendChild(vc3d_glob.renderer.domElement);
    //console.log("elCanvas           =======         ", elCanvas)

    const width = elCanvas.clientWidth;
    const height = elCanvas.clientHeight;
    vc3d_glob.SCREEN_WIDTH = width;
    vc3d_glob.SCREEN_HEIGHT = height;

    vc3d_glob.renderer.setSize(width, height);
    //console.log("width", width, "height", height);
    vc3d_glob.renderer.gammaOutput = true;

    let tl = objLoaders.getOffsetSum(elCanvas);
    vc3d_glob.canvas_top = tl.top;
    vc3d_glob.canvas_left = tl.left;

    objLoaders.rt_SceneCameraLight();
    objLoaders.rt_Custom();
    objLoaders.rt_Listeners();

    i3d_all.onWindowResize_AO();
  }

  sceneSetup_ThreeJS(mode) {
    //alert("sceneSetup_ThreeJS (mode) " + mode)

    if (mode === "ALL") {
      vc3d_glob.renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
      });
      vc3d_glob.renderer.setPixelRatio(window.devicePixelRatio);

      var container = document.getElementById("ThreeJS");

      //let elCanvas = this1.mount.appendChild( vc3d_glob.renderer.domElement );
      let elCanvas = container.appendChild(vc3d_glob.renderer.domElement);
      //console.log("elCanvas           =======         ", elCanvas)
      //console.log("device           =======         ", device)

      const width = elCanvas.clientWidth;
      const height = elCanvas.clientHeight;
      vc3d_glob.SCREEN_WIDTH = width;
      vc3d_glob.SCREEN_HEIGHT = height;

      vc3d_glob.renderer.setSize(width, height);
      //console.log("width", width, "height", height);
      vc3d_glob.renderer.gammaOutput = true;

      let tl = objLoaders.getOffsetSum(elCanvas);
      vc3d_glob.canvas_top = tl.top;
      vc3d_glob.canvas_left = tl.left;

      objLoaders.rt_SceneCameraLight();
      objLoaders.rt_Listeners();
      objLoaders.rt_Custom();
    } else if (mode === "CUSTOM") {
      //alert(mode)
      objLoaders.rt_Custom();
    }

    i3d_all.onWindowResize_AO();
  }
}

let objLoaders = new ObjLoaders();
export default objLoaders;
