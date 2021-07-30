import React, { useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import ReactMapGL, {
  Source,
  Layer,
  ViewportProps,
  MapEvent
} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {
  FeatureCollection,
  Feature,
  Geometry,
  GeoJsonProperties
} from 'geojson';

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

  const [hoveredFeature, setHoveredFeature] = useState<
    Feature<Geometry, GeoJsonProperties>
  >({} as Feature);

  const handleHover = useCallback(({ features }: MapEvent) => {
    setHoveredFeature(
      Array.isArray(features) && features.length > 0 ? features[0] : undefined
    );
  }, []);

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
              </Source>
            );
          })}
        {hoveredFeature ? (
          <Source id='hovered' type='geojson' data={hoveredFeature}>
            <Layer
              id='layerLine'
              type='line'
              paint={{
                'line-width': 2,
                'line-color': '#2ECC71'
              }}
            />
          </Source>
        ) : null}
      </ReactMapGL>
    </MapContainer>
  );
};

export default Map;
