package com.dreamproject.inwords.domain.interactor.translation;

import com.dreamproject.inwords.data.dto.WordTranslation;

import java.util.List;

import io.reactivex.Completable;
import io.reactivex.Observable;

public interface TranslationWordsRepositoryInteractor {
    Observable<WordTranslation> getTranslation(String word);

    Observable<WordTranslation> getByOne();

    Observable<List<WordTranslation>> getList();

    Completable add(WordTranslation wordTranslation);

    Completable addAll(List<WordTranslation> wordTranslations);

    Completable markRemoved(WordTranslation wordTranslation);

    Completable markRemovedAll(List<WordTranslation> wordTranslations);
}