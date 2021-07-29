import React from 'react';
import { Feature } from 'geojson';
import Property from './Property';
interface PropertiesProps {
  features: Feature[] | undefined;
}

const Properties: React.FC<PropertiesProps> = ({
  features
}: PropertiesProps) => (
  <>
    {console.log('User just clicked on the following feature(s):', features)}
    {features?.length ? (
      features.map((feature, i) => (
        <ul key={`${i}-ul-feature`}>
          Properties: <Property feature={feature} />
        </ul>
      ))
    ) : (
      <p>Click on something!</p>
    )}
  </>
);

export default Properties;
