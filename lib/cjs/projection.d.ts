import Star, { StarProjection } from "./star";
export declare const starToRandomMap: (stars: Star[]) => StarProjection[];
export declare const starToCelestialMap: (stars: Star[]) => StarProjection[];
export declare const starToGroundMap: (stars: Star[], fov?: string) => StarProjection[];
