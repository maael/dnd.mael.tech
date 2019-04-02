import {createContext} from 'react';
import uuidv4 from 'uuid/v4';

const KonvaContext = createContext();

class KonvaContextWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      trigger: this.trigger,
      on: this.on,
      remove: this.remove,
      contextTarget: null,
      update: this.setState.bind(this)
    }
    this._events = {};
  }

  on = (event, fn) => {
    const bucket = this._events[event];
    const id = uuidv4();
    if (bucket) {
      bucket.set(id, fn);
    } else {
      this._events[event] = new Map([[id, fn]]);
    }
    return id;
  }

  remove = (event, eventId) => {
    const bucket = this._events[event];
    if (bucket) {
      bucket.delete(eventId);
    }
  }

  trigger = (event, data) => {
    const bucket = this._events[event];
    if (!bucket) return;
    [...bucket.values()].forEach((fn) => fn(data));
  }

  render () {
    const {children} = this.props;
    return (
      <KonvaContext.Provider value={this.state}>
        {children}
      </KonvaContext.Provider>
    )
  }
}

export const Context = KonvaContext;
export const Wrapper = KonvaContextWrapper;
export default KonvaContextWrapper;
