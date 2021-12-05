const NBBL = artifacts.require('NBBL')

module.exports = async function(deployer, newtwork, accounts) {
    await deployer.deploy(NBBL)
};
