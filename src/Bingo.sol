// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20; // Note: Your code used ^0.8.30, but the logic is compatible with ^0.8.20.

import "./IBingo.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Bingo
 * @author Avanish Garg
 * @notice A fully on-chain Bingo game where players use ERC20 tokens to join, compete,
 * and win a prize pool based on randomly drawn numbers.
 */
contract Bingo is IBingo, Ownable {
    using SafeERC20 for IERC20;

    // =============================================================
    //                           CONSTANTS
    // =============================================================

    /// @notice A bitmask for the free middle square (index 12) on a 5x5 board.
    uint256 public constant MIDDLE_SQUARE_MASK = 1 << 12;
    /// @notice A bitmask to isolate a single 8-bit number from a packed board state.
    uint256 private constant NUMBER_MASK = 0xff; // 0b11111111

    /**
     * @dev An array of bitmaps representing the 12 possible winning lines on a 5x5 board.
     * Each bit corresponds to a square on the board, from top-left (bit 24) to bottom-right (bit 0).
     */
    uint256[12] private winningLines = [
        0b11111_00000_00000_00000_00000, // Row 1
        0b00000_11111_00000_00000_00000, // Row 2
        0b00000_00000_11111_00000_00000, // Row 3
        0b00000_00000_00000_11111_00000, // Row 4
        0b00000_00000_00000_00000_11111, // Row 5
        0b10000_10000_10000_10000_10000, // Col 1
        0b01000_01000_01000_01000_01000, // Col 2
        0b00100_00100_00100_00100_00100, // Col 3
        0b00010_00010_00010_00010_00010, // Col 4
        0b00001_00001_00001_00001_00001, // Col 5
        0b10000_01000_00100_00010_00001, // Diagonal 1 (Top-Left to Bottom-Right)
        0b00001_00010_00100_01000_10000  // Diagonal 2 (Top-Right to Bottom-Left)
    ];

    // =============================================================
    //                         STATE VARIABLES
    // =============================================================

    /// @notice The ERC20 token used for entry fees and prize payouts.
    IERC20 public immutable token;
    /// @notice A counter to ensure each new game gets a unique ID.
    uint256 public nextGameId;

    /// @notice Mapping from a game ID to its core game data.
    mapping(uint256 => Game) public games;
    /// @notice Mapping from a game ID to a player's address to their player data (board).
    mapping(uint256 => mapping(address => Player)) public playerData;

    // =============================================================
    //                           CONSTRUCTOR
    // =============================================================

    /**
     * @notice Initializes the contract by setting the game's ERC20 token.
     * @param _tokenAddress The address of the ERC20 token to be used.
     */
    constructor(address _tokenAddress) Ownable(msg.sender) {
        token = IERC20(_tokenAddress);
    }

    // =============================================================
    //                      OWNER FUNCTIONS
    // =============================================================

    /**
     * @notice Creates a new Bingo game with specified parameters.
     * @dev Can only be called by the contract owner.
     * @param _entryFee The fee required for a player to join the game.
     * @param _joinDuration The duration in seconds that the game is open for players to join.
     * @param _turnDuration The delay in seconds between each number draw.
     */
    function createGame(uint96 _entryFee, uint64 _joinDuration, uint64 _turnDuration) external onlyOwner {
        uint256 gameId = nextGameId;
        games[gameId] = Game({
            entryFee: _entryFee, totalPrize: 0, playerCount: 0,
            winner: address(0), joinDeadline: uint64(block.timestamp) + _joinDuration,
            turnDuration: _turnDuration, nextTurnTimestamp: 0, drawnNumbersBitmap: 0
        });
        emit GameCreated(gameId, _entryFee, _joinDuration, _turnDuration);
        nextGameId++;
    }

    /**
     * @notice Updates the parameters of a game that has not yet started.
     * @dev Can only be called by the owner. Fails if players have already joined.
     * @param _gameId The ID of the game to update.
     * @param _entryFee The new entry fee.
     * @param _joinDuration The new join duration.
     * @param _turnDuration The new turn duration.
     */
    function updateGame(uint256 _gameId, uint96 _entryFee, uint64 _joinDuration, uint64 _turnDuration) external onlyOwner {
        Game storage game = games[_gameId];
        require(game.winner == address(0), "Game has already ended");
        require(game.playerCount == 0, "Cannot update a game with players");
        game.entryFee = _entryFee;
        game.joinDeadline = uint64(block.timestamp) + _joinDuration;
        game.turnDuration = _turnDuration;
        emit GameUpdated(_gameId, _entryFee, _joinDuration, _turnDuration);
    }

    // =============================================================
    //                      PUBLIC USER FUNCTIONS
    // =============================================================

    /**
     * @notice Allows a player to join a game by paying the entry fee.
     * @dev The player must have approved the contract to spend the entry fee amount.
     * @param _gameId The ID of the game to join.
     */
    function joinGame(uint256 _gameId) external {
        Game storage game = games[_gameId];
        require(block.timestamp <= game.joinDeadline, "Join period is over");
        require(playerData[_gameId][msg.sender].board == 0, "Already joined");

        token.safeTransferFrom(msg.sender, address(this), game.entryFee);
        game.totalPrize += game.entryFee;

        uint64 newPlayerIndex = game.playerCount;
        game.playerCount++;

        playerData[_gameId][msg.sender] = Player({
            board: _generateBoard(_gameId, newPlayerIndex)
        });

        emit PlayerJoined(_gameId, msg.sender, game.playerCount);
    }

    /**
     * @notice Draws a new number for a game if the turn time has passed.
     * @dev Can be called by anyone, allowing for decentralized game progression.
     * @param _gameId The ID of the game to draw a number for.
     */
    function drawNumber(uint256 _gameId) external {
        Game storage game = games[_gameId];

        if (game.nextTurnTimestamp == 0) {
            require(block.timestamp > game.joinDeadline, "Join period not over");
            game.nextTurnTimestamp = uint64(block.timestamp) + game.turnDuration;
            emit GameStarted(_gameId);
        } else {
            require(block.timestamp >= game.nextTurnTimestamp, "Not time for the next turn");
            game.nextTurnTimestamp = uint64(block.timestamp) + game.turnDuration;
        }

        require(game.winner == address(0), "Game has already been won");

        uint8 newNumber;
        for (uint256 i = 0; i < 10; ++i) { 
            newNumber = _generateRandomNumber(i);
            if ((game.drawnNumbersBitmap & (uint256(1) << newNumber)) == 0) {
                break;
            }
        }
        
        require((game.drawnNumbersBitmap & (uint256(1) << newNumber)) == 0, "Could not find a new number");

        game.drawnNumbersBitmap |= (uint256(1) << newNumber);
        emit NumberDrawn(_gameId, newNumber);
    }

    /**
     * @notice Allows any address to claim victory on behalf of a player with a winning board.
     * @dev The prize is transferred to the winning player, not the caller.
     * @param _gameId The ID of the game.
     * @param _playerAddress The address of the player who is believed to have a winning board.
     */
    function claimBingo(uint256 _gameId, address _playerAddress) external {
        Game storage game = games[_gameId];
        require(game.winner == address(0), "A winner has already been claimed");
        require(playerData[_gameId][_playerAddress].board != 0, "Player is not in this game");

        uint256 markedBoard = _getUpdatedMarkedBoard(_gameId, _playerAddress);
        
        bool hasBingo = false;
        for (uint256 i = 0; i < 12; ++i) {
            if ((markedBoard & winningLines[i]) == winningLines[i]) {
                hasBingo = true;
                break;
            }
        }
        require(hasBingo, "Player does not have a winning line");

        game.winner = _playerAddress;

        uint256 prize = game.totalPrize;
        token.safeTransfer(_playerAddress, prize);

        emit WinnerClaimed(_gameId, _playerAddress, prize);
    }

    // =============================================================
    //                  INTERNAL & VIEW FUNCTIONS
    // =============================================================

    /**
     * @notice Generates a pseudo-random number.
     * @dev INSECURE. Do NOT use in production for high value. Vulnerable to miner manipulation.
     * @param salt A value to add entropy to the hash.
     * @return A pseudo-random number between 0 and 255.
     */
    function _generateRandomNumber(uint256 salt) private view returns (uint8) {
        return uint8(uint256(keccak256(abi.encodePacked(blockhash(block.number - 1), block.timestamp, salt))));
    }

    /**
     * @notice Generates a 5x5 board with 25 pseudo-random numbers.
     * @dev Packs 25 `uint8` numbers into a single `uint256` for gas efficiency.
     * @param _gameId The ID of the current game.
     * @param _playerIndex The sequential index of the joining player.
     * @return The packed board as a uint256.
     */
    function _generateBoard(uint256 _gameId, uint256 _playerIndex) private view returns (uint256) {
        uint256 packedBoard;
        for (uint256 i = 0; i < 25; ++i) {
            uint256 randomNumber = _generateRandomNumber(i + _playerIndex + _gameId);
            packedBoard |= (randomNumber << (i * 8));
        }
        return packedBoard;
    }

    /**
     * @notice Calculates a player's marked board in memory by comparing their board to drawn numbers.
     * @dev This is a view-like calculation performed at the time of claim to save gas,
     * avoiding expensive storage updates for every player on every number draw.
     * @param _gameId The ID of the current game.
     * @param _player The address of the player whose marked board is being calculated.
     * @return A bitmap of the player's marked squares.
     */
    function _getUpdatedMarkedBoard(uint256 _gameId, address _player) internal view returns (uint256) {
        Player storage player = playerData[_gameId][_player];
        uint256 currentMarkedBoard = MIDDLE_SQUARE_MASK;
        uint256 drawnNumbers = games[_gameId].drawnNumbersBitmap;

        for (uint256 i = 0; i < 25; ++i) {
            uint256 boardNumber = (player.board >> (i * 8)) & NUMBER_MASK;
            if ((drawnNumbers & (uint256(1) << boardNumber)) != 0) {
                currentMarkedBoard |= (uint256(1) << i);
            }
        }
        return currentMarkedBoard;
    }

    // =============================================================
    //                       GETTER FUNCTIONS
    // =============================================================

    /**
     * @notice Retrieves the main data for a specific game.
     * @param _gameId The ID of the game to query.
     * @return game The Game struct containing all data for the specified game.
     */
    function getGame(uint256 _gameId) external view returns (Game memory game) {
        return games[_gameId];
    }

    /**
     * @notice Retrieves the data for a specific player in a game.
     * @param _gameId The ID of the game the player is in.
     * @param _playerAddress The address of the player to query.
     * @return player The Player struct for the specified address.
     */
    function getPlayer(uint256 _gameId, address _playerAddress) external view returns (Player memory player) {
        require(playerData[_gameId][_playerAddress].board != 0, "Player not found");
        return playerData[_gameId][_playerAddress];
    }
}