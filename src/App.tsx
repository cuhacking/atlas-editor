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
import Modal from './Modal';

const { ipcRenderer } = window.require('electron');

const StyledDiv = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
`;

const ErrorHeader = styled.h2`
  font-size: 1rem;
  line-height: 1.5rem;
  margin: 0px;
  margin-bottom: 1em;
`;

const ErrorText = styled.p`
  font-size: 0.875rem;
  line-height: 1.25rem;
  margin: 0px;
`;

const ErrorList = styled.ul`
  padding-left: 1em;
  margin: 0px;
`;

const ErrorItem = styled.li`
  font-size: 0.875rem;
  line-height: 1.25rem;
  margin: 0px;
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
          <Modal onClose={() => setErrorFiles([])}>
            <ErrorHeader>There was an error importing some files.</ErrorHeader>
            <ErrorText>Files that could not be imported:</ErrorText>
            <ErrorList>
              {errorFiles.map((file, i) => (
                <ErrorItem key={`${file}-${i}`}>{file}</ErrorItem>
              ))}
            </ErrorList>
          </Modal>
        ) : null}
      </StyledDiv>
    </>
  );
};

export default App;
