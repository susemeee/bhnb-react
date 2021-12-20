"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Projection = void 0;
var react_1 = __importStar(require("react"));
var react_konva_1 = require("react-konva");
var Projection = function (_a) {
    var _b = _a.mapType, mapType = _b === void 0 ? "GroundMap" : _b, props = __rest(_a, ["mapType"]);
    var _c = (0, react_1.useState)([]), stars = _c[0], setStars = _c[1];
    (0, react_1.useEffect)(function () {
        fetch("https://raw.githubusercontent.com/PngWnA/BHNB/master/resources/halflarge.json").then(function (res) { return console.log(res); });
    }, []);
    return (react_1.default.createElement("div", null,
        react_1.default.createElement(react_konva_1.Rect, { x: 20, y: 20, width: 50, height: 50, fill: "green", shadowBlur: 5 })));
};
exports.Projection = Projection;
exports.default = exports.Projection;
