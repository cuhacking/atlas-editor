import React, { Fragment } from 'react';
import { FeatureCollection } from 'geojson';

interface PropertyProps {
  info: FeatureCollection[] | null;
}

const Properties: React.FC<PropertyProps> = (props: PropertyProps) => {
  console.log('props', props);
  const { info } = props;
  console.log('info', info);

  return (
    <div>
      {info ? (
        info.map((inf, i) => (
          <Fragment key={`${i}-fr-inf`}>
            <ul key={`${i}-ul-inf`}>
              Properties:{' '}
              {inf.features.map((feature, j) => {
                const { properties } = feature;
                // console.log('properties', properties);
                return properties ? (
                  <Fragment key={`${j}-pr-fr-inf`}>
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
                          (searchTag: string, k: number) => (
                            <li key={`${k}-search=tag`}>{searchTag}</li>
                          )
                        )}
                      </ul>
                    </li>
                    <br />
                  </Fragment>
                ) : (
                  'N/A'
                );
              })}
            </ul>
          </Fragment>
        ))
      ) : (
        <p>Open a file!</p>
      )}
    </div>
    // <div>
    //   {info ? (
    //     <>
    //       <p>Type: {info.type}</p>
    //       <ul>
    //         Properties:{' '}
    //         {info.features.map((feature) => {
    //           const { properties } = feature;
    //           console.log('properties', properties);
    //           return properties ? (
    //             <>
    //               <br />
    //               <li key={`${properties.fid}-map-properties`}>
    //                 {properties.building}
    //                 {properties.roomId}
    //               </li>
    //               <li> Floor: {properties.floor}</li>
    //               <li>
    //                 {' '}
    //                 Room: {properties.roomName} ({properties.roomType})
    //               </li>
    //               <li>
    //                 Search Tags:
    //                 <ul>
    //                   {properties.searchTagProps.map(
    //                     (searchTag: string, i: number) => (
    //                       <li key={`${i}-search=tag`}>{searchTag}</li>
    //                     )
    //                   )}
    //                 </ul>
    //               </li>
    //               <br />
    //             </>
    //           ) : (
    //             'N/A'
    //           );
    //         })}
    //       </ul>
    //     </>
    //   ) : (
    //     'Open a file qt'
    //   )}
    // </div>
  );
};

export default Properties;
