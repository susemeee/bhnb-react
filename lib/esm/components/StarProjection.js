var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { Animation } from "konva/lib/Animation";
import React, { useEffect, useRef, useState } from "react";
import { Stage, Layer, Circle } from "react-konva";
import { starToCelestialMap, starToGroundMap, starToRandomMap, } from "../projection";
import { convertAllEquatorial, getLocalGeographic } from "../util";
import HYGDatabase from "../hyg-database.json";
import useWindowWidth from "../useWindowWidth";
// animation constants
var CIRCLE_ANIM_SIZE_TH = 0.8;
var CIRCLE_TARGET_OPACITY = 0.3;
var CIRCLE_OPACITY_DELTA = (1 - CIRCLE_TARGET_OPACITY) / 30;
export var Projection = function (_a) {
    var _b = _a.mapType, mapType = _b === void 0 ? "GroundMap" : _b, _c = _a.starShapeConf, starShapeConf = _c === void 0 ? {
        fill: "white",
        shadowBlur: 6.0,
    } : _c, _d = _a.anim, anim = _d === void 0 ? false : _d, props = __rest(_a, ["mapType", "starShapeConf", "anim"]);
    var refs = useRef([]);
    var windowWidth = useWindowWidth(200);
    var _e = useState([]), stars = _e[0], setStars = _e[1];
    var _f = useState([]), starProjections = _f[0], setStarProjections = _f[1];
    useEffect(function () {
        Promise.all([
            HYGDatabase.map(function (res) { return (__assign(__assign({}, res), { ra: Number(res.ra), dec: Number(res.dec), mag: Number(res.mag) })); }),
            getLocalGeographic(),
        ]).then(function (_a) {
            var stars = _a[0], geo = _a[1];
            return setStars(convertAllEquatorial(stars, geo));
        });
    }, []);
    useEffect(function () {
        switch (mapType) {
            case "RandomMap":
                setStarProjections(starToRandomMap(stars));
                break;
            case "CelestialMap":
                setStarProjections(starToCelestialMap(stars));
                break;
            case "GroundMap":
                setStarProjections(starToGroundMap(stars));
                break;
            default:
                throw new Error("INVALID_PROJ_MODE");
        }
    }, [stars, windowWidth]);
    useEffect(function () {
        if (!refs.current || anim === false) {
            return;
        }
        for (var _i = 0, _a = refs.current; _i < _a.length; _i++) {
            var circle = _a[_i];
            if (circle.attrs.radius < CIRCLE_ANIM_SIZE_TH) {
                continue;
            }
            var delay = (Math.random() * 2.0 + 0.5) * 1000;
            circle.setAttr("d", delay);
            circle.setAttr("r", false);
        }
        var animation = new Animation(function (frame) {
            // frame skipping
            if (!frame || frame.time % 20 >= 1.0) {
                return false;
            }
            else {
                for (var _i = 0, _a = refs.current; _i < _a.length; _i++) {
                    var circle = _a[_i];
                    if (!circle.attrs.d || frame.time < circle.attrs.d) {
                        continue;
                    }
                    // regular update
                    var currentOpacity = circle.opacity();
                    if (!circle.attrs.r) {
                        circle.opacity(currentOpacity - CIRCLE_OPACITY_DELTA);
                        if (currentOpacity < CIRCLE_TARGET_OPACITY) {
                            circle.setAttr("r", true);
                        }
                    }
                    else {
                        circle.opacity(currentOpacity + CIRCLE_OPACITY_DELTA);
                        if (currentOpacity >= 1.0) {
                            circle.setAttr("r", false);
                        }
                    }
                }
            }
        });
        animation.start();
    }, [starProjections]);
    return (React.createElement(Stage, { width: window.innerWidth, height: window.innerHeight },
        React.createElement(Layer, null, starProjections
            .filter(function (star) { return star.width > 0 && star.height > 0; })
            .map(function (star, index) { return (React.createElement(Circle, __assign({ ref: function (element) {
                refs.current[index] = element;
            }, key: "".concat(star.x, "_").concat(star.y, "_").concat(star.width, "_").concat(star.height), x: star.x, y: star.y, width: star.width, height: star.height }, starShapeConf))); }))));
};
export default Projection;
