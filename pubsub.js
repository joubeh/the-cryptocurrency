const redis = require('redis')

const CHANNELS = {
    BLOCKCHAIN: 'BLOCKCHAIN'
}

class PubSub {
    constructor(blockchain) {
        this.blockchain = blockchain
        this.publisher = redis.createClient()
        this.subscriber = redis.createClient()

        this.subscribeToChannels()
    }

    handleMessage(channel, message) {
        const parsedMessage = JSON.parse(message)

        switch (channel) {
            case CHANNELS.BLOCKCHAIN:
                this.blockchain.replaceChain(parsedMessage)
                break
            default:
                console.log(`Message received from unknown channel. Channel: ${channel}\tMessage: ${message}`)
        }
    }

    subscribeToChannels() {
        Object.values(CHANNELS).forEach(channel => {
            this.subscriber.subscribe(channel, (message) => {
                this.handleMessage(channel, message)
            })
        })
    }

    publish(channel, message) {
        this.publisher.publish(channel, message)
    }

    broadcastChain() {
        this.publish(CHANNELS.BLOCKCHAIN, JSON.stringify(this.blockchain.chain))
    }
}

module.exports = { PubSub }