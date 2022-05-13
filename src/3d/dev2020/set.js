
import * as THREE from 'three';

import { i3d_base } from "./f4_base.js";
import { i3d_all } from "./f7_assist.js";
import { app } from "./f9_appvue.js";
import { vc3d_glob } from "./f5_vc3d_glob.js";
import { i3d_ao3 } from "./f8_ao3.js";
import { i3d_down_up } from "./f88_down.js";
import { i3d_events } from "./f8_events.js";
import { i3d_windows, i3d_windows1 } from "./f10_windows.js";


document.addEventListener("DOMContentLoaded", () => {
    alert(1)
    if(!vc3d_glob.noVK) { if (VK) { VK.Auth.getLoginStatus(app.authInfo); } else { app.fb_check(); }; }

    i3d_base.RENDER();

    i3d_base.make_test1();

    glob_anim();

    if(vc3d_glob.i3d_windows) {
        //i3d_windows.createWindows()
        i3d_windows.createWinds()
        i3d_windows1.createWinds()
    }
});
function glob_anim() {
    alert(2)

    /**/
    if (vc3d_glob.animate) {
        animate(); //alert(11671)
    } else {
        i3d_all.animate4();
    }; // тут модели ЕЩЕ НЕ загружены, палитра НЕ раскрашена теперь или запускаем animate всегда или временно 
    /**/
}



function animate() {
    c("animate() =================vc3d_glob.animate = " + vc3d_glob.animate);
    if(!vc3d_glob.animate) { return; }
    requestAnimationFrame(animate);
    if(vc3d_glob.key_upd) { update(); }

    if ( vc3d_glob.ready && vc3d_glob.mixers ) {
        var delta = vc3d_glob.clock.getDelta();
        for ( var i = 0; i < vc3d_glob.mixers.length; ++ i ) {
            vc3d_glob.mixers[ i ].update( delta / 2.0 );
        }
    }
    vc3d_glob.renderer.render(vc3d_glob.SCENE, vc3d_glob.CAMERA);
}

function render() {

    /** /
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        videoImageContext.drawImage(video, 0, 0);
        if (videoTexture)
            videoTexture.needsUpdate = true;
    }
    /**/

    vc3d_glob.renderer.render(vc3d_glob.SCENE, vc3d_glob.CAMERA);

}

function update()
{
    if(MovingCube) {
        var delta = vc3d_glob.clock.getDelta(); // seconds.
        var moveDistance = 300 * delta; // 200 pixels per second
        var rotateAngle = Math.PI / 2 * delta;   // pi/2 radians (90 degrees) per second
        
        // local transformations

        // move forwards/backwards/left/right
        if ( keyboard.pressed("W") )
            MovingCube.translateZ( -moveDistance );
        if ( keyboard.pressed("S") )
            MovingCube.translateZ(  moveDistance );
        if ( keyboard.pressed("Q") )
            MovingCube.translateX( -moveDistance );
        if ( keyboard.pressed("E") )
            MovingCube.translateX(  moveDistance );	

        // rotate left/right/up/down
        var rotation_matrix = new THREE.Matrix4().identity();
        if ( keyboard.pressed("A") )
            MovingCube.rotateOnAxis( new THREE.Vector3(0,1,0), rotateAngle);
        if ( keyboard.pressed("D") )
            MovingCube.rotateOnAxis( new THREE.Vector3(0,1,0), -rotateAngle);
        if ( keyboard.pressed("R") )
            MovingCube.rotateOnAxis( new THREE.Vector3(1,0,0), rotateAngle);
        if ( keyboard.pressed("F") )
            MovingCube.rotateOnAxis( new THREE.Vector3(1,0,0), -rotateAngle);
        
        if ( keyboard.pressed("Z") )
        {
            MovingCube.position.set(0,25.1,0);
            MovingCube.rotation.set(0,0,0);
        }
        
        var relativeCameraOffset = new THREE.Vector3(0,50,200);
        var cameraOffset = relativeCameraOffset.applyMatrix4( MovingCube.matrixWorld );
        vc3d_glob.CAMERA.position.x = cameraOffset.x;
        vc3d_glob.CAMERA.position.y = cameraOffset.y;
        vc3d_glob.CAMERA.position.z = cameraOffset.z;
        vc3d_glob.CAMERA.lookAt( MovingCube.position );

        //if ( keyboard.pressed("U") ) vc3d_glob.cube_move = false;
        //if ( keyboard.pressed("J") ) vc3d_glob.cube_move = true;

        //vc3d_glob.CAMERA.updateMatrix();
        //vc3d_glob.CAMERA.updateProjectionMatrix();
                
        //stats.update();
    }
}

function update_joystick(){
   
    //requestAnimationFrame(animate);
    if(MovingCube) {
 
        frameTime = vc3d_glob.clock.getDelta();
    
        if(sunRiseFlag == true){
        sunHeight = sunHeight + 60 * frameTime;
        }
    
        if(sunRiseFlag == false){
        sunHeight = sunHeight - 60 * frameTime;
        }
    
        if(sunHeight > 150){
        sunHeight = 150;
        sunRiseFlag = false;
        }
    
        if(sunHeight < 0){
        sunHeight = 0;
        sunRiseFlag = true;
        }
    
        //light.position.set(50,sunHeight,50);
        //sphere.position = light.position;
    
        
        if( keyboard.pressed("D") ){
    MovingCube.position.x = MovingCube.position.x + 60 * frameTime;
        }
        if( keyboard.pressed("A") ){
    MovingCube.position.x = MovingCube.position.x - 60 * frameTime;
        }
        if( keyboard.pressed("W") ){
    MovingCube.position.y = MovingCube.position.y + 60 * frameTime;
        }
        if( keyboard.pressed("S") ){
    MovingCube.position.y = MovingCube.position.y - 60 * frameTime;
        }
    
        if( joystick.right() ){
    MovingCube.position.x = MovingCube.position.x + 60 * frameTime;    
        }
        if( joystick.left() ){
    MovingCube.position.x = MovingCube.position.x - 60 * frameTime;     
        }
        if( joystick.up() ){
    MovingCube.position.y = MovingCube.position.y + 60 * frameTime;       
        }
        if( joystick.down() ){
    MovingCube.position.y = MovingCube.position.y - 60 * frameTime;
        }
    
        //renderer.render( vc3d_glob.SCENE, vc3d_glob.CAMERA );
        
        //debugText1.innerHTML = "MovingCube position X: " + MovingCube.position.x.toFixed(1);
        //debugText2.innerHTML = "MovingCube position Y: " + MovingCube.position.y.toFixed(1);
        
        var relativeCameraOffset = new THREE.Vector3(0,50,200);
        var cameraOffset = relativeCameraOffset.applyMatrix4( MovingCube.matrixWorld );
        vc3d_glob.CAMERA.position.x = cameraOffset.x;
        vc3d_glob.CAMERA.position.y = cameraOffset.y;
        vc3d_glob.CAMERA.position.z = cameraOffset.z;
        vc3d_glob.CAMERA.lookAt( MovingCube.position );
    }

 }
 
 








