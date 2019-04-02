import {Image as KonvaImage} from 'react-konva';

export default class ImageComponent extends React.Component {
  state = {
    loading: false,
    image: null
  }

  componentDidMount() {
    const {src} = this.props;
    if (src) {
      this.setState({loading: true})
      const image = new Image();
      image.onload = () => {
        this.setState({image, loading: false});
      }
      image.src = src;
    }
  }

  render () {
    const {src, ...props} = this.props;
    const {image} = this.state;
    return (
      <KonvaImage
        width={50}
        height={50}
        x={-45}
        y={-20}
        image={image}
        {...props}
      />
    )
  }
}
