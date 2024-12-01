// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title Token
 * @dev ERC20 Token with a maximum supply and minting restricted to the TokenFactory.
 */
contract Token is ERC20 {
    // Address of the TokenFactory contract
    address public minter;

    // Maximum supply of the token
    uint256 public maxSupply;

    /**
     * @dev Sets the values for {name}, {symbol}, {initialSupply}, and {maxSupply}.
     * All four of these values are immutable: they can only be set once during
     * construction.
     *
     * Requirements:
     *
     * - `initialSupply` must not exceed `maxSupply`.
     */
    constructor(
        string memory name_,
        string memory symbol_,
        uint256 initialSupply_,
        uint256 maxSupply_
    ) ERC20(name_, symbol_) {
        require(initialSupply_ <= maxSupply_, "Initial supply exceeds max supply");
        minter = msg.sender;
        maxSupply = maxSupply_;
        _mint(msg.sender, initialSupply_);
    }

    /**
     * @dev Mints `amount` tokens to address `to`.
     *
     * Requirements:
     *
     * - Only the TokenFactory can call this function.
     * - The total supply after minting must not exceed `maxSupply`.
     */
    function mint(uint256 amount, address to) external {
        require(msg.sender == minter, "Only TokenFactory can mint");
        require(totalSupply() + amount <= maxSupply, "Minting exceeds max supply");
        _mint(to, amount);
    }
}
