pragma solidity >=0.4.21 <0.7.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Identity.sol";

contract TestIdentity {

  function testItStoresAValue() public {
    Identity Identity = Identity(DeployedAddresses.Identity());

    Identity.set(89);

    uint expected = 89;

    Assert.equal(Identity.get(), expected, "It should store the value 89.");
  }

}
