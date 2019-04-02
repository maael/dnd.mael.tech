import {Group, Text} from 'react-konva';
import CustomPortal from '../Portal';
import {Context} from '../lib/KonvaContext';
import Image from '../ui/Image';
import appDebug from '../../../lib/debug';

const debug = appDebug.extend('MarkerItem');

export default class MarkerItem extends React.Component {
  state = {
    active: false
  }

  renderActive = () => {
    const {layer, updateLayer, ...item} = this.props;
    return (
      <CustomPortal>
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
      </CustomPortal>
    );
  }

  renderInactive = () => {
    const {layer, updateLayer, ...item} = this.props;
    return (
      <>
      <Image src={`${window.location.origin}/static/icons/scroll.png`} />
      <Text text={item.label} onDblClick={() => {
        this.setState({active: true});
        const id = this.context.on('stage:click', () => {
          this.setState({active: false});
          this.context.remove('stage:click', id);
        })
      }} />
      </>
    )
  }

  render () {
    const {layer,   updateLayer, ...item} = this.props;
    const {active} = this.state;
    return (
      <Group x={item.x} y={item.y} draggable onDragMove={function (e) {
        debug.extend('drag')(item.id, item.x, item.y, e);
        const {x: offsetX, y: offsetY} = this.absolutePosition();
        updateLayer(layer, {...item, x: offsetX, y: offsetY});
      }}>
        {active ? this.renderActive() : this.renderInactive() }
      </Group>
    )
  }
}

MarkerItem.contextType = Context;
