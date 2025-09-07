import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import Redis from 'ioredis'

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {cors : {origin: '*'}})

const redis = new Redis()
const publisher = new Redis()

//const STREAM_KEY = 'stock_prices'

app.use(express.static("client"))

io.on("connection", (socket) => {
    console.log("New client connected: ", socket.id)

    socket.on('subscribe', (symbol) => {
        console.log(`Client ${socket.id} subscribed to ${symbol}`)
        socket.join(symbol)
    })

    // socket.on('unsubscribe', (symbol) => {
    //     console.log(`Client ${socket.id} unsubscribed from ${symbol}`)
    //     socket.leave(symbol)
    // })

    socket.on('disconnect', (symbol) => {
        console.log(`Client disconnected ${socket.id}`)
    })
})

redis.subscribe('stock_prices')

redis.on("message", (channel, message) => {
    const tick = JSON.parse(message)
    io.to(tick.symbol).emit('tick', tick)
})

// async function consumerStream () {
//     let lastId = '0-0'
//     while (true) {
//         const streams = await redis.xread('BLOCK', 0, 'STREAMS', STREAM_KEY, lastId)

//         if (streams) {
//             const [key, entries] = streams[0]
//             for (const [id, fields] of entries) {
//                 lastId = id
//                 const tick = JSON.parse(fields[1])
//                 io.to(tick.symbol).emit('tick', tick)
//             }
//         }
//     }
// }

// consumerStream().catch(console.error)

httpServer.listen(3000, () => {
    console.log("Server running at http://localhost:3000")
})