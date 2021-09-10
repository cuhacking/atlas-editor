import React from 'react';
import styled from 'styled-components';
import Modal from '..';

interface FileErrorModalProps {
  files: string[];
  onClose: () => void;
}

const ErrorModal: React.FC<FileErrorModalProps> = ({
  onClose,
  files
}: FileErrorModalProps) => {
  return (
    <Modal onClose={onClose}>
      <ErrorHeader>There was an error importing some files.</ErrorHeader>
      <ErrorText>Files that could not be imported:</ErrorText>
      <ErrorList>
        {files.map((file, i) => (
          <ErrorItem key={`${file}-${i}`}>{file}</ErrorItem>
        ))}
      </ErrorList>
    </Modal>
  );
};

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

export default ErrorModal;
