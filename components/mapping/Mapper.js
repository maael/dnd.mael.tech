import {Stage} from 'react-konva';
import LayerManager from './LayerManager';
import ContextMenu from './ui/ContextMenu';
import {Wrapper, Context} from './lib/KonvaContext';

export default () => {
  if (typeof window === 'undefined') return null;
  return (
    <Wrapper>
      <Context.Consumer>
        {(context) => (
          <>
            <Stage width={window.innerWidth} height={window.innerHeight} onClick={(e) => {
              context.trigger('stage:click', e.target);
            }}>
              <Context.Provider value={context}>
                <LayerManager />
              </Context.Provider>
            </Stage>
            <ContextMenu />
          </>
        )}
      </Context.Consumer>
    </Wrapper>
  );
}
