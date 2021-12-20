import { useEffect, useState } from "react";
import debounce from "lodash/debounce";
export function useWindowWidth(delay) {
    if (delay === void 0) { delay = 700; }
    var _a = useState(window.innerWidth), width = _a[0], setWidth = _a[1];
    useEffect(function () {
        var handleResize = function () { return setWidth(window.innerWidth); };
        var debouncedHandleResize = debounce(handleResize, delay);
        window.addEventListener("resize", debouncedHandleResize);
        return function () {
            window.removeEventListener("resize", debouncedHandleResize);
        };
    }, [delay]);
    return width;
}
export default useWindowWidth;
