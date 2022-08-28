const express = require('express')
const bodyParser = require('body-parser')
const { Blockchain } = require('./blockchain')
const { PubSub } = require('./pubsub')
const request = require('request')

const app = express()
const blockchain = new Blockchain()
const pubSub = new PubSub(blockchain)

setTimeout(() => {
    pubSub.broadcastChain()
}, 1000)

app.use(bodyParser.json())

app.get('/api/blocks', (req, res) => {
    res.json(blockchain.chain)
})

app.post('/api/mine', (req, res) => {
    const { data } = req.body
    blockchain.addBlock(data)
    pubSub.broadcastChain()
    res.send('ok')
})

const PORT = 3000

const ROOT_NODE_ADDRESS = `http://127.0.0.1:${PORT}`
const syncChains = () => {
    request({ url: `${ROOT_NODE_ADDRESS}/api/blocks` }, (error, response, body) => {
        if(!error && response.statusCode === 200) {
            const rootChain = JSON.parse(body)
            blockchain.replaceChain(rootChain)
        }
    })
}

app.listen(PORT, () => {
    console.log(`App is running at port: ${PORT}`)
    syncChains()
})