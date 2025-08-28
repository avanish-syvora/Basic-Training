// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IBingo
 * @author Avanish Garg
 * @notice Interface for a decentralized Bingo game contract.
 */
interface IBingo {
    // =============================================================
    //                           STRUCTS
    // =============================================================

    struct Player {
        uint256 board;
    }

    struct Game {
        uint96 entryFee;
        uint96 totalPrize;
        uint64 playerCount;
        address winner;
        uint64 joinDeadline;
        uint64 turnDuration;
        uint64 nextTurnTimestamp;
        uint256 drawnNumbersBitmap;
    }

    // =============================================================
    //                            EVENTS
    // =============================================================
    
    event GameCreated(uint256 indexed gameId, uint256 entryFee, uint256 joinDuration, uint256 turnDuration);
    event GameUpdated(uint256 indexed gameId, uint256 entryFee, uint256 joinDuration, uint256 turnDuration);
    event PlayerJoined(uint256 indexed gameId, address indexed player, uint256 playerCount);
    event GameStarted(uint256 indexed gameId);
    event NumberDrawn(uint256 indexed gameId, uint8 number);
    event WinnerClaimed(uint256 indexed gameId, address indexed winner, uint256 prizeAmount);

    // =============================================================
    //                      STATE-CHANGING FUNCTIONS
    // =============================================================
    
    function createGame(uint96 _entryFee, uint64 _joinDuration, uint64 _turnDuration) external;
    function updateGame(uint256 _gameId, uint96 _entryFee, uint64 _joinDuration, uint64 _turnDuration) external;
    function joinGame(uint256 _gameId) external;
    function drawNumber(uint256 _gameId) external;
    /**
     * @notice Allows any address to claim victory on behalf of a player.
     * @param _playerAddress The address of the player who has a winning board.
     */
    function claimBingo(uint256 _gameId, address _playerAddress) external;

    // =============================================================
    //                       VIEW FUNCTIONS
    // =============================================================

    function getGame(uint256 _gameId) external view returns (Game memory);
    function getPlayer(uint256 _gameId, address _playerAddress) external view returns (Player memory);
}