// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./Token.sol";
import "hardhat/console.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol"; // Using Router02 for additional functionalities
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title TokenFactory
 * @dev Factory contract to create and manage Meme Tokens, handle their funding, and manage liquidity pools on Uniswap V2.
 */
contract TokenFactory is ReentrancyGuard {

    /**
     * @dev Struct representing a Meme Token.
     */
    struct MemeToken {
        string name;
        string symbol;
        string description;
        string tokenImageUrl;
        uint fundingRaised;
        address tokenAddress;
        address creatorAddress;
    }

    // Array to store all created Meme Token addresses
    address[] public memeTokenAddresses;

    // Mapping from Meme Token address to its details
    mapping(address => MemeToken) public addressToMemeTokenMapping;

    // **USDC Equivalent Details**
    IERC20 public constant USDC = IERC20(0xf805ce4F96e0EdD6f0b6cd4be22B34b92373d696); // Your Token Address on Sepolia
    uint256 public constant USDC_DECIMALS = 10 ** 18; // 18 decimals as per your token

    // **Constants**
    uint256 public constant MEMETOKEN_CREATION_PLATFORM_FEE = 1e17; // 0.1 USDC Equivalent
    uint256 public constant MEMECOIN_FUNDING_DEADLINE_DURATION = 10 days;
    uint256 public constant MEMECOIN_FUNDING_GOAL = 24 * USDC_DECIMALS; // 24 USDC Equivalent

    // **Uniswap V2 Addresses on Sepolia**
    address constant UNISWAP_V2_FACTORY_ADDRESS = 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f; // Replace with your Uniswap V2 Factory address
    address constant UNISWAP_V2_ROUTER_ADDRESS = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;   // Replace with your Uniswap V2 Router address

    // **Token Supply Constants**
    uint256 constant DECIMALS = 10 ** 18;
    uint256 constant MAX_SUPPLY = 1000000 * DECIMALS; // 1,000,000 tokens
    uint256 constant INIT_SUPPLY = 20 * MAX_SUPPLY / 100; // 20% of MAX_SUPPLY = 200,000 tokens

    // **Pricing Constants**
    uint256 public constant INITIAL_PRICE = 1e17;  // 0.1 USDC Equivalent
    uint256 public constant K = 8 * 10**15;  // Growth rate (k), scaled to avoid precision loss (0.01 * 10^18)

    // **Events**
    event MemeTokenCreated(address indexed tokenAddress, address indexed creator);
    event MemeTokenPurchased(address indexed buyer, address indexed tokenAddress, uint256 tokenQty, uint256 cost);
    event LiquidityProvided(address indexed tokenAddress, uint256 liquidity);
    event LPTokensBurned(address indexed pool, uint256 liquidity);

    /**
     * @notice Calculates the cost in USDC for purchasing a specific quantity of tokens based on the exponential bonding curve.
     * @param currentSupply The current supply of the token.
     * @param tokensToBuy The number of tokens the user wants to purchase.
     * @return cost The calculated cost in USDC.
     */
    function calculateCost(uint256 currentSupply, uint256 tokensToBuy) public pure returns (uint256) {
        // Calculate the exponent parts scaled to avoid precision loss
        uint256 exponent1 = (K * (currentSupply + tokensToBuy)) / 1e18;
        uint256 exponent2 = (K * currentSupply) / 1e18;

        // Calculate e^(kx) using the exp function
        uint256 exp1 = exp(exponent1);
        uint256 exp2 = exp(exponent2);

        // Cost formula: (P0 / k) * (e^(k * (currentSupply + tokensToBuy)) - e^(k * currentSupply))
        // We use (P0 * 1e18) / k to keep the division safe from zero
        uint256 cost = (INITIAL_PRICE * 1e18 * (exp1 - exp2)) / K;  // Adjust for k scaling without dividing by zero
        return cost;
    }

    /**
     * @notice Calculates e^x using a Taylor series approximation.
     * @param x The exponent input.
     * @return The calculated value of e^x.
     */
    function exp(uint256 x) internal pure returns (uint256) {
        uint256 sum = 1e18;  // Start with 1 * 1e18 for precision
        uint256 term = 1e18;  // Initial term = 1 * 1e18
        uint256 xPower = x;    // Initial power of x

        for (uint256 i = 1; i <= 20; i++) {  // Increase iterations for better accuracy
            term = (term * xPower) / (i * 1e18);  // x^i / i!
            sum += term;

            // Prevent overflow and unnecessary calculations
            if (term < 1) break;
        }

        return sum;
    }

    /**
     * @notice Creates a new Meme Token.
     * @param name Name of the meme token.
     * @param symbol Symbol of the meme token.
     * @param imageUrl URL of the token image.
     * @param description Description of the meme token.
     * @return memeTokenAddress Address of the newly created meme token.
     */
    function createMemeToken(
        string memory name, 
        string memory symbol, 
        string memory imageUrl, 
        string memory description
    ) 
        public 
        nonReentrant
        returns(address) 
    {
        console.log("Starting createMemeToken");

        // **Transfer Platform Fee in USDC Equivalent**
        bool feeTransfer = USDC.transferFrom(msg.sender, address(this), MEMETOKEN_CREATION_PLATFORM_FEE);
        console.log("Fee Transfer Success:", feeTransfer);
        require(feeTransfer, "USDC transfer failed");

        // **Deploy the New Meme Token**
        Token ct = new Token(name, symbol, INIT_SUPPLY, MAX_SUPPLY);
        address memeTokenAddress = address(ct);
        console.log("Meme Token Address:", memeTokenAddress);
        
        // **Create MemeToken Struct**
        MemeToken memory newlyCreatedToken = MemeToken(
            name, 
            symbol, 
            description, 
            imageUrl, 
            0, 
            memeTokenAddress, 
            msg.sender
        );
        
        // **Store the Token**
        memeTokenAddresses.push(memeTokenAddress);
        addressToMemeTokenMapping[memeTokenAddress] = newlyCreatedToken;
        console.log("MemeToken Struct Stored");

        emit MemeTokenCreated(memeTokenAddress, msg.sender);
        
        return memeTokenAddress;
    }

    /**
     * @notice Retrieves all created Meme Tokens.
     * @return allTokens Array of all MemeToken structs.
     */
    function getAllMemeTokens() public view returns(MemeToken[] memory) {
        MemeToken[] memory allTokens = new MemeToken[](memeTokenAddresses.length);
        for (uint256 i = 0; i < memeTokenAddresses.length; i++) {
            allTokens[i] = addressToMemeTokenMapping[memeTokenAddresses[i]];
        }
        return allTokens;
    }

    /**
     * @notice Buys Meme Tokens using USDC Equivalent.
     * @param memeTokenAddress Address of the meme token to buy.
     * @param tokenQty Quantity of tokens to buy.
     * @return success Indicator of successful purchase.
     */
    function buyMemeToken(address memeTokenAddress, uint256 tokenQty) public nonReentrant returns(uint256) {

        // **Check if Meme Token is Listed**
        require(
            addressToMemeTokenMapping[memeTokenAddress].tokenAddress != address(0), 
            "Token is not listed"
        );
        
        MemeToken storage listedToken = addressToMemeTokenMapping[memeTokenAddress];
        Token memeTokenCt = Token(memeTokenAddress);

        // **Ensure Funding Goal is Not Met**
        require(
            listedToken.fundingRaised <= MEMECOIN_FUNDING_GOAL, 
            "Funding has already been raised"
        );

        // **Check Available Supply**
        uint256 currentSupply = memeTokenCt.totalSupply();
        uint256 available_qty = MAX_SUPPLY - currentSupply;

        require(available_qty >= tokenQty, "Not enough available supply");

        // **Calculate the Cost in USDC Equivalent**
        uint256 currentSupplyScaled = (currentSupply - INIT_SUPPLY) / DECIMALS;
        uint256 requiredUSDC = calculateCost(currentSupplyScaled, tokenQty);

        console.log("USDC required for purchasing meme tokens is ", requiredUSDC);

        // **Transfer USDC from User to Contract**
        bool usdcTransfer = USDC.transferFrom(msg.sender, address(this), requiredUSDC);
        console.log("USDC Transfer Success:", usdcTransfer);
        require(usdcTransfer, "USDC transfer failed");

        emit MemeTokenPurchased(msg.sender, memeTokenAddress, tokenQty, requiredUSDC);

        // **Increment the Funding**
        listedToken.fundingRaised += requiredUSDC;

        if (listedToken.fundingRaised >= MEMECOIN_FUNDING_GOAL) {
            // **Create Liquidity Pool**
            address pool = _createLiquidityPool(memeTokenAddress);
            console.log("Pool address ", pool);

            // **Provide Liquidity**
            uint256 tokenAmount = INIT_SUPPLY;
            uint256 usdcAmount = listedToken.fundingRaised;
            uint256 liquidity = _provideLiquidity(memeTokenAddress, tokenAmount, usdcAmount);
            console.log("Uniswap provided liquidity ", liquidity);

            emit LiquidityProvided(memeTokenAddress, liquidity);

            // **Burn LP Tokens**
            _burnLpTokens(pool, liquidity);
        }

        // **Mint the Tokens to Buyer**
        memeTokenCt.mint(tokenQty, msg.sender); // tokenQty already in 18 decimals

        console.log("User balance of the tokens is ", memeTokenCt.balanceOf(msg.sender));
        console.log("New available qty ", MAX_SUPPLY - memeTokenCt.totalSupply());

        return 1;
    }

    /**
     * @notice Creates a liquidity pool for the meme token and USDC Equivalent.
     * @param memeTokenAddress Address of the meme token.
     * @return pair Address of the created liquidity pool.
     */
    function _createLiquidityPool(address memeTokenAddress) internal returns(address) {
        IUniswapV2Factory factory = IUniswapV2Factory(UNISWAP_V2_FACTORY_ADDRESS);
        address pair = factory.createPair(memeTokenAddress, address(USDC));
        return pair;
    }

    /**
     * @notice Provides liquidity to the Uniswap pool.
     * @param memeTokenAddress Address of the meme token.
     * @param tokenAmount Amount of meme tokens to add.
     * @param usdcAmount Amount of USDC Equivalent to add.
     * @return liquidity Amount of liquidity tokens minted.
     */
    function _provideLiquidity(address memeTokenAddress, uint256 tokenAmount, uint256 usdcAmount) internal returns(uint256){
        Token memeTokenCt = Token(memeTokenAddress);
        
        // **Approve Uniswap Router to Spend Tokens and USDC Equivalent**
        bool tokenApprove = memeTokenCt.approve(UNISWAP_V2_ROUTER_ADDRESS, tokenAmount);
        console.log("Token Approval Success:", tokenApprove);
        require(tokenApprove, "Token approval failed");

        bool usdcApprove = USDC.approve(UNISWAP_V2_ROUTER_ADDRESS, usdcAmount);
        console.log("USDC Approval Success:", usdcApprove);
        require(usdcApprove, "USDC approval failed");
        
        IUniswapV2Router02 router = IUniswapV2Router02(UNISWAP_V2_ROUTER_ADDRESS);
        
        // **Add Liquidity Without ETH**
        (uint256 amountToken, uint256 amountUSDC, uint256 liquidity) = router.addLiquidity(
            memeTokenAddress,
            address(USDC),
            tokenAmount,
            usdcAmount,
            tokenAmount,
            usdcAmount,
            address(this),
            block.timestamp
        );
        
        return liquidity;
    }

    /**
     * @notice Burns the liquidity pool tokens by sending them to the zero address.
     * @param pool Address of the liquidity pool.
     * @param liquidity Amount of liquidity tokens to burn.
     * @return success Indicator of successful burn.
     */
    function _burnLpTokens(address pool, uint256 liquidity) internal returns(uint256){
        IUniswapV2Pair uniswapv2pairct = IUniswapV2Pair(pool);
        bool transferSuccess = uniswapv2pairct.transfer(address(0), liquidity);
        console.log("LP Token Transfer Success:", transferSuccess);
        require(transferSuccess, "LP burn failed");
        console.log("Uni v2 tokens burnt");
        
        emit LPTokensBurned(pool, liquidity);
        
        return 1;
    }

}
