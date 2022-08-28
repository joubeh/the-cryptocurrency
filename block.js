const { GENESIS_DATA, MINE_RATE } = require('./config')
const { cryptoHash } = require('./crypto-hash')
const hexToBinary = require('hex-to-binary')

class Block {
    constructor(timestamp, lastHash, data, hash, nonce, difficulty) {
        this.timestamp = timestamp
        this.lastHash = lastHash
        this.data = data
        this.hash = hash
        this.nonce = nonce
        this.difficulty = difficulty
    }

    static genesis() {
        return new this(
            GENESIS_DATA.timestamp,
            GENESIS_DATA.lastHash,
            GENESIS_DATA.data,
            GENESIS_DATA.hash,
            GENESIS_DATA.nonce,
            GENESIS_DATA.difficulty
        )
    }

    static mineBlock(lastBlock, data) {
        let timestamp, hash
        const lastHash = lastBlock.hash
        let { difficulty } = lastBlock
        let nonce = 0

        do {
            nonce++
            timestamp = Date.now()
            hash = cryptoHash(timestamp, lastHash, data, nonce, difficulty)
            difficulty = Block.adjustDifficulty(lastBlock, timestamp)
        } while (hexToBinary(hash).substring(0, difficulty) !== '0'.repeat(difficulty))

        return new this(
            timestamp,
            lastHash,
            data,
            cryptoHash(timestamp, lastHash, data, nonce, difficulty),
            nonce,
            difficulty
        )
    }

    static adjustDifficulty(originalBlock, timestamp) {
        const { difficulty } = originalBlock
        if(difficulty < 1) {
            return 1
        }
        if((timestamp - originalBlock.timestamp) > MINE_RATE) {
            return difficulty - 1
        }
        if((timestamp - originalBlock.timestamp) < MINE_RATE) {
            return difficulty + 1
        }
        return difficulty
    }
}

module.exports = { Block }