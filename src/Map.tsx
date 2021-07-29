import React, { useState, useRef, useCallback } from 'react';
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

  const [hoverSource, setHoverSource] = useState('');

  const handleHover = useCallback(({ features }: MapEvent) => {
    setHoverSource(features && features.length > 0 ? features[0].source : '');
  }, []);
  const handleCursor = () => (hoverSource ? 'pointer' : 'grab');

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
        getCursor={handleCursor}
      >
        {data &&
          data.map((datum, i) => {
            const key = `map=src-${i}`;
            return (
              <Source id={key} key={key} type='geojson' data={datum}>
                <Layer
                  id='layerFill'
                  type='fill'
                  paint={{
                    'fill-color': '#A150F2'
                  }}
                />
                <Layer
                  id='layerLine'
                  type='line'
                  paint={{
                    'line-width': 4,
                    'line-color': hoverSource === key ? '#5e219c' : '#A150F2'
                  }}
                />
              </Source>
            );
          })}
      </ReactMapGL>
    </MapContainer>
  );
};

export default Map;
