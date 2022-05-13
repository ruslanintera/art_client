

import { app } from "./f9_appvue.js";
//import { i3d_down_up } from "./f88_down.js";
import { i3d_all } from "./f7_assist.js";
import { i3d_mats } from "./f2_mats.js";
import { vc3d_glob } from "./f5_vc3d_glob.js";


class i3d_Ao3 {


// if(YES) значит выбираем цель для итерации итерации режима элемента
 check_if_we_in_editor_mode() {
    return false;
}

 send_mess_to_parent(obj) {
    if (window.parent && window.parent.postMessage) {
        
        obj.trigger_mode_num = vc3d_glob.trigger_mode_num;
        var ttt = JSON.stringify(obj);
        window.parent.postMessage(ttt, "*");
    }
}
/*
i3d_ao3.send_mess_to_parent({"model_unid_in_ge": vc3d_glob.curr_obj.model_unid_in_ge
, "name": vc3d_glob.curr_obj.name, "target_num": target_num
, "target_name": trigger.iters[iteration].targets[i].target, "mat_id": mat_id });

*/




 click_white_area() {

        // ЗНАЧИТ ПРОИЗОШЕЛ КЛИК НА БЕЛОМ ФОНЕ !!!
        if (i3d_ao3.check_if_we_in_editor_mode()) {
            // значит мы находися в режиме выбора целей - таргетов
            i3d_all.alert_sys("Вы находитесь в режиме выбора целей - элементов, которые будут изменяться. Для выхода из режима, пожалуйста, проверьте выбранные цели и затем нажмите одну из кнопок 'Завершить выбор целей'");

        } else {
            
            if (vc3d_glob.audio && vc3d_glob.audio.isPlaying) { vc3d_glob.audio.pause(); } //vc3d_glob.audio = vc3d_glob.curr_obj.sound; if (vc3d_glob.audio) { vc3d_glob.audio.play(); }

            app.content_categories_curr_obj = []; // сначала обнулим список категорий для выбранного объекта

            vc3d_glob.curr_obj = null;
            vc3d_glob.curr_obj_all = null;
            vc3d_glob.last_trigger_iterations_name = ""; // белый фон это же не итерация (не перебор цифр для колесика)
            vc3d_glob.previous_point = null;
            vc3d_glob.selected_to_move = false;
            vc3d_glob.curr_obj = null;
            app.el_name = ""; app.el_descr = ""; app.el_price = ""; app.el_volume = "";

            //!!!! вернем объекту его изначальный материал
            if(vc3d_glob.delete_elem_selection_when_click_white_area) { 
                if(vc3d_glob.current2021) { 
                    vc3d_glob.current2021.obj.material = vc3d_glob.current2021.mat; 
                    //console.log("w 2")
                }
                if (!vc3d_glob.animate) { i3d_all.animate2(); }
            }
            vc3d_glob.device.setActive3dElement(null)

        }

}
 move_model() { // во время щелчка по элементу посчитаем значения vc3d_glob.raznica_inter. x,y,z для расчета движения элемента

    // это если нужно двигать объекты ////////////////////////////////////////
        if ((vc3d_glob.move && vc3d_glob.curr_obj_all.move_type > 0) || vc3d_glob.curr_obj.light_sphere == true) {
            vc3d_glob.selected_to_move = true; //Object.create(vc3d_glob.curr_obj); 

            vc3d_glob.raycaster.setFromCamera(vc3d_glob.mouse, vc3d_glob.CAMERA);

            var intersects_plane = vc3d_glob.raycaster.intersectObject(vc3d_glob.plane);
            if (intersects_plane && intersects_plane[0] && intersects_plane[0].point) {
                vc3d_glob.raznica_inter.x = parseFloat(intersects_plane[0].point.x) - parseFloat(vc3d_glob.curr_obj_all.position.x);
                vc3d_glob.raznica_inter.y = parseFloat(intersects_plane[0].point.y) - parseFloat(vc3d_glob.curr_obj_all.position.y); // z изменяется когда двигаемся по СТЕНЕ
                vc3d_glob.raznica_inter.z = parseFloat(intersects_plane[0].point.z) - parseFloat(vc3d_glob.curr_obj_all.position.z); // z изменяется когда двигаемся по полу

            } else {
                vc3d_glob.raznica_inter.x = 0; vc3d_glob.raznica_inter.y = 0; vc3d_glob.raznica_inter.z = 0;
                //raznica_inter_el.x = 0; raznica_inter_el.y = 0; raznica_inter_el.z = 0;
            }


        } else {
            vc3d_glob.selected_to_move = false;
            vc3d_glob.raznica_inter.x = 0; vc3d_glob.raznica_inter.y = 0; vc3d_glob.raznica_inter.z = 0;
            //raznica_inter_el.x = 0; raznica_inter_el.y = 0; raznica_inter_el.z = 0;
        }

}


 play_sound(j) {
    // найдем звук в массиве vc3d_glob.sounds_array и проиграем его
    if (app.all.elems[j].modes[app.all.elems[j].mode_num].sound) {
        for(let si=0; si < vc3d_glob.sounds_array.length; si++) {
            if(vc3d_glob.sounds_array[si].sound_ref == app.all.elems[j].modes[app.all.elems[j].mode_num].sound) { 
                if (vc3d_glob.audio && vc3d_glob.new_true_old_false) { 
                    vc3d_glob.audio.stop(); //c("sound stop");
                } 
                vc3d_glob.audio = vc3d_glob.sounds_array[si].sound;
                if (vc3d_glob.audio) { 
                    vc3d_glob.audio.play(); //c("sound play");
                }
                break; 
            } // ищем данный звук в этом массиве
        }
    }
}


 ugol_between_points(Ax,Az,Bx,Bz){

    //function math.angle(x1,y1, x2,y2)
    //return math.atan2(x2-x1, y2-y1)

    let Ugol_rad = Math.atan2(Bx-Ax, Bz-Az);
    let Ugol_gradus = Ugol_rad * 180 / Math.PI; 
    return  { "Ugol_rad": Ugol_rad, "Ugol_gradus": Ugol_gradus };
}
 ugol_between_vectors(Ax,Az,Bx,Bz){

    let Scalyar = Ax * Bx + Az * Bz;
    let A_modul = Math.sqrt(Ax * Ax + Az * Az)
    let B_modul = Math.sqrt(Bx * Bx + Bz * Bz)
    let Ugol_rad = Scalyar / (A_modul * B_modul);
    let Ugol_gradus = Ugol_rad * 180 / Math.PI; 

    /** /
    //c("Ugol_rad = "+Ugol_rad+", Ugol_gradus = "+Ugol_gradus+", Ax = "+Ax+", Az = "+Az+", Bx = "+Bx+", Bz = "+Bz+", Scalyar = "+Scalyar+", A_modul = "+A_modul+", B_modul = "+B_modul);
    /**/
    return { "Ugol_rad": Ugol_rad, "Ugol_gradus": Ugol_gradus };

}
 WherePoint(ax,ay,bx,by,px,py){
    var s, point_left_1_right_minus_1;
    s=(bx-ax)*(py-ay)-(by-ay)*(px-ax);
    if (s > 0) { point_left_1_right_minus_1 = 1; }
    else if (s < 0) { point_left_1_right_minus_1 = -1; }
    else { point_left_1_right_minus_1 = 0; }
    return point_left_1_right_minus_1;
}



}
export let i3d_ao3 = new i3d_Ao3(); // i3d_ao3.




// f8_ao3.js



