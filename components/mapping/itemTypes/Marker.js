import {Group, Text} from 'react-konva';
import CustomPortal from '../Portal';
import appDebug from '../../../lib/debug';

const debug = appDebug.extend('MarkerItem');

/**
 * TODO: Doesn't close when you click outside an active marker
 * Needs some kind of 'stage' listener working inside konva to have easy access
 * to the targetted element to decide whether to stay active or not
 */

export default class MarkerItem extends React.Component {
  state = {
    active: false
  }
  render () {
    const {layer, updateLayer, ...item} = this.props;
    const {active} = this.state;
    return (
      <Group x={item.x} y={item.y} draggable onDragMove={function (e) {
        debug.extend('drag')(item.id, item.x, item.y, e);
        const {x: offsetX, y: offsetY} = this.absolutePosition();
        updateLayer(layer, {...item, x: offsetX, y: offsetY});
      }}>
        {active ? <CustomPortal>
          <div style={{
            position: 'absolute',
            top: item.y + 45,
            left: item.x
          }}>
            <input type='text' placeholder='Marker...' value={item.label} onChange={({target}) => {
              updateLayer(layer, {...item, label: target.value});
              debug.extend('label')(item.id, target.value);
            }} onKeyDown={(e) => {
              if (e.key === 'Enter') {
                this.setState({active: false});
              }
            }} />
          </div>
        </CustomPortal> : <Text text={item.label} onDblClick={() => this.setState({active: true})} />}
      </Group>
    )
  }
}
