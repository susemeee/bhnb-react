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
import React, { useEffect, useState } from "react";
import { Stage, Layer, Rect, Text } from "react-konva";
export var Projection = function (_a) {
    var _b = _a.mapType, mapType = _b === void 0 ? "GroundMap" : _b, props = __rest(_a, ["mapType"]);
    var _c = useState([]), stars = _c[0], setStars = _c[1];
    useEffect(function () {
        fetch("https://raw.githubusercontent.com/PngWnA/BHNB/master/resources/halflarge.json")
            .then(function (res) { return res.json(); })
            .then(console.log);
    }, []);
    return (React.createElement(Stage, { width: window.innerWidth, height: window.innerHeight },
        React.createElement(Layer, null,
            React.createElement(Text, { text: "Try click on rect" }),
            React.createElement(Rect, { x: 20, y: 20, width: 50, height: 50, fill: "green", shadowBlur: 5 }))));
};
export default Projection;
