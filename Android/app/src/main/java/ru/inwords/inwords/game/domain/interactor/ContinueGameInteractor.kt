package ru.inwords.inwords.game.domain.interactor

import ru.inwords.inwords.core.resource.Resource
import ru.inwords.inwords.game.data.repository.GetGameGameGatewayController
import ru.inwords.inwords.game.data.repository.custom_game.GameCreator
import ru.inwords.inwords.game.domain.model.*
import ru.inwords.inwords.game.domain.model.TrainingStrategy.TrainingMode.TRAINING
import ru.inwords.inwords.game.domain.model.TrainingStrategy.TrainingMode.WORD_SETS
import ru.inwords.inwords.translation.domain.interactor.TrainingInteractor

class ContinueGameInteractor internal constructor(
    private val gameGatewayController: GetGameGameGatewayController,
    private val trainingInteractor: TrainingInteractor,
    private val gameCreator: GameCreator
) {
    fun getFirstZeroStarsLevel(): Resource<GamePathToLevel> {
        val gamesInfoRes = gameGatewayController.getGamesInfo(forceUpdate = false).blockingFirst()

        when (gamesInfoRes) {
            is Resource.Success -> {
                for (gameInfo in gamesInfoRes.data.gameInfos) {
                    val gameRes = gameGatewayController.getGame(gameId = gameInfo.gameId, forceUpdate = false).blockingFirst()
                    when (gameRes) {
                        is Resource.Success -> {
                            for (gameLevelInfo in gameRes.data.gameLevelInfos) {
                                if (gameLevelInfo.playerStars == 0) {
                                    return Resource.Success(GamePathToLevel(gameInfo, gameRes.data, gameLevelInfo))
                                }
                            }
                        }
                        is Resource.Loading -> return Resource.Loading(gameRes.source)
                        is Resource.Error -> return Resource.Error(gameRes.message, gameRes.throwable, gameRes.source)
                    }
                }
            }
            is Resource.Loading -> return Resource.Loading(gamesInfoRes.source)
            is Resource.Error -> return Resource.Error(gamesInfoRes.message, gamesInfoRes.throwable, gamesInfoRes.source)
        }

        return Resource.Error(FirstZeroStarsLevelNotFoundException.message, FirstZeroStarsLevelNotFoundException)
    }

    fun queryContinueGame(game: Game, levelInfo: GameLevelInfo, mode: TrainingStrategy.TrainingMode): Resource<ContinueGameQueryResult> {
        return when (mode) {
            WORD_SETS -> queryContinueGameWordsSets(game, levelInfo)
            TRAINING -> queryContinueGameTraining(game)
        }
    }

    private fun queryContinueGameWordsSets(game: Game, levelInfo: GameLevelInfo): Resource<ContinueGameQueryResult> {
        val gameLevelInfos = game.gameLevelInfos
        val nextLevelIndex = levelInfo.level

        val lastLevelNum = gameLevelInfos.maxByOrNull { it.level }

        val nextLevelInfo = gameLevelInfos.getOrNull(nextLevelIndex)

        return when {
            nextLevelInfo != null -> {
                val isLast = nextLevelInfo.level == lastLevelNum?.level
                Resource.Success(ContinueGameQueryResult.NextLevelInfo(game, nextLevelInfo, isLast = isLast))
            }
            lastLevelNum != null -> {
                return when (val gameInfosResource = gameGatewayController.getGamesInfo().blockingFirst()) {
                    is Resource.Success -> {
                        val nextGameInfoIndex = gameInfosResource.data.gameInfos.indexOfFirst { it.gameId == game.gameId }
                        val nextGameInfo = gameInfosResource.data.gameInfos.getOrNull(nextGameInfoIndex + 1)

                        if (nextGameInfo != null) {
                            getFirstLevelInGame(nextGameInfo.gameId)
                        } else {
                            Resource.Success(ContinueGameQueryResult.NoMoreLevels)
                        }
                    }
                    is Resource.Loading -> Resource.Loading(gameInfosResource.source)
                    is Resource.Error -> Resource.Error(gameInfosResource.message, gameInfosResource.throwable, gameInfosResource.source)
                }
            }
            else -> {
                Resource.Error("", RuntimeException("")) //TODO normal exception
            }
        }
    }

    private fun queryContinueGameTraining(game: Game): Resource<ContinueGameQueryResult> {
        return trainingInteractor.getActualWordsForTraining()
            .map {
                if (it.isEmpty()) {
                    Resource.Success(ContinueGameQueryResult.NoMoreLevels)
                } else {
                    val nextLevelInfo = gameCreator.createLevel(it)
                    trainingInteractor.clearCache()
                    Resource.Success(ContinueGameQueryResult.NextLevelInfo(game, nextLevelInfo, false))
                } as Resource<ContinueGameQueryResult>
            }
            .onErrorReturn {
                Resource.Error<ContinueGameQueryResult>(it.message, it)
            }
            .blockingGet()
    }

    private fun getFirstLevelInGame(gameId: Int): Resource<ContinueGameQueryResult.NextLevelInfo> {
        return when (val gameRes = gameGatewayController.getGame(gameId).blockingFirst()) {
            is Resource.Success -> {
                val gameLevelInfos = gameRes.data.gameLevelInfos
                val firstLevelInfo = gameLevelInfos.getOrNull(0)

                if (firstLevelInfo != null) {
                    val lastLevelNum = gameLevelInfos.maxByOrNull { it: GameLevelInfo -> it.level }
                    val isLast = firstLevelInfo.level == lastLevelNum?.level

                    Resource.Success(ContinueGameQueryResult.NextLevelInfo(gameRes.data, firstLevelInfo, isLast))
                } else {
                    Resource.Error("", RuntimeException("")) //TODO normal exception
                }
            }
            is Resource.Loading -> Resource.Loading(gameRes.source)
            is Resource.Error -> Resource.Error(gameRes.message, gameRes.throwable, gameRes.source)
        }
    }

}