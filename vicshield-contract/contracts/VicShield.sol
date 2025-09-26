// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title MerkleAgreement
 * @notice On-chain registry for "online contracts" (agreements) signed via Merkle proofs.
 * @dev Leaf formula: keccak256(abi.encodePacked(signer, docHash)) — binds signer to a specific document.
 *      Build the Merkle tree off-chain from the allowed signer set.
 */
import {MerkleProof} from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract VicShield {
    struct Agreement {
        address creator;
        bytes32 docHash; // Hash of the document file (e.g., keccak256 of PDF bytes or IPFS CID digest)
        bytes32 merkleRoot; // Root of allowed signers for this doc (leaf = keccak256(abi.encodePacked(addr, docHash)))
        string uri; // Optional metadata URI (e.g., IPFS link to the file)
        uint64 createdAt;
        uint64 deadline; // unix seconds; 0 = no deadline
        uint32 requiredSignatures; // 0 => no threshold; track all signers allowed
        uint32 signedCount; // number of unique signers who signed
        bool closed; // creator can close early; also closes when deadline passed conditionally
        mapping(address => bool) signed; // signer => signed?
    }

    uint256 public nextId;
    mapping(uint256 => Agreement) private _agreements;

    event AgreementCreated(
        uint256 indexed id,
        address indexed creator,
        bytes32 indexed docHash,
        bytes32 merkleRoot,
        uint64 deadline,
        uint32 requiredSignatures,
        string uri
    );
    event AgreementSigned(uint256 indexed id, address indexed signer);
    event AgreementClosed(uint256 indexed id, address indexed closer);

    error NotCreator();
    error AlreadyClosed();
    error PastDeadline();
    error NotAllowedSigner();
    error AlreadySigned();
    error InvalidParams();

    /**
     * @notice Create a new agreement
     * @param docHash keccak256 hash of the raw document (or a stable content hash you use)
     * @param merkleRoot Merkle root of allowed signers (leaf = keccak256(abi.encodePacked(signer, docHash)))
     * @param uri Optional metadata URI
     * @param deadline Unix timestamp; 0 for no deadline
     * @param requiredSignatures Minimal signatures to consider "complete"; 0 if not needed
     * @return id Agreement id
     */
    function createAgreement(
        bytes32 docHash,
        bytes32 merkleRoot,
        string calldata uri,
        uint64 deadline,
        uint32 requiredSignatures
    ) external returns (uint256 id) {
        if (merkleRoot == bytes32(0) || docHash == bytes32(0)) revert InvalidParams();
        id = ++nextId;
        Agreement storage a = _agreements[id];
        a.creator = msg.sender;
        a.docHash = docHash;
        a.merkleRoot = merkleRoot;
        a.uri = uri;
        a.createdAt = uint64(block.timestamp);
        a.deadline = deadline;
        a.requiredSignatures = requiredSignatures;

        emit AgreementCreated(id, msg.sender, docHash, merkleRoot, deadline, requiredSignatures, uri);
    }

    /**
     * @notice Sign an agreement by proving inclusion in its Merkle tree.
     * @param id Agreement id
     * @param proof Merkle proof for leaf = keccak256(abi.encodePacked(msg.sender, docHash))
     */
    function sign(uint256 id, bytes32[] calldata proof) external {
        Agreement storage a = _agreements[id];
        if (a.creator == address(0)) revert InvalidParams(); // not exists
        if (a.closed) revert AlreadyClosed();
        if (a.deadline != 0 && block.timestamp > a.deadline) revert PastDeadline();
        if (a.signed[msg.sender]) revert AlreadySigned();

        bytes32 leaf = keccak256(abi.encodePacked(msg.sender, a.docHash));
        bool ok = MerkleProof.verify(proof, a.merkleRoot, leaf);
        if (!ok) revert NotAllowedSigner();

        a.signed[msg.sender] = true;
        unchecked {
            a.signedCount += 1;
        }

        emit AgreementSigned(id, msg.sender);

        // Auto-close if reached threshold
        if (a.requiredSignatures != 0 && a.signedCount >= a.requiredSignatures) {
            a.closed = true;
            emit AgreementClosed(id, address(this));
        }
    }

    /**
     * @notice Manually close an agreement (by creator). Useful to prevent late signatures.
     */
    function close(uint256 id) external {
        Agreement storage a = _agreements[id];
        if (a.creator != msg.sender) revert NotCreator();
        if (a.closed) revert AlreadyClosed();
        a.closed = true;
        emit AgreementClosed(id, msg.sender);
    }

    // -------------------- Views --------------------

    function getMeta(
        uint256 id
    )
        external
        view
        returns (
            address creator,
            bytes32 docHash,
            bytes32 merkleRoot,
            string memory uri,
            uint64 createdAt,
            uint64 deadline,
            uint32 requiredSignatures,
            uint32 signedCount,
            bool closed
        )
    {
        Agreement storage a = _agreements[id];
        return (
            a.creator,
            a.docHash,
            a.merkleRoot,
            a.uri,
            a.createdAt,
            a.deadline,
            a.requiredSignatures,
            a.signedCount,
            a.closed
        );
    }

    function hasSigned(uint256 id, address account) external view returns (bool) {
        return _agreements[id].signed[account];
    }
}
