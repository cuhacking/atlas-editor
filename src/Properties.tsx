import React from 'react';
import { FeatureCollection } from 'geojson';

import { Text } from './common';

interface PropertyProps {
  info: FeatureCollection | null;
  // children?: ReactNode;
}

const Properties: React.FC<PropertyProps> = (props: PropertyProps) => {
  console.log('props', props);
  const { info } = props;
  return (
    <div>
      {info ? (
        <>
          <p>Type: {info.type}</p>
          <ul>
            Properties:{' '}
            {info.features.map((feature) => {
              const { properties } = feature;
              console.log('properties', properties);
              return properties ? (
                <>
                  <br />
                  <li key={`${properties.fid}-map-properties`}>
                    {properties.building}
                    {properties.roomId}
                  </li>
                  <li> Floor: {properties.floor}</li>
                  <li>
                    {' '}
                    Room: {properties.roomName} ({properties.roomType})
                  </li>
                  <li>
                    Search Tags:
                    <ul>
                      {properties.searchTagProps.map(
                        (searchTag: string, i: number) => (
                          <li key={`${i}-search=tag`}>{searchTag}</li>
                        )
                      )}
                    </ul>
                  </li>
                  <br />
                </>
              ) : (
                'N/A'
              );
            })}
          </ul>
        </>
      ) : (
        'Open a file qt'
      )}
    </div>
  );
};

export default Properties;
