package com.dreamproject.inwords.domain.interactor.game

import com.dreamproject.inwords.data.dto.game.Game
import com.dreamproject.inwords.data.dto.game.GameLevel
import com.dreamproject.inwords.data.dto.game.LevelScore
import com.dreamproject.inwords.domain.model.GameModel
import com.dreamproject.inwords.domain.model.GamesInfoModel
import io.reactivex.Observable
import io.reactivex.Single

interface GameInteractor {
    fun getGamesInfo(): Observable<GamesInfoModel>
    fun getGame(gameId: Int): Observable<GameModel>
    fun getLevel(levelId: Int): Observable<GameLevel>
    fun getScore(game: Game, levelId: Int, openingQuantity: Int): Single<LevelScore>
}