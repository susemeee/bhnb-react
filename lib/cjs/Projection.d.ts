import React from "react";
export declare type ProjectionMapType = "RandomMap" | "CelestialMap" | "GroundMap";
interface IProjectionProps {
    mapType?: ProjectionMapType;
}
export declare const Projection: React.FC<IProjectionProps>;
export default Projection;
