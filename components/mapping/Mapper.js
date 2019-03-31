import {Stage} from 'react-konva';
import LayerManager from './LayerManager';

export default () => {
  if (typeof window === 'undefined') return null;
  return (
    <>
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <LayerManager />
      </Stage>
    </>
  );
}
