package ru.inwords.inwords.translation.data.grpc

import dagger.Lazy
import io.grpc.ManagedChannel
import io.reactivex.Completable
import io.reactivex.Single
import ru.inwords.inwords.core.utils.unsafeLazy
import ru.inwords.inwords.main_activity.di.annotations.GrpcDefaultChannel
import ru.inwords.inwords.network.grpc.TokenHeaderAttachingClientInterceptor
import ru.inwords.inwords.proto.common.Empty
import ru.inwords.inwords.proto.dictionary.*
import ru.inwords.inwords.translation.domain.model.WordTranslation

internal class DictionaryGrpcService internal constructor(
    @GrpcDefaultChannel managedChannel: Lazy<ManagedChannel>,
    tokenHeaderAttachingClientInterceptor: TokenHeaderAttachingClientInterceptor
) {
    private val dictionaryStub: DictionaryProviderGrpc.DictionaryProviderBlockingStub by unsafeLazy {
        DictionaryProviderGrpc.newBlockingStub(managedChannel.get())
            .withInterceptors(tokenHeaderAttachingClientInterceptor)
    }

    fun deleteWords(serverIds: List<Int>): Completable {
        val request = DeleteWordsRequest.newBuilder()
            .addAllDelete(serverIds)
            .build()

        return Completable.fromCallable { dictionaryStub.deleteWords(request) }
    }

    fun addWords(words: List<WordTranslation>): Single<AddWordsReply> {
        val addWordRequestList = words.map {
            AddWordRequest.newBuilder()
                .setLocalId(it.id.toInt()) //TODO type mismatch
                .setWordForeign(it.wordForeign)
                .setWordNative(it.wordNative)
                .build()
        }

        val request = AddWordsRequest.newBuilder()
            .addAllWords(addWordRequestList)
            .build()

        return Single.fromCallable { dictionaryStub.addWords(request) }
    }

    fun pullWords(serverIds: List<Int>): Single<WordsReply> {
        val request = GetWordsRequest.newBuilder()
            .addAllUserWordpairIds(serverIds)
            .build()

        return Single.fromCallable { dictionaryStub.getWords(request) }
    }

    fun lookup(text: String, lang: String): Single<LookupReply> {
        val request = LookupRequest.newBuilder()
            .setLang(lang)
            .setText(text)
            .build()

        return Single.fromCallable { dictionaryStub.lookup(request) }
    }

    fun trainingWords(): Single<TrainingReply> {
        return Single.fromCallable { dictionaryStub.training(Empty.getDefaultInstance()) }
    }

    fun trainingIds(): Single<TrainingIdsReply> {
        return Single.fromCallable { dictionaryStub.trainingIds(Empty.getDefaultInstance()) }
    }
}