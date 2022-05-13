

import * as THREE from 'three';

import { vc3d_glob } from "../3d/dev2020/f5_vc3d_glob";
import { i3d_base } from "../3d/dev2020/f4_base";
import { i3d_all } from "../3d/dev2020/f7_assist";


class Common {

 // очистим сцену
 clear3dscene() {
    vc3d_glob.ray_objects.length = 0; // Элемент нужно удалять не только со сцены но и из массива для RAYCASTER-а !!!!
    for (var i = vc3d_glob.SCENE.children.length-1; i >= 0; i--) {
        if (vc3d_glob.SCENE.children[i].MODEL3D) {
            vc3d_glob.SCENE.children.splice(i, 1);
        }
    }
    if (!vc3d_glob.animate) { i3d_all.animate2(); }
    //console.log("1===============CLEAR==================vc3d_glob.SCENE.children = ", vc3d_glob.SCENE.children );
 }
 
 valOrDefault(val, defaultVal) {
    if(val == undefined) { return defaultVal; }
    else { return val; }
 }


 def_rack_type(rack_type, rack_p) {  // rack_p - problems array = p: [{ e: "polka_61", pt: 2 }]

    //let cubes_remont2 = [], cubes_remont22 = [], cubes_zamena3 = [], cubes_zamena33 = [], cubes_remont_zamena33 = [], cubes_empty = []
    // мы тут определяем тип Стеллажа: 
    // cubes_remont2 - один ремонт, cubes_remont22 - 2+ ремонтов, то есть у стеллажа сломаны более 2х элементов
    // cubes_zamena3 - одна замена, cubes_zamena33 - 2+ замен
    // rack_type = 23 - значит у стеллажа есть элементы которые надо и ремонтировать и менять
    if(rack_p && rack_p.length > 0) {  //problems     p: [{ e: "polka_61", pt: 2 }]
      rack_p.map((probl) => { 
        if(probl.pt > 0) {
          if(rack_type === 1) { 
            if(probl.pt === 2) { rack_type = 2; } else if(probl.pt === 3) { rack_type = 3; } 
          } else if(rack_type === 2) { 
            if(probl.pt === 2) { rack_type = 22; } else if(probl.pt === 3) { rack_type = 23; } 
          } else if(rack_type === 3) { 
            if(probl.pt === 2) { rack_type = 23; } //else if(probl.pt === 3) { rack_type = 23; } 
          } else if(rack_type === 22) { 
            if(probl.pt === 3) { rack_type = 23; } 
          } else if(rack_type === 33) { 
            if(probl.pt === 2) { rack_type = 23; }
          }
        }
       })
    }
    return rack_type;
}

 animate2() {
    //console.log("animate3   vc3d_glob.ao = " + vc3d_glob.ao);

    if (!vc3d_glob.animate) {
        if (vc3d_glob.ao) {
            //console.log("animate3");
            setTimeout(function () { i3d_base.render_AO(); }, 50);
            setTimeout(function () { i3d_base.render_AO(); }, 100);
        } else {
            //console.log("animate3");
            setTimeout(function () { i3d_base.render(); }, 50);
            setTimeout(function () { i3d_base.render(); }, 100);
        }
    }
}
 animate3() {
    //console.log("animate3   vc3d_glob.ao = " + vc3d_glob.ao);

    if (!vc3d_glob.animate) {
        if (vc3d_glob.ao) {
            //console.log("animate3");
            setTimeout(function () { i3d_base.render_AO(); }, 50);
            setTimeout(function () { i3d_base.render_AO(); }, 100);
            setTimeout(function () { i3d_base.render_AO(); }, 200);
            setTimeout(function () { i3d_base.render_AO(); }, 300);
            setTimeout(function () { i3d_base.render_AO(); }, 400);
            setTimeout(function () { i3d_base.render_AO(); }, 800);
        } else {
            //console.log("animate3");
            setTimeout(function () { i3d_base.render(); }, 50);
            setTimeout(function () { i3d_base.render(); }, 100);
            setTimeout(function () { i3d_base.render(); }, 200);
            setTimeout(function () { i3d_base.render(); }, 300);
            setTimeout(function () { i3d_base.render(); }, 400);
            setTimeout(function () { i3d_base.render(); }, 800);
        }
    }
}
 animate4() {
    if (!vc3d_glob.animate) {

        if (vc3d_glob.ao) {
            //console.log("animate3");
            setTimeout(function () { i3d_base.render_AO(); }, 50);
            setTimeout(function () { i3d_base.render_AO(); }, 100);
            setTimeout(function () { i3d_base.render_AO(); }, 200);
            setTimeout(function () { i3d_base.render_AO(); }, 300);
            setTimeout(function () { i3d_base.render_AO(); }, 400);
            setTimeout(function () { i3d_base.render_AO(); }, 800);
            setTimeout(function () { i3d_base.render_AO(); }, 900);
            setTimeout(function () { i3d_base.render_AO(); }, 1000);
            setTimeout(function () { i3d_base.render_AO(); }, 1100);
            setTimeout(function () { i3d_base.render_AO(); }, 1200);
            setTimeout(function () { i3d_base.render_AO(); }, 1300);
            setTimeout(function () { i3d_base.render_AO(); }, 1400);
            setTimeout(function () { i3d_base.render_AO(); }, 1500);
            setTimeout(function () { i3d_base.render_AO(); }, 1600);
            setTimeout(function () { i3d_base.render_AO(); }, 1700);
            setTimeout(function () { i3d_base.render_AO(); }, 1800);
            setTimeout(function () { i3d_base.render_AO(); }, 2000);
            setTimeout(function () { i3d_base.render_AO(); }, 3000);
            setTimeout(function () { i3d_base.render_AO(); }, 4000);
            setTimeout(function () { i3d_base.render_AO(); }, 5000);
            setTimeout(function () { i3d_base.render_AO(); }, 6000);
            setTimeout(function () { i3d_base.render_AO(); }, 7000);
        } else {
            //console.log("animate3");
            setTimeout(function () { i3d_base.render(); }, 50);
            setTimeout(function () { i3d_base.render(); }, 100);
            setTimeout(function () { i3d_base.render(); }, 200);
            setTimeout(function () { i3d_base.render(); }, 300);
            setTimeout(function () { i3d_base.render(); }, 400);
            setTimeout(function () { i3d_base.render(); }, 800);
            setTimeout(function () { i3d_base.render(); }, 900);
            setTimeout(function () { i3d_base.render(); }, 1000);
            setTimeout(function () { i3d_base.render(); }, 1100);
            setTimeout(function () { i3d_base.render(); }, 1200);
            setTimeout(function () { i3d_base.render(); }, 1300);
            setTimeout(function () { i3d_base.render(); }, 1400);
            setTimeout(function () { i3d_base.render(); }, 1500);
            setTimeout(function () { i3d_base.render(); }, 1600);
            setTimeout(function () { i3d_base.render(); }, 1700);
            setTimeout(function () { i3d_base.render(); }, 1800);
            setTimeout(function () { i3d_base.render(); }, 2000);
            setTimeout(function () { i3d_base.render(); }, 3000);
            setTimeout(function () { i3d_base.render(); }, 4000);
            setTimeout(function () { i3d_base.render(); }, 5000);
            setTimeout(function () { i3d_base.render(); }, 6000);
            setTimeout(function () { i3d_base.render(); }, 7000);
        }
    }
}
 animate5() {
    if (!vc3d_glob.animate) {

        //alert("animate 5!");

        var time1 = 100;

        if (vc3d_glob.ao) {
            //console.log("animate3");


            for (var i = 0; i < 1000; i++) {

                setTimeout(function () { 
                    //TWEEN.update(); 
                    i3d_base.render_AO(); }, time1);
                time1 += 50;
                //("time1 = " + time1);
            }

        } else {

            for (var i = 0; i < 1000; i++) {

                setTimeout(function () { 
                    //TWEEN.update(); 
                    i3d_base.render(); }, time1);
                time1 += 50;
                //c("time1 = " + time1);
            }
        }
    }
}































 o(num) { return Math.ceil(num * 100) / 100; }

 gener_name_to_input(length, chars, div_id) { // g ener_name_to_input(16, '#aA', 
    var random = this.randomString(length, chars);
    var to_name = "" + random;
    return to_name;
}
 randomString(length, chars) {
    var mask = '';
    if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
    if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (chars.indexOf('#') > -1) mask += '0123456789';
    if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
    var result = '';
    for (var i = length; i > 0; --i) result += mask[Math.floor(Math.random() * mask.length)];
    return result;
}
 err_mess(err_mess_text, err_mess_id) {
try {
    //if (jscloud_data.err_mess_alert) this.alert_sys(err_mess_text);

    err_mess_id = "err mess";
    if (err_mess_id) {
        var err_mess_id_el = document.getElementById(err_mess_id); if (err_mess_id_el) { err_mess_id_el.innerHTML = err_mess_text; }
        else { this.alert_sys(err_mess_text); }
    } else { this.alert_sys(err_mess_text); }
} catch (e) { this.c_sys("err mess: " + e.name + ": " + e.message); }
}
 oi(oooiii, some_string) {
var sss = "", ooo = oooiii; for (var key in ooo) { if (typeof (ooo[key]) !== "function") sss += "\n" + key + ':' + ooo[key]; }
this.alert_sys(some_string + sss);
}
 coi(oooiii, some_string) {
//var sss = "", ooo = oooiii; for (var key in ooo) { if (typeof (ooo[key]) !== "function") sss += "\n" + key + ':' + ooo[key]; }
console.log(some_string);
console.log(oooiii);
}
 ca(oooiii, some_string) {
//var sss = "", ooo = oooiii; for (var key in ooo) { if (typeof (ooo[key]) !== "function") sss += "\n" + key + ':' + ooo[key]; }
console.log(some_string);
console.log(oooiii);alert(some_string);
}
 coi_sys(oooiii, some_string) {
//var sss = "", ooo = oooiii; for (var key in ooo) { if (typeof (ooo[key]) !== "function") sss += "\n" + key + ':' + ooo[key]; }
console.log(some_string);
console.log(oooiii);
}
 c(some_string) { console.log(some_string); }
 c_sys(some_string) { console.log(some_string); }
 getParam(sParamName) {
var Params = ""; //location.search.substring(1).split("&");
var variable = "";
for (var i = 0; i < Params.length; i++) {
    if (Params[i].split("=")[0] == sParamName) {
        if (Params[i].split("=").length > 1) variable = Params[i].split("=")[1];
        return variable;
    }
}
return "";
}

 random_color() { return "#" + ((1 << 24) * Math.random() | 0).toString(16); }
 alert_sys(txt) {alert(txt);}


 onWindowResize_AO_WORK() {

   //this.c("onWindowResize_AO")
   // var width = vc3d_glob.SCREEN_WIDTH || window.innerWidth;
   // var height = vc3d_glob.SCREEN_HEIGHT || window.innerHeight;
   var width = vc3d_glob.SCREEN_WIDTH = window.innerWidth;
   var height = vc3d_glob.SCREEN_HEIGHT = window.innerHeight;

   vc3d_glob.CAMERA.aspect = width / height;

   vc3d_glob.CAMERA.updateProjectionMatrix(); // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
   vc3d_glob.renderer.setSize(width, height);

   // if (vc3d_glob.ao) {
   //     // Resize renderTargets
   //     ssaoPass.setSize(width, height);

   //     var pixelRatio = vc3d_glob.renderer.getPixelRatio();
   //     var newWidth = Math.floor(width / pixelRatio) || 1;
   //     var newHeight = Math.floor(height / pixelRatio) || 1;
   //     app.ao.effectComposer.setSize(newWidth, newHeight);
   // }


   // if (vc3d_glob.webcam) {

   //     if (vc3d_glob.old_width == -1) { vc3d_glob.old_width = width; }
   //     if (vc3d_glob.old_height == -1) { vc3d_glob.old_height = height; }

   //     var xrate = width / vc3d_glob.old_width; var yrate = height / vc3d_glob.old_height;
   //     if (video_mesh) { video_mesh.scale.set(vc3d_glob.videox * xrate, vc3d_glob.videoy * yrate, 1); }; // на мобильном

   //     vc3d_glob.old_width = width;
   //     vc3d_glob.old_height = height;
   // }

   if (!vc3d_glob.animate) { this.animate3(); }
}


 onWindowResize_AO_Mobile() {
    
    const w = 500, h = 700;
    let newWidth = window.innerWidth > w ? w : window.innerWidth;
    let newHeight = window.innerHeight > h ? h : window.innerHeight;

    var width = vc3d_glob.SCREEN_WIDTH = newWidth;
    var height = vc3d_glob.SCREEN_HEIGHT = newHeight;

    vc3d_glob.CAMERA.aspect = width / height;

    vc3d_glob.CAMERA.updateProjectionMatrix(); // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    vc3d_glob.renderer.setSize(width, height);

    //console.log("onWindowResize_AO  width = " +  width + ", height = " + height + ", window.innerHeight = " + window.innerHeight + ", newHeight = " + newHeight);

    // alert("onWindowResize_AO  " + ", height = " + height + ", width = " +  width 
    // + ", \n window.innerHeight = " + window.innerHeight 
    // + ", window.innerWidth = " + window.innerWidth
    // + ", \n document.body.clientHeight = " + document.body.clientHeight
    // + ", document.body.clientWidth = " + document.body.clientWidth
    // + ", \n  window.screen.height = " +  window.screen.height
    // + ",  window.screen.width = " +  window.screen.width
    // + ", \n window.screen.availHeight = " + window.screen.availHeight
    // + ", window.screen.availWidth = " + window.screen.availWidth
    // );

    if (!vc3d_glob.animate) { this.animate3(); }
}

 onWindowResize_AO_Detect() {

    if (navigator.platform == 'Win32' || navigator.platform == 'Win64' ) {
        // код для обычных устройств
        var width = vc3d_glob.SCREEN_WIDTH = window.innerWidth;
        var height = vc3d_glob.SCREEN_HEIGHT = window.innerHeight;
     
        vc3d_glob.CAMERA.aspect = width / height;
     
        vc3d_glob.CAMERA.updateProjectionMatrix(); // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        vc3d_glob.renderer.setSize(width, height);

        if (!vc3d_glob.animate) { this.animate3(); }
        alert("Computer   navigator.platform = " + navigator.platform)

      } else {
        // код для мобильных устройств
        this.onWindowResize_AO_Mobile()
        alert("Mobile   navigator.platform = " + navigator.platform)

    }
}
// ____DETECT_Mobile
onWindowResize_AO() {

    if (navigator.platform == 'Win32' || navigator.platform == 'Win64' ) {
        // код для обычных устройств
        var width = vc3d_glob.SCREEN_WIDTH = window.innerWidth;
        var height = vc3d_glob.SCREEN_HEIGHT = window.innerHeight;
    } else {
        // код для мобильных устройств
        //alert(window.orientation);

        if (window.matchMedia("(orientation: portrait)").matches) {
            // you're in PORTRAIT mode
            //var width = vc3d_glob.SCREEN_WIDTH = window.screen.width * 1.2;
            var width = vc3d_glob.SCREEN_WIDTH = window.innerWidth;
            //var height = vc3d_glob.SCREEN_HEIGHT = window.screen.height;
            var h = 1000;
            let newHeight = window.innerHeight > h ? h : window.innerHeight;
            var height = vc3d_glob.SCREEN_HEIGHT = newHeight;

         } else if (window.matchMedia("(orientation: landscape)").matches) {
            // you're in LANDSCAPE mode
            // var width = vc3d_glob.SCREEN_WIDTH = window.screen.width;
            // var height = vc3d_glob.SCREEN_HEIGHT = window.screen.height;

            var w = 500;
            let newWidth = window.innerWidth > w ? w : window.innerWidth;
            var width = vc3d_glob.SCREEN_WIDTH = newWidth;
                       
            var h = 300;
            let newHeight = window.innerHeight > h ? h : window.innerHeight;
            var height = vc3d_glob.SCREEN_HEIGHT = newHeight;
               
         }
    }

    vc3d_glob.CAMERA.aspect = width / height;
 
    vc3d_glob.CAMERA.updateProjectionMatrix(); // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    vc3d_glob.renderer.setSize(width, height);

    // alert("onWindowResize_AO  " + ", height = " + height + ", width = " +  width 
    // + ", \n window.innerHeight = " + window.innerHeight 
    // + ", window.innerWidth = " + window.innerWidth
    // + ", \n document.body.clientHeight = " + document.body.clientHeight
    // + ", document.body.clientWidth = " + document.body.clientWidth
    // + ", \n  window.screen.height = " +  window.screen.height
    // + ",  window.screen.width = " +  window.screen.width
    // + ", \n window.width = " + window.width
    // + ", window.height = " + window.height
    // );

    if (!vc3d_glob.animate) { this.animate3(); }
 }
 



}

export let common = new Common();


