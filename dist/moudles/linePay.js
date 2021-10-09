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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmLineDonateOrder = exports.createBuskerDonateLineOrder = void 0;
const uuid4_1 = __importDefault(require("uuid4"));
const crypto_js_1 = __importDefault(require("crypto-js"));
const axios_1 = __importDefault(require("axios"));
const json_bigint_1 = __importDefault(require("json-bigint"));
const envSetup_1 = require("../envSetup");
const dotenv = __importStar(require("dotenv"));
dotenv.config({ path: envSetup_1.envSetup() });
const key = process.env.LINE_PAY_SECRET;
const uri = 'https://sandbox-api-pay.line.me';
const quantity = 10, price = 1;
const amount = quantity * price;
const createBuskerDonateLineOrder = (performanceId) => __awaiter(void 0, void 0, void 0, function* () {
    const nonce = uuid4_1.default();
    const requestUri = '/v3/payments/request';
    const orderId = `startbuskerOrder&${nonce}&${performanceId}`;
    const name = `${nonce}-${performanceId}`;
    const order = {
        amount: amount,
        currency: 'TWD',
        orderId: orderId,
        packages: [
            {
                id: nonce,
                amount: amount,
                name: name,
                products: [
                    {
                        name: name,
                        quantity: quantity,
                        price: price
                    }
                ]
            }
        ],
        redirectUrls: {
            // confirmUrl: 'http://localhost:3000/linePayDonate',
            confirmUrl: 'http://localhost:8081/api/confirmLineDonateOrder',
            cancelUrl: 'http://localhost:3000'
        }
    };
    const encrypt = crypto_js_1.default.HmacSHA256(key + requestUri + JSON.stringify(order) + nonce, key);
    // 然後再轉成Base64
    const hmacBase64 = crypto_js_1.default.enc.Base64.stringify(encrypt);
    const configs = {
        headers: {
            'Content-Type': 'application/json',
            'X-LINE-ChannelId': process.env.LINE_PAY_CHANNEL_ID,
            'X-LINE-Authorization-Nonce': nonce,
            'X-LINE-Authorization': hmacBase64
        }
    };
    const result = yield axios_1.default.post('https://sandbox-api-pay.line.me/v3/payments/request', order, configs);
    console.log('requestLineOrder:', result.data);
    return Object.assign(Object.assign({}, result.data), { orderId });
});
exports.createBuskerDonateLineOrder = createBuskerDonateLineOrder;
const nonce = uuid4_1.default();
const confirmLineDonateOrder = (transactionId) => __awaiter(void 0, void 0, void 0, function* () {
    const api = `/v3/payments/${transactionId}/confirm`;
    const body = { amount: amount, currency: 'TWD' };
    const encrypt = crypto_js_1.default.HmacSHA256(key + api + JSON.stringify(body) + nonce, key);
    const hmacBase64 = crypto_js_1.default.enc.Base64.stringify(encrypt);
    let configs = {
        headers: {
            'Content-Type': 'application/json',
            'X-LINE-ChannelId': process.env.LINE_PAY_CHANNEL_ID,
            'X-LINE-Authorization-Nonce': nonce,
            'X-LINE-Authorization': hmacBase64
        },
        transformResponse: jsonbigTransform
    };
    const result = yield axios_1.default.post(uri + api, body, configs);
    console.log('confirmLineDonateOrder:', result.data);
    return result.data;
});
exports.confirmLineDonateOrder = confirmLineDonateOrder;
const jsonbigTransform = (data) => {
    return json_bigint_1.default.parse(data);
};
//# sourceMappingURL=linePay.js.map