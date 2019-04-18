import gameConstants from '../constants/gameConstants';

const initializeGamesInfo = gamesInfo => ({
    type: gameConstants.GAMES_INFO_INITIALIZATION,
    payload: gamesInfo
});

const updateGamesInfoAfterAddition = gamesInfo => ({
    type: gameConstants.GAMES_INFO_UPDATE_AFTER_ADDITION,
    payload: gamesInfo
});

const updateGamesInfoAfterDeletion = gameId => ({
    type: gameConstants.GAMES_INFO_UPDATE_AFTER_DELETION,
    payload: gameId
});

const initializeGameInfo = gameInfo => ({
    type: gameConstants.GAME_INFO_INITIALIZATION,
    payload: gameInfo
});

const updateGameInfoAfterResultSaving = gameInfo => ({
    type: gameConstants.GAME_INFO_UPDATE_AFTER_RESULT_SAVING,
    payload: gameInfo
});

const initializeGameLevel = gameLevel => ({
    type: gameConstants.GAME_LEVEL_INITIALIZATION,
    payload: gameLevel
});

const updateGameLevelAfterResultSaving = gameLevel => ({
    type: gameConstants.GAME_LEVEL_UPDATE_AFTER_RESULT_SAVING,
    payload: gameLevel
});

export default {
    initializeGamesInfo,
    updateGamesInfoAfterAddition,
    updateGamesInfoAfterDeletion,
    initializeGameInfo,
    updateGameInfoAfterResultSaving,
    initializeGameLevel,
    updateGameLevelAfterResultSaving
};