import uuid from 'uuid4'
import crypto from 'crypto-js'
import axios from 'axios'
import jsonbig from 'json-bigint';
import { envSetup } from "../envSetup";
import * as dotenv from 'dotenv'
dotenv.config({ path: envSetup() })
const key = process.env.LINE_PAY_SECRET

type LineOrderResType = {
    returnCode: string,
    returnMessage: string,
    info: {
        paymentUrl: {
            web: string,
            app: string
        },
        transactionId: number,
        paymentAccessToken: string
    },
    orderId: string
}
const uri = 'https://sandbox-api-pay.line.me'
const quantity = 10, price = 1
const amount = quantity * price

export const createBuskerDonateLineOrder = async (performanceId: number) => {
    const nonce = uuid()
    const requestUri = '/v3/payments/request'
    const orderId = `startbuskerOrder&${nonce}&${performanceId}`
    const name = `${nonce}-${performanceId}`
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
    }
    const encrypt = crypto.HmacSHA256(key + requestUri + JSON.stringify(order) + nonce, key)

    // 然後再轉成Base64
    const hmacBase64 = crypto.enc.Base64.stringify(encrypt)
    const configs = {
        headers: {
            'Content-Type': 'application/json',
            'X-LINE-ChannelId': process.env.LINE_PAY_CHANNEL_ID,
            'X-LINE-Authorization-Nonce': nonce,
            'X-LINE-Authorization': hmacBase64
        }
    }

    const result = await axios.post('https://sandbox-api-pay.line.me/v3/payments/request', order, configs)
    console.log('requestLineOrder:', result.data)
    return { ...result.data, orderId } as LineOrderResType
}

const nonce = uuid()
export const confirmLineDonateOrder = async (transactionId: string) => {
    const api = `/v3/payments/${transactionId}/confirm`
    const body = { amount: amount, currency: 'TWD' }
    const encrypt = crypto.HmacSHA256(key + api + JSON.stringify(body) + nonce, key)
    const hmacBase64 = crypto.enc.Base64.stringify(encrypt)
    let configs = {
        headers: {
            'Content-Type': 'application/json',
            'X-LINE-ChannelId': process.env.LINE_PAY_CHANNEL_ID,
            'X-LINE-Authorization-Nonce': nonce,
            'X-LINE-Authorization': hmacBase64
        },
        transformResponse: jsonbigTransform
    }
    const result = await axios.post(uri + api, body, configs)
    console.log('confirmLineDonateOrder:', result.data);
    return result.data
}

const jsonbigTransform = (data) => {
    return jsonbig.parse(data);
}

