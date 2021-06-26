import React, { useCallback, useEffect, useState } from 'react';
import { FeatureCollection } from 'geojson';
import Map from './Map';
import styled, {
  createGlobalStyle // TODO: Establish a theme and hook this up to everything
} from 'styled-components';
import Left from './Left';
import Right from './Right';

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

const App: React.FC = () => {
  const fileChannel = 'file-content';
  const [data, setData] = useState<FeatureCollection | null>(null);

  const onFileOpen = useCallback((event: any, contents: FeatureCollection) => {
    console.log(`RENDERER: ${fileChannel}`, contents);
    setData(contents);
  }, []);

  useEffect(() => {
    ipcRenderer.on(fileChannel, onFileOpen);

    return () => ipcRenderer.removeListener(fileChannel, onFileOpen);
  }, []);

  return (
    <>
      <GlobalStyle />
      <StyledDiv className='App'>
        <Left />
        <Map latitude={45.3854} longitude={-75.69608} data={data} />
        <Right />
      </StyledDiv>
    </>
  );
};

export default App;
