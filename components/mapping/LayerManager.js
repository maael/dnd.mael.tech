import {useState, useRef} from 'react';
import {Layer} from 'react-konva';
import uuidv4 from 'uuid/v4';
import debounce from 'lodash.debounce';
import LayerControl from './LayerControl';
import MapLayer from './MapLayer';
import Button from './ui/Button';

export default () => {
  const [currentLayer, updateCurrentLayer] = useState(0);
  const existingMapState = localStorage.getItem('mapState');
  let existingMapStateJson = [
    {id: uuidv4(), name: 'Layer #1', items: [{id: uuidv4(), type: 'image', data: {x: 100, y: 100}}]},
    {id: uuidv4(), name: 'Layer #2', items: [{id: uuidv4(), type: 'marker', data: {x: 200, y: 100, label: 'Test'}}]}
  ];
  try {
    const parsed = JSON.parse(existingMapState);
    if (parsed) {
      existingMapStateJson = parsed;
    }
  } catch (e) {
    console.error('Error loading state from localstorage', e);
  }
  const [layers, updateLayers] = useState(existingMapStateJson);
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
    getThumbnail();
  }

  const getThumbnail = debounce(getThumbnailRaw, 2000);

  function getThumbnailRaw () {
    return currentLayerRef && currentLayerRef.current && currentLayerRef.current.getLayer().toDataURL();
  }

  return (
    <>
      <MapLayer layer={layers[currentLayer]} updateLayer={updateLayer} currentLayerRef={currentLayerRef} />
      <Layer ref={detailsRef}>
        <Button x={100} y={10} text={`Current layer: ${layers[currentLayer] ? layers[currentLayer].name : ''}`} />
        <Button x={250} y={10} text="Add layer" onClick={handleNewLayer} onTap={handleNewLayer} />
        <Button x={350} y={10} text="Add image" onClick={handleNewLayerItem('image')} onTap={handleNewLayerItem('image')} />
        <Button x={450} y={10} text="Add marker" onClick={handleNewLayerItem('marker')} onTap={handleNewLayerItem('marker')} />
        <Button x={550} y={10} text="Save" onClick={() => {
          console.info('save', layers, JSON.stringify(layers));
          localStorage.setItem('mapState', JSON.stringify(layers));
        }} onTap={() => console.info('save', layers)} />
      </Layer>
      <LayerControl
        currentValue={currentLayer}
        steps={layers.length}
        onChangeStep={(_, next) => updateCurrentLayer(next)}
      />
    </>
  );
}
