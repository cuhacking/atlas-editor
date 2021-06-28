/* eslint @typescript-eslint/no-var-requires: "off" */
import React, { useCallback, useEffect, useState } from 'react';
import { FeatureCollection } from 'geojson';
import Map from './Map';
import styled, {
  createGlobalStyle // TODO: Establish a theme and hook this up to everything
} from 'styled-components';
import Left from './Left';
import Properties from './Properties';

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
  const [data, setData] = useState<FeatureCollection[] | null>(null);

  const onFileOpen = useCallback((event, contents: FeatureCollection[]) => {
    console.log(`RENDERER: ${fileChannel}`, contents);
    setData(contents);
  }, []);

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
          data={data}
        />
        <Properties info={data} />
      </StyledDiv>
    </>
  );
};

export default App;
