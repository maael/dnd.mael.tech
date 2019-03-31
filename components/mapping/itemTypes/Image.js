import {createRef} from 'react';
import {Group, Text, Image as KImage} from 'react-konva';
import CustomPortal from '../Portal';
import appDebug from '../../../lib/debug';

const debug = appDebug.extend('ImageItem');

export default class ImageItem extends React.Component {
  fileInput = createRef();

  state = {
    image: undefined
  }

  componentDidMount = () => {
    const {src} = this.props;
    if (src) {
      const image = new Image();
      image.onload = () => {
        this.setState({image});
        debug.extend('componentDidMount')(image);
      }
      image.src = src;
    }
  }

  onFileInput = () => {
    if (this.fileInput && this.fileInput.current) {
      this.fileInput.current.click();
    }
  }

  onFileSelect = ({target}) => {
    const {layer, updateLayer, ...item} = this.props;
    if (target.files && target.files[0]) {
      const reader = new FileReader();

      reader.onload = ({target: readerTarget}) => {
        const image = new Image();
        image.onload = () => {
          this.setState({image});
          updateLayer(layer, {...item, src: image.src});
          debug.extend('onFileSelect')(image);
        }
        image.src = readerTarget.result;
      }

      reader.readAsDataURL(target.files[0]);
    }
  }

  render() {
    const {layer, updateLayer, ...item} = this.props;
    console.info('item', item);
    const {image} = this.state;
    return (
      <Group x={item.x} y={item.y} draggable onDragMove={function (e) {
        const {x: offsetX, y: offsetY} = this.absolutePosition();
        debug.extend('drag')(item.id, item.x, item.y, e);
        updateLayer(layer, {...item, x: offsetX, y: offsetY});
      }}>
        {image
          ? <KImage image={image} onClick={this.onFileInput} onTap={this.onFileInput} />
          : <Text text='Select Image' onClick={this.onFileInput} onTap={this.onFileInput} />
        }
        <CustomPortal>
          <div style={{display: 'none'}}>
            <input type='file' ref={this.fileInput} onChange={this.onFileSelect} />
          </div>
        </CustomPortal>
      </Group>
    );
  }
}
