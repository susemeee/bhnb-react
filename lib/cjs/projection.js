"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.starToGroundMap = exports.starToCelestialMap = exports.starToRandomMap = void 0;
var util_1 = require("./util");
// brightness : mag -> size
var brightness = function (mag) { return Math.min(6.0, (-11 / 9) * mag + 21 / 3); };
// setRandomMap : star* -> star*
var starToRandomMap = function (stars) {
    return stars.map(function (star) {
        var size = Math.random() * 3;
        return {
            x: innerWidth * Math.random(),
            y: innerHeight * Math.random(),
            width: size,
            height: size,
        };
    });
};
exports.starToRandomMap = starToRandomMap;
// setCelestialMap : star* -> star*
var starToCelestialMap = function (stars) {
    return stars.map(function (star) {
        var az = star.az;
        var alt = star.alt;
        var mag = star.mag;
        return {
            x: ((az / 360 + 0.5) % 1.0) * innerWidth,
            y: ((-alt + 90) / 180) * innerHeight,
            width: brightness(mag),
            height: brightness(mag),
        };
    });
};
exports.starToCelestialMap = starToCelestialMap;
// setGroundMap : fov -> star* -> star*
var starToGroundMap = function (stars, fov) {
    if (fov === void 0) { fov = "N"; }
    return stars.map(function (star) {
        var az = star.az;
        var alt = star.alt;
        var mag = star.mag;
        var _a = (0, util_1.azaltToCatesian)(az, alt), x = _a.x, y = _a.y, z = _a.z;
        var start, end, factor;
        var Y, Z;
        if (fov === "N") {
            start = 90;
            end = 270;
            factor = 1 + x;
            Y = y / factor;
            Z = z / factor;
        }
        else {
            start = 270;
            end = 90;
            factor = 1 - x;
            Y = -y / factor;
            Z = z / factor;
        }
        var W = innerWidth / 2;
        var H = innerHeight;
        var scale = Math.sqrt(W * W + H * H);
        // Filter out half sphere
        if (start <= az && az <= end) {
            return {
                x: 0,
                y: 0,
                width: 0,
                height: 0,
            };
        }
        return {
            x: W - Y * scale,
            y: H - Z * scale,
            width: brightness(mag),
            height: brightness(mag),
        };
    });
};
exports.starToGroundMap = starToGroundMap;
