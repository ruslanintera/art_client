import React, {
  Component,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";

import { observer } from "mobx-react-lite";
import { Context } from "../../index";
import { useHistory } from "react-router-dom";
//import { vc3d_glob } from "../../3d/dev2020/f5_vc3d_glob";

import classes from "./JoyStick.module.css";

const JoyStick = observer((props) => {
  let rootElement = props.rootElement;
  const { device } = useContext(Context);
  const history = useHistory();
  const containerRef = React.createRef();
  useEffect(() => {
    // Обновляем заголовок документа с помощью API браузера
    // Create JoyStick object into the DIV 'joy2Div'
    var joy2Param = { title: "joystick2", autoReturnToCenter: true };
    var Joy2 = new JoyStick1("joy2Div", joy2Param);

    var joy2IinputPosX = document.getElementById("joy2PosizioneX");
    var joy2InputPosY = document.getElementById("joy2PosizioneY");
    var joy2Direzione = document.getElementById("joy2Direzione");
    var joy2X = document.getElementById("joy2X");
    var joy2Y = document.getElementById("joy2Y");

    setInterval(function () {
      joy2IinputPosX.value = Joy2.GetPosX();
    }, 50);
    setInterval(function () {
      joy2InputPosY.value = Joy2.GetPosY();
    }, 50);
    setInterval(function () {
      joy2Direzione.value = Joy2.GetDir();
    }, 50);
    setInterval(function () {
      joy2X.value = Joy2.GetX();
    }, 50);
    setInterval(function () {
      joy2Y.value = Joy2.GetY();
    }, 50);
  });

  let StickStatus = {
    xPosition: 0,
    yPosition: 0,
    x: 0,
    y: 0,
    cardinalDirection: "C",
  };
  var JoyStick1 = function (container, parameters, callback) {
    parameters = parameters || {};
    var title =
        typeof parameters.title === "undefined" ? "joystick" : parameters.title,
      width = typeof parameters.width === "undefined" ? 0 : parameters.width,
      height = typeof parameters.height === "undefined" ? 0 : parameters.height,
      internalFillColor =
        typeof parameters.internalFillColor === "undefined"
          ? "#00AA00"
          : parameters.internalFillColor,
      internalLineWidth =
        typeof parameters.internalLineWidth === "undefined"
          ? 2
          : parameters.internalLineWidth,
      internalStrokeColor =
        typeof parameters.internalStrokeColor === "undefined"
          ? "#003300"
          : parameters.internalStrokeColor,
      externalLineWidth =
        typeof parameters.externalLineWidth === "undefined"
          ? 2
          : parameters.externalLineWidth,
      externalStrokeColor =
        typeof parameters.externalStrokeColor === "undefined"
          ? "#008000"
          : parameters.externalStrokeColor,
      autoReturnToCenter =
        typeof parameters.autoReturnToCenter === "undefined"
          ? true
          : parameters.autoReturnToCenter;

    callback = callback || function (StickStatus) {};

    // Create Canvas element and add it in the Container object
    var objContainer = document.getElementById(container);
    //var objContainer = containerRef; //document.getElementById(container);
    console.log("containerRef = ", containerRef);
    // Fixing Unable to preventDefault inside passive event listener due to target being treated as passive in Chrome [Thanks to https://github.com/artisticfox8 for this suggestion]
    objContainer.style.touchAction = "none";

    var canvas = document.createElement("canvas");
    canvas.id = title;
    if (width === 0) {
      width = objContainer.clientWidth;
    }
    if (height === 0) {
      height = objContainer.clientHeight;
    }
    canvas.width = width;
    canvas.height = height;
    objContainer.appendChild(canvas);
    var context = canvas.getContext("2d");

    var pressed = 0; // Bool - 1=Yes - 0=No
    var circumference = 2 * Math.PI;
    var internalRadius = (canvas.width - (canvas.width / 2 + 10)) / 2;
    var maxMoveStick = internalRadius + 5;
    var externalRadius = internalRadius + 30;
    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;
    var directionHorizontalLimitPos = canvas.width / 10;
    var directionHorizontalLimitNeg = directionHorizontalLimitPos * -1;
    var directionVerticalLimitPos = canvas.height / 10;
    var directionVerticalLimitNeg = directionVerticalLimitPos * -1;
    // Used to save current position of stick
    var movedX = centerX;
    var movedY = centerY;
    console.log("centerX = ", centerX, "centerY = ", centerY);
    // Check if the device support the touch or not
    if ("ontouchstart" in document.documentElement) {
      canvas.addEventListener("touchstart", onTouchStart, false);
      document.addEventListener("touchmove", onTouchMove, false);
      document.addEventListener("touchend", onTouchEnd, false);
    } else {
      canvas.addEventListener("mousedown", onMouseDown, false);
      document.addEventListener("mousemove", onMouseMove, false);
      document.addEventListener("mouseup", onMouseUp, false);
    }
    // Draw the object
    drawExternal();
    drawInternal();

    /******************************************************
     * Private methods
     *****************************************************/

    /**
     * @desc Draw the external circle used as reference position
     */
    function drawExternal() {
      context.beginPath();
      context.arc(centerX, centerY, externalRadius, 0, circumference, false);
      context.lineWidth = externalLineWidth;
      context.strokeStyle = externalStrokeColor;
      context.stroke();
    }

    /**
     * @desc Draw the internal stick in the current position the user have moved it
     */
    function drawInternal() {
      context.beginPath();
      if (movedX < internalRadius) {
        movedX = maxMoveStick;
      }
      if (movedX + internalRadius > canvas.width) {
        movedX = canvas.width - maxMoveStick;
      }
      if (movedY < internalRadius) {
        movedY = maxMoveStick;
      }
      if (movedY + internalRadius > canvas.height) {
        movedY = canvas.height - maxMoveStick;
      }
      context.arc(movedX, movedY, internalRadius, 0, circumference, false);
      // create radial gradient
      var grd = context.createRadialGradient(
        centerX,
        centerY,
        5,
        centerX,
        centerY,
        200
      );
      // Light color
      grd.addColorStop(0, internalFillColor);
      // Dark color
      grd.addColorStop(1, internalStrokeColor);
      context.fillStyle = grd;
      context.fill();
      context.lineWidth = internalLineWidth;
      context.strokeStyle = internalStrokeColor;
      context.stroke();
    }

    /**
     * @desc Events for manage touch
     */
    function onTouchStart(event) {
      pressed = 1;
    }

    function onTouchMove(event) {
      if (pressed === 1 && event.targetTouches[0].target === canvas) {
        movedX = event.targetTouches[0].pageX;
        movedY = event.targetTouches[0].pageY;
        // Manage offset
        if (canvas.offsetParent.tagName.toUpperCase() === "BODY") {
          movedX -= canvas.offsetLeft;
          movedY -= canvas.offsetTop;
        } else {
          movedX -= canvas.offsetParent.offsetLeft;
          movedY -= canvas.offsetParent.offsetTop;
        }
        // Delete canvas
        context.clearRect(0, 0, canvas.width, canvas.height);
        // Redraw object
        drawExternal();
        drawInternal();

        // Set attribute of callback
        StickStatus.xPosition = movedX;
        StickStatus.yPosition = movedY;
        StickStatus.x = (100 * ((movedX - centerX) / maxMoveStick)).toFixed();
        StickStatus.y = (
          100 *
          ((movedY - centerY) / maxMoveStick) *
          -1
        ).toFixed();
        StickStatus.cardinalDirection = getCardinalDirection();
        callback(StickStatus);
      }
    }

    function onTouchEnd(event) {
      pressed = 0;
      // If required reset position store variable
      if (autoReturnToCenter) {
        movedX = centerX;
        movedY = centerY;
      }
      // Delete canvas
      context.clearRect(0, 0, canvas.width, canvas.height);
      // Redraw object
      drawExternal();
      drawInternal();

      // Set attribute of callback
      StickStatus.xPosition = movedX;
      StickStatus.yPosition = movedY;
      StickStatus.x = (100 * ((movedX - centerX) / maxMoveStick)).toFixed();
      StickStatus.y = (
        100 *
        ((movedY - centerY) / maxMoveStick) *
        -1
      ).toFixed();
      StickStatus.cardinalDirection = getCardinalDirection();
      callback(StickStatus);
    }

    /**
     * @desc Events for manage mouse
     */
    function onMouseDown(event) {
      pressed = 1;
    }

    /* To simplify this code there was a new experimental feature here: https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/offsetX , but it present only in Mouse case not metod presents in Touch case :-( */
    function onMouseMove(event) {
      if (pressed === 1) {
        movedX = event.pageX;
        movedY = event.pageY;
        // Manage offset
        if (canvas.offsetParent.tagName.toUpperCase() === "BODY") {
          movedX -= canvas.offsetLeft;
          movedY -= canvas.offsetTop;
        } else {
          movedX -= canvas.offsetParent.offsetLeft;
          movedY -= canvas.offsetParent.offsetTop;
        }
        // Delete canvas
        context.clearRect(0, 0, canvas.width, canvas.height);
        // Redraw object
        drawExternal();
        drawInternal();

        console.log("movedX = ", movedX, "movedY = ", movedY);
        console.log("centerX = ", centerX, "centerY = ", centerY);

        // Set attribute of callback
        StickStatus.xPosition = movedX;
        StickStatus.yPosition = movedY;
        StickStatus.x = (100 * ((movedX - centerX) / maxMoveStick)).toFixed();
        StickStatus.y = (
          100 *
          ((movedY - centerY) / maxMoveStick) *
          -1
        ).toFixed();
        StickStatus.cardinalDirection = getCardinalDirection();
        console.log("StickStatus.x = ", StickStatus.x, ".y = ", StickStatus.y);
        //console.log("callback = ", callback, "StickStatus = ", StickStatus);

        callback(StickStatus);
      }
    }

    function onMouseUp(event) {
      pressed = 0;
      // If required reset position store variable
      if (autoReturnToCenter) {
        movedX = centerX;
        movedY = centerY;
      }
      // Delete canvas
      context.clearRect(0, 0, canvas.width, canvas.height);
      // Redraw object
      drawExternal();
      drawInternal();

      // Set attribute of callback
      StickStatus.xPosition = movedX;
      StickStatus.yPosition = movedY;
      StickStatus.x = (100 * ((movedX - centerX) / maxMoveStick)).toFixed();
      StickStatus.y = (
        100 *
        ((movedY - centerY) / maxMoveStick) *
        -1
      ).toFixed();
      StickStatus.cardinalDirection = getCardinalDirection();
      callback(StickStatus);
    }

    function getCardinalDirection() {
      let result = "";
      let orizontal = movedX - centerX;
      let vertical = movedY - centerY;

      if (
        vertical >= directionVerticalLimitNeg &&
        vertical <= directionVerticalLimitPos
      ) {
        result = "C";
      }
      if (vertical < directionVerticalLimitNeg) {
        result = "N";
      }
      if (vertical > directionVerticalLimitPos) {
        result = "S";
      }

      if (orizontal < directionHorizontalLimitNeg) {
        if (result === "C") {
          result = "W";
        } else {
          result += "W";
        }
      }
      if (orizontal > directionHorizontalLimitPos) {
        if (result === "C") {
          result = "E";
        } else {
          result += "E";
        }
      }

      return result;
    }

    /******************************************************
     * Public methods
     *****************************************************/

    /**
     * @desc The width of canvas
     * @return Number of pixel width
     */
    this.GetWidth = function () {
      return canvas.width;
    };

    /**
     * @desc The height of canvas
     * @return Number of pixel height
     */
    this.GetHeight = function () {
      return canvas.height;
    };

    /**
     * @desc The X position of the cursor relative to the canvas that contains it and to its dimensions
     * @return Number that indicate relative position
     */
    this.GetPosX = function () {
      return movedX;
    };

    /**
     * @desc The Y position of the cursor relative to the canvas that contains it and to its dimensions
     * @return Number that indicate relative position
     */
    this.GetPosY = function () {
      return movedY;
    };

    /**
     * @desc Normalizzed value of X move of stick
     * @return Integer from -100 to +100
     */
    this.GetX = function () {
      return (100 * ((movedX - centerX) / maxMoveStick)).toFixed();
    };

    /**
     * @desc Normalizzed value of Y move of stick
     * @return Integer from -100 to +100
     */
    this.GetY = function () {
      return (100 * ((movedY - centerY) / maxMoveStick) * -1).toFixed();
    };

    /**
     * @desc Get the direction of the cursor as a string that indicates the cardinal points where this is oriented
     * @return String of cardinal point N, NE, E, SE, S, SW, W, NW and C when it is placed in the center
     */
    this.GetDir = function () {
      return getCardinalDirection();
    };
  };

  //   useEffect(() => {
  //     fetchRacktype({
  //       page: device.getRacktypePage,
  //       limit: device.getRacktypeLimit,
  //     }).then((data) => {
  //       device.setRacktype(data.rows);
  //       device.setRacktypeTotal(data.count);
  //     });
  //   }, [device.getRacktypePage]);

  //   function DELETE() {
  //     try {
  //     } catch (e) {
  //       console.error("ERRR del==", e);
  //     }
  //   }

  return (
    // <></>
    <div className={classes.columnLateral}>
      <div id="joy2Div" ref={containerRef} className={classes.joy2Div}></div>
      Posizione X:
      <input id="joy2PosizioneX" type="text" />
      Posizione Y:
      <input id="joy2PosizioneY" type="text" />
      Direzione:
      <input id="joy2Direzione" type="text" />
      X :<input id="joy2X" type="text" />
      Y :<input id="joy2Y" type="text" />
    </div>
  );
});

export default JoyStick;