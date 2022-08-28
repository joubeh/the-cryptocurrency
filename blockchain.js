const { Block } = require('./block')
const { cryptoHash } = require('./crypto-hash')

class Blockchain {
    constructor() {
        this.chain = [Block.genesis()]
    }

    addBlock(data) {
        const newBlock = Block.mineBlock(
            this.chain[this.chain.length - 1],
            data
        )

        this.chain.push(newBlock)
    }

    static isValidChain(chain) {
        if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
            return false
        }

        for(let i=1; i<chain.length; i++) {
            const block = chain[i]
            const actualLastHash = chain[i-1].hash
            const { timestamp, lastHash, data, hash, nonce, difficulty } = block
            const lastDifficulty = chain[i-1].difficulty

            if(lastHash !== actualLastHash){
                return false
            }

            const validatedHash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);

            if(validatedHash !== hash) {
                return false
            }

            if(Math.abs(lastDifficulty - difficulty) > 1) {
                return false
            }
        }

        return true
    }

    replaceChain(chain) {
        if(chain.length <= this.chain) {
            console.error('The incoming chain must be longer')
            return
        }

        if(!Blockchain.isValidChain(chain)) {
            console.error('The incoming chain must be valid')
            return
        }

        console.log('Replacing chain...')
        this.chain = chain
    }
}

module.exports = { Blockchain }