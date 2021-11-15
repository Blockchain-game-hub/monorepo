//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./rarible/impl/RoyaltiesV2Impl.sol";
import "./rarible/LibPart.sol";
import "./rarible/LibRoyaltiesV2.sol";

contract PortalsMembershipNFT is ERC721URIStorage, Ownable, RoyaltiesV2Impl {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    uint96 PORTALS_ROYALTY_BASIS_POINTS = 250; // 2.5%
    address payable PORTALS_DAO_ADDRESS;

    constructor(
        string memory name,
        string memory symbol,
        address payable _portalsAddress
    )
        ERC721(
            string(abi.encodePacked("Portals: ", name)),
            string(abi.encodePacked("PORTALS_", symbol))
        )
    {
        PORTALS_DAO_ADDRESS = _portalsAddress;
        _tokenIds.increment();
    }

    event NFTMinted(address sender, uint256 tokenId);

    function mint() external {
        uint256 newItemId = _tokenIds.current();
        _safeMint(msg.sender, newItemId);

        console.log("Minted NFT # %s for %s", newItemId, msg.sender);
        emit NFTMinted(msg.sender, newItemId);
        _tokenIds.increment();
    }

    function setTokenURI(uint256 _tokenId, string memory _tokenURI)
        external
        onlyOwner
    {
        _setTokenURI(_tokenId, _tokenURI);
    }

    function setRoyalties(
        uint256 _tokenId,
        address payable _royaltiesRecipientAddress,
        uint96 _percentageBasisPoints
    ) public onlyOwner {
        LibPart.Part[] memory _royalties = new LibPart.Part[](2);
        _royalties[0].value = PORTALS_ROYALTY_BASIS_POINTS;
        _royalties[0].account = PORTALS_DAO_ADDRESS;

        _royalties[1].value = _percentageBasisPoints;
        _royalties[1].account = _royaltiesRecipientAddress;

        _saveRoyalties(_tokenId, _royalties);
    }
}
