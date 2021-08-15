"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.geocoder = void 0;
const node_geocoder_1 = __importDefault(require("node-geocoder"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const options = {
    provider: 'google',
    // Optional depending on the providers
    fetch: function fetch(url, options) {
        return node_fetch_1.default(url, Object.assign(Object.assign({}, options), { headers: {
            // 'user-agent': 'My application <email@domain.com>',
            // 'X-Specific-Header': 'Specific value'
            } }));
    },
    apiKey: process.env.GOOGLE_MAP_API_KRY,
    formatter: null // 'gpx', 'string', ...
};
exports.geocoder = node_geocoder_1.default(options);
//# sourceMappingURL=nodeGeocoder.js.map