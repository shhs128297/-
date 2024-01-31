const path = require('path');

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, 'client/src/contracts'), //合約編譯後的存放位置
  networks: {
    development: {
      host: 'localhost',
      port: 8545, 
      network_id: '*'
//      gas: 0xfffff729fff,
//      gasLimit: 0xfffffff,
//      gasPrice: 0xfffff
    }
  },
  solc: {
    optimizer: {
       enabled: true, // Default: false
       runs: 200 // Default: 200
    }
  }

};