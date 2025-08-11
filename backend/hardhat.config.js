require("@nomicfoundation/hardhat-toolbox");
const { mnemonic } = require('./secrets.json');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      accounts: {
        mnemonic: mnemonic,
        count: 20
      }
    }
  }
};
