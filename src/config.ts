import {Config} from "./types";

export const config: Config = {
    tokensToTrade: {
        "ETH": {
            "prices": [3500, 4500],
            "leverage": [10, 10],
            "maxSpread": 0.005,
            "openPrice": [0.0, 0.0],
        },
        "BTC": {
            "prices": [3500, 4500],
            "leverage": [10, 10],
            "maxSpread": 0.005,
            "openPrice": [0.0, 0.0],
        },
    },
    //Замедление перед каждой операцией
    slowMo: 1000,
    viewport: {width: 1920, height: 900},
    simpleSwap: false,
}
export default config
