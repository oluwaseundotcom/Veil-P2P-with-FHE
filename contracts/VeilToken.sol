// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import "fhevm/lib/TFHE.sol";
import "fhevm/abstracts/EERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title VeilToken (Confidential USDT)
 * @dev Implementation of a confidential token using Zama's fhEVM.
 * Balances are encrypted using TFHE (Threshold Fully Homomorphic Encryption).
 */
contract VeilToken is EERC20, Ownable {
    // Mapping from address to encrypted balance
    // euint64 is an encrypted 64-bit unsigned integer
    mapping(address => euint64) internal _balances;

    constructor() EERC20("Veil Confidential USDT", "cUSDT") Ownable(msg.sender) {
        // Mint initial supply to the owner (encrypted)
        _balances[msg.sender] = TFHE.asEuint64(1000000);
    }

    /**
     * @dev Confidential transfer. 
     * @param to Recipient address
     * @param encryptedAmount The amount to transfer, encrypted by the sender's public key
     */
    function transfer(address to, bytes calldata encryptedAmount) public virtual returns (bool) {
        euint64 amount = TFHE.asEuint64(encryptedAmount);
        
        // Requirement: sender must have enough balance
        // TFHE.le (less than or equal) returns an eb3 (encrypted boolean)
        // TFHE.optReq (optional requirement) reverts if the encrypted condition is false
        TFHE.optReq(TFHE.le(amount, _balances[msg.sender]));

        // Perform the homomorphic subtraction and addition
        // No one (including the validator) sees the actual numbers
        _balances[msg.sender] = TFHE.sub(_balances[msg.sender], amount);
        _balances[to] = TFHE.add(_balances[to], amount);

        emit Transfer(msg.sender, to, 0); // Standard ERC20 event with 0 value to maintain privacy
        return true;
    }

    /**
     * @dev Re-encryption for the user to view their own balance.
     * @param publicKey The user's temporary public key for re-encryption
     * @param signature Signature proving the user owns the address
     */
    function balanceView(
        bytes32 publicKey,
        bytes calldata signature
    ) public view returns (bytes memory) {
        // Zama's reencrypt function allows a user to see their private state
        // without revealing it to the blockchain or other users.
        return TFHE.reencrypt(_balances[msg.sender], publicKey, signature);
    }
}
