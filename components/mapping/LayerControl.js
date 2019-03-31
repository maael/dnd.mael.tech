import {useRef, useState} from 'react';
import {Layer, Rect} from 'react-konva';

export default ({steps = 4, x = 20, y = 20,
bar = {
  width: 10,
  height: 200
},
dragItem = {
  width: 20,
  height: 20
},
currentValue = 0,
onChangeStep = () => {},
theme = {
  fillColor: 'lightgrey',
  strokeColor: 'darkgrey',
  strokeWidth: 2,
  shadowBlur: 5
}}) => {
  const [currentStep, updateStep] = useState(0);
  const [currentSteps, updateSteps] = useState(steps);
  const barRef = useRef();
  const dragItemRef = useRef();
  const layerRef = useRef();
  const stepSize = bar.height / (steps -1);
  function handleBarClick (e) {
    const {offsetX, offsetY} = e.evt;
    const {current} = dragItemRef;
    const pos = calculateDragItemCoords({x: offsetX, y: offsetY});
    current.setPosition(pos);
    layerRef.current.draw();
  }
  function hasStepChanged(pos) {
    if (pos.y < y || pos.y > y + bar.height) return;
    const newStep = Math.round(pos.y / stepSize);
    if (newStep !== currentStep) {
      const previousStep = currentStep;
      updateStep(newStep);
      onChangeStep(previousStep, newStep);
    }
  }
  function calculateDragItemCoords (pos) {
    let dragY = y - (dragItem.height / 2) + Math.round(pos.y / stepSize) * stepSize;
    const {y: barY, height: barHeight} = barRef.current.attrs;
    if (dragY + dragItem.height > barY + barHeight) {
      dragY = (barY + barHeight) - dragItem.height;
    } else if (dragY < barY) {
      dragY = barY;
    }
    hasStepChanged(pos);
    return {
      x: dragItemRef.current.attrs.x,
      y: dragY
    }
  }
  if (currentStep !== currentValue || steps !== currentSteps) {
    updateStep(currentValue);
    updateSteps(steps);
    onChangeStep(currentStep, currentValue);
    let dragY = y - (dragItem.height / 2) + (currentValue) * stepSize;
    const {y: barY, height: barHeight} = barRef.current.attrs;
    if (dragY + dragItem.height > barY + barHeight) {
      dragY = (barY + barHeight) - dragItem.height;
    } else if (dragY < barY) {
      dragY = barY;
    }
    const pos = {
      x: dragItemRef.current.attrs.x,
      y: dragY
    };
    const {current} = dragItemRef;
    current.setPosition(pos);
    layerRef.current.draw();
  }
  return (
    <Layer ref={layerRef}>
      <Rect
        x={x}
        y={y}
        width={bar.width}
        height={bar.height}
        fill={theme.fillColor}
        shadowBlur={theme.shadowBlur}
        stroke={theme.strokeColor}
        strokeWidth={theme.strokeWidth}
        ref={barRef}
        onTap={handleBarClick}
        onClick={handleBarClick}
      />
      <Rect
        x={x - ((dragItem.width - bar.width) / 2)}
        y={y}
        width={dragItem.width}
        height={dragItem.height}
        fill={theme.fillColor}
        shadowBlur={theme.shadowBlur}
        stroke={theme.strokeColor}
        strokeWidth={theme.strokeWidth}
        draggable
        dragBoundFunc={calculateDragItemCoords}
        ref={dragItemRef}
      />
    </Layer>
  );
}
