
import * as THREE from 'three';

import { i3d_ao3 } from "./f8_ao3.js";
import { i3d_down_up } from "./f88_down.js";
import { i3d_events_func } from "./f8_events_func.js";

import { i3d_mats } from "./f2_mats.js";
import { app } from "./f9_appvue.js";
import { i3d_all } from "./f7_assist.js";
import { i3d_app_sets } from "./f3_apparat_sets.js";
import { vc3d_glob } from "./f5_vc3d_glob.js";


class i3d_Dop {


     repair_W() {
            
        // vc3d_glob.currentRT - rack 3d model    has DC = {dc, x, z }
        // vc3d_glob.currentDCRack   - from DC params1 - with problems description
  
        if(device.getDCOne.params1_obj && device.getDCOne.params1_obj.racks 
          && device.getActive3dElement && device.getActiveRackType3d.RACK) {
          
          const rack = device.getDCOne.params1_obj.racks.find((obj, index) => { 
            return ( obj.x == device.getActive3dElement.x && obj.z == device.getActive3dElement.z) })
      
          if(rack) {
            //console.log("1 rack = ", rack)
      
            if(!rack.p) { 
              //rack.p = [ {'e': device.getActiveRackType3d.RACK.name, 'pt': 2 }];
              rack.p = [ {'e': device.getActive3dElement.elementName, 'pt': 2 }];
              rack.type = 2;
            } else {
              //идем по массиву p (problems) и проверяем нет ли там элемента с именем device.getActiveRackType3d.RACK.name
              // temp:
              rack.p = [ {'e': device.getActive3dElement.elementName, 'pt': 2 }];
              rack.type = 2;
      
            }
          } else {
            //console.log("NO rack = ", rack)
          }
          device.getDCOne.params1 = JSON.stringify(device.getDCOne.params1_obj)
          //console.log("device.getDCOne.params1 = ", device.getDCOne.params1)
      
          try{
              //console.log("UPDATE oneValue = =  = = =", oneValue)
              fetchDCUpdate(device.getDCOne); 
          } catch (e) {
              common.coi_sys("UPDATE ERROR", e)
              alert(e.response.data.message); // Пользователь с таким email уже существует
          }
      
        } else {
          console.error("ERRRRRRRRRRRRRRRRRRR device.getDCOne.params1_obj")
        }
      
      
      }
//l oad_gltf_2021(model3d_path, params1, params2) {
    load_gltf_2021_W(RT, DC) {
        try {
            //console.log("l oad_gltf_2021  DC = ", DC, "RT = ", RT  )
            //+ "typeof = " + typeof RT.params1 +",    RT.params1 = !", RT.params1 
            //+ "typeof = " + typeof RT.params2 +",    RT.params2 = !", RT.params2
            //+ "!   RT.model3d = ", RT.model3d 
            //+ "vc3d_glob.device.getDCOne = ", vc3d_glob.device.getDCOne 
            //);
        
            let wl_1 = {}
            var onProgress = function (xhr) { 
                //console.log( `${( xhr.loaded / xhr.total * 100 )}% loaded` ); 
            }
            var onError_gltf = function (error) { console.error( 'An error happened', error ); };
            
       
            var loader = new GLTFLoader();
            
            //loader.load('../o4bVjzEGtvIxEZUq/ikrand1.gltf',function (gltf) {
            loader.load("../" + RT.model3d,function (gltf) {
                var gltf_model = gltf.scene;
                
                //! const boundingBox = new THREE.Box3().setFromObject(gltf.scene); let size = boundingBox.getSize(); //console.log("4444444444      =                size", size)
        
                vc3d_glob.ray_objects.push(gltf.scene);  // тут те модели, которые можно выбирать r aycaster-ом
                
                gltf.scene.move_type = 0; //parseInt(wl_1.move_type); //нужно ли двигать объект?
                gltf.scene.MODEL3D = 1; //
                gltf.scene.wtype = "gltf"; //
                if(DC) { gltf.scene.DC = DC; }
                
    
                // PARAMS ////////////////////////////////////////////////////////////////////
                if(!RT.params1) RT.params1 = "{}"; 
                if(!RT.params2) RT.params2 = "{}";
                
                //console.log("gltf.scene.DC = ", gltf.scene.DC);
                //console.log("RT.params2 = ", RT.params2); //alert(params1)
                
                //45678
                try{
                    if(typeof RT.params1 === "string" && typeof RT.params2 === "string") {
                        var JSON_params1 = eval('(' + RT.params1 + ')'); //console.log("JSON_params1 = ", JSON_params1)
                        if(JSON_params1.size) { gltf.scene.scale.set(JSON_params1.size, JSON_params1.size, JSON_params1.size); }
                        const x = JSON_params1.x || 0; const y = JSON_params1.y || 0; const z = JSON_params1.z || 0;
                        gltf.scene.position.set(x, y, z);
                        
                        var JSON_params2 = eval('(' + RT.params2 + ')'); //console.log("JSON_params2 = ", JSON_params2)
                        const cx = common.valOrDefault(JSON_params2.cx, 0); 
                        const cy = common.valOrDefault(JSON_params2.cy, 1000);
                        const cz = common.valOrDefault(JSON_params2.cz, 500);
                        vc3d_glob.CAMERA.position.set(cx, cy, cz); 
                        vc3d_glob.CAMERA.updateProjectionMatrix();
                        
                        //console.log("l oad_gltf_2021    CAMERA     cx = ", cx, "cy = ", cy, "cz = ", cz)
                        if (!vc3d_glob.animate) { i3d_all.animate3(); }
        
        
                    } else {
                        console.error("ERRRR params12 NOT STRING !!!! typeof RT.params1 = ", typeof RT.params1, "typeof RT.params2 = ", typeof RT.params2)
        
                    }
                } catch(e) {
                    console.error("ERRRR params12", e)
                }
            
                //////////////////////////////////////////////////////////////////////
        
                gltf.scene.model_unid = RT.id || i3d_all.gener_name_to_input(16, '#aA');
        
        
                let data_rows = [], data_count = 1; // список элементов модели
        
                gltf.scene.traverse(function (child) {
        
                    if (child.isMesh) {
                        if (vc3d_glob.shadow) { child.castShadow = true; child.receiveShadow = true; }
            
                        vc3d_glob.ray_objects.push(child);  // тут те модели, которые можно выбирать r aycaster-ом
            
                        child.material.needsUpdate = true;
                        child.model_unid = gltf.scene.model_unid;
                        if(DC) { child.DC = DC; }
        
                        // заполняем список элементов модели:
                        data_rows.push({id: data_count, model_unid: gltf.scene.model_unid, name: child.name, active: 0, el: child });
        
                        data_count++;
        
                        /*==== Раскрасим модель просто цветом =========================================================*/
                        //wl_1.colored = "1"
                        if (wl_1.colored == "1") {
                            child.material.color = new THREE.Color("#00f"); //0x444444
                            child.material.emissive = new THREE.Color("#00f");;
                            child.material.emissiveIntensity = 1;
                        }
    
                        // if( child.name === "stoyka004") {
                        //     //console.log("stoyka001  stoyka001  stoyka001  !!!")
                        //     child.material.color = new THREE.Color("#0f0");
                        //     child.material.wireframe = true;
                        // }
                        // if( child.name === "polka_31") {
                        //     //console.log("stoyka001  stoyka001  stoyka001  !!!")
                        //     child.material.color = new THREE.Color("#f00");
                        //     child.material.wireframe = true;
                        // }
                        // //console.log("4!!!!!!!!!5      child.name = !" + child.name, "! child.material.color = ", child.material.color) //, "child.material = ", child.material)
    
                        //console.log("RT.p", RT.p)
                        //i3d_events_func.find_obj(vc3d_glob.SCENE, obj.model_unid, obj.name, i3d_events_func.temp_mat_curr_obj_2021);
                        if(RT.p) { // значит у стеллажа есть проблемы
                            //child.material.color = new THREE.Color("#f00");
                            RT.p.map((probl) => {
    
                                if(probl.e === child.name) {
                                    
                                    //console.log("4!!!!!!!!!5      child.name = ", child.name, "probl.e = ", probl.e, "child.material.color = ", child.material.color, "child.material = ", child.material)
    
                                    child.material.color = new THREE.Color("#ff0");
                                    child.material.opacity = 0.5;
                                    //child.material.wireframe = true;
                                    
                                    //i3d_events_func.find_obj(vc3d_glob.SCENE, gltf.scene.model_unid, probl.e
                                    //    , i3d_events_func.temp_mat_curr_obj_2021);
                                    
                                } else if( child.name === "stoyka001") {
                                    //console.log("stoyka001  stoyka001  stoyka001  !!!")
                                    //child.material.color = new THREE.Color("#0f0");
                                    //child.material.wireframe = true;
    
                                } else {
                                    //child.material.color = new THREE.Color("#f00");
    
                                }
                            })
                        }
    
        
                    }
                });
            
        
                // заполняем список элементов модели:
                vc3d_glob.device.setModelRack3d(data_rows)
                vc3d_glob.device.setModelRack3dTotal(data_count)
        
    
    
    
                gltf.scene.RACK = { name: RT.name, type: RT.rt, 'rt': RT.rt, 'x': DC.x, 'z': DC.z }; // type:  0 - empty, 1 - rack, 2 - ремонт, 3 - замена, rt - RACKTYPE
                if(vc3d_glob.device.getDCOne && vc3d_glob.device.getDCOne.id) { 
                    gltf.scene.RACK.dc = { id: vc3d_glob.device.getDCOne.id, name: vc3d_glob.device.getDCOne.name } 
                } // данные РЦ
                if(RT.p && RT.p.length > 0) { gltf.scene.RACK.p = RT.p;  }  //problems
    
    
    
    
                vc3d_glob.device.setActiveRackType3d(gltf.scene);
                vc3d_glob.device.setActive3dElement({}) //vc3d_glob.curr_obj.DC
    
                //console.log("gltf.scene = ", gltf.scene, "vc3d_glob.device.getActiveRackType3d = ", vc3d_glob.device.getActiveRackType3d)
    
    
    
                vc3d_glob.SCENE.add(gltf.scene);
                //vc3d_glob.CAMERA.updateProjectionMatrix();
                //alert(94)
        
                //!!!!!!!!!!!!!!!!
                i3d_all.onWindowResize_AO()
        
                //console.log("===============1==================vc3d_glob.SCENE.children = ", vc3d_glob.SCENE.children);
        
                //if (!vc3d_glob.animate) { i3d_all.animate3(); }
        
        
                /**/        
                //vc3d_glob.SCENE.add(gltf_model);
        
            //}, onProgress, onError_gltf);
            //}, onProgress);
            });
        
        } catch (e) { i3d_all.c_sys("ERROR mess: " + e.name + ": " + e.message, "e = ", e); }
        
        }
    
    load_gltf_2021_WORK(model3d_path, params1, params2) {
        try {
            //console.log("l oad_gltf_2021  " 
            //+ "typeof = " + typeof params1 +",    params1 = !", params1 
            //+ "typeof = " + typeof params2 +",    params2 = !", params2
            //+ "!   model3d_path = ", model3d_path );
        
            let wl_1 = {}
            var onProgress = function (xhr) { 
                //console.log( `${( xhr.loaded / xhr.total * 100 )}% loaded` ); 
            }
            var onError_gltf = function (error) { console.error( 'An error happened', error ); };
            
            //wl_1.obj_path = "../etYoTBaStlPEYbOD/5d.gltf";
            //wl_1.obj_path = "../models3d/11d.glb";
            
            wl_1.obj_path = "../models3d/2d.glb";
            //wl_1.obj_path = "../models3d/sss1.glb";
            //{ size: 1 }
        
            //wl_1.obj_path = "../o4bVjzEGtvIxEZUq/ikrand1.gltf";
        
            var loader = new GLTFLoader();
            
            //loader.load('../o4bVjzEGtvIxEZUq/ikrand1.gltf',function (gltf) {
            loader.load("../" + model3d_path,function (gltf) {
                var gltf_model = gltf.scene;
                
                //! const boundingBox = new THREE.Box3().setFromObject(gltf.scene); let size = boundingBox.getSize(); //console.log("4444444444      =                size", size)
        
                vc3d_glob.ray_objects.push(gltf.scene);  // тут те модели, которые можно выбирать r aycaster-ом
                
                gltf.scene.move_type = 0; //parseInt(wl_1.move_type); //нужно ли двигать объект?
                gltf.scene.MODEL3D = 1; //
                gltf.scene.wtype = "gltf"; //
                
        
                // PARAMS ////////////////////////////////////////////////////////////////////
                if(!params1) params1 = "{}"; if(!params2) params2 = "{}";
                
                //console.log("params1 = ", params1);
                //console.log("params2 = ", params2); //alert(params1)
                
                //45678
                try{
                    if(typeof params1 === "string" && typeof params2 === "string") {
                        var JSON_params1 = eval('(' + params1 + ')'); //console.log("JSON_params1 = ", JSON_params1)
                        if(JSON_params1.size) { gltf.scene.scale.set(JSON_params1.size, JSON_params1.size, JSON_params1.size); }
                        const x = JSON_params1.x || 0; const y = JSON_params1.y || 0; const z = JSON_params1.z || 0;
                        gltf.scene.position.set(x, y, z);
                        
                        var JSON_params2 = eval('(' + params2 + ')'); //console.log("JSON_params2 = ", JSON_params2)
                        const cx = common.valOrDefault(JSON_params2.cx, 0); 
                        const cy = common.valOrDefault(JSON_params2.cy, 1000);
                        const cz = common.valOrDefault(JSON_params2.cz, 500);
                        vc3d_glob.CAMERA.position.set(cx, cy, cz); 
                        vc3d_glob.CAMERA.updateProjectionMatrix();
                        vc3d_glob.CONTROLS.update();
                        
                        //console.log("load_gltf_2021    CAMERA     cx = ", cx, "cy = ", cy, "cz = ", cz)
                        if (!vc3d_glob.animate) { i3d_all.animate3(); }
        
        
                    } else {
                        console.error("ERRRR params12 NOT STRING !!!! typeof params1 = ", typeof params1, "typeof params2 = ", typeof params1)
        
                    }
                } catch(e) {
                    console.error("ERRRR params12", e)
                }
            
                //////////////////////////////////////////////////////////////////////
        
                gltf.scene.model_unid = wl_1.model_unid || i3d_all.gener_name_to_input(16, '#aA');
        
        
                let data_rows = [], data_count = 1; // список элементов модели
        
                gltf.scene.traverse(function (child) {
        
                    if (child.isMesh) {
                        if (vc3d_glob.shadow) { child.castShadow = true; child.receiveShadow = true; }
            
                        vc3d_glob.ray_objects.push(child);  // тут те модели, которые можно выбирать r aycaster-ом
            
                        child.material.needsUpdate = true;
                        child.model_unid = gltf.scene.model_unid;
        
                        // заполняем список элементов модели:
                        data_rows.push({id: data_count, model_unid: gltf.scene.model_unid, name: child.name, active: 0, el: child });
        
                        data_count++;
        
                        /*==== Раскрасим модель просто цветом =========================================================*/
                        if (wl_1.colored == "1") {
                            child.material.color = new THREE.Color("#00f"); //0x444444
                            child.material.emissive = new THREE.Color("#00f");;
                            child.material.emissiveIntensity = 1;
                        }
        
                    }
                });
            
        
                // заполняем список элементов модели:
                vc3d_glob.device.setModelRack3d(data_rows)
                vc3d_glob.device.setModelRack3dTotal(data_count)
        
                vc3d_glob.SCENE.add(gltf.scene);
                //vc3d_glob.CAMERA.updateProjectionMatrix();
        
                //!!!!!!!!!!!!!!!!
                i3d_all.onWindowResize_AO()
        
                //console.log("===============1==================vc3d_glob.SCENE.children = ", vc3d_glob.SCENE.children);
        
                //if (!vc3d_glob.animate) { i3d_all.animate3(); }
        
        
                /**/        
                //vc3d_glob.SCENE.add(gltf_model);
        
            //}, onProgress, onError_gltf);
            //}, onProgress);
            });
        
        } catch (e) { i3d_all.c_sys("ERROR mess: " + e.name + ": " + e.message, "e = ", e); }
        
        }


    /** /
    if (parseInt(set.light1_type)) { this.add_light_and_sphere(1, set.light1_x, set.light1_y, set.light1_z, set.light1_color, set.light1_type); };
    if (parseInt(set.light2_type)) { this.add_light_and_sphere(2, set.light2_x, set.light2_y, set.light2_z, set.light2_color, set.light2_type); };
    if (parseInt(set.light3_type)) { this.add_light_and_sphere(3, set.light3_x, set.light3_y, set.light3_z, set.light3_color, set.light3_type); };
    if (parseInt(set.light4_type)) { this.add_light_and_sphere(4, set.light4_x, set.light4_y, set.light4_z, set.light4_color, set.light4_type); };
    /**/
// OLD
add_light_and_sphere(i, light_x, light_y, light_z, light_color, light_type) { //

    light_x = parseInt(light_x); light_y = parseInt(light_y); light_z = parseInt(light_z); light_type = parseInt(light_type);
    alert(i + ", " + light_x + ", " + light_y + ", " + light_z + ", " + light_color + ", " + light_type);

    if (light_type == 1 || light_type == 11) {
        var newObj = new THREE.SpotLight(light_color, 2);
        if (vc3d_glob.shadow) { newObj.castShadow = true; }
        newObj.angle = 0.73;
        newObj.penumbra = 0.2;
        newObj.decay = 2;
        newObj.distance = 50000;


        if (vc3d_glob.shadow) {
            newObj.shadow.mapSize.width = 1024;
            newObj.shadow.mapSize.height = 1024;
        }

        if (light_type > 10) {
            vc3d_glob["light_helper" + i] = new THREE.SpotLightHelper(newObj);
            vc3d_glob.SCENE.add(vc3d_glob["light_helper" + i]);
            vc3d_glob["light_helper" + i].name1 = "light_helper_" + i;
        }

    } else if (light_type == 2 || light_type == 22) {

        var newObj = new THREE.DirectionalLight(light_color, 1);

        if (vc3d_glob.shadow) {
            newObj.castShadow = true;
            newObj.shadow.mapSize.width = 2048;
            newObj.shadow.mapSize.height = 2048;
            var d = 50;
            newObj.shadow.vc3d_glob.CAMERA.left = -d;
            newObj.shadow.vc3d_glob.CAMERA.right = d;
            newObj.shadow.vc3d_glob.CAMERA.top = d;
            newObj.shadow.vc3d_glob.CAMERA.bottom = -d;
            newObj.shadow.vc3d_glob.CAMERA.far = 3500;
            newObj.shadow.bias = -0.0001;
        }
        if (light_type > 10) {
            vc3d_glob["light_helper" + i] = new THREE.DirectionalLightHelper(newObj, 10000);
            vc3d_glob["light_helper" + i].name1 = "light_helper_" + i;
            vc3d_glob.SCENE.add(vc3d_glob["light_helper" + i]);
        }

    } else if (light_type == 3 || light_type == 33) {

        var newObj = new THREE.PointLight(light_color, 1, 115001);

        vc3d_glob.SCENE.add(newObj);

        if (vc3d_glob.shadow) { newObj.castShadow = true; }

        if (light_type > 10) {
            vc3d_glob["light_helper" + i] = new THREE.PointLightHelper(newObj, 10000);
            vc3d_glob["light_helper" + i].name1 = "light_helper_" + i;
            vc3d_glob.SCENE.add(vc3d_glob["light_helper" + i]);
        }

    } else {

        var newObj = new THREE.HemisphereLight(0x999999, 0x999999, 1);
        vc3d_glob.SCENE.add(newObj);

    }

    vc3d_glob["light_" + i] = newObj; // vc3d_glob["light_1"]    vc3d_glob.light_1
    vc3d_glob["light_" + i].position.set(light_x, light_y, light_z);
    vc3d_glob["light_" + i].num1 = i;
    vc3d_glob["light_" + i].name1 = "light_" + i;

    vc3d_glob.SCENE.add(vc3d_glob["light_" + i]);

    //  a dd_light_sphere  ////////////////////////////////////////////////
    var editor_sphere_diameter = 1; if (vc3d_glob.light_sphere > 0) { editor_sphere_diameter = vc3d_glob.light_sphere; };
    var newSphereGeom = new THREE.SphereGeometry(editor_sphere_diameter, editor_sphere_diameter, editor_sphere_diameter);
    vc3d_glob["light_sphere" + i] = new THREE.Mesh(newSphereGeom, new THREE.MeshBasicMaterial({ color: light_color }));
    vc3d_glob["light_sphere" + i].position.set(light_x, light_y, light_z);
    vc3d_glob["light_sphere" + i].light_sphere = true;
    vc3d_glob["light_sphere" + i].light_num = i;

    vc3d_glob.ray_objects.push(vc3d_glob["light_sphere" + i]);

    vc3d_glob["light_sphere" + i].name1 = "light_sphere" + i;

    if (vc3d_glob.light_sphere > 0) { vc3d_glob.SCENE.add(vc3d_glob["light_sphere" + i]); }  // НЕ УДАЛЯТЬ   - ДОБАВЛЕНИЕ СФЕРЫ СВЕТА !!!

    vc3d_glob["light_sphere" + i].position.set(light_x, light_y, light_z);
}

    //i3d_dop.planeV();
    planeV(corner_true, x, y, z, rx, ry, rz) {

    var planeGeometry = new THREE.PlaneGeometry(1100,1500,1,1);
	var planeMaterial = new THREE.MeshBasicMaterial({color: 0xcc00cc});
	vc3d_glob.plane = new THREE.Mesh(planeGeometry,planeMaterial);
	if(x) { vc3d_glob.plane.position.x = x; } else { vc3d_glob.plane.position.x = 0; } 
	if(x) { vc3d_glob.plane.position.y = y; } else { vc3d_glob.plane.position.x = 0; }
	if(x) { vc3d_glob.plane.position.z = z; } else { vc3d_glob.plane.position.x = 0; }
	if(rx) { vc3d_glob.plane.rotation.x = rx; } //-0.5*Math.PI;
	if(ry) { vc3d_glob.plane.rotation.y = ry; }
    if(rz) { vc3d_glob.plane.rotation.z = rz; }
    
    //vc3d_glob.plane.rotation.x = -0.5*Math.PI;

    vc3d_glob.plane.move_type = 1; //нужно ли двигать объект?
    vc3d_glob.ray_objects.push(vc3d_glob.plane);  // тут те модели, которые можно выбирать r aycaster-ом
    vc3d_glob.SCENE.add(vc3d_glob.plane);
    
    //coi(vc3d_glob.plane, "vc3d_glob.plane");


    //rotatePlane(x, y, z, plane);
    //i3d_base.rotatePlane(1, 0, 1, vc3d_glob.plane);

    /** * /
    i3d_base.sphereV(vc3d_glob.plane.geometry.vertices[0].x, vc3d_glob.plane.geometry.vertices[0].y, vc3d_glob.plane.geometry.vertices[0].z)
    i3d_base.sphereV(vc3d_glob.plane.geometry.vertices[1].x, vc3d_glob.plane.geometry.vertices[1].y, vc3d_glob.plane.geometry.vertices[1].z)
    i3d_base.sphereV(vc3d_glob.plane.geometry.vertices[2].x, vc3d_glob.plane.geometry.vertices[2].y, vc3d_glob.plane.geometry.vertices[2].z)
    i3d_base.sphereV(vc3d_glob.plane.geometry.vertices[3].x, vc3d_glob.plane.geometry.vertices[3].y, vc3d_glob.plane.geometry.vertices[3].z)
    /** * /
    var v0 = new THREE.Vector3(); //coi(v0, "111    v0");
    vc3d_glob.plane.localToWorld(v0); //coi(v0, "222    v0");
    i3d_base.sphereV2(v0); 

    var v1 = new THREE.Vector3(); vc3d_glob.plane.localToWorld(v1); i3d_base.sphereV2(v1); 
    var v2 = new THREE.Vector3(); vc3d_glob.plane.localToWorld(v2); i3d_base.sphereV2(v2); 
    var v3 = new THREE.Vector3(); vc3d_glob.plane.localToWorld(v3); i3d_base.sphereV2(v3); 
    /** */
    var v0 = vc3d_glob.plane.geometry.vertices[0]; //coi(v0, "111    v0");
    v0 = vc3d_glob.plane.localToWorld(v0); //coi(v0, "222    v0");
    i3d_base.sphereV2(v0); 

    var v1 = vc3d_glob.plane.geometry.vertices[1]; v1 = vc3d_glob.plane.localToWorld(v1); i3d_base.sphereV2(v1); 
    var v2 = vc3d_glob.plane.geometry.vertices[2]; vc3d_glob.plane.localToWorld(v2); i3d_base.sphereV2(v2); 
    var v3 = vc3d_glob.plane.geometry.vertices[3]; vc3d_glob.plane.localToWorld(v3); i3d_base.sphereV2(v3); 
    

    if(corner_true) {

        //i3d_dop.planeV(vc3d_glob.plane..x, vc3d_glob.plane.geometry.vertices[0].y, vc3d_glob.plane.geometry.vertices[0].z)
    }

    var radius = 40, widthSegments = 10, heightSegments = 10;
    //var geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength);
    var geometry_sphere = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
	var material_sphere = new THREE.MeshBasicMaterial({color: 0x5500ff});
	vc3d_glob.sphereV = new THREE.Mesh(geometry_sphere, material_sphere);
    vc3d_glob.sphereV.move_type = 1; //нужно ли двигать объект?
    vc3d_glob.sphereV.position.x = 0; vc3d_glob.sphereV.position.y = 0; vc3d_glob.sphereV.position.z = 0; 
    vc3d_glob.sphereV.V = true;
    vc3d_glob.ray_objects.push(vc3d_glob.sphereV);  // тут те модели, которые можно выбирать r aycaster-ом
    vc3d_glob.SCENE.add(vc3d_glob.sphereV);



 }

 //if (vc3d_glob.curr_obj_all.V) { i3d_base.d(vc3d_glob.curr_obj_all.position, ) }
 d( v1, v2 ) {
    var dx = v1.x - v2.x;
    var dy = v1.y - v2.y;
    var dz = v1.z - v2.z;

    return Math.sqrt( dx * dx + dy * dy + dz * dz );
}

sphereV(x, y, z) {
    //coi(plane, "plane");
    var radius = 20, widthSegments = 10, heightSegments = 10;
    var geometry_sphere = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
	var material_sphere = new THREE.MeshBasicMaterial({color: 0x5590ff});
	var sphere = new THREE.Mesh(geometry_sphere, material_sphere);
    sphere.move_type = 1; //нужно ли двигать объект?
    sphere.position.x = x; sphere.position.y = y; sphere.position.z = z; 
    vc3d_glob.ray_objects.push(sphere);  // тут те модели, которые можно выбирать r aycaster-ом
    vc3d_glob.SCENE.add(sphere);
 }
 sphereV2(v) {
    //coi(v, "sphereV2  v");
    var radius = 20, widthSegments = 10, heightSegments = 10;
    var geometry_sphere = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
	var material_sphere = new THREE.MeshBasicMaterial({color: 0x5590ff});
	var sphere = new THREE.Mesh(geometry_sphere, material_sphere);
    sphere.move_type = 1; //нужно ли двигать объект?
    sphere.position.x = v.x; sphere.position.y = v.y; sphere.position.z = v.z; 
    vc3d_glob.ray_objects.push(sphere);  // тут те модели, которые можно выбирать r aycaster-ом
    vc3d_glob.SCENE.add(sphere);
 }

 find_angle_XY(A,B,C) {
    var AB = Math.sqrt(Math.pow(B.x-A.x,2)+ Math.pow(B.y-A.y,2));    
    var BC = Math.sqrt(Math.pow(B.x-C.x,2)+ Math.pow(B.y-C.y,2)); 
    var AC = Math.sqrt(Math.pow(C.x-A.x,2)+ Math.pow(C.y-A.y,2));
    var a = Math.acos((BC*BC+AB*AB-AC*AC)/(2*BC*AB));
    //c("AB = " + AB + ", BC = " + BC + ", AC = " + AC + ", a = " + a);
    //c("A.x = " + Math.ceil(A.x) + ", A.y = " + Math.ceil(A.y) + ", B.x = " + Math.ceil(B.x) + ", B.y = " + Math.ceil(B.y) + ", C.x = " + Math.ceil(C.x) + ", C.y = " + Math.ceil(C.y));

    return Math.acos((BC*BC+AB*AB-AC*AC)/(2*BC*AB));
}
find_angle_XZ_W(A,B,C) {
    var AB = Math.sqrt(Math.pow(B.x-A.x,2)+ Math.pow(B.z-A.z,2));    
    var BC = Math.sqrt(Math.pow(B.x-C.x,2)+ Math.pow(B.z-C.z,2)); 
    var AC = Math.sqrt(Math.pow(C.x-A.x,2)+ Math.pow(C.z-A.z,2));
    var a = Math.acos((BC*BC+AB*AB-AC*AC)/(2*BC*AB));
    //c("AB = " + AB + ", BC = " + BC + ", AC = " + AC + ", a = " + a);
    //c("A.x = " + Math.ceil(A.x) + ", A.z = " + Math.ceil(A.z) + ", B.x = " + Math.ceil(B.x) + ", B.z = " + Math.ceil(B.z) + ", C.x = " + Math.ceil(C.x) + ", C.z = " + Math.ceil(C.z));

    return Math.acos((BC*BC+AB*AB-AC*AC)/(2*BC*AB));
}
find_angle_XZ_WORK(A,B,C) {
        //Make sure axis is a unit vector (has length 1), and angle is in radians.
        //Object3D.rotateOnAxis( axis, angle ) rotates on an axis in object space.
        //Object3D.rotateOnWorldAxis( axis, angle ) rotates on an axis in world space.

    var AB = Math.sqrt(Math.pow(B.x-A.x,2)+ Math.pow(B.z-A.z,2));    
    var BC = Math.sqrt(Math.pow(B.x-C.x,2)+ Math.pow(B.z-C.z,2)); 
    var AC = Math.sqrt(Math.pow(C.x-A.x,2)+ Math.pow(C.z-A.z,2));
    var a = Math.acos((BC*BC+AB*AB-AC*AC)/(2*BC*AB));
    //c("AB = " + AB + ", BC = " + BC + ", AC = " + AC + ", a = " + a);

    var vector_BA = { x: A.x - B.x, y: A.y - B.y, z: A.z - B.z };
    var vector_BC = { x: C.x - B.x, y: C.y - B.y, z: C.z - B.z };
    var multiply_v = vector_BA.x * vector_BC.x + vector_BA.y * vector_BC.y + vector_BA.z * vector_BC.z;
    var KOSOE_multiply_v_2D = vector_BA.x * vector_BC.y - vector_BA.y * vector_BC.x; // + vector_BA.z * vector_BC.z;
    //var a1 = Math.acos((multiply_v) / (AB * BC));
    var cos = multiply_v / (AB * BC);
    var a1 = Math.acos(cos);
    /** * /
    //c("A.x = " + Math.ceil(A.x) + ", A.z = " + Math.ceil(A.z) + ", B.x = " + Math.ceil(B.x) + ", B.z = " + Math.ceil(B.z) 
    + ", C.x = " + Math.ceil(C.x) + ", C.z = " + Math.ceil(C.z) 
    + ", a1 = " + Math.ceil(a1 * 100) / 100 + ", a1_GRAD = " + Math.ceil(a1 * 180 / Math.PI * 100) / 100 
    + ", cos = " + Math.ceil(cos * 100) / 100);
    /** * /
    if(KOSOE_multiply_v_2D < 0) {
        //c("vector_BA.x * vector_BC.y = " + Math.ceil(vector_BA.x * vector_BC.y) 
        + ", vector_BA.y * vector_BC.x = " + Math.ceil(vector_BA.y * vector_BC.x)  
        + ", a1 = " + Math.ceil(a1 * 100) / 100 
        + ", a1_GRAD = " + Math.ceil(a1 * 180 / Math.PI * 100) / 100 
        + ", KOSOE_multiply_v_2D = " + KOSOE_multiply_v_2D 
        + ", cos = " + Math.ceil(cos * 100) / 100);
    }
    /** */

    //return Math.acos((BC*BC+AB*AB-AC*AC)/(2*BC*AB));
    return { angle: a1, cos: cos, KOSOE_multiply_v_2D: KOSOE_multiply_v_2D };

}
find_angle_XZ(A,B,C) {
    //Make sure axis is a unit vector (has length 1), and angle is in radians.
    //Object3D.rotateOnAxis( axis, angle ) rotates on an axis in object space.
    //Object3D.rotateOnWorldAxis( axis, angle ) rotates on an axis in world space.

    var AB = Math.sqrt(Math.pow(B.x-A.x,2)+ Math.pow(B.z-A.z,2));    
    var BC = Math.sqrt(Math.pow(B.x-C.x,2)+ Math.pow(B.z-C.z,2)); 
    var AC = Math.sqrt(Math.pow(C.x-A.x,2)+ Math.pow(C.z-A.z,2));
    var a = Math.acos((BC*BC+AB*AB-AC*AC)/(2*BC*AB));
    //c("AB = " + AB + ", BC = " + BC + ", AC = " + AC + ", a = " + a);

    var vector_BA = { x: A.x - B.x, y: A.y - B.y, z: A.z - B.z };
    var vector_BC = { x: C.x - B.x, y: C.y - B.y, z: C.z - B.z };
    var multiply_v = vector_BA.x * vector_BC.x + vector_BA.y * vector_BC.y + vector_BA.z * vector_BC.z;
    var KOSOE_multiply_v_2D = vector_BA.x * vector_BC.y - vector_BA.y * vector_BC.x; // + vector_BA.z * vector_BC.z;
    //var a1 = Math.acos((multiply_v) / (AB * BC));
    var cos = multiply_v / (AB * BC);
    //var a1 = Math.acos(cos);
    var a1 = Math.acos(cos) * 1.5;
    /** * /
    //c("A.x = " + Math.ceil(A.x) + ", A.z = " + Math.ceil(A.z) + ", B.x = " + Math.ceil(B.x) + ", B.z = " + Math.ceil(B.z) 
    + ", C.x = " + Math.ceil(C.x) + ", C.z = " + Math.ceil(C.z) 
    + ", a1 = " + Math.ceil(a1 * 100) / 100 + ", a1_GRAD = " + Math.ceil(a1 * 180 / Math.PI * 100) / 100 
    + ", cos = " + Math.ceil(cos * 100) / 100);
    /** * /
    if(KOSOE_multiply_v_2D < 0) {
        //c("vector_BA.x * vector_BC.y = " + Math.ceil(vector_BA.x * vector_BC.y) 
        + ", vector_BA.y * vector_BC.x = " + Math.ceil(vector_BA.y * vector_BC.x)  
        + ", a1 = " + Math.ceil(a1 * 100) / 100 
        + ", a1_GRAD = " + Math.ceil(a1 * 180 / Math.PI * 100) / 100 
        + ", KOSOE_multiply_v_2D = " + KOSOE_multiply_v_2D 
        + ", cos = " + Math.ceil(cos * 100) / 100);
    }
    /** */

    return { angle: a1, cos: cos, KOSOE_multiply_v_2D: KOSOE_multiply_v_2D };
    /** * /
    if(AB > 150 && BC > 150) {
        return { angle: a1, cos: cos, KOSOE_multiply_v_2D: KOSOE_multiply_v_2D };
    } else {
        return { angle: null, cos: null, KOSOE_multiply_v_2D: null };
    }
    /** */
}

/// CUBES //////////////////////////////////////////////////////////////////////////////

    // our futur array of bufferGeometry
    cubes = []
    points = []
    
    addCube_W(){


        var particleLight = new THREE.Mesh(
            new THREE.SphereBufferGeometry( 400, 4, 4 ),
            new THREE.MeshBasicMaterial( { color: "#0f0" } )
        );
        particleLight.position.x = 0;
        particleLight.position.y = 0;
        particleLight.position.z = 0;
        //vc3d_glob.SCENE.add( particleLight );

        //i3d_all.c("=================")




        for ( let i = 0; i < 10; i ++ ) {


        }

        /**/
      var geo = new THREE.BoxBufferGeometry (125, 125, 125)
      //var geo = new THREE.SphereBufferGeometry( 140, 4, 4 )



      for ( let i = 0; i < 50000; i ++ ) {
        //i3d_all.c(i)
        // instead of creating a new geometry, we just clone the bufferGeometry instance
        var geometry = geo.clone()
        //geometry.applyMatrix4( new THREE.Matrix4().makeTranslation(Math.random() * 10000 - 5000, Math.random() * 10000 - 5000, 0) );
        geometry.applyMatrix4( new THREE.Matrix4().makeTranslation(Math.random() * 10000 - 5000, Math.random() * 10000 - 5000, 0) );

        geometry.rotateX(Math.random() * 1)
        geometry.rotateY(Math.random() * 1)
        // then, we push this bufferGeometry instance in our array
        cubes.push(geometry)
      
        //var one_cube = new THREE.Mesh(geometry, new THREE.MeshNormalMaterial( { color: "#0f0" } ));
        var one_cube = new THREE.Mesh(geo, new THREE.MeshPhongMaterial( { color: "#705" } ));
        one_cube.position.x = Math.random() * 10000 - 500;
        one_cube.position.y = Math.random() * 10000 - 500;
        one_cube.position.z = Math.random() * 10000 - 500;
        //vc3d_glob.SCENE.add(one_cube);

      }
      // Here is the big boy in action
      //var geometriesCubes = THREE.BufferGeometryUtils.mergeBufferGeometries(cubes);
      var geometriesCubes = BufferGeometryUtils.mergeBufferGeometries(cubes);
    
      // now we got 1 mega big mesh with 10 000 cubes in it
      var mesh = new THREE.Mesh(geometriesCubes, new THREE.MeshPhongMaterial( { color: "#a07" } ));
      mesh.cubes = true;

      vc3d_glob.SCENE.add(mesh);
    /**/

    }
    //addCube();



    addCube(){

        var geo = new THREE.BoxBufferGeometry (15, 15, 15)
        //var geo = new THREE.SphereBufferGeometry( 140, 4, 4 )
          let d = 20, k = 20, ky = 60, temp = "", r, g, b;
        for ( let x = -d; x < d; x ++ ) {
          for ( let z = -d; z < d; z ++ ) {
  
              let x1 = x * k;
              let z1 = z * k;
              //let y1 = Math.sin(x)*Math.cos(z) * ky
              let y1 = x*x/4 - z*z/9
              
              var geometry = geo.clone()
              /** * /
              geometry.translate(
                  x1, 
                  y1,
                  z1
              )
              /** */
              
              //geometry.rotateX(Math.random() * 1)
              //geometry.rotateY(Math.random() * 1)
              // then, we push this bufferGeometry instance in our array
              //cubes.push(geometry)
          
              geometry.x1 = x1
              geometry.y1 = y1
              geometry.z1 = z1
  
              temp = x1.toString(); r = parseInt(temp[temp.length - 1]); //c("r = " + r)
              temp = y1.toString(); g = parseInt(temp[temp.length - 1]); //c("g = " + g)
              temp = z1.toString(); b = parseInt(temp[temp.length - 1]); //c("b = " + b)
              const color = "#"+r+g+b; i3d_all.c_sys("color = " + color); //"#705"

              //var one_cube = new THREE.Mesh(geometry, new THREE.MeshNormalMaterial( { color: "#0f0" } ));
              var one_cube = new THREE.Mesh(geo, new THREE.MeshPhongMaterial( { color: color } ));
              // one_cube.position.x = Math.random() * 10000 - 500; // one_cube.position.y = Math.random() * 10000 - 500; // one_cube.position.z = Math.random() * 10000 - 500;
              
              one_cube.position.x = x1; one_cube.position.y = y1; one_cube.position.z = z1;
              one_cube.move_type = 1; //нужно ли двигать объект?
              vc3d_glob.ray_objects.push(one_cube);  // тут те модели, которые можно выбирать r aycaster-ом
                    
              vc3d_glob.SCENE.add(one_cube);
  
          }
      }
      /**
        // Here is the big boy in action
        //var geometriesCubes = THREE.BufferGeometryUtils.mergeBufferGeometries(cubes);
        var geometriesCubes = BufferGeometryUtils.mergeBufferGeometries(cubes);
      
        // now we got 1 mega big mesh with 10 000 cubes in it
        var mesh = new THREE.Mesh(geometriesCubes, new THREE.MeshPhongMaterial( { color: "#a07" } ));
        mesh.cubes = true;
        mesh.move_type = 1; //parseInt(wl_1.move_type); //нужно ли двигать объект?
        vc3d_glob.ray_objects.push(mesh);  // тут те модели, которые можно выбирать r aycaster-ом
  
        vc3d_glob.SCENE.add(mesh);
      /**/
  
      }
      //addCube();

      // WORK !!
    addCubeMerge(){

      var geo = new THREE.BoxBufferGeometry (15, 15, 15)
      //var geo = new THREE.SphereBufferGeometry( 140, 4, 4 )
        let d = 100, k = 20, ky = 60;
      for ( let x = -d; x < d; x ++ ) {
        for ( let z = -d; z < d; z ++ ) {

            var geometry = geo.clone()
            //geometry.applyMatrix4( new THREE.Matrix4().makeTranslation(Math.random() * 10000 - 5000, Math.random() * 10000 - 5000, 0) );

            /** */

            let x1 = x * k;
            let z1 = z * k;
            //let y1 = Math.sin(x)*Math.cos(z) * ky
            let y1 = x*x/4 - z*z/9

            geometry.translate(
                x1, 
                y1,
                z1
            )
            /** */
            
            //geometry.rotateX(Math.random() * 1)
            //geometry.rotateY(Math.random() * 1)
            // then, we push this bufferGeometry instance in our array
            cubes.push(geometry)
        
            geometry.x1 = x1
            geometry.y1 = y1
            geometry.z1 = z1

        }
    }

    var geometriesCubes = BufferGeometryUtils.mergeBufferGeometries(cubes);
    
      // now we got 1 mega big mesh with 10 000 cubes in it
      var mesh = new THREE.Mesh(geometriesCubes, new THREE.MeshPhongMaterial( { color: "#a07" } ));
      mesh.cubes = true;
      mesh.move_type = 1; //parseInt(wl_1.move_type); //нужно ли двигать объект?
      vc3d_glob.ray_objects.push(mesh);  // тут те модели, которые можно выбирать r aycaster-ом

      vc3d_glob.SCENE.add(mesh);
    /**/

    }
    addCubeMerge();

    addLineMerge(){

      var geo = new THREE.BoxBufferGeometry (15, 15, 15)
      //var geo = new THREE.SphereBufferGeometry( 140, 4, 4 )
        let d = 10, k = 20, ky = 60;
      for ( let x = -d; x < d; x ++ ) {
        for ( let z = -d; z < d; z ++ ) {

            var geometry = geo.clone()
            //geometry.applyMatrix4( new THREE.Matrix4().makeTranslation(Math.random() * 10000 - 5000, Math.random() * 10000 - 5000, 0) );

            /** */

            let x1 = x * k;
            let z1 = z * k;
            //let y1 = Math.sin(x)*Math.cos(z) * ky
            let y1 = x*x/4 - z*z/9

            geometry.translate(
                x1, 
                y1,
                z1
            )
            
            /** */
            

            var materialLine = new THREE.LineBasicMaterial({
                color: 0x293A45,
                opacity: 0.9,
                linewidth: 1
            });
            
            /****************************************************** * /
            var shipAnchorGeometry = new THREE.Geometry();
            shipAnchorGeometry.vertices.push(new THREE.Vertex(new THREE.Vector3( 0, 0, 0 )));
            shipAnchorGeometry.vertices.push(new THREE.Vertex(new THREE.Vector3( x1, y1, z1 )));
            
            var shipAnchor = new THREE.Line(shipAnchorGeometry, materialLine);
            shipAnchor.position.set(0, 0, 0);
            
            scene.add( shipAnchor );
            /****************************************************** */

            const points = [];
            points.push( new THREE.Vector3( 0, 0, 0 ) );
            points.push( new THREE.Vector3( x1, y1, z1 ) );
            
            const geometryLine = new THREE.BufferGeometry().setFromPoints( points );
            var Line1 = new THREE.Line(geometryLine, materialLine);
            vc3d_glob.SCENE.add(Line1);

            //geometry.rotateX(Math.random() * 1)
            //geometry.rotateY(Math.random() * 1)
            // then, we push this bufferGeometry instance in our array
            cubes.push(geometryLine)
        
            //geometry.x1 = x1; geometry.y1 = y1; geometry.z1 = z1

        }
    }
    /**
    var geometriesCubes = BufferGeometryUtils.mergeBufferGeometries(cubes);
    
      // now we got 1 mega big mesh with 10 000 cubes in it
      var mesh = new THREE.Mesh(geometriesCubes, new THREE.MeshPhongMaterial( { color: "#a07" } ));
      mesh.cubes = true;
      mesh.move_type = 1; //parseInt(wl_1.move_type); //нужно ли двигать объект?
      vc3d_glob.ray_objects.push(mesh);  // тут те модели, которые можно выбирать r aycaster-ом

      //vc3d_glob.SCENE.add(mesh);
    /**/

    }
    //addLineMerge();

    addLineMerge2(){
        //i3d_all.c("=======================================================")
        var geo = new THREE.BoxBufferGeometry (15, 15, 15)
        //var geo = new THREE.SphereBufferGeometry( 140, 4, 4 )
          let d = 10, k = 20, ky = 60, dl1 = 2, dl2 = 5;
        for ( let x = -d; x < d; x ++ ) {
          for ( let z = -d; z < d; z ++ ) {
  
              var geometry = geo.clone()
              //geometry.applyMatrix4( new THREE.Matrix4().makeTranslation(Math.random() * 10000 - 5000, Math.random() * 10000 - 5000, 0) );
  
              /** */
  
              let x1 = x * k;
              let z1 = z * k;
              //let y1 = Math.sin(x)*Math.cos(z) * ky
              let y1 = x*x/4 - z*z/9

              let x2 = (x + 1) * k;
              let z2 = (z + 1) * k;
              //let y2 = (x + 1) * ( x + 1 )/4 - (z + 1 )* ( z + 1 ) /9

            //   let y_x1z2 = ( x ) * ( x )/4 - (z + 1 )* ( z + 1 ) /9
            //   let y_x2z1 = (x + 1) * ( x + 1 )/4 - ( z )* ( z ) /9
              let y_x1z2 = ( x ) * ( x )/dl1 - (z + 1 )* ( z + 1 ) /dl2
              let y_x2z1 = (x + 1) * ( x + 1 )/dl1 - ( z )* ( z ) /dl2


              geometry.translate(
                  x1, 
                  y1,
                  z1
              )
              
              /** */
              
  
              var materialLine = new THREE.LineBasicMaterial({
                  color: "#905",
                  opacity: 0.9,
                  linewidth: .1
              });
              
              /****************************************************** * /
              var shipAnchorGeometry = new THREE.Geometry();
              shipAnchorGeometry.vertices.push(new THREE.Vertex(new THREE.Vector3( 0, 0, 0 )));
              shipAnchorGeometry.vertices.push(new THREE.Vertex(new THREE.Vector3( x1, y1, z1 )));
              
              var shipAnchor = new THREE.Line(shipAnchorGeometry, materialLine);
              shipAnchor.position.set(0, 0, 0);
              
              scene.add( shipAnchor );
              /****************************************************** */
  
              let points = [];
              //points.push( new THREE.Vector3( 0, 0, 0 ) );
              points.push( new THREE.Vector3( x1, y1, z1 ) );
              points.push( new THREE.Vector3( x1, y_x1z2, z2 ) );
              //points.push( new THREE.Vector3( x2, y_x2z1, z1 ) );
              //points.push( new THREE.Vector3( x2, y2, z2 ) );
              
              let geometryLine = new THREE.BufferGeometry().setFromPoints( points );
              var Line1 = new THREE.Line(geometryLine, materialLine);
              vc3d_glob.SCENE.add(Line1);
  
              points = [];
              //points.push( new THREE.Vector3( 0, 0, 0 ) );
              points.push( new THREE.Vector3( x1, y1, z1 ) );
              //points.push( new THREE.Vector3( x1, y_x1z2, z2 ) );
              points.push( new THREE.Vector3( x2, y_x2z1, z1 ) );
              //points.push( new THREE.Vector3( x2, y2, z2 ) );
              
              geometryLine = new THREE.BufferGeometry().setFromPoints( points );
              var Line1 = new THREE.Line(geometryLine, materialLine);
              vc3d_glob.SCENE.add(Line1);



              
              cubes.push(geometryLine)
              //cubes.push(geometry)
          
  
          }
      }
      /** /
      var geometriesCubes = BufferGeometryUtils.mergeBufferGeometries(cubes);
      
        var mesh = new THREE.Mesh(geometriesCubes, new THREE.MeshPhongMaterial( { color: "#a07" } ));
        mesh.cubes = true;
        mesh.move_type = 1; //parseInt(wl_1.move_type); //нужно ли двигать объект?
        vc3d_glob.ray_objects.push(mesh);  // тут те модели, которые можно выбирать r aycaster-ом
  
        vc3d_glob.SCENE.add(mesh);
      /**/
  
      }
      //addLineMerge2();
  

    addGraph(){

        var geo = new THREE.BoxBufferGeometry (15, 15, 15)
          let d = 100, k = 20, ky = 60;
        for ( let x = -d; x < d; x ++ ) {
          for ( let z = -d; z < d; z ++ ) {
              // instead of creating a new geometry, we just clone the bufferGeometry instance
              var geometry = geo.clone()  
  
              let x1 = x * k;
              let z1 = z * k;
              //let y1 = Math.sin(x)*Math.cos(z) * ky
              //let y1 = x*x/4 - z*z/9
              let y1 = x*x/4



              geometry.translate(
                  x1, 
                  y1,
                  z1
              )
              /** */
              
              // then, we push this bufferGeometry instance in our array
              //!!! cubes.push(geometry)
          
              //cubes.push( new THREE.Vector3( x1, y1, z1 ) );
              points.push( new THREE.Vector3( x1, y1, z1 ) );
  
  
              var one_cube = new THREE.Mesh(geo, new THREE.MeshPhongMaterial( { color: "#705" } ));
              // one_cube.position.x = Math.random() * 10000 - 500;
              // one_cube.position.y = Math.random() * 10000 - 500;
              // one_cube.position.z = Math.random() * 10000 - 500;
              //vc3d_glob.SCENE.add(one_cube);
              
              //one_cube.position.x = x * 100;
              //one_cube.position.y = 100;
              //one_cube.position.z = z * 100;
              //vc3d_glob.SCENE.add(one_cube);
  
          }
      }
        //!!!!!
        /**/
        const mat = new THREE.MeshPhongMaterial( { color: "#f00" } )
        const geometryPoints = new THREE.BufferGeometry().setFromPoints( points );      
        const line = new THREE.Line( geometryPoints, mat );
        vc3d_glob.SCENE.add(line);
        
        //!!!!!
        /** /
        cubes.push(geometryPoints);
        var geometriesCubes = BufferGeometryUtils.mergeBufferGeometries(cubes); // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        var mesh = new THREE.Mesh(geometriesCubes, mat);
        mesh.cubes = true;
        vc3d_glob.SCENE.add(mesh);
        /**/
  
      }
      //addGraph();




}
export let i3d_dop = new i3d_Dop(); // i3d_Events.

