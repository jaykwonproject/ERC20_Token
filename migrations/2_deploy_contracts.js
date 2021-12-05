const NBBL = artifacts.require('NBBL')

module.exports = async function(deployer) {
    await deployer.deploy(NBBL)
};
