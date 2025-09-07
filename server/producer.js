import { Redis } from 'ioredis'

const redis = new Redis()

//const STREAM_KEY = 'stock_prices'
const SYMBOLS = ["AAPL", "TSLA", "MSFT", "GOOG", "AMZN"]

function randomPrice(base) {
    return (base + Math.random() * 10 - 5).toFixed(2)
}

setInterval(() => {
    const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
    const tick = {symbol, price: randomPrice(100), ts: Date.now()}
    redis.publish("stock_prices", JSON.stringify(tick))
    console.log("Published: ", tick)
}, 1000)