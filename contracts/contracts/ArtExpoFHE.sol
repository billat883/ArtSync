// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

interface IArtPassToken {
    function mintPass(address to, uint256 exhibitId) external returns (uint256 tokenId);
}

/// @title ArtExpo Manager with FHE-encrypted attendance counter
/// @notice Manages art exhibits and encrypted attendance; optional ArtPass minting
contract ArtExpoFHE is SepoliaConfig {
    struct Exhibit {
        uint256 id;
        address organizer;
        string metadataCID;
        uint64 startTime;
        uint64 endTime;
        bool enablePass;
        euint32 encryptedCount;
    }

    event ExhibitScheduled(uint256 indexed exhibitId, address indexed organizer);
    event CheckedIn(uint256 indexed exhibitId, address indexed attendee);

    IArtPassToken public immutable artPass;
    uint256 public nextExhibitId = 1;

    mapping(uint256 => Exhibit) private _exhibits;
    mapping(uint256 => mapping(address => bool)) private _hasCheckedIn;
    mapping(uint256 => mapping(address => bool)) private _passClaimed;

    constructor(address artPassToken) {
        artPass = IArtPassToken(artPassToken);
    }

    function scheduleExhibit(
        string calldata metadataCID,
        uint256 startTime,
        uint256 endTime,
        bool enablePass
    ) external returns (uint256 exhibitId) {
        require(bytes(metadataCID).length > 0, "empty cid");
        require(endTime > startTime && endTime > block.timestamp, "invalid time");

        exhibitId = nextExhibitId++;
        _exhibits[exhibitId] = Exhibit({
            id: exhibitId,
            organizer: msg.sender,
            metadataCID: metadataCID,
            startTime: uint64(startTime),
            endTime: uint64(endTime),
            enablePass: enablePass,
            encryptedCount: FHE.asEuint32(0)
        });

        FHE.allowThis(_exhibits[exhibitId].encryptedCount);
        FHE.allow(_exhibits[exhibitId].encryptedCount, msg.sender);

        emit ExhibitScheduled(exhibitId, msg.sender);
    }

    /// @notice Returns public exhibit info; encrypted count fetched with `getEncryptedAttendance`
    function getExhibit(uint256 exhibitId) external view returns (Exhibit memory) {
        Exhibit memory e = _exhibits[exhibitId];
        require(e.organizer != address(0), "not found");
        return e;
    }

    /// @notice Get exhibit header (without encrypted field)
    function getExhibitHeader(uint256 exhibitId)
        external
        view
        returns (
            uint256 id,
            address organizer,
            string memory metadataCID,
            uint64 startTime,
            uint64 endTime,
            bool enablePass
        )
    {
        Exhibit storage e = _exhibits[exhibitId];
        require(e.organizer != address(0), "not found");
        return (e.id, e.organizer, e.metadataCID, e.startTime, e.endTime, e.enablePass);
    }

    /// @notice Get encrypted attendee count handle
    function getEncryptedAttendance(uint256 exhibitId) external view returns (euint32) {
        Exhibit storage e = _exhibits[exhibitId];
        require(e.organizer != address(0), "not found");
        return e.encryptedCount;
    }

    function hasCheckedIn(uint256 exhibitId, address user) external view returns (bool) {
        return _hasCheckedIn[exhibitId][user];
    }

    /// @notice Encrypted check-in with FHE input verification (value 1)
    function checkInEncrypted(
        uint256 exhibitId,
        externalEuint32 oneEncrypted,
        bytes calldata inputProof
    ) external {
        Exhibit storage e = _exhibits[exhibitId];
        require(e.organizer != address(0), "not found");
        require(block.timestamp >= e.startTime && block.timestamp <= e.endTime, "not open");
        require(!_hasCheckedIn[exhibitId][msg.sender], "already in");

        euint32 one = FHE.fromExternal(oneEncrypted, inputProof);
        e.encryptedCount = FHE.add(e.encryptedCount, one);

        FHE.allowThis(e.encryptedCount);
        FHE.allow(e.encryptedCount, msg.sender);
        FHE.allow(e.encryptedCount, e.organizer);

        _hasCheckedIn[exhibitId][msg.sender] = true;

        emit CheckedIn(exhibitId, msg.sender);
    }

    /// @notice Whether user can mint a pass for the exhibit
    function canMintPass(uint256 exhibitId, address user) public view returns (bool) {
        Exhibit storage e = _exhibits[exhibitId];
        if (e.organizer == address(0)) return false;
        if (!e.enablePass) return false;
        if (!_hasCheckedIn[exhibitId][user]) return false;
        if (_passClaimed[exhibitId][user]) return false;
        return true;
    }

    /// @notice Mint pass if eligible
    function mintPass(uint256 exhibitId) external {
        require(canMintPass(exhibitId, msg.sender), "not eligible");
        _passClaimed[exhibitId][msg.sender] = true;
        artPass.mintPass(msg.sender, exhibitId);
    }
}



