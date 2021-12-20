import { ShapeConfig } from "konva/lib/Shape";
import React from "react";
export declare type ProjectionMapType = "RandomMap" | "CelestialMap" | "GroundMap";
interface IProjectionProps {
    mapType?: ProjectionMapType;
    starShapeConf?: ShapeConfig;
    anim?: boolean;
}
export declare const Projection: React.FC<IProjectionProps>;
export default Projection;
