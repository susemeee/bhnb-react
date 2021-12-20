"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWindowWidth = void 0;
var react_1 = require("react");
var debounce_1 = __importDefault(require("lodash/debounce"));
function useWindowWidth(delay) {
    if (delay === void 0) { delay = 700; }
    var _a = (0, react_1.useState)(window.innerWidth), width = _a[0], setWidth = _a[1];
    (0, react_1.useEffect)(function () {
        var handleResize = function () { return setWidth(window.innerWidth); };
        var debouncedHandleResize = (0, debounce_1.default)(handleResize, delay);
        window.addEventListener("resize", debouncedHandleResize);
        return function () {
            window.removeEventListener("resize", debouncedHandleResize);
        };
    }, [delay]);
    return width;
}
exports.useWindowWidth = useWindowWidth;
exports.default = useWindowWidth;
