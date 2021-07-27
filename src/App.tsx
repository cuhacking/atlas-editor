/* eslint @typescript-eslint/no-var-requires: "off" */
import React, { useCallback, useEffect, useState } from 'react';
import { FeatureCollection, Feature } from 'geojson';
import Map from './Map';
import styled, {
  createGlobalStyle // TODO: Establish a theme and hook this up to everything
} from 'styled-components';
import Left from './Left';
import Properties from './Properties';
import type { IpcRendererEvent } from 'electron';
import { MapEvent } from 'react-map-gl';

const { ipcRenderer } = window.require('electron');

const StyledDiv = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
`;

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
  }
`;

const carleton = {
  latitude: 45.3854,
  longitude: -75.69608
};

const fileChannel = 'file-content';
const App: React.FC = () => {
  const [feature, setFeature] = useState<Feature[] | null>(null);

  const displayFeature = useCallback(({ features }: MapEvent) => {
    if (features) {
      setFeature(features);
    }
  }, []);
  const [mapData, setData] = useState<FeatureCollection[] | null>(null);

  const onFileOpen = useCallback(
    (event: IpcRendererEvent, contents: FeatureCollection[]) => {
      console.log(`RENDERER: ${fileChannel}`, contents);
      setData(contents);
      // TODO: Add file validation
    },
    []
  );

  useEffect(() => {
    ipcRenderer.on(fileChannel, onFileOpen);

    return () => {
      ipcRenderer.removeListener(fileChannel, onFileOpen);
    };
  }, []);

  return (
    <>
      <GlobalStyle />
      <StyledDiv className='App'>
        <Left />
        <Map
          latitude={carleton.latitude}
          longitude={carleton.longitude}
          data={mapData}
          displayFeature={displayFeature}
        />
        <Properties features={feature} />
      </StyledDiv>
    </>
  );
};

export default App;
