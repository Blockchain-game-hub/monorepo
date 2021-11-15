const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RaribleRoyaltyERC721 Test", () => {
  let royaltyNFT;

  before(async () => {
    [deployer, account1, account2] = await ethers.getSigners();
    const RoyaltyNFT = await ethers.getContractFactory("PortalsMembershipNFT");
    royaltyNFT = await RoyaltyNFT.deploy(
      "Creator",
      "CREATOR",
      deployer.address
    );
    await royaltyNFT.deployed();
  });

  describe("Mint token and set royalty", async () => {
    it("mint two tokens and set two different royalties", async () => {
      // Basis points
      const royalty10Percent = 1000;
      const royalty20Percent = 1000;
      const portalRoyaltyPercent = 250;

      await royaltyNFT.connect(account1).mint();
      await royaltyNFT
        .connect(deployer)
        .setRoyalties(0, account1.address, royalty10Percent);

      await royaltyNFT.connect(account1).mint();
      await royaltyNFT
        .connect(deployer)
        .setRoyalties(1, account1.address, royalty20Percent);

      const token0Royalty = await royaltyNFT.getRaribleV2Royalties(0);
      const token1Royalty = await royaltyNFT.getRaribleV2Royalties(1);

      expect(token0Royalty[0][1]).to.equal(portalRoyaltyPercent);
      expect(token1Royalty[0][1]).to.equal(portalRoyaltyPercent);

      expect(token0Royalty[1][1]).to.equal(royalty10Percent);
      expect(token1Royalty[1][1]).to.equal(royalty20Percent);
    });
  });
});
