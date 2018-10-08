package com.dreamproject.inwords.data.repository.Translation;

import android.app.Application;

import com.dreamproject.inwords.data.entity.WordTranslation;
import com.dreamproject.inwords.data.sync.SyncController;

import java.util.List;

import io.reactivex.Completable;
import io.reactivex.Observable;

public class TranslationWordsMainRepository implements TranslationWordsProvider {
    private TranslationWordsLocalRepository inMemoryRepository;

    public TranslationWordsMainRepository(Application application) {
        inMemoryRepository = new TranslationWordsCacheRepository();
        TranslationWordsLocalRepository localRepository = new TranslationWordsDatabaseRepository(application);
        TranslationWordsRemoteRepository remoteRepository = new TranslationWordsWebApiRepository();

        SyncController syncController = new SyncController(inMemoryRepository, localRepository, remoteRepository);
        syncController.presyncOnStart()
                .blockingSubscribe((wordTranslations) -> {
                }, Throwable::printStackTrace);
        syncController.trySyncAllReposWithCache()
                .blockingSubscribe((wordTranslations) -> {
                }, Throwable::printStackTrace);

    }

    @Override
    public Observable<WordTranslation> getTranslation(String word) {
        return inMemoryRepository.getTranslation(word);
    }

    @Override
    public Observable<WordTranslation> getByOne() {
        return inMemoryRepository.getByOne();
    }

    @Override
    public Observable<List<WordTranslation>> getList() {
        return inMemoryRepository.getList();
    }

    @Override
    public Completable add(WordTranslation wordTranslation) {
        return inMemoryRepository.add(wordTranslation).ignoreElement();
    }

    @Override
    public Completable addAll(List<WordTranslation> wordTranslations) {
        return inMemoryRepository.addAll(wordTranslations).ignoreElement();
    }

    @Override
    public Completable remove(WordTranslation wordTranslation) {
        return inMemoryRepository.remove(wordTranslation);
    }

    @Override
    public Completable removeAll(List<WordTranslation> wordTranslations) {
        return inMemoryRepository.removeAll(wordTranslations);
    }
}
