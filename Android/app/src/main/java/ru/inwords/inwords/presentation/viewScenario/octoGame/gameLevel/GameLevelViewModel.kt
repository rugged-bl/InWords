package ru.inwords.inwords.presentation.viewScenario.octoGame.gameLevel

import android.annotation.SuppressLint
import io.reactivex.Observable
import io.reactivex.subjects.BehaviorSubject
import io.reactivex.subjects.PublishSubject
import io.reactivex.subjects.Subject
import ru.inwords.inwords.data.dto.game.Game
import ru.inwords.inwords.data.dto.game.LevelScore
import ru.inwords.inwords.data.dto.game.LevelScoreRequest
import ru.inwords.inwords.domain.CardsData
import ru.inwords.inwords.domain.interactor.game.GameInteractor
import ru.inwords.inwords.domain.model.Resource
import ru.inwords.inwords.presentation.viewScenario.BasicViewModel

class GameLevelViewModel(private val gameInteractor: GameInteractor) : BasicViewModel() {
    private val _cardsDataSubject: Subject<Resource<CardsData>> = BehaviorSubject.create()
    private val _navigationSubject: Subject<FromGameEndPathsEnum> = PublishSubject.create()
    private val _scoreSubject: Subject<Resource<LevelScore>> = BehaviorSubject.create()

    fun onGameLevelSelected(gameLevelId: Int) {
        compositeDisposable.clear()

        gameInteractor.getLevel(gameLevelId)
                .map {
                    when (it.status) {
                        Resource.Status.SUCCESS -> Resource.success(CardsData(it.data!!.wordTranslations))
                        Resource.Status.LOADING -> Resource.loading<CardsData>(null)
                        Resource.Status.ERROR -> Resource.error<CardsData>(it.message!!, null)
                    }
                }
                .subscribe(_cardsDataSubject)
    }

    fun cardsStream(): Observable<Resource<CardsData>> = _cardsDataSubject

    fun navigationStream(): Observable<FromGameEndPathsEnum> = _navigationSubject

    fun scoreStream(): Observable<Resource<LevelScore>> = _scoreSubject

    fun gameStream(gameId: Int): Observable<Resource<Game>> = gameInteractor.getGame(gameId).map { it.gameResource }

    fun onNewNavCommand(path: FromGameEndPathsEnum) {
        _navigationSubject.onNext(path)
    }

    @SuppressLint("CheckResult")
    fun onGameEnd(game: Game, levelId: Int, cardOpenClicks: Int, wordsCount: Int) {
        gameInteractor.getScore(game, LevelScoreRequest(levelId, cardOpenClicks, wordsCount))
                .subscribe(_scoreSubject::onNext) //TODO inconsistency may happen
    }
}