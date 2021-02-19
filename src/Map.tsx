import React, { useState } from 'react';
import ReactMapGL from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapProps {
  latitude: number,
  longitude: number
}

const Map: React.FC<MapProps> =  ({latitude, longitude}) =>{
  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: latitude, 
    longitude: longitude,
    zoom: 16
  });

  return (
    <ReactMapGL mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
      {...viewport}
      onViewportChange={setViewport}
    />
  );
}

export default Map;