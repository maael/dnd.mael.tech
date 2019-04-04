import { useState, useRef, useEffect } from 'react';
import { Layer } from 'react-konva';
import uuidv4 from 'uuid/v4';
import debounce from 'lodash.debounce';
import ky from 'ky';
import LayerControl from './LayerControl';
import MapLayer from './MapLayer';
import Button from './ui/Button';

function getMapId() {
  const local = localStorage.getItem('mapId');
  const param = window.location.pathname.slice('/map/'.length);
  return param || local;
}

export default () => {
  const [currentLayer, updateCurrentLayer] = useState(0);
  let initialMapState = [
    {
      id: uuidv4(),
      name: 'Layer #1',
      items: [{ id: uuidv4(), type: 'image', data: { x: 100, y: 100 } }]
    },
    {
      id: uuidv4(),
      name: 'Layer #2',
      items: [
        {
          id: uuidv4(),
          type: 'marker',
          data: {
            x: 200,
            y: 100,
            icon: 'scroll',
            labelColor: '#000',
            label: 'Test'
          }
        }
      ]
    }
  ];
  const [layers, updateLayers] = useState(initialMapState);
  const detailsRef = useRef();
  const currentLayerRef = useRef();
  const hydrateCheck = useRef();

  function handleNewLayer() {
    const newLayers = [].concat(layers);
    newLayers.splice(currentLayer, 0, {
      id: uuidv4(),
      name: `Layer #${newLayers.length + 1}`,
      items: []
    });
    updateLayers(newLayers);
    detailsRef.current.draw();
  }

  function handleNewLayerItem(type) {
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
      };
      if (type === 'marker') {
        newLayers[currentLayer].items[
          newLayers[currentLayer].items.length - 1
        ].data.icon = 'scroll';
        newLayers[currentLayer].items[
          newLayers[currentLayer].items.length - 1
        ].data.labelColor = '#000';
        newLayers[currentLayer].items[
          newLayers[currentLayer].items.length - 1
        ].data.label = 'New Marker';
      }
      updateLayers(newLayers);
    };
  }

  function updateLayer(layer, item) {
    const layerIndex = layers.findIndex(({ id }) => id === layer.id);
    const itemIndex = layer.items.findIndex(({ id }) => id === item.id);
    const newLayers = [].concat(layers);
    newLayers[layerIndex].items[itemIndex].data = {
      ...newLayers[layerIndex].items[itemIndex].data,
      ...item
    };
    updateLayers(newLayers);
    getThumbnail();
  }

  const getThumbnail = debounce(getThumbnailRaw, 2000);

  function getThumbnailRaw() {
    return (
      currentLayerRef &&
      currentLayerRef.current &&
      currentLayerRef.current.getLayer().toDataURL()
    );
  }

  async function hydrateLayer() {
    const mapId = getMapId();
    if (!mapId) return;
    const existing = await ky.get(`/api/map-save/${mapId}`).json();
    updateLayers(existing.data);
  }

  useEffect(() => {
    if (hydrateCheck.current) return;
    hydrateLayer().finally(() => {
      hydrateCheck.current = true;
    });
  });

  async function dataToFile(src, layerId, itemId) {
    const mimeType = src.split(';')[0].slice('data:'.length);
    return fetch(src)
      .then(res => res.arrayBuffer())
      .then(buf => new File([buf], itemId, { type: mimeType }))
      .then(file => ({ file, layerId, itemId }));
  }

  async function upload(itemId, file) {
    const form = new FormData();
    form.append('image', file);
    const result = await ky
      .post(`/api/map-image/${itemId}`, { body: form })
      .json();
    return `/api/map-image${new URL(result.imageUrl).pathname}`;
  }

  return (
    <>
      <MapLayer
        layer={layers[currentLayer]}
        updateLayer={updateLayer}
        currentLayerRef={currentLayerRef}
      />
      <Layer ref={detailsRef}>
        <Button
          x={100}
          y={10}
          text={`Current layer: ${
            layers[currentLayer] ? layers[currentLayer].name : ''
          }`}
        />
        <Button
          x={250}
          y={10}
          text="Add layer"
          onClick={handleNewLayer}
          onTap={handleNewLayer}
        />
        <Button
          x={350}
          y={10}
          text="Add image"
          onClick={handleNewLayerItem('image')}
          onTap={handleNewLayerItem('image')}
        />
        <Button
          x={450}
          y={10}
          text="Add marker"
          onClick={handleNewLayerItem('marker')}
          onTap={handleNewLayerItem('marker')}
        />
        <Button
          x={550}
          y={10}
          text="Save"
          onClick={async () => {
            const mapId = getMapId();
            const method = mapId ? 'patch' : 'post';
            const imageConversions = [];
            layers.forEach(layer => {
              layer.items.forEach(item => {
                if (
                  item.type === 'image' &&
                  item.data.src.startsWith('data:')
                ) {
                  imageConversions.push(
                    (async () => {
                      const file = await dataToFile(
                        item.data.src,
                        layer.id,
                        item.id
                      );
                      const uploaded = await upload(item.id, file.file);
                      item.data.src = uploaded;
                      return { uploaded, ...file, item };
                    })()
                  );
                }
              });
            });
            const conversions = await Promise.all(imageConversions);
            conversions.forEach(conversion => {
              const layer = layers.find(({ id }) => id === conversion.layerId);
              updateLayer(layer, conversion.item);
            });
            const result = await ky[method](
              `/api/map-save${mapId ? `/${mapId}` : ''}`,
              {
                json: {
                  name: 'Test',
                  description: 'testing saves',
                  data: layers
                }
              }
            ).json();
            localStorage.setItem('mapId', result._id);
          }}
          onTap={() => console.info('save', layers)}
        />
        <Button
          x={600}
          y={10}
          text="Clear"
          onClick={() => {
            localStorage.removeItem('mapId');
            updateLayers(initialMapState);
          }}
        />
      </Layer>
      <LayerControl
        currentValue={currentLayer}
        steps={layers.length}
        onChangeStep={(_, next) => updateCurrentLayer(next)}
      />
    </>
  );
};
