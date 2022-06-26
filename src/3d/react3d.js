import * as THREE from "three"
// import { vc3d_glob } from "../3d/dev2020/f5_vc3d_glob"
// import { i3d_base } from "../3d/dev2020/f4_base"
import { i3d_all } from "./dev2020/f7_assist"
import { i3d_mats } from "./dev2020/f2_mats.js"
import { fetchOneModelType3d, fetchSetUpdate } from "../http/commAPI"
import { vc3d_glob } from "./dev2020/f5_vc3d_glob"
//import { common } from "../common/common"
import { i3d_base } from "./dev2020/f4_base"

class React3d {
  ADD_IMAGE(obj, item, device) {
    //console.log('ADD_IMAGE  item = ', item)
    const itemWithURL = process.env.REACT_APP_API_URL + item
    const textureLoader = new THREE.TextureLoader()
    const diffuseMap = textureLoader.load(itemWithURL)
    diffuseMap.encoding = THREE.sRGBEncoding
    const specularMap = textureLoader.load(itemWithURL)
    specularMap.encoding = THREE.sRGBEncoding
    const normalMap = textureLoader.load(itemWithURL)
    const materialParamsObj = {
      color: "#fff",
      //specular: 0x222222,
      shininess: 35,
      map: diffuseMap,
      specularMap: specularMap,
      normalMap: normalMap,
      normalScale: new THREE.Vector2(0.8, 0.8),
    }
    const material = new THREE.MeshPhongMaterial(materialParamsObj)

    if (vc3d_glob?.curr_obj?.material) {
      vc3d_glob.curr_obj.material = material

      if (!vc3d_glob.curr_obj.materialParams) {
        const materialParams = {
          color: "#fff",
          //specular: 0x222222,
          shininess: 35,
          map: item,
          specularMap: item,
          normalMap: item,
          normalScale: new THREE.Vector2(0.8, 0.8),
        }
        vc3d_glob.curr_obj.materialParams = materialParams
      } else {
        vc3d_glob.curr_obj.materialParams.map = item
        vc3d_glob.curr_obj.materialParams.specularMap = item
        vc3d_glob.curr_obj.materialParams.normalMap = item
      }

      // vc3d_glob.curr_obj.material.color = 0xdddddd
      // vc3d_glob.curr_obj.material.specular = 0x222222
      // vc3d_glob.curr_obj.material.shininess = 35
      // vc3d_glob.curr_obj.material.map = diffuseMap
      //vc3d_glob.curr_obj.material.specularMap = specularMap
      // vc3d_glob.curr_obj.material.normalMap = normalMap
      // vc3d_glob.curr_obj.material.normalScale = new THREE.Vector2(0.8, 0.8)

      //console.log("material = ", vc3d_glob.curr_obj.material)
      //console.log("vc3d_glob.curr_obj = ", vc3d_glob.curr_obj)
      if (!vc3d_glob.animate) {
        i3d_all.animate4()
      }
    }
  }

  ADD_MP4(obj, item, device) {
    //console.log('ADD_MP4  item = ', item)
    if (vc3d_glob?.curr_obj?.material) {
      if (!vc3d_glob.curr_obj.materialParams) {
        const materialParams = {
          video: item,
        }
        vc3d_glob.curr_obj.materialParams = materialParams
      } else {
        vc3d_glob.curr_obj.materialParams.video = item
      }
    }
  }

  ADD_MODEL(m, device) {
    // m = model id
    try {
      if (!m) {
        return
      }
      fetchOneModelType3d(m).then((data) => {
        device.setModelType3dOne(data)
        if (!device.getModelType3dOne) return
        vc3d_glob.currentRT = device.getModelType3dOne

        const Set = { dc: 1, x: 1, z: 1 } //device.getSetOne    dc, x, z
        vc3d_glob.currentRT.Set = Set //{ dc, x, z } //device.getSetOne

        var JSON_params1 = { size: 1, fix: 0 }
        if (!data.params1) {
          data.params1 = "{}"
        }
        try {
          JSON_params1 = eval("(" + data.params1 + ")")
        } catch (e) {
          JSON_params1 = { size: 1, fix: 0 }
        }
        //console.log("##@@@@@@ JSON_params1", JSON_params1)
        //console.log("device.getActive3dElement", device.getActive3dElement)

        if (vc3d_glob.currentRT && vc3d_glob.SCENE) {
          vc3d_glob.device = device

          let x = device.getActive3dElement?.cx || 0
          let y = device.getActive3dElement?.cy || 0
          let z = device.getActive3dElement?.cz || 0
          let rx = 0
          let ry = 0
          let rz = 0
          let s = JSON_params1.size || 1 // scale/size
          let set = 1
          let fix = JSON_params1.fix || 0
          let matsArray = [] //JSON_params3[i].matsArray || []

          i3d_base.load_gltf_2021_params({
            m,
            x,
            y,
            z,
            rx,
            ry,
            rz,
            s,
            set,
            data,
            matsArray,
            fix,
          })
        }
      })
    } catch (e) {
      console.error("ERRR==", e)
    }
  }
  DELETE() {
    try {
      if (vc3d_glob.curr_obj_all) {
        vc3d_glob.SCENE.remove(vc3d_glob.curr_obj_all)

        vc3d_glob.ray_objects = vc3d_glob.ray_objects.filter((item) => {
          return item.uuid !== vc3d_glob.curr_obj_all.uuid
        })
        vc3d_glob.ray_objects.forEach((item, idx) => {
          //console.log("item", item)
        })
        if (!vc3d_glob.animate) {
          i3d_all.animate2()
        }
      }
    } catch (e) {
      console.error("ERRR del==", e)
    }
  }
  SAVE(device) {
    try {
      let SetOne = vc3d_glob.device.getSetOne
      let { id, name, adress, model3d, params1, params2, params3, updatedAt } =
        device.getSetOne

      var JSON_params2 = {},
        JSON_params3 = []

      for (var i = vc3d_glob.SCENE.children.length - 1; i >= 0; i--) {
        if (vc3d_glob.SCENE.children[i].MODEL3D) {
          let model = vc3d_glob.SCENE.children[i]

          //console.log("model", model)

          const matsArray = []
          this.find_obj_get_mats(model, matsArray)

          JSON_params3.push({
            m: model.m,
            x: model.position.x,
            y: model.position.y,
            z: model.position.z,
            rx: model.rotation.x,
            ry: model.rotation.y,
            rz: model.rotation.z,
            s: model.scale.x,
            fix: model.fix,
            matsArray,
          })
        }
      }
      JSON_params2.cx = vc3d_glob.CAMERA.position.x
      JSON_params2.cy = vc3d_glob.CAMERA.position.y
      JSON_params2.cz = vc3d_glob.CAMERA.position.z

      params2 = JSON.stringify(JSON_params2)
      SetOne = { ...SetOne, params2: params2 }
      params3 = JSON.stringify(JSON_params3)
      SetOne = { ...SetOne, params3: params3 }

      //console.log("21 SetOne = ", { ...SetOne })
      fetchSetUpdate(SetOne)
    } catch (e) {
      console.error("ERRR sidebar ==", e)
    }
  }

  find_obj_get_mats(node, matsArray) {
    if (
      node.type == "Scene" ||
      node.type == "Group" ||
      node.type == "Mesh" ||
      node.type == "Object3D"
      //) && node.children
    ) {
      if (node.materialParams && node.name) {
        matsArray.push({
          el: node.name,
          params: node.materialParams,
        })
      }

      for (var i = 0; i < node.children.length; i++) {
        this.find_obj_get_mats(node.children[i], matsArray)
      }
    }
  }
  find_obj_set_mats(node, el, params) {
    //console.log("params ===", params)
    if (
      node.type == "Scene" ||
      node.type == "Group" ||
      node.type == "Mesh" ||
      node.type == "Object3D"
      //) && node.children
    ) {
      if (node.name === el && (params.map || params.video)) {
        //console.log("BINGO node.name", node.name)
        //console.log("BINGO2 params.map", params.map)

        const materialParams = {}

        if (params.map) {

          const textureLoader = new THREE.TextureLoader()
          const item = params.map
          const itemWithURL = process.env.REACT_APP_API_URL + params.map
          
          const diffuseMap = textureLoader.load(itemWithURL)
          diffuseMap.encoding = THREE.sRGBEncoding

          const specularMap = textureLoader.load(itemWithURL)
          specularMap.encoding = THREE.sRGBEncoding

          const normalMap = textureLoader.load(itemWithURL)

          materialParams.color = "#fff"
          materialParams.shininess = 35
          materialParams.normalScale = new THREE.Vector2(0.8, 0.8)

          materialParams.map = item
          materialParams.specularMap = item
          materialParams.normalMap = item


          const materialParamsObj = {
            color: "#fff",
            //specular: 0x222222,
            shininess: 35,
            map: diffuseMap,
            specularMap: specularMap,
            normalMap: normalMap,
            normalScale: new THREE.Vector2(0.8, 0.8),
          }
          const material = new THREE.MeshPhongMaterial(materialParamsObj)
          node.material = material
        }
        if (params.video) {
          materialParams.video = params.video
          //materialParamsObj.video = params.video
          //console.log('89898989 params.video = ', params.video, 'node.uuid = ', node.uuid)
        }
        node.materialParams = materialParams

      } else {
        for (var i = 0; i < node.children.length; i++) {
          this.find_obj_set_mats(node.children[i], el, params)
        }
      }
    }
  }
}

export let react3d = new React3d()
