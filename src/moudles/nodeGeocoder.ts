import NodeGeocoder from 'node-geocoder';
import nodeFetch from 'node-fetch';
import * as dotenv from 'dotenv'
import { envSetup } from "../envSetup";
dotenv.config({ path: envSetup() })


const options: any = {
    provider: 'google',
    // Optional depending on the providers
    fetch: function fetch(url, options) {

        return nodeFetch(url, {
            ...options,
            headers: {
                // 'user-agent': 'My application <email@domain.com>',
                // 'X-Specific-Header': 'Specific value'
            }
        })
    },
    apiKey: `${process.env.GOOGLE_MAP_API_KRY}`, // for Mapquest, OpenCage, Google Premier AIzaSyDv-qTdhtRt8GnEPSNiGppH308o2oQINbU

    // apiKey: process.env.GOOGLE_MAP_API_KRY, // for Mapquest, OpenCage, Google Premier AIzaSyDv-qTdhtRt8GnEPSNiGppH308o2oQINbU
    formatter: null // 'gpx', 'string', ...
};

export const geocoder = NodeGeocoder(options);

