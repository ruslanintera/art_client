import React, {
  Component,
  memo,
  useCallback,
  useState,
  useEffect,
  useMemo,
} from "react";
import { render } from "react-dom";
//import Hello from "./Hello";
//import "./style.css";

const RangeSlider = memo(
  ({ classes, label, onChange, value, ...sliderProps }) => {
    const [sliderVal, setSliderVal] = useState(0);
    const [mouseState, setMouseState] = useState(null);

    useEffect(() => {
      setSliderVal(value);
    }, [value]);

    const changeCallback = (e) => {
      setSliderVal(e.target.value);
    };

    useEffect(() => {
      if (mouseState === "up") {
        onChange(sliderVal);
      }
    }, [mouseState]);
    console.log("RENDER");
    return (
      <div className="range-slider">
        <p>{label}</p>
        <h3>value: {sliderVal}</h3>
        <input
          type="range"
          value={sliderVal}
          {...sliderProps}
          className={`slider ${classes}`}
          id="myRange"
          onChange={changeCallback}
          onMouseDown={() => setMouseState("down")}
          onMouseUp={() => setMouseState("up")}
        />
      </div>
    );
  }
);

export default RangeSlider;
