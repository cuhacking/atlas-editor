import React, { Fragment } from 'react';
import { Feature } from 'geojson';
interface PropertyProps {
  feature: Feature;
}

const Property = ({ feature }: PropertyProps) => {
  const { properties } = feature;
  return properties ? (
    <Fragment key={`${properties.building}-${properties.roomId}-property`}>
      <br />
      <li>
        {properties.building}
        {properties.roomId}
      </li>
      <li> Floor: {properties.floor}</li>
      <li>
        {' '}
        Room: {properties.roomName} ({properties.roomType})
      </li>
      {Array.isArray(properties.searchTagProps) && (
        <li>
          Search Tags:
          <ul>
            {properties.searchTagProps.map((searchTag: string, k: number) => (
              <li key={`${k}-property-search-tag`}>{searchTag}</li>
            ))}
          </ul>
        </li>
      )}
      <br />
    </Fragment>
  ) : (
    <p>Something may have gone wrong</p>
  );
};
interface PropertiesProps {
  features: Feature[] | null;
}

const Properties: React.FC<PropertiesProps> = ({
  features
}: PropertiesProps) => (
  <>
    {console.log('User just clicked on the following feature(s):', features)}
    {features ? (
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
