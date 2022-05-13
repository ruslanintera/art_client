


export let vc3d_glob = {
	
	set_temp_mat: false,
    delete_elem_selection_when_click_white_area: true, // вернем объекту его изначальный материал ?
    // 0 - empty, 1 - rack, 2 - ремонт, 3 - замена:
    rack_empty_color: "#eee",
    rack_empty_DARK_color: "#888",
    rack_BLUE_color: "#00f",
    rack_GREEN_color: "#1f1",
    rack_repair_color: "#f50",
    rack_change_color: "#f00",

    rack_repair2_color: "#c07",
    rack_repair22_color: "#c04",

    rack_change3_color: "#f00",
    rack_change33_color: "#800",
    rack_repair_change23_color: "#f04",




    dc_params1: {}, // данные РЦ
    delete_previous_cube: true,
    red_cubes: [], // показываем кубики при клике на стеллаж

    ao: false,
	shadow: false,
	//animate: true, // !!! 
	//animate: false,
	camera: { x: 0, y: 2700, z: 100 }, lookAt: { x: 0, y: 0, z: 0 }, 
    
    noVK: true,
    //noVK: false,
    noVUE: true,

    carousel: false,
    tween: false,
    no_SCENE_PARAMS: false,

	webcam: false,
	video: false, //true
	el_name: true,
	interactive: "yes",
	add_text: "no", //"no", "text"
	add_stext: false, // //sprite
	apparat: false,
	exhibition: false,
	apparatNEW: true,
	light_sphere: 22,
	init_num: "ao3", // ao3, css3
	mat_envMap: false,
	envMap: false,
    
    floor: "floor", // "floor, wall"
    //floor: "wall", // "floor, wall"
    
    mat_type: "fashion", //standard, phong, fashion
	onlongtouch_times: 0, // 5 // счетчик количества срабатываний onlongtouch = сколько должно сработать onlongtouch, чтобы мы считали это долгим нажатием. Если долгое нажатие но mouse_UP не должно срабатывать
	touchduration_reg_iter: 170, //70, //40 скорость инкримента //length of time we want the user to touch before we do something
	touchduration_ONE_LONG_CLICK: 170, //40  скорость инкримента //length of time we want the user to touch before we do something
	touch_type: 2, // mouse_DOWN(event);

    MouseUp: false, // пока MouseUp == false есть возможность срабатывания событий для длительного нажатия отменяем

    data_folder: "../data/",

    texture_type: "FF", // FF, sets
	pics_dir: "../../",
	listen: true,


    turn_obj: false, // вращаем объект, тест
    
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1
    //i3d_windows: true, // показываем новый тип окна
    onlyOneRender: 0,


    panSpeed_not_count: true, // if true then we could move scene with all o bjects

    plane: {}, // плоскость для перемещения объектов
    mouse: {}, // координаты мыши на экране
    raznica_inter: { x: 0, y: 0, z: 0 }, // для перемещения объектов
    SCREEN_WIDTH: window.innerWidth, 
    SCREEN_HEIGHT: window.innerHeight,
    // API: { offsetX: 0, offsetY: 0, repeatX: 0.25, repeatY: 0.25, rotation: Math.PI / 4, centerX: 0.5, centerY: 0.5 },
    php_ajax: { n3: "https://intera3d.ru/_aphp2020_1/n3_u511037.php?callback=?" },


    // vc3d :

    curr_obj: {}
    , envMap: {}
    , log_fb: false, log_vk: false
    , user_data: {}

    , selected_to_move: null
    , move: true

    , materials: [] //список материалов для выбранного элемента
    , libs: [] //- тут список библиотек для которых уже вытаскивали материалы из базы. Значит при назначении элементу библиотеки нужно этот список обнулить, чтобы опять сделать запрос из базы
    , APImat: { offsetX: 0, offsetY: 0, repeatX: 10, repeatY: 10, rotation: 0, centerX: 0, centerY: 0 }

    , shadow: false
    , no_anim: true
    // , ao: false  = vc3d_glob.ao
    , mat_type: "standard"
    //, mat_type: "phong"
    , old_width: -1, old_height: -1, videox: 35, videoy: 35

    , curr_obj_last_choosed: null //объект который выбрали последним, он нам нужен потому что мы ему изменили цвет и когда выберем другой объект нужно ему вернуть его родной цвет
    , choosed_material_color: { b: 0.1, g: 0.5, r: 0.7 } // сюда мы будем записывать родной цвет элемента перед тем как поменяем цвет элемента на синий
    , choosed_material: { } // сюда мы будем записывать родной МАТЕРИАЛ элемента перед тем как поменяем цвет элемента на синий

    // это для управления колесиками, которые увеличивают значения при продолжительном нажатии
    , isDown: false // нажата или кнопка мыши
    , isDown_moving: false // нажата или кнопка мыши
    , iteration: 0 // счетчик итераций
    , timer: null
    , timer_moving: null
    , timer_counter_moving: 0
    
    , target:[]
    , node_blue: null // элемент выделенный синим
    , height_bolshe_width: 1

    , clicked_elems_list: []

    , TWEEN_animate: false, TWEEN_i: 0 // for tween
    , sounds_array: [] // здесь храним все звуки
    

    , test_works: false, test_num: -1

    , count: 0

    , isDown_SKLAD: false, isDown_SKLAD_left: false, isDown_SKLAD_right: false, isDown_SKLAD_RUN: false
    , isDown_SKLAD_step_left: false, isDown_SKLAD_step_right: false
    , isDown_SKLAD_type: ""
    , SKLAD_RUN_arr: [], SKLAD_RUN_arr2: []


    // v3d
    , v3d_edit: true
    , folder_up: "../../"
    , folder_up2: ""
    , owner: undefined
    , MovingCube: undefined
    , CONTROLS: undefined, CAMERA: undefined, SCENE: undefined
    , userOpts: { range: -80, range_y: 40, duration: 500, delay: 20, easing: 'Quadratic.EaseIn' }
    , ray_objects: [] // тут те модели, которые можно выбирать r aycaster-ом
    


};






