
import * as THREE from 'three';

import { i3d_all } from "./f7_assist.js";
import { i3d_app_sets } from "./f3_apparat_sets.js";
import { i3d_save } from "./f1_save.js";
import { i3d_mats } from "./f2_mats.js";
import { vc3d_glob } from "./f5_vc3d_glob.js";

export let app = {
    el: '#app',
        curr_obj_scale_x: 1, curr_obj_scale_y: 1, curr_obj_scale_z: 1, curr_obj_pos_x: 1, curr_obj_pos_y: 1, curr_obj_pos_z: 1, curr_obj_rot_x: 1, curr_obj_rot_y: 1, curr_obj_rot_z: 1,
        //APi   materials
        offsetX: 0, offsetY: 0, repeatX: 0.25, repeatY: 0.25, centerX: 0.5, centerY: 0.5, rotation: Math.PI / 4, // rotation positive is counter-clockwise
        el_name: "", el_descr: "", el_price: "", el_volume: "",
        value: 50

        , all: { curr_obj_elems: [] } // curr_obj_elems - элементы выбранной модели, // app.all.ge[1].elems[1].libs[1]  - вот так храним библиотеки назначенные элементу!!!
        , user_data: {  }

        , mats_dwnldbl: {}

        // UP LESTER
        , models_array: [] // заполняется из таблицы models (n3 -> models_owner3)
        , all_ge: []   // temp
        , model_unid_in_ge: ""

        , set_name: "", set_user_name: "", set_user_email: "", set_user_tel: "" //, : ""



        , curr_libs_id: 0, curr_libs_name: ""
        , libs_array: []
        , libs_array_1000: []
        , libs_choosed: []
        , curr_obj_data: { "set_unid": "", "set_id": 0, "obj_type": 0, "mod_type": 0, "users_id": 0, "ge_i": "", "model_unid_in_ge": "", "child_number": 0, "mod_name": "", "libs": [], mat_params: {} }

        , libs_select_1_array: [{ id: 1, text: "Одежда" }, { id: 2, text: "Обувь" }, { id: 3, text: "Сумки" }, { id: 4, text: "Аксессуары" },
        { id: 5, text: "Ювелирные изделия" }, { id: 6, text: "Головные уборы" }, { id: 7, text: "Разное" }]

        /*{ id: 0, text: "Все" }, */
        , heading: "Vue Select Cascade"
        , make: null
        , model: null, libs_sex: null 
        , makes_options: [{ id: 1, text: "Одежда" }, { id: 2, text: "Обувь" }, { id: 3, text: "Сумки" }, { id: 4, text: "Головные уборы" }, { id: 5, text: "Аксессуары" }, { id: 6, text: "Перчатки и варежки" }
            , { id: 7, text: "Белье" }, { id: 8, text: "Ювелирные изделия" }, { id: 9, text: "Разное" }, { id: 10, text: "Свои фото" }
        ]
        , libs_sex_array: [{ id: 1, text: "женская" }, { id: 2, text: "мужская" }, { id: 3, text: "детская" }, { id: 4, text: "унисекс" },
        { id: 5, text: "женская / детская" } ]

        , goods_elements_materials: []
        , refreshs_array: [{ id: 1, name: "Обновить все" }]

        , sets_array: []
        , obj_gltf_array: [{ id: "obj_gltf_array_id_1", val: 1, name: "obj", title: "Выберите этот пункт если будете загружать файлы obj + mtl, jpg или png" }
            , { id: "obj_gltf_array_id_2", val: 2, name: "gltf", title: "Выберите этот пункт если будете загружать файлы gltf + bin, jpg или png" }]
        , curr_model_type: 1
        , all: { ge: [], set: [], elems: [], set_id: "", set_name: "", set_unid: "", set_users_id: "" } // из таблицы sets (n3 - > g oods_elements_by_set)

        , site: "https://int3d.store/edit.html", pics_dir: vc3d_glob.pics_dir

        , user_data: {}
        , uid: 1
        , message: 'Привет, Vue!'
        , refreshs_array: [{ id: 1, name: "Обновить все" }]
        , curr_obj: { "set_unid": "", "set_id": 0, "obj_type": 0, "mod_type": 0, "users_id": 0, "ge_i": -1, "model_unid_in_ge": "", "child_number": 0, "name": 0, "mod_name": "", "libs": [], mat_params: {} }



        /// APPARAT  //////////////////
        , all_mats_libs_id: 67 //, plus_mat_id: 701, minus_mat_id: 700
        , apparat: {

            places: [
                //{ metka: "mode", coords: [{ x: 513, y: 512, z: 0 }, { x: 667, y: 512, z: 0 }, { x: - 667, y: 434, z: 0 }, { x: 513, y: 434, z: 0 } ], no: "z" },
                { metka: "mode", x: [513, 667, 667, 513], y: [512, 512, 434, 434], z: [0, 0, 0, 0], no: "z" },
                { metka: "mode", x: [513, 667, 667, 513], y: [512, 512, 434, 434], z: [0, 0, 0, 0], no: "z" },

            ],
        }

        // FF
        , libs_array: []
        , choosed_elem_libs_array: []

        // gltf apparat EDITOR
        , editor: { curr_trigger: {}, curr_target: {}, choosing_trigger_true: true, iteration: 0
            , modes: [], iters: [], targets: [], mode_num: 0
            , digit3: true, sign: 1
            , choose_targets: false, choose_targets_model_unid_in_ge: "", choose_targets_target: ""
            , materials: []
            , choosed_elem_mode_iter_target: undefined
            //, choosed_regular_iter: undefined
            , lib_num_to_all_elems: -1


            , choosed_elem_mode: undefined

            //goods
            , goods: [], choosed_good: undefined, good_activeIndex: -1, good_activeIndex2: -1 // , good_num: 0
            // sklad goods types
            , goods_types: [], choosed_good_type: undefined, good_type_activeIndex: -1 // , good_num: 0


            // regular_iter
            , choosed_regular_iter: undefined
            , choosed_regular_iter_target: undefined
            , choosed_regular_iter_target_rule: undefined
            , regular_iter_targets: []
            , regular_iter_target_rules: []
            , regular_iter_activeIndex: -1 // для выделения цветом
            , regular_iter_target_activeIndex: -1 // для выделения цветом
            , regular_iter_target_rules: undefined // для выделения цветом ПРАВИЛО РЕГ.ИТЕРАЦИИ
            , regular_iter_target_rule_activeIndex: -1 // для выделения цветом ПРАВИЛО РЕГ.ИТЕРАЦИИ

            , regular_iter_digit_activeIndex: undefined // для выделения цветом (номера цифр счетчика) - когда он определен мы не даем кликать на 3Д модели, потому что иначе при клике номерам цифр счетчка будут присвоены номеры элементов на которых произошел клик. Поэтому идут проверки чтобы он был равен undefined
            , regular_iter_digit_plus_minus_activeIndex: undefined // для выделения цветом (ПЛЮС И МИНУС номера цифр счетчика) - когда он определен мы не даем кликать на 3Д модели, потому что иначе при клике номерам цифр счетчка будут присвоены номеры элементов на которых произошел клик. Поэтому идут проверки чтобы он был равен undefined
            , regular_iter_digit2_activeIndex: undefined // для выделения цветом (номера цифр счетчика) - когда он определен мы не даем кликать на 3Д модели, потому что иначе при клике номерам цифр счетчка будут присвоены номеры элементов на которых произошел клик. Поэтому идут проверки чтобы он был равен undefined
            , regular_iter_digit2_plus_minus_activeIndex: undefined // для выделения цветом (ПЛЮС И МИНУС номера цифр счетчика) - когда он определен мы не даем кликать на 3Д модели, потому что иначе при клике номерам цифр счетчка будут присвоены номеры элементов на которых произошел клик. Поэтому идут проверки чтобы он был равен undefined
            
            , mode_activeIndex: -1 // для выделения цветом
            , iter_activeIndex: -1 // для выделения цветом
            , targets_activeIndex: -1 // для выделения цветом
            , iterations: [] // итерации сюда запишем из all.set[0].iterations

            , regular_iter_digits_mats_id: [] // цифры для числовых итераций регуляторов
            , regular_iter_digit_plus_minus: [] // цифры для числовых итераций регуляторов
            , regular_iter_digits2_mats_id: [] // цифры для числовых итераций регуляторов
            , regular_iter_digit2_plus_minus: [] // цифры для числовых итераций регуляторов

            , all_elems_activeIndex: -1 // для выделения цветом

            // TEST
            , tests: []
            , test_activeIndex: -1 // для выделения цветом
            , choosed_test: undefined
            , choosed_test_actions: []
            , choosed_test_action: undefined
            , test_action_activeIndex: -1 // для выделения цветом
            
            , choosed_test_action_clicks: []
            , choosed_test_action_click: undefined
            , test_action_click_activeIndex: -1 // для выделения цветом
            
            , choosed_test_action_targets: []
            , choosed_test_action_target: undefined
            , test_action_target_activeIndex: -1 // для выделения цветом

            , test_mess: "" // сообщения по выполнению теста


            , libs: [] // список номеров библиотек для записи в sets[0].libs

            , libs_audio: []
            , audios: []
            , digits_isHidden: true
            //, plus_mat_id: 868, minus_mat_id: 867


            , ONE_choosed_elem_target: undefined // в идеале у нас должен быть только один элемент для которого назначаем элемент (цель) модели
            , choosing_navi_left_target: false // если true значит выбираем навигацию слева
            , choosing_navi_right_target: false // если true значит выбираем навигацию справа
            
            , choosing_target_mat: false // если true значит выбираем материал для таргета
            , choosing_target_mat2: false // если true значит выбираем материал 2 для таргета
            
            , choosing_mode_obodok_mat: false // если true значит выбираем материал для режима ободка
            , choosing_mode_obodok_mat2: false // если true значит выбираем материал 2 режима ободка

            , selected_elem_target_num: -1 // элемент который выбран в данный момент или первый элемент с которого начинается навигация
            , selected_elem_name: "" // элемент который выбран в данный момент или первый элемент с которого начинается навигация
            , selected_elem_model_unid: "" // элемент который выбран в данный момент или первый элемент с которого начинается навигация
            , selected_elem_type: -1 // 5 - hover OR 6 - selected
            , selected_elem_for_navi: undefined // 5 - hover OR 6 - selected
            //, selected_elem_target_num_6: -1 // элемент который выбран в данный момент или первый элемент с которого начинается навигация
            //, selected_elem_name_6: "" // элемент который выбран в данный момент или первый элемент с которого начинается навигация
            //, selected_elem_model_unid_6: "" // элемент который выбран в данный момент или первый элемент с которого начинается навигация


            // MENUS
            , menus: [], menu_items: [], menu_item_num: 0, menu_item_point_num: 0
            , menu_activeIndex: -1, choosed_menu: undefined, choosed_menu_items: []
            , menu_item_activeIndex: -1, choosed_menu_item: undefined
            , menu_item_acts: [], menu_item_act_activeIndex: -1, choosed_menu_item_act: undefined, choosed_menu_item_acts: [] //, choosed_menu_item_acts: []

            , pics_dir_mat_img: ""     // src для отдельной выбранной картинки
            , pics_dir_mat_img_id: -1  // id отдельной выбранной картинки

            , choosing_menu_item_mat: false
            , choosing_menu_item_mat2: false
            , choosing_menu_item_act_mat: false
            , choosing_menu_item_act_mat2: false

            , curr_el: {} // текущий элемент меню и экранов


        }
        // МЕНЮ СПРАВА - ВЫБИРАЕМ ПУНКТЫ МЕНЮ КОТОРЫЕ ОТКРЫВАЮТСЯ ПО УМОЛЧАНИЮ
        , menu: { main: false, save: false, editor: false, info: true }
        , menu2: { objects: true, libs_to_objects: false, libs_pics: false, sets: false }
        , menu3: { pics: false, editor: false, mat_edit: true, elems: false }

        , login: false // если false значит показывается кнопки FB и VK, если true показываем кнопку Выхода
        , temp: false // если false значит показывается кнопки FB и VK, если true показываем кнопку Выхода
        , messages: {
            elem_name1: ""
            , elem_descr: ""
            , elem_mode_mess: ""
            , elem_mode_iter_mess: ""
            , elem_mode_iter_target_mess: ""
            , elem_reg_iter_mess: ""
            , elem_reg_iter_target_mess: ""
            , elem_reg_iter_target_rule_mess: ""

        }
        , mess_if: false


        , test: false
        , plitka: {
            sets: [
  { hor_qty: 1, vert_qty: 1, width: 800, height: 700, gap_width: 10, gap_height: 10, pos: { x: 2000, y: 220, z: 0}, rot: { x: 40, y: 0, z: 0}},
  { hor_qty: 2, vert_qty: 2, width: 900, height: 700, gap_width: 20, gap_height: 20, pos: { x: -100, y: 220, z: -220}, rot: { x: 90, y: 0, z: 0}},
          ] //, type: "wall" //"floor"
        }

        , not_show: true


        , v_messages_erase() { // удалим сообщения об элементах
            for (var key in this.messages) { 
                //c("menu[key] = " + menu[key] + ", key = " + key + ", menu_name = " + menu_name);
                this.messages[key] = "";
            }
            this.mess_if = false;
        }
    
    


       
};


// f9_appvue.js
