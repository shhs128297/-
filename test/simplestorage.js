const Identity = artifacts.require("./Identity.sol");

contract("Identity", accounts => {
  it("...should store the value 89.", async () => {
    const IdentityInstance = await Identity.deployed();

    // Set value of 89
    await IdentityInstance.set(89, { from: accounts[0] });

    // Get stored value
    const storedData = await IdentityInstance.get.call();

    assert.equal(storedData, 89, "The value 89 was not stored.");
  });
});
