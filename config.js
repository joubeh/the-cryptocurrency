const MINE_RATE = 10000
const INITIAL_DIFFICULTY = 3

const GENESIS_DATA = {
    timestamp: 0,
    lastHash: '',
    data: [],
    hash: '',
    nonce: 0,
    difficulty: INITIAL_DIFFICULTY
}

module.exports = { GENESIS_DATA, MINE_RATE }