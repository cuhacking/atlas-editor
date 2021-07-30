import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import ReactMapGL, {
  Source,
  Layer,
  ViewportProps,
  MapEvent
} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { FeatureCollection } from 'geojson';

interface MapProps {
  latitude: number;
  longitude: number;
  data: FeatureCollection[] | null;
  displayFeature: (e: MapEvent) => void;
}

const MapContainer = styled.div`
  display: flex;
  flex-grow: 1;
  position: relative;
`;

const Map: React.FC<MapProps> = ({
  data,
  displayFeature,
  latitude,
  longitude
}: MapProps) => {
  const [viewport, setViewport] = useState<ViewportProps>({
    latitude: latitude,
    longitude: longitude,
    zoom: 16
  });

  const [hoveredFeatures, setHoveredFeatures] = useState<FeatureCollection>({
    type: 'FeatureCollection',
    features: []
  } as FeatureCollection);

  const handleHover = ({ features }: MapEvent) => {
    setHoveredFeatures({
      type: 'FeatureCollection',
      features
    } as FeatureCollection);
  };

  const containerRef = useRef<HTMLDivElement | null>(null);
  return (
    <MapContainer ref={containerRef}>
      <ReactMapGL
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
        {...viewport}
        width='100%'
        height='100%'
        onViewportChange={setViewport}
        onClick={displayFeature}
        onHover={handleHover}
        interactiveLayerIds={
          Array.isArray(data) && data.length > 0 ? ['layerFill'] : []
        }
      >
        {data &&
          data.map((datum, i) => (
            <Source key={`map=src-${i}`} type='geojson' data={datum}>
              <Layer
                id='layerFill'
                type='fill'
                paint={{
                  'fill-color': '#A150F2'
                }}
              />
            </Source>
          ))}
        <Source id='hovered' type='geojson' data={hoveredFeatures}>
          <Layer
            id='layerLine'
            type='line'
            paint={{
              'line-width': 2,
              'line-color': '#2ECC71'
            }}
          />
        </Source>
      </ReactMapGL>
    </MapContainer>
  );
};

export default Map;
