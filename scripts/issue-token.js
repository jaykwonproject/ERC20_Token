const NBBL = artifacts.require('NBBL')

module.exports = async function(callback) {
    let nbbl = await NBBL.deployed()
    await nbbl.issueTokens()
    console.log("Tokens issued!")
    callback()
}