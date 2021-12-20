import Star from "./star";
export interface Geography {
    lat: number;
    lon: number;
}
export declare const getLocalGeographic: () => Promise<Geography>;
export declare const getLocalSidereal: (longitude: number) => number;
export declare const equatorialToHorizontal: (lat: number, LST: number, star: Star) => Star;
export declare const azaltToCatesian: (az: number, alt: number) => {
    x: number;
    y: number;
    z: number;
};
export declare const convertAllEquatorial: (stars: Star[], geo: Geography) => Star[];
