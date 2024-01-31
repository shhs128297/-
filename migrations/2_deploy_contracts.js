var Identity = artifacts.require("./Identity.sol");
var FileCrypto = artifacts.require("./FileCrypto.sol");
var AllContract = artifacts.require("./AllContract.sol");

module.exports = function(deployer) {

  deployer.deploy(Identity)
  // 等待、直到合约部署完成
  .then(() => Identity.deployed())
  // 传递 Storage 合约地址，部署 InfoManager 合约          
 
  .then(() => deployer.deploy(FileCrypto))

  .then(() => FileCrypto.deployed())
  // 传递 Storage 合约地址，部署 InfoManager 合约          
 
  .then(() => deployer.deploy(AllContract));

} ;

