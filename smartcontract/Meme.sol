// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./Token.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

contract TokenFactory {
    IERC20 public stableCoin; // USDE Stablecoin interface
    address public stableCoinAddress; // Address of the stablecoin (e.g., USDC, DAI)

    struct MemeToken {
        string name;
        string symbol;
        string description;
        string tokenImageUrl;
        uint fundingRaised;
        address tokenAddress;
        address creatorAddress;
    }

    address[] public memeTokenAddresses;
    mapping(address => MemeToken) public addressToMemeTokenMapping;

    uint constant DECIMALS = 18;
    uint constant MAX_SUPPLY = 1000000 * (10**DECIMALS);
    uint constant INIT_SUPPLY = 200000 * (10**DECIMALS); // 20% of MAX_SUPPLY

    uint constant MEMETOKEN_CREATION_PLATFORM_FEE = 1 * (10**DECIMALS); // Fee in stablecoin decimals
    uint constant MEMECOIN_FUNDING_GOAL = 1 * (10**DECIMALS); // Goal in stablecoin decimals

    address constant UNISWAP_V2_FACTORY_ADDRESS = 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f;
    address constant UNISWAP_V2_ROUTER_ADDRESS = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;

    constructor(address _stableCoinAddress) {
        stableCoin = IERC20(_stableCoinAddress);
        stableCoinAddress = _stableCoinAddress;
    }

    function createMemeToken(string memory name, string memory symbol, string memory imageUrl, string memory description) public returns(address) {
        require(stableCoin.transferFrom(msg.sender, address(this), MEMETOKEN_CREATION_PLATFORM_FEE), "Fee transfer failed");
        Token newToken = new Token(name, symbol, INIT_SUPPLY);
        address memeTokenAddress = address(newToken);
        MemeToken memory newMemeToken = MemeToken(name, symbol, description, imageUrl, 0, memeTokenAddress, msg.sender);
        memeTokenAddresses.push(memeTokenAddress);
        addressToMemeTokenMapping[memeTokenAddress] = newMemeToken;
        return memeTokenAddress;
    }

    function buyMemeToken(address memeTokenAddress, uint tokenQty) public {
        require(addressToMemeTokenMapping[memeTokenAddress].tokenAddress != address(0), "Token is not listed");
        MemeToken storage listedToken = addressToMemeTokenMapping[memeTokenAddress];
        require(listedToken.fundingRaised <= MEMECOIN_FUNDING_GOAL, "Funding goal reached");
        uint currentSupply = Token(memeTokenAddress).totalSupply();
        uint availableQty = MAX_SUPPLY - currentSupply;
        require(tokenQty <= availableQty, "Insufficient supply");
        uint requiredUSD = calculateCost(currentSupply, tokenQty);
        require(stableCoin.transferFrom(msg.sender, address(this), requiredUSD), "Payment failed");
        listedToken.fundingRaised += requiredUSD;
        if (listedToken.fundingRaised >= MEMECOIN_FUNDING_GOAL) {
            address pool = _createLiquidityPool(memeTokenAddress);
            uint liquidity = _provideLiquidity(memeTokenAddress, INIT_SUPPLY, listedToken.fundingRaised);
            _burnLpTokens(pool, liquidity);
        }
        Token(memeTokenAddress).mint(tokenQty, msg.sender);
    }

    // Dummy implementation, adjust the function as necessary
    function calculateCost(uint currentSupply, uint tokenQty) internal pure returns (uint) {
        return tokenQty * 1 ether; // Example: Each token costs 1 USDE
    }

    function _createLiquidityPool(address memeTokenAddress) internal returns(address) {
        IUniswapV2Factory factory = IUniswapV2Factory(UNISWAP_V2_FACTORY_ADDRESS);
        address pair = factory.createPair(memeTokenAddress, stableCoinAddress);
        return pair;
    }

    function _provideLiquidity(address memeTokenAddress, uint tokenAmount, uint usdeAmount) internal returns(uint) {
        Token(memeTokenAddress).approve(UNISWAP_V2_ROUTER_ADDRESS, tokenAmount);
        stableCoin.approve(UNISWAP_V2_ROUTER_ADDRESS, usdeAmount);
        IUniswapV2Router02 router = IUniswapV2Router02(UNISWAP_V2_ROUTER_ADDRESS);
        (uint amountToken, uint amountUSD, uint liquidity) = router.addLiquidity(
            memeTokenAddress,
            stableCoinAddress,
            tokenAmount,
            usdeAmount,
            0, // min amount tokens
            0, // min amount usde
            address(this),
            block.timestamp
        );
        return liquidity;
    }

    function _burnLpTokens(address pool, uint liquidity) internal {
        IUniswapV2Pair uniswapPair = IUniswapV2Pair(pool);
        uniswapPair.transfer(address(0), liquidity);
    }
}
