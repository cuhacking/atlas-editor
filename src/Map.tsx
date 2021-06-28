import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import ReactMapGL, { Source, Layer, ViewportProps } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { FeatureCollection } from 'geojson';

interface MapProps {
  latitude: number;
  longitude: number;
  data: FeatureCollection[] | null;
}

const MapContainer = styled.div`
  display: flex;
  flex-grow: 1;
  position: relative;
`;

const Map: React.FC<MapProps> = ({ latitude, longitude, data }: MapProps) => {
  const [viewport, setViewport] = useState<ViewportProps>({
    latitude: latitude,
    longitude: longitude,
    zoom: 16
  });

  const containerRef = useRef<HTMLDivElement | null>(null);
  console.log('What Im rendering is: ', data ? data : 'not here yet');
  return (
    <MapContainer ref={containerRef}>
      <ReactMapGL
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
        {...viewport}
        width='100%'
        height='100%'
        onViewportChange={setViewport}
      >
        {data &&
          data.map((datum, i) => (
            // var data: FeatureCollection<Geometry, GeoJsonProperties>
            <Source key={`map=src-${i}`} type='geojson' data={datum}>
              <Layer
                id='test'
                type='fill'
                paint={{
                  'fill-color': '#A150F2'
                }}
              />
            </Source>
          ))}
      </ReactMapGL>
    </MapContainer>
  );
};

export default Map;
