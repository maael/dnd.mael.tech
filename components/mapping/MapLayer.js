import { Layer } from 'react-konva';
import types from './itemTypes';

/*
  layer format:
  {
    name: string,
    items: [
      {
        id: uuidv4,
        type: 'image',
        data: {
          src: string,
          x: number,
          y: number
        }
      },
      {
        id: uuidv4,
        type: 'marker',
        data: {
          label: 'What',
          x: number,
          y: number
        }
      }
    ]
  }
*/

export default ({ layer, updateLayer, currentLayerRef }) => {
  return layer && layer.items ? (
    <Layer ref={ref => (currentLayerRef.current = ref)}>
      {layer.items.map(item => {
        if (!types[item.type]) return null;
        const Comp = types[item.type];
        return (
          <Comp
            key={item.id}
            id={item.id}
            {...item.data}
            layer={layer}
            updateLayer={updateLayer}
          />
        );
      })}
    </Layer>
  ) : null;
};
