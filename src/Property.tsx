import React from 'react';
import { Feature } from 'geojson';
import styled from 'styled-components';

interface PropertyProps {
  feature: Feature;
}

const StyledInput = styled.input`
  border: 1px solid transparent;
  text-decoration-line: underline;
  text-decoration-color: green;
`;

const Property: React.FC<PropertyProps> = ({ feature }: PropertyProps) => {
  const { properties } = feature;
  return properties ? (
    <>
      {Object.keys(properties).map((property) => {
        return (
          <li key={property}>
            {property}:{' '}
            {/* TODO: Figure out what the heck is going on with searchTagProps */}
            <StyledInput type='text' defaultValue={properties[property]} />{' '}
          </li>
        );
      })}
    </>
  ) : (
    <p>Something may have gone wrong</p>
  );
};

export default Property;
