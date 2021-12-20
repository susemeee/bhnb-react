var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var r2d = function (rad) { return (rad * 180) / Math.PI; };
var d2r = function (degree) { return (degree * Math.PI) / 180; };
var sin = Math.sin, cos = Math.cos, tan = Math.tan, asin = Math.asin, acos = Math.acos, atan2 = Math.atan2;
// getGeographic : ip -> {lat, long}
export var getLocalGeographic = function () { return __awaiter(void 0, void 0, void 0, function () {
    var endpoint, base;
    return __generator(this, function (_a) {
        endpoint = "http://ip-api.com/json/";
        base = { lat: 37.582474, lon: 127.02756 };
        return [2 /*return*/, fetch(endpoint)
                .then(function (res) { return res.json(); })
                .catch(function (err) { return base; })];
    });
}); };
// getLocalSidereal : long -> LST
export var getLocalSidereal = function (longitude) {
    var now = new Date();
    var from2020 = new Date("2020/01/01");
    var offset = (now.getTime() - from2020.getTime()) / 1000.0 / 60.0 / 60.0 / 24.0;
    // Ignore err between UT1 and UTC,
    // since it's tiny.
    var UT1 = now.getUTCHours() +
        now.getUTCMinutes() / 60.0 +
        now.getUTCSeconds() / 3600.0;
    /*
     * Formula by U.S. Naval Observatory, 2020
     * Computing general local sidereal is exhausting...
     * Use this!
     */
    var GST = (6.6090775 + 0.0657098246 * offset + 1.00273791 * UT1) % 24;
    // GST = LST + long(converted to hours)
    var LST = (GST + longitude / 15.0) % 24;
    return LST;
};
// equatorialToHorizontal : lat -> LST -> star -> {az, alt}
export var equatorialToHorizontal = function (lat, LST, star) {
    /*
     * ra : hour
     * dec : -90 ~ +90
     * lat : -90 ~ +90
     * LST : hour
     * az : 360
     * alt : -90 ~ +90
     * HA : 0 ~ 360
     */
    var ra = star.ra;
    var dec = star.dec;
    // Convert HA to angle.
    var HA = ((LST - ra) * 15) % 360;
    // For readability.
    var sin = Math.sin, cos = Math.cos, tan = Math.tan, asin = Math.asin, acos = Math.acos, atan2 = Math.atan2;
    var Altitude = r2d(asin(sin(d2r(dec)) * sin(d2r(lat)) +
        cos(d2r(dec)) * cos(d2r(lat)) * cos(d2r(HA))));
    var Azimuth = r2d(atan2(sin(d2r(HA)), cos(d2r(HA)) * sin(d2r(lat)) - tan(d2r(dec)) * cos(d2r(lat)))) + 180;
    star.az = Azimuth;
    star.alt = Altitude;
    return star;
};
// azaltToCatesian : az -> alt -> {x, y, z}
export var azaltToCatesian = function (az, alt) {
    var pi = (-az + 360) % 360;
    var theta = -alt + 90;
    var x = sin(d2r(theta)) * cos(d2r(pi));
    var y = sin(d2r(theta)) * sin(d2r(pi));
    var z = cos(d2r(theta));
    return { x: x, y: y, z: z };
};
// azaltToCatesian : star* -> star*
export var convertAllEquatorial = function (stars, geo) {
    return stars.map(function (star) {
        return equatorialToHorizontal(geo.lat, getLocalSidereal(geo.lon), star);
    });
};
