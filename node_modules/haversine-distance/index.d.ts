interface LatitudeLongitude {
    latitude: number;
    longitude: number;
}

interface LatLng {
    lat: number;
    lng: number;
}

interface LatLon {
    lat: number;
    lon: number;
}

interface GeoJSONPoint extends Array<number|number>{0:number; 1:number}

type Coordinates = LatitudeLongitude | LatLng | LatLon | GeoJSONPoint

/**
 * Return the Haversine distance in meters
 * @param a - first location
 * @param b - second location
 */
declare function haversineDistance(a: Coordinates, b: Coordinates): number;

declare namespace haversineDistance {
    export function haversineDistance(): number;
}

export = haversineDistance;
