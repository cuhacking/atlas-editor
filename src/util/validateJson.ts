/* eslint @typescript-eslint/no-explicit-any: "off" */
/* eslint @typescript-eslint/explicit-module-boundary-types: "off" */
import type {
  FeatureCollection,
  Feature,
  GeoJsonProperties,
  Geometry
} from 'geojson';

export function isFeatureCollection(object: any): object is FeatureCollection {
  return (
    typeof object !== 'undefined' &&
    typeof object === 'object' &&
    object.type === 'FeatureCollection' &&
    Array.isArray(object.features) &&
    object.features.every(isFeature)
  );
}

export function isFeature(object: any): object is Feature {
  return (
    typeof object !== 'undefined' &&
    typeof object === 'object' &&
    object.type === 'Feature' &&
    (typeof object.id === 'string' ||
      typeof object.id == 'number' ||
      typeof object.id === 'undefined') &&
    isGeoJsonProperties(object.properties) &&
    isGeometry(object.geometry)
  );
}

export function isGeoJsonProperties(object: any): object is GeoJsonProperties {
  return typeof object === 'object' || object === null;
}

export function isGeometry(object: any): object is Geometry {
  return (
    typeof object !== 'undefined' &&
    typeof object === 'object' &&
    (object.type === 'Point' ||
      object.type === 'MultiPoint' ||
      object.type === 'LineString' ||
      object.type === 'MultiLineString' ||
      object.type === 'Polygon' ||
      object.type === 'MultiPolygon') &&
    Array.isArray(object.coordinates) &&
    (typeof object.coordinates[0] === 'number' ||
      (Array.isArray(object.coordinates[0]) &&
        (typeof object.coordinates[0][0] === 'number' ||
          (Array.isArray(object.coordinates[0][0]) &&
            typeof object.coordinates[0][0][0] === 'number'))))
  );
}
