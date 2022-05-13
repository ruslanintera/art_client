

import { i3d_events_func } from "./f8_events_func.js";
import { vc3d_glob } from "./f5_vc3d_glob.js";


class i3d_Events {


onDocumentMouseMove8(event) {
    i3d_events_func.MouseMove8(event);
}
onDocumentMouseDown8(event) {
    //console.log("MD8 event", event)
    i3d_events_func.MouseDown8(event); 
}
onDocumentMouseUp8(event) {
    i3d_events_func.MouseUp8(event);
}
onDocumentTouchMove(event) {
    i3d_events_func.TouchMove(event);
}
onDocumentTouchStart(event) {
    i3d_events_func.TouchStart(event);
}
onDocument_keydown(event) {
    //c("event.code = " + event.code + ", event.ctrlKey = " + event.ctrlKey + ", event.shiftKey = " + event.shiftKey + ", event.altKey = " + event.altKey + ", event.metaKey = " + event.metaKey);
    i3d_events_func.update_keydown(event);
}


}
export let i3d_events = new i3d_Events(); // i3d_Events.

