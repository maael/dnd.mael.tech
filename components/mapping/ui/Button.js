import { Group, Rect, Text } from 'react-konva';

export default class Button extends React.Component {
  textRef = null;
  state = {
    height: 0,
    width: 0,
    state: 'up'
  };

  componentDidMount() {
    this.setState({
      height: this.textRef.height(),
      width: this.textRef.width()
    });
  }

  render() {
    const { text, padding = 5, ...props } = this.props;
    const { height, state, width } = this.state;
    return (
      <Group
        {...props}
        onMouseDown={() => {
          this.setState({ state: 'down' });
          const listener = () => {
            this.setState({ state: 'up' });
            document.body.removeEventListener('mouseup', listener);
          };
          document.body.addEventListener('mouseup', listener);
        }}
      >
        <Rect
          width={width + padding * 2}
          height={height + padding * 2}
          fill={state === 'down' ? 'darkgrey' : 'lightgrey'}
          stroke={'darkgrey'}
          strokeWidth={2}
        />
        <Text
          ref={ref => {
            this.textRef = ref;
          }}
          x={5}
          y={5}
          text={text}
        />
      </Group>
    );
  }
}
