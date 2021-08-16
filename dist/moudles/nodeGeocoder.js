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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.geocoder = void 0;
const node_geocoder_1 = __importDefault(require("node-geocoder"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const dotenv = __importStar(require("dotenv"));
const envSetup_1 = require("../envSetup");
dotenv.config({ path: envSetup_1.envSetup() });
const options = {
    provider: 'google',
    // Optional depending on the providers
    fetch: function fetch(url, options) {
        return node_fetch_1.default(url, Object.assign(Object.assign({}, options), { headers: {
            // 'user-agent': 'My application <email@domain.com>',
            // 'X-Specific-Header': 'Specific value'
            } }));
    },
    apiKey: `${process.env.GOOGLE_MAP_API_KRY}`,
    // apiKey: process.env.GOOGLE_MAP_API_KRY, // for Mapquest, OpenCage, Google Premier AIzaSyDv-qTdhtRt8GnEPSNiGppH308o2oQINbU
    formatter: null // 'gpx', 'string', ...
};
exports.geocoder = node_geocoder_1.default(options);
//# sourceMappingURL=nodeGeocoder.js.map