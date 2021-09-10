/* eslint @typescript-eslint/no-var-requires: "off" */
import React, { useCallback, useEffect, useState } from 'react';
import { FeatureCollection, Feature } from 'geojson';
import styled, {
  createGlobalStyle // TODO: Establish a theme and hook this up to everything
} from 'styled-components';
import type { IpcRendererEvent } from 'electron';
import { MapEvent } from 'react-map-gl';
import { partition } from 'lodash';
import { isFeatureCollection } from './util/validateJson';
import Map from './Map';
import Left from './Left';
import Properties from './Properties';
import FileErrorModal from './components/Modal/FileErrorModal';

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

interface FileData {
  filepath: string;
  content: FeatureCollection;
}

const fileChannel = 'file-content';
const App: React.FC = () => {
  const [feature, setFeature] = useState<Feature[] | undefined>(undefined);
  const [mapData, setData] = useState<FeatureCollection[] | null>(null);
  const [errorFiles, setErrorFiles] = useState<string[]>([]);

  const displayFeature = useCallback(({ features }: MapEvent) => {
    setFeature(features);
  }, []);

  const onFileOpen = useCallback(
    (event: IpcRendererEvent, contents: FileData[]) => {
      console.log(`RENDERER: ${fileChannel}`, contents);
      const [validFiles, invalidFiles] = partition(contents, (f) =>
        isFeatureCollection(f.content)
      );
      // if a bad file was found, num of validated files will be less than input contents
      if (validFiles.length < contents.length) {
        setErrorFiles(invalidFiles.map((f) => f.filepath));
      }
      setData(validFiles.map((f) => f.content));
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
        {errorFiles.length > 0 ? (
          <FileErrorModal
            onClose={() => setErrorFiles([])}
            files={errorFiles}
          />
        ) : null}
      </StyledDiv>
    </>
  );
};

export default App;
