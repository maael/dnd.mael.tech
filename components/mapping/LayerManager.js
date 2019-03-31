import {useState, useRef} from 'react';
import {Layer, Text} from 'react-konva';
import uuidv4 from 'uuid/v4';
import LayerControl from './LayerControl';
import MapLayer from './MapLayer';

export default () => {
  const [currentLayer, updateCurrentLayer] = useState(0);
  const [layers, updateLayers] = useState([
    {id: uuidv4(), name: 'Layer #1', items: [{id: uuidv4(), type: 'image', data: {x: 100, y: 100}}]},
    {id: uuidv4(), name: 'Layer #2', items: [{id: uuidv4(), type: 'marker', data: {x: 200, y: 100, label: 'Test'}}]}
  ]);
  const detailsRef = useRef();
  const currentLayerRef = useRef();

  function handleNewLayer () {
    const newLayers = [].concat(layers);
    newLayers.splice(currentLayer, 0, {id: uuidv4(), name: `Layer #${newLayers.length + 1}`, items: []});
    updateLayers(newLayers);
    detailsRef.current.draw();
  }

  function handleNewLayerItem (type) {
    return () => {
      const newLayers = [].concat(layers);
      newLayers[currentLayer] = {
        ...newLayers[currentLayer],
        items: newLayers[currentLayer].items.concat({
          id: uuidv4(),
          type,
          data: {
            x: 100,
            y: 100
          }
        })
      }
      if (type === 'marker') {
        newLayers[currentLayer].items[newLayers[currentLayer].items.length - 1].data.label = 'New Marker';
      }
      updateLayers(newLayers);
    }
  }

  function updateLayer (layer, item) {
    const layerIndex = layers.findIndex(({id}) => id === layer.id);
    const itemIndex = layer.items.findIndex(({id}) => id === item.id);
    const newLayers = [].concat(layers);
    newLayers[layerIndex].items[itemIndex].data = {
      ...newLayers[layerIndex].items[itemIndex].data,
      ...item,
    };
    updateLayers(newLayers);
    console.info('what', currentLayerRef && currentLayerRef.current && currentLayerRef.current.getLayer().toDataURL());
  }

  return (
    <>
      <Layer ref={detailsRef}>
        <Text x={100} text={`Current layer: ${layers[currentLayer] ? layers[currentLayer].name : ''}`} />
        <Text x={250} text="Add layer" onClick={handleNewLayer} onTap={handleNewLayer} />
        <Text x={350} text="Add image" onClick={handleNewLayerItem('image')} onTap={handleNewLayerItem('image')} />
        <Text x={450} text="Add marker" onClick={handleNewLayerItem('marker')} onTap={handleNewLayerItem('marker')} />
        <Text x={550} text="Save" onClick={() => console.info('save', layers)} onTap={() => console.info('save', layers)} />
      </Layer>
      <MapLayer layer={layers[currentLayer]} updateLayer={updateLayer} currentLayerRef={currentLayerRef} />
      <LayerControl
        currentValue={currentLayer}
        steps={layers.length}
        onChangeStep={(_, next) => updateCurrentLayer(next)}
      />
    </>
  );
}
