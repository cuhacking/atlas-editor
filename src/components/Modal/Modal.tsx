import React from 'react';
import styled from 'styled-components';

interface ModalProps {
  onClose: () => void;
  children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, children }: ModalProps) => {
  return (
    <ModalContainer>
      <ModalBackground onClick={() => onClose()} />
      <ModalContent>
        <ModalHeader>
          <ModalCloseButton onClick={() => onClose()}>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              style={{ width: '1.25rem' }}
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </ModalCloseButton>
        </ModalHeader>
        {children}
      </ModalContent>
    </ModalContainer>
  );
};

const ModalContainer = styled.div`
  position: fixed;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
`;

const ModalBackground = styled.div`
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  background-color: #000;
  opacity: 0.8;
`;

const ModalContent = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  opacity: 1;
  padding: 2em;
  padding-bottom: 3em;
  border-radius: 0.25rem;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
`;

const ModalCloseButton = styled.button`
  margin: 0px;
  padding: 0px;
  cursor: pointer;
  background: none;
  border: none;
`;

export default Modal;
