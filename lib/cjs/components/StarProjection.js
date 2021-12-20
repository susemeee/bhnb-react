"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Projection = void 0;
var Animation_1 = require("konva/lib/Animation");
var react_1 = __importStar(require("react"));
var react_konva_1 = require("react-konva");
var projection_1 = require("../projection");
var util_1 = require("../util");
var hyg_database_json_1 = __importDefault(require("../hyg-database.json"));
var useWindowWidth_1 = __importDefault(require("../useWindowWidth"));
// animation constants
var CIRCLE_ANIM_SIZE_TH = 0.8;
var CIRCLE_TARGET_OPACITY = 0.3;
var CIRCLE_OPACITY_DELTA = (1 - CIRCLE_TARGET_OPACITY) / 30;
var Projection = function (_a) {
    var _b = _a.mapType, mapType = _b === void 0 ? "GroundMap" : _b, _c = _a.starShapeConf, starShapeConf = _c === void 0 ? {
        fill: "white",
        shadowBlur: 6.0,
    } : _c, _d = _a.anim, anim = _d === void 0 ? false : _d, props = __rest(_a, ["mapType", "starShapeConf", "anim"]);
    var refs = (0, react_1.useRef)([]);
    var windowWidth = (0, useWindowWidth_1.default)(200);
    var _e = (0, react_1.useState)([]), stars = _e[0], setStars = _e[1];
    var _f = (0, react_1.useState)([]), starProjections = _f[0], setStarProjections = _f[1];
    (0, react_1.useEffect)(function () {
        Promise.all([
            hyg_database_json_1.default.map(function (res) { return (__assign(__assign({}, res), { ra: Number(res.ra), dec: Number(res.dec), mag: Number(res.mag) })); }),
            (0, util_1.getLocalGeographic)(),
        ]).then(function (_a) {
            var stars = _a[0], geo = _a[1];
            return setStars((0, util_1.convertAllEquatorial)(stars, geo));
        });
    }, []);
    (0, react_1.useEffect)(function () {
        switch (mapType) {
            case "RandomMap":
                setStarProjections((0, projection_1.starToRandomMap)(stars));
                break;
            case "CelestialMap":
                setStarProjections((0, projection_1.starToCelestialMap)(stars));
                break;
            case "GroundMap":
                setStarProjections((0, projection_1.starToGroundMap)(stars));
                break;
            default:
                throw new Error("INVALID_PROJ_MODE");
        }
    }, [stars, windowWidth]);
    (0, react_1.useEffect)(function () {
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
        var animation = new Animation_1.Animation(function (frame) {
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
    return (react_1.default.createElement(react_konva_1.Stage, { width: window.innerWidth, height: window.innerHeight },
        react_1.default.createElement(react_konva_1.Layer, null, starProjections
            .filter(function (star) { return star.width > 0 && star.height > 0; })
            .map(function (star, index) { return (react_1.default.createElement(react_konva_1.Circle, __assign({ ref: function (element) {
                refs.current[index] = element;
            }, key: "".concat(star.x, "_").concat(star.y, "_").concat(star.width, "_").concat(star.height), x: star.x, y: star.y, width: star.width, height: star.height }, starShapeConf))); }))));
};
exports.Projection = Projection;
exports.default = exports.Projection;
