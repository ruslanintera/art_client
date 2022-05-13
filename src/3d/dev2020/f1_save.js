
//https://skalman.github.io/UglifyJS-online/

/*
LEARNING !!!
https://threejsfundamentals.org/threejs/lessons/ru/threejs-debugging-javascript.html
https://threejsfundamentals.org/threejs/lessons/ru/threejs-backgrounds.html
https://documentation.help/three.js-ru/next-steps.htm#2
https://www.reddit.com/r/threejs/

http://localhost:5500/examples/atoms.html

*/
import * as THREE from 'three';

import { app } from "./f9_appvue.js";
import { i3d_all } from "./f7_assist.js";
import { vc3d_glob } from "./f5_vc3d_glob.js";


class Save {


copyToClipboard(text) {
    var dummy = document.createElement("input");
    document.body.appendChild(dummy);
    dummy.setAttribute('value', text);
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy); 
}
//copyToClipboard('Hell444o, World!')

}

export let i3d_save = new Save();



// f1_save.js
