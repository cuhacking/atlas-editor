/* eslint @typescript-eslint/no-explicit-any: "off" */
/* eslint @typescript-eslint/explicit-module-boundary-types: "off" */
import type { FeatureCollection } from 'geojson';
import * as jsonschema from 'jsonschema';
import FeatureCollectionSchema from './FeatureCollection.json';

export function isFeatureCollection(object: any): object is FeatureCollection {
  return jsonschema.validate(object, FeatureCollectionSchema).valid;
}
