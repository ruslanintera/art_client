

// import { i3d_events_func } from "./f8_events_func.js";
// import { app } from "./f9_appvue.js";
// import { i3d_app_sets } from "./f3_apparat_sets.js";
// import { i3d_tween } from "./f6_tween.js";

import * as THREE from 'three';
import { i3d_all } from "./f7_assist.js";
import { vc3d_glob } from "./f5_vc3d_glob.js";
import { i3d_base } from "./f4_base.js";


let createShapeMaterialCommon = function(color) {
    if(!color) { if(this.current) { color = this.currentShapeColor } else { color = this.shapeColor; } }

    var material = new THREE.MeshPhysicalMaterial({
        color: color,
        side: THREE.DoubleSide,
    });
    return material;
}
let createMaterialCommon = function(jpg, textureLoader)  {
    
    if(!textureLoader) textureLoader = new THREE.TextureLoader();

    var diffuse = textureLoader.load(jpg); // "../../data/_1/p1.jpg"
    diffuse.encoding = THREE.sRGBEncoding;
    diffuse.wrapS = THREE.RepeatWrapping;
    diffuse.wrapT = THREE.RepeatWrapping;
    diffuse.repeat.x = 1;
    diffuse.repeat.y = 1;

    var normalMap = textureLoader.load(jpg); //"../../data/_1/p1.jpg"
    normalMap.wrapS = THREE.RepeatWrapping;
    normalMap.wrapT = THREE.RepeatWrapping;

    var material = new THREE.MeshPhysicalMaterial({
        //clearcoat: 1.0,
        //clearcoatRoughness: 0.1,
        //metalness: 0.9,
        //roughness: 0.5,
        //color: 0x0000ff,
        //envMap: hdrCubeRenderTarget.texture,
        map: diffuse,
        normalMap: normalMap,
        side: THREE.DoubleSide,
        //normalScale: new THREE.Vector2(0.1, 0.1)
    });
    return material;
}



class i3d_Windows {
    constructor(option) {
        this.shapeColorMaterial = createShapeMaterialCommon("#fff")
        this.currentShapeColorMaterial = createShapeMaterialCommon("#f00")

        this.currentNum = option.currentNum
        this.winds = option.winds
        this.groupParams = option.groupParams
        this.txl = new THREE.TextureLoader()
        this.groupWindows = new THREE.Group();

    }

    createWinds() {
        this.winds.forEach(elementARRAY => {
            
            elementARRAY.forEach(element => {

                let colorMaterial = element.current ? this.currentShapeColorMaterial : this.shapeColorMaterial

                element.obj = new Wind({ currentNum: this.currentNum, element: element, colorMaterial: colorMaterial
                    , textureLoader: this.txl, groupWindows: this.groupWindows, groupParams: this.groupParams })

                element.planeGroup = element.obj.createPlaneGroup()
                element.plane = element.obj.createPlane(element.planeGroup)
                element.planeShape = element.obj.createPlaneShape(element.planeGroup)

                if (!element.areaNum) {
                    element.planeGroup.visible = false;
                }
            })

        });

        this.area = new Area({ width:2500, height:590, grotx:-90, y:-40, textureLoader: this.txl })
        this.areaPlane = this.area.createPlane({ color: "#0f0" })

        this.area1 = new Area({ f: "turnCurrentLeftInArea", width:500, height:500, x: -2500, grotx:-90, y:-40, textureLoader: this.txl })
        this.areaPlane = this.area1.createPlane({ jpg: vc3d_glob.data_folder + "img/bw-up.png" })

        this.area2 = new Area({ f: "turnCurrentRightInArea", width:500, height:500, x: 2500, grotx:-90, y:-40, textureLoader: this.txl })
        this.areaPlane = this.area2.createPlane({ jpg: vc3d_glob.data_folder + "img/fw-up.png" })



        // !
        this.minStopper = 0
        this.maxStopper = 0
        this.windsLength = this.winds.length
        this.qty_from_zero_to_minStopper = 0
        this.curr_qty_from_zero_to_minStopper = 0
        this.qty_from_maxStopper_to_windsLength = 0
        this.curr_qty_from_maxStopper_to_windsLength = 0

        for(let i=0;i<this.winds.length;i++) {
            if(this.winds[i].areaNum && this.minStopper == undefined) { this.minStopper = i; }
            if(this.winds[i].areaNum && i >= this.maxStopper) { this.maxStopper = i; }
        }
        this.curr_qty_from_zero_to_minStopper = this.qty_from_zero_to_minStopper = this.minStopper;
        this.curr_qty_from_maxStopper_to_windsLength = this.qty_from_maxStopper_to_windsLength = this.winds.length - this.maxStopper - 1;

    }
    swipeLeft() {

        let i0_jpg = this.winds[0].jpg;
        for(let i=0;i<this.winds.length;i++) {
            if(i === this.winds.length-1) { 
                this.winds[i].jpg     = i0_jpg;
                this.winds[i].obj.jpg = i0_jpg;
            } else {
                this.winds[i].jpg     = this.winds[i+1].jpg;
                this.winds[i].obj.jpg = this.winds[i+1].jpg;    
            }
        }
        this.winds.forEach(element => {
            let mat = element.obj.createMaterial()
            element.plane.material = mat;
        });
        if (!vc3d_glob.animate) { i3d_all.animate2(); }
    }
    swipeRight() {
        let last_jpg = this.winds[this.winds.length-1].jpg;
        for(let i=this.winds.length-1;i>=0;i--) {
            if(i === 0) { 
                this.winds[i].jpg     = last_jpg;
                this.winds[i].obj.jpg = last_jpg;
            } else {
                this.winds[i].jpg     = this.winds[i-1].jpg;
                this.winds[i].obj.jpg = this.winds[i-1].jpg;    
            }
        }
        this.winds.forEach(element => {
            let mat = element.obj.createMaterial()
            element.plane.material = mat;
        });
        if (!vc3d_glob.animate) { i3d_all.animate2(); }
    }
    turnCurrentLeft() {
        let newNum = this.currentNum - 1
        if(newNum < 0) newNum = this.winds.length-1
        
        this.winds[this.currentNum].current     = false;
        this.winds[this.currentNum].obj.current = false;
        this.winds[this.currentNum].planeShape.material = this.shapeColorMaterial

        this.winds[newNum].current     = true;
        this.winds[newNum].obj.current = true;
        this.winds[newNum].planeShape.material = this.currentShapeColorMaterial

        this.currentNum = newNum;
        if (!vc3d_glob.animate) { i3d_all.animate2(); }
    }
    turnCurrentRight() {
        let newNum = this.currentNum + 1
        if(newNum > this.winds.length-1) newNum = 0
        
        this.winds[this.currentNum].current     = false;
        this.winds[this.currentNum].obj.current = false;
        this.winds[this.currentNum].planeShape.material = this.shapeColorMaterial

        this.winds[newNum].current     = true;
        this.winds[newNum].obj.current = true;
        this.winds[newNum].planeShape.material = this.currentShapeColorMaterial

        this.currentNum = newNum;
        if (!vc3d_glob.animate) { i3d_all.animate2(); }
    }
    turnCurrentRightInArea(areaNum) {
        let newNum = this.currentNum + 1
        if(newNum > this.winds.length-1) newNum = 0
        
        if(this.winds[newNum][0].areaNum == areaNum) {
            for(let j=0;j<this.winds[newNum].length;j++) {
                this.winds[this.currentNum][j].current     = false;
                this.winds[this.currentNum][j].obj.current = false;
                this.winds[this.currentNum][j].planeShape.material = this.shapeColorMaterial

                this.winds[newNum][j].current     = true;
                this.winds[newNum][j].obj.current = true;
                this.winds[newNum][j].planeShape.material = this.currentShapeColorMaterial

            }
            this.currentNum = newNum;
        } else {
            //coi(this.winds, "====================================== this.winds ============================================")

            let winds_0 = [...this.winds[0]]; //[0].jpg; //c("i0_jpg = " + i0_jpg)
            //coi(winds_0, "winds_0")

            for(let i=0;i<this.winds.length;i++) {
                if(i === this.winds.length-1) { 
                    for(let j=0;j<this.winds[i].length;j++) {
                        this.winds[i][j].jpg     = winds_0[j].jpg; //c("winds_0[j].jpg = " + winds_0[j].jpg)
                        this.winds[i][j].obj.jpg = winds_0[j].jpg;
                    }
                } else {
                    for(let j=0;j<this.winds[i].length;j++) {
                        this.winds[i][j].jpg     = this.winds[i+1][j].jpg;
                        this.winds[i][j].obj.jpg = this.winds[i+1][j].jpg;
                    }
                }
            }

            this.winds.forEach(elementARRAY => {
                elementARRAY.forEach(element => {
                    let mat = element.obj.createMaterial()
                    element.plane.material = mat;
                    //c(4)
                });
            });
        }
        if (!vc3d_glob.animate) { i3d_all.animate2(); }

    
    }
    turnCurrentLeftInArea(areaNum) {
        let newNum = this.currentNum - 1
        if(newNum < 0) newNum = this.winds.length-1
        //c("this.winds[newNum].areaNum === areaNum = " + areaNum)
        
        if(this.winds[newNum].areaNum == areaNum) {
            //c("this.winds[newNum].areaNum === areaNum = " + areaNum)
            this.winds[this.currentNum].current     = false;
            this.winds[this.currentNum].obj.current = false;
            this.winds[this.currentNum].planeShape.material = this.shapeColorMaterial

            this.winds[newNum].current     = true;
            this.winds[newNum].obj.current = true;
            this.winds[newNum].planeShape.material = this.currentShapeColorMaterial

            this.currentNum = newNum;
        } else {
            let last_jpg = this.winds[this.winds.length-1].jpg;
            for(let i=this.winds.length-1;i>=0;i--) {
                if(i === 0) { 
                    this.winds[i].jpg     = last_jpg;
                    this.winds[i].obj.jpg = last_jpg;
                } else {
                    this.winds[i].jpg     = this.winds[i-1].jpg;
                    this.winds[i].obj.jpg = this.winds[i-1].jpg;    
                }
            }
            this.winds.forEach(element => {
                //c("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! element.areaNum = = " + element.areaNum)
                //coi(element, "element =============")
                if (element.areaNum == 1) {
                    let mat = element.obj.createMaterial()
                    element.plane.material = mat;
                } else {
                    element.planeShape.visible = false
                }
                //coi(mat, "mat =")
            });
        }
        if (!vc3d_glob.animate) { i3d_all.animate2(); }
    }

    turnCurrentRightInAreaWithStopper(areaNum) {

        let newNum = this.currentNum + 1
        if(newNum > this.winds.length-1) newNum = 0
        //c("this.winds[newNum].areaNum === areaNum = " + areaNum)
        
        if(this.winds[newNum].areaNum == areaNum) {
            //c("this.winds[newNum].areaNum === areaNum = " + areaNum)
            this.winds[this.currentNum].current     = false;
            this.winds[this.currentNum].obj.current = false;
            this.winds[this.currentNum].planeShape.material = this.shapeColorMaterial

            this.winds[newNum].current     = true;
            this.winds[newNum].obj.current = true;
            this.winds[newNum].planeShape.material = this.currentShapeColorMaterial

            this.currentNum = newNum;
        } else {
            //c("!!!!!!!!!!!!!!")
            if (this.curr_qty_from_maxStopper_to_windsLength > 0) {
                let i0_jpg = this.winds[0].jpg;
                for(let i=0;i<this.winds.length;i++) {
                    if(i === this.winds.length-1) { 
                        this.winds[i].jpg     = i0_jpg;
                        this.winds[i].obj.jpg = i0_jpg;
                    } else {
                        this.winds[i].jpg     = this.winds[i+1].jpg;
                        this.winds[i].obj.jpg = this.winds[i+1].jpg;    
                    }
                }
                this.winds.forEach(element => {
                    let mat = element.obj.createMaterial()
                    element.plane.material = mat;
                });

                this.curr_qty_from_maxStopper_to_windsLength--;
            }
        }
        if (!vc3d_glob.animate) { i3d_all.animate2(); }
    }
    turnCurrentRightInAreaWithStopper(areaNum) {

        let newNum = this.currentNum + 1
        if(newNum > this.winds.length-1) newNum = 0
        //c("this.winds[newNum].areaNum === areaNum = " + areaNum)
        
        if(this.winds[newNum].areaNum == areaNum) {
            //c("this.winds[newNum].areaNum === areaNum = " + areaNum)
            this.winds[this.currentNum].current     = false;
            this.winds[this.currentNum].obj.current = false;
            this.winds[this.currentNum].planeShape.material = this.shapeColorMaterial

            this.winds[newNum].current     = true;
            this.winds[newNum].obj.current = true;
            this.winds[newNum].planeShape.material = this.currentShapeColorMaterial

            this.currentNum = newNum;
        } else {
            //c("!!!!!!!!!!!!!!")
            if (this.curr_qty_from_maxStopper_to_windsLength > 0) {
                let i0_jpg = this.winds[0].jpg;
                for(let i=0;i<this.winds.length;i++) {
                    if(i === this.winds.length-1) { 
                        this.winds[i].jpg     = i0_jpg;
                        this.winds[i].obj.jpg = i0_jpg;
                    } else {
                        this.winds[i].jpg     = this.winds[i+1].jpg;
                        this.winds[i].obj.jpg = this.winds[i+1].jpg;    
                    }
                }
                this.winds.forEach(element => {
                    let mat = element.obj.createMaterial()
                    element.plane.material = mat;
                });

                this.curr_qty_from_maxStopper_to_windsLength--;
            }
        }
        if (!vc3d_glob.animate) { i3d_all.animate2(); }
    }
    turnCurrentLeftInAreaWithStopper(areaNum) {

        let newNum = this.currentNum - 1
        if(newNum < 0) newNum = this.winds.length-1
        //c("this.winds[newNum].areaNum === areaNum = " + areaNum)
        
        if(this.winds[newNum].areaNum == areaNum) {
            //c("this.winds[newNum].areaNum === areaNum = " + areaNum)
            this.winds[this.currentNum].current     = false;
            this.winds[this.currentNum].obj.current = false;
            this.winds[this.currentNum].planeShape.material = this.shapeColorMaterial

            this.winds[newNum].current     = true;
            this.winds[newNum].obj.current = true;
            this.winds[newNum].planeShape.material = this.currentShapeColorMaterial

            this.currentNum = newNum;
        } else {
            //c("!!!!!!!!!!!!!!")
            if (this.curr_qty_from_maxStopper_to_windsLength > 0) {
                let last_jpg = this.winds[this.winds.length-1].jpg;
                for(let i=this.winds.length-1;i>=0;i--) {
                    if(i === 0) { 
                        this.winds[i].jpg     = last_jpg;
                        this.winds[i].obj.jpg = last_jpg;
                    } else {
                        this.winds[i].jpg     = this.winds[i-1].jpg;
                        this.winds[i].obj.jpg = this.winds[i-1].jpg;    
                    }
                }
                this.winds.forEach(element => {
                    //c("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! element.areaNum = = " + element.areaNum)
                    //coi(element, "element =============")
                    
                    /** * /
                    if (element.areaNum == 1) {
                        let mat = element.obj.createMaterial()
                        element.plane.material = mat;
                    } else {
                        element.planeGroup.visible = false; //c("VVVVVVVVVVVVVVV")
                    }
                    /** */
                    if (element.areaNum == 1) {
                        let mat = element.obj.createMaterial()
                        element.plane.material = mat;
                    }
                    /** */

                        //coi(mat, "mat =")
                });
    
                this.curr_qty_from_maxStopper_to_windsLength--;
            }
        }
        if (!vc3d_glob.animate) { i3d_all.animate2(); }
    }


}

class Wind {
    constructor(option) {
        //coi(option, "option")
        
        this.currentNum = option.element.currentNum || 0;
        this.textureLoader = option.element.textureLoader || new THREE.TextureLoader();
        this.colorMaterial = option.colorMaterial || createShapeMaterialCommon("#fff");
        //this.colorMaterial = option.colorMaterial || null;
        
        // ELEMENT = winds[i]
        this.type = option.element.type || "";
        this.width = option.element.width || 480;
        this.height = option.element.height || 480;

        this.x = option.element.x || 0;
        this.y = option.element.y || 0;
        this.z = option.element.z || 0;
        this.jpg = option.element.jpg || vc3d_glob.data_folder + "img/fb.png";

        this.grotx = option.element.grotx || 0; // rotation Градусы
        this.groty = option.element.groty || 0;
        this.grotz = option.element.grotz || 0;

        this.rotx = this.grotx * Math.PI / 180; // радианы
        this.roty = this.groty * Math.PI / 180;
        this.rotz = this.grotz * Math.PI / 180;

        this.color = option.element.color || "#00f";

        this.name = option.element.name || "";
        this.num = option.element.num || "";
        this.model_unid = option.element.model_unid || i3d_all.gener_name_to_input(16, '#aA');
        this.move_type = option.element.move_type || 1;
        this.ray = option.element.ray || true;
        
        this.current = option.element.current || false;
        this.shapeWidth = option.element.shapeWidth || 500;
        this.shapeHeight = option.element.shapeHeight || 500;

        this.shapeColor = option.element.shapeColor || "#fff";
        this.currentShapeColor = option.element.currentShapeColor || "#f00";

        this.shapeX = option.element.shapeX || this.x; this.shapeY = option.element.shapeY || this.y; this.shapeZ = option.element.shapeZ || this.z;
        /*
        if(option.element.shapeX) { this.shapeX = this.x + option.element.shapeX; } else { this.shapeX = this.x; }
        if(option.element.shapeY) { this.shapeY = this.y + option.element.shapeY; } else { this.shapeY = this.y; }
        if(option.element.shapeZ) { this.shapeZ = this.x + option.element.shapeZ; } else { this.shapeZ = this.z; }
        /**/
        // false && 
        if(option.groupWindows) {
            this.groupWindows = option.groupWindows; // || 
            this.groupWindows.move_type = this.move_type; //parseInt(wl_1.move_type); //нужно ли двигать объект?
            if(this.ray) vc3d_glob.ray_objects.push(this.groupWindows);  // тут те модели, которые можно выбирать r aycaster-ом
            //coi(this.groupWindows, "this.groupWindows ===================== 4 ")
            /** * /
            this.groupParamsX = option.groupParams.x || 0;
            this.groupParamsY = option.groupParams.y || 0;
            this.groupParamsZ = option.groupParams.z || 0;

            this.groupParamsRotX = option.groupParams.rotx || 0;
            this.groupParamsRotY = option.groupParams.roty || 0;
            this.groupParamsRotZ = option.groupParams.rotz || 0;
            /** */
            this.groupWindows.position.set(option.groupParams.x, option.groupParams.y, option.groupParams.z);
            //this.groupWindows.rotation.set(option.groupParams.rotx, option.groupParams.roty, option.groupParams.rotz);
            this.groupWindows.rotation.set(option.groupParams.rotx * Math.PI / 180, option.groupParams.roty * Math.PI / 180, option.groupParams.rotz * Math.PI / 180);

            
        }
        //coi(option.groupWindows, "option.groupWindows")

        //return this.createPlane()
        //c("constructor")
        
    }
    createMaterial() {
        //var textureLoader = new THREE.TextureLoader();
        var diffuse = this.textureLoader.load(this.jpg); // "../../data/_1/p1.jpg"
        diffuse.encoding = THREE.sRGBEncoding;
        diffuse.wrapS = THREE.RepeatWrapping;
        diffuse.wrapT = THREE.RepeatWrapping;
        diffuse.repeat.x = 1;
        diffuse.repeat.y = 1;
    
        var normalMap = this.textureLoader.load(this.jpg); //"../../data/_1/p1.jpg"
        normalMap.wrapS = THREE.RepeatWrapping;
        normalMap.wrapT = THREE.RepeatWrapping;
    
        var material = new THREE.MeshPhysicalMaterial({
            //clearcoat: 1.0,
            //clearcoatRoughness: 0.1,
            //metalness: 0.9,
            //roughness: 0.5,
            //color: 0x0000ff,
            //envMap: hdrCubeRenderTarget.texture,
            map: diffuse,
            normalMap: normalMap,
            side: THREE.DoubleSide,
            //normalScale: new THREE.Vector2(0.1, 0.1)
        });
        //c("this.jpg = " + this.jpg)
        return material;
    }
    //createShapeMaterial = createShapeMaterialCommon

    createPlaneGroup(){
        const group = new THREE.Group();
        return group;
    }
    createPlane(group){
        let plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(this.width, this.height, 1, 1), createMaterialCommon(this.jpg));
        plane.position.set(this.x, this.y, this.z);
        plane.rotation.set(this.rotx, this.roty, this.rotz); //plane.rotation.x = this.rotx; plane.rotation.y = this.roty; plane.rotation.z = this.rotz;

        //console.log(`this.x = ${this.x}, this.y = ${this.y}, this.z = ${this.z}`)

        plane.name = this.name; //
        plane.num = this.num; //
        plane.model_unid = this.model_unid;
        plane.move_type = this.move_type; //parseInt(wl_1.move_type); //нужно ли двигать объект?
        if(this.ray) vc3d_glob.ray_objects.push(plane);  // тут те модели, которые можно выбирать r aycaster-ом
        
        group.move_type = this.move_type; //parseInt(wl_1.move_type); //нужно ли двигать объект?
        if(this.ray) vc3d_glob.ray_objects.push(group);  // тут те модели, которые можно выбирать r aycaster-ом
        
        if(this.groupWindows) { 
            group.add( plane );
            this.groupWindows.add( group ); 
            vc3d_glob.SCENE.add(this.groupWindows);
            //coi(this.groupWindows, "this.groupWindows!!!!!!!!!!!!!!!!!!!!!!1===");
        } else {
            group.add( plane );
            vc3d_glob.SCENE.add(group);
        }
        return plane;
    }
    createPlaneShape(group){
        let plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(this.shapeWidth, this.shapeHeight, 1, 1), this.colorMaterial);
        plane.position.set(this.shapeX, this.shapeY, this.shapeZ);
        plane.rotation.set(this.rotx, this.roty, this.rotz); //plane.rotation.x = this.rotx; plane.rotation.y = this.roty; plane.rotation.z = this.rotz;

        //console.log(`11111111111111   this.shapeX = ${this.shapeX}, this.shapeY = ${this.shapeY}, this.shapeZ = ${this.shapeZ}`)

        plane.name = this.name; //
        plane.num = this.num; //
        plane.model_unid = this.model_unid;
        plane.shape = true;

        plane.move_type = this.move_type; //parseInt(wl_1.move_type); //нужно ли двигать объект?
        if(this.ray) vc3d_glob.ray_objects.push(plane);  // тут те модели, которые можно выбирать r aycaster-ом

        if(this.groupWindows) { 
            group.add( plane );
            this.groupWindows.add( group ); 
            vc3d_glob.SCENE.add(this.groupWindows);
            //coi(this.groupWindows, "SHAPE   this.groupWindows!!!!!!!!!!!!!!!!!!!!!!1===");
        } else {
            group.add( plane );
            vc3d_glob.SCENE.add(group);
        }

        //group.add( plane );
        //vc3d_glob.SCENE.add(group);

        return plane;
    }
    
}

class Area {
    constructor(option) {
        this.type = option.type || "";
        this.width = option.width || 480;
        this.height = option.height || 480;

        this.f = option.f || ""; // turnCurrentRightInArea

        this.x = option.x || 0;
        this.y = option.y || 0;
        this.z = option.z || 0;
        this.jpg = option.jpg || vc3d_glob.data_folder + "img/fb.png";

        this.grotx = option.grotx || 0; // rotation Градусы
        this.groty = option.groty || 0;
        this.grotz = option.grotz || 0;

        this.rotx = this.grotx * Math.PI / 180; // радианы
        this.roty = this.groty * Math.PI / 180;
        this.rotz = this.grotz * Math.PI / 180;

        this.color = option.color || "#00f";

        this.textureLoader = option.textureLoader || new THREE.TextureLoader();

        this.name = option.name || "";
        this.num = option.num || "";
        this.model_unid = option.model_unid || i3d_all.gener_name_to_input(16, '#aA');
        this.move_type = option.move_type || 1;
        this.ray = option.ray || true;

        //this.material = createShapeMaterialCommon("#00f")

    }

    createPlane(option){
        if(option.jpg) { 
            this.material = createMaterialCommon(option.jpg, this.textureLoader)
        } else {
            this.color = option.color || "#00f";
            this.material = createShapeMaterialCommon(this.color)
        }
        this.material = i3d_base.makeTextSprite_material(">")
        //this.material = i3d_base.engraveTextOnWatch(">")
        
        let plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(this.width, this.height, 1, 1), this.material);
        plane.position.set(this.x, this.y, this.z);
        plane.rotation.set(this.rotx, this.roty, this.rotz); //plane.rotation.x = this.rotx; plane.rotation.y = this.roty; plane.rotation.z = this.rotz;

        plane.f = this.f; //c("plane.f = " + plane.f)
        plane.name = this.name; //
        plane.num = this.num; //
        plane.model_unid = this.model_unid;
        plane.move_type = this.move_type; //parseInt(wl_1.move_type); //нужно ли двигать объект?
        if(this.ray) vc3d_glob.ray_objects.push(plane);  // тут те модели, которые можно выбирать r aycaster-ом
        
        if (option.group) { option.group.add( plane ); vc3d_glob.SCENE.add(option.group); }
        else { vc3d_glob.SCENE.add(plane); }
        return plane;
    }

    
}
/** */
let option1 = {
    currentNum: 3,
    winds: [
        [ { x: -2000, y: 0, z: 0, shapeZ: -20, shapeY: 0, grotx:0, jpg: vc3d_glob.data_folder + "img/lamp_up.png" } ],
        [ { x: -1500, y: 0, z: 0, shapeZ: -20, shapeY: 0, grotx:0, jpg: vc3d_glob.data_folder + "img/reload_up.png" } ],
        [ { x: -1000, y: 0, z: 0, shapeZ: -20, shapeY: 0, grotx:0, jpg: vc3d_glob.data_folder + "img/vk.png", areaNum: 1 } ],
        [ { x: -500, y: 0, z: 0, shapeZ: -20, shapeY: 0, grotx:0, jpg: vc3d_glob.data_folder + "img/screenshot-up.png", current: true, areaNum: 1 } ],
        [ { x: 0, y: 0, z: 0, shapeZ: -20, shapeY: 0, grotx:0, jpg: vc3d_glob.data_folder + "img/flex1_up.png", areaNum: 1 } ],
        [ { x: 500, y: 0, z: 0, shapeZ: -20, shapeY: 0, grotx:0, jpg: vc3d_glob.data_folder + "img/share-up.png", areaNum: 1 } ],
        [ { x: 1000, y: 0, z: 0, shapeZ: -20, shapeY: 0, grotx:0, jpg: vc3d_glob.data_folder + "img/bw-up.png", areaNum: 1 } ],
        [ { x: 1500, y: 0, z: 0, shapeZ: -20, shapeY: 0, grotx:0, jpg: vc3d_glob.data_folder + "img/fb.png" } ],
        [ { x: 2000, y: 0, z: 0, shapeZ: -20, shapeY: 0, grotx:0, jpg: vc3d_glob.data_folder + "img/close.png" } ],
    ],
    groupParams: { x: 100, y: 0, z: 1000, rotx: -90, roty: 0, rotz: 0 }

}
export let i3d_windows = new i3d_Windows(option1); //

let option2 = {
    currentNum: 3,
    winds: [
        [ { x: 0, z: 0, y: -2000, shapeZ: -20, jpg: vc3d_glob.data_folder + "img/lamp_up.png" }
            , { x: 500, z: 0, y: -2000, shapeZ: -20, jpg: vc3d_glob.data_folder + "digits1/cifra_0_unvector.png" } ],
        [ { x: 0, z: 0, y: -1500, shapeZ: -20, jpg: vc3d_glob.data_folder + "img/reload_up.png" }
            , { x: 500, z: 0, y: -1500, shapeZ: -20, jpg: vc3d_glob.data_folder + "digits1/cifra_1_unvector.png" } ],
        [ { x: 0, z: 0, y: -1000, shapeZ: -20, jpg: vc3d_glob.data_folder + "img/vk.png", areaNum: 1 }
            , { x: 500, z: 0, y: -1000, shapeZ: -20, jpg: vc3d_glob.data_folder + "digits1/cifra_2_unvector.png", areaNum: 1 } ],
        [ { x: 0, z: 0, y: -500, shapeZ: -20, jpg: vc3d_glob.data_folder + "img/screenshot-up.png", current: true, areaNum: 1 }
            , { x: 500, z: 0, y: -500, shapeZ: -20, jpg: vc3d_glob.data_folder + "digits1/cifra_3_unvector.png", current: true, areaNum: 1 } ],
        [ { x: 0, z: 0, y: 0, shapeZ: -20, jpg: vc3d_glob.data_folder + "img/flex1_up.png", areaNum: 1 }
            , { x: 500, z: 0, y: 0, shapeZ: -20, jpg: vc3d_glob.data_folder + "digits1/cifra_4_unvector.png", areaNum: 1 } ],
        [ { x: 0, z: 0, y: 500, shapeZ: -20, jpg: vc3d_glob.data_folder + "img/share-up.png", areaNum: 1 }
            , { x: 500, z: 0, y: 500, shapeZ: -20, jpg: vc3d_glob.data_folder + "digits1/cifra_5_unvector.png", areaNum: 1 } ],
        [ { x: 0, z: 0, y: 1000, shapeZ: -20, jpg: vc3d_glob.data_folder + "img/bw-up.png", areaNum: 1 }
            , { x: 500, z: 0, y: 1000, shapeZ: -20, jpg: vc3d_glob.data_folder + "digits1/cifra_6_unvector.png", areaNum: 1 } ],
        [ { x: 0, z: 0, y: 1500, shapeZ: -20, jpg: vc3d_glob.data_folder + "img/fb.png" }
            , { x: 500, z: 0, y: 1500, shapeZ: -20, jpg: vc3d_glob.data_folder + "digits1/cifra_7_unvector.png" } ],
        [ { x: 0, z: 0, y: 2000, shapeZ: -20, jpg: vc3d_glob.data_folder + "img/close.png" }
            , { x: 500, z: 0, y: 2000, shapeZ: -20, jpg: vc3d_glob.data_folder + "digits1/cifra_8_unvector.png" } ],
    ],
    groupParams: { x: 1000, y: 0, z: 0, rotx: -90, roty: 0, rotz: 0 }

}
export let i3d_windows1 = new i3d_Windows(option2); //

export let windArray = [i3d_windows, i3d_windows1];






