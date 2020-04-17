package ru.inwords.inwords.data.source.remote

import io.reactivex.Completable
import io.reactivex.Single
import ru.inwords.inwords.game.data.bean.LevelScore
import ru.inwords.inwords.game.data.bean.TrainingEstimateRequest
import ru.inwords.inwords.profile.data.bean.User
import ru.inwords.inwords.proto.dictionary.AddWordsReply
import ru.inwords.inwords.proto.dictionary.LookupReply
import ru.inwords.inwords.proto.dictionary.WordsReply
import ru.inwords.inwords.proto.profile.EmailChangeReply
import ru.inwords.inwords.proto.word_set.GetLevelWordsReply
import ru.inwords.inwords.proto.word_set.GetLevelsReply
import ru.inwords.inwords.proto.word_set.WordSetReply
import ru.inwords.inwords.translation.domain.model.WordTranslation

interface WebRequestsManagerAuthorised {
    fun notifyAuthStateChanged(authorised: Boolean)

    fun getLogin(): Single<String>

    fun getAuthorisedUser(): Single<User>

    fun getGameInfos(): Single<WordSetReply>

    fun getUserById(id: Int): Single<User>

    fun updateUser(newUser: User): Completable

    fun requestEmailUpdate(newEmail: String): Single<EmailChangeReply>

    fun insertAllWords(wordTranslations: List<WordTranslation>): Single<AddWordsReply>

    fun removeAllByServerId(serverIds: List<Int>): Completable

    fun pullWords(serverIds: List<Int>): Single<WordsReply>

    fun lookup(text: String, lang: String): Single<LookupReply>

    fun getLevels(wordSetId: Int): Single<GetLevelsReply>

    fun getLevelWords(levelId: Int): Single<GetLevelWordsReply>

    fun getScore(trainingEstimateRequest: TrainingEstimateRequest): Single<List<LevelScore>>

    fun addWordSetToDictionary(wordSetId: Int): Completable

    fun getWordsForTraining(): Single<List<WordTranslation>>
    fun getIdsForTraining(): Single<List<Int>>
}
