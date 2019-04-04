import { Group, Text } from 'react-konva';
import { SketchPicker } from 'react-color';
import CustomPortal from '../Portal';
import { Context } from '../lib/KonvaContext';
import Image from '../ui/Image';
import appDebug from '../../../lib/debug';

const debug = appDebug.extend('MarkerItem');

const icons = [
  'scroll',
  'anvil',
  'bag',
  'book',
  'candles',
  'chest',
  'helmet',
  'hourglass',
  'potion',
  'rose',
  'skull',
  'sword',
  'wheat'
];

export default class MarkerItem extends React.Component {
  state = {
    active: false
  };

  renderActive = () => {
    const { layer, updateLayer, ...item } = this.props;
    return (
      <CustomPortal>
        <div
          style={{
            position: 'absolute',
            top: item.y - 50,
            left: item.x - 100,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          <div style={{ maxWidth: 125, textAlign: 'center', paddingRight: 5 }}>
            {icons.map(icon => (
              <img
                style={item.icon === icon ? { border: '1px solid red' } : {}}
                height={40}
                width={40}
                src={`/static/icons/${icon}.png`}
                key={icon}
                onClick={() => {
                  updateLayer(layer, { ...item, icon });
                }}
              />
            ))}
          </div>
          <div style={{ width: 150 }}>
            <input
              autoFocus
              type="text"
              placeholder="Marker..."
              value={item.label}
              onChange={({ target }) => {
                updateLayer(layer, { ...item, label: target.value });
                debug.extend('label')(item.id, target.value);
              }}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  this.setState({ active: false });
                }
              }}
              style={{ width: '100%', marginBottom: 5 }}
            />
            <SketchPicker
              presetColors={[]}
              disableAlpha
              width={150}
              onChangeComplete={color => {
                updateLayer(layer, { ...item, labelColor: color.hex });
              }}
              color={item.labelColor}
              styles={{
                picker: {
                  boxSizing: 'border-box'
                }
              }}
            />
          </div>
        </div>
      </CustomPortal>
    );
  };

  renderInactive = () => {
    const { layer, updateLayer, ...item } = this.props;
    const activate = () => {
      this.setState({ active: true });
      const id = this.context.on('stage:click', () => {
        this.setState({ active: false });
        this.context.remove('stage:click', id);
      });
    };
    return (
      <>
        <Image
          src={`${window.location.origin}/static/icons/${item.icon}.png`}
        />
        <Text
          text={item.label}
          fontStyle="bold"
          fill={item.labelColor}
          onDblClick={activate}
          onDblTap={activate}
        />
      </>
    );
  };

  render() {
    const { layer, updateLayer, ...item } = this.props;
    const { active } = this.state;
    return (
      <Group
        x={item.x}
        y={item.y}
        draggable
        onDragMove={function(e) {
          const { x: offsetX, y: offsetY } = this.absolutePosition();
          updateLayer(layer, { ...item, x: offsetX, y: offsetY });
        }}
      >
        {active ? this.renderActive() : this.renderInactive()}
      </Group>
    );
  }
}

MarkerItem.contextType = Context;
