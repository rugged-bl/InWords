package com.dreamproject.inwords.data.source.webService;

import com.dreamproject.inwords.core.util.Function;
import com.dreamproject.inwords.core.util.SchedulersFacade;
import com.dreamproject.inwords.data.dto.EntityIdentificator;
import com.dreamproject.inwords.data.dto.User;
import com.dreamproject.inwords.data.dto.UserCredentials;
import com.dreamproject.inwords.data.dto.WordTranslation;
import com.dreamproject.inwords.data.dto.game.Game;
import com.dreamproject.inwords.data.dto.game.GameInfo;
import com.dreamproject.inwords.data.dto.game.GameLevel;
import com.dreamproject.inwords.data.dto.game.GameScore;
import com.dreamproject.inwords.data.dto.game.GameScoreRequest;
import com.dreamproject.inwords.data.source.webService.session.AuthInfo;
import com.dreamproject.inwords.data.source.webService.session.SessionHelper;
import com.dreamproject.inwords.data.source.webService.session.TokenResponse;
import com.dreamproject.inwords.data.sync.PullWordsAnswer;

import java.util.Arrays;
import java.util.List;

import javax.inject.Inject;

import io.reactivex.Maybe;
import io.reactivex.Single;
import io.reactivex.schedulers.Schedulers;

public class WebRequestsManagerImpl implements WebRequestsManager {
    private WebApiService apiService;
    private SessionHelper sessionHelper;
    private AuthInfo authInfo;

    @Inject
    WebRequestsManagerImpl(WebApiService apiService, BasicAuthenticator authenticator, SessionHelper sessionHelper) {
        this.apiService = apiService;
        this.sessionHelper = sessionHelper;
        this.authInfo = new AuthInfo();

        authenticator.setOnUnauthorisedCallback(() -> getCredentials()
                .flatMap(credentials -> applyAuthSessionHelper(apiService.getToken(credentials))) //TODO COSTIL
                .blockingGet());
    }

    private Single<TokenResponse> setAuthToken(TokenResponse tokenResponse) {
        return Single.fromCallable(() -> {
            this.authInfo.setTokenResponse(tokenResponse);
            return tokenResponse;
        });
    }

    private Single<UserCredentials> setCredentials(UserCredentials userCredentials) {
        return Single.fromCallable(() ->
        {
            authInfo.setCredentials(userCredentials);
            return authInfo.getCredentials();
        });
    }

    private Single<UserCredentials> getCredentials() {
        return Single.fromCallable(() -> authInfo.getCredentials());
    }

    @Override
    public Single<TokenResponse> getToken(UserCredentials userCredentials) {
        return setCredentials(userCredentials)
                .flatMap(s -> applyAuthSessionHelper(apiService.getToken(s)))
                .subscribeOn(SchedulersFacade.io());
    }

    @Override
    public Single<TokenResponse> registerUser(UserCredentials userCredentials) {
        return applyAuthSessionHelper(apiService.registerUser(userCredentials))
                .zipWith(setCredentials(userCredentials), (tokenResponse, u) -> tokenResponse)
                .subscribeOn(Schedulers.io());
    }

    @Override
    public Single<String> getLogin() {
        return applySessionHelper(b -> apiService.getLogin(b))
                .subscribeOn(SchedulersFacade.io());
    }

    @Override
    public Single<User> getAuthorisedUser() {
        return applySessionHelper(b -> apiService.getAuthorisedUser(b))
                //.flatMap(Observable::fromIterable)
                .subscribeOn(SchedulersFacade.io());
    }

    @Override
    public Single<User> getUserById(int id) {
        return applySessionHelper(b -> apiService.getUserById(b, id))
                //.flatMap(Observable::fromIterable)
                .subscribeOn(SchedulersFacade.io());
    }

    @Override
    public Maybe<List<WordTranslation>> getAllWords() { //TODO its a mock
        return Maybe.fromCallable(() -> {
            try {
                Thread.sleep(2000);
            } catch (Exception e) {
                e.printStackTrace();
            }

            return Arrays.asList(new WordTranslation("asd", "ку"), new WordTranslation("sdg", "укеу"));
        })
                .subscribeOn(SchedulersFacade.io());
    }

    @Override
    public Single<WordTranslation> insertWord(WordTranslation wordTranslation) { //TODO its a mock
        return Single.defer(() -> {
            Thread.sleep(2000);

            return Single.just(wordTranslation); //TODO
        })
                .subscribeOn(SchedulersFacade.io());
    }

    @Override
    public Single<List<EntityIdentificator>> insertAllWords(List<WordTranslation> wordTranslations) {
        return applySessionHelper(b -> apiService.addPairs(b, wordTranslations))
                .subscribeOn(SchedulersFacade.io());
    }

    @Override
    public Single<Integer> removeAllServerIds(List<Integer> serverIds) {
        return applySessionHelper(b -> apiService.deletePairs(b, serverIds))
                .subscribeOn(SchedulersFacade.io());
    }

    @Override
    public Single<PullWordsAnswer> pullWords(List<Integer> serverIds) {
        return applySessionHelper(b -> apiService.pullWordsPairs(b, serverIds))
                .subscribeOn(SchedulersFacade.io());
    }

    @Override
    public Single<List<GameInfo>> getGameInfos() {
        return applySessionHelper(b -> apiService.getGameInfos(b))
                .subscribeOn(SchedulersFacade.io());
    }

    @Override
    public Single<Game> getGame(int gameId) {
        return applySessionHelper(b -> apiService.getGame(b, gameId))
                .subscribeOn(SchedulersFacade.io());
    }

    @Override
    public Single<GameLevel> getLevel(int levelId) {
        return applySessionHelper(b -> apiService.getLevel(b, levelId))
                .subscribeOn(SchedulersFacade.io());
    }

    @Override
    public Single<GameScore> getScore(GameScoreRequest gameScoreRequest) {
        return applySessionHelper(b -> apiService.getGameScore(b, gameScoreRequest))
                .subscribeOn(SchedulersFacade.io());
    }

    private String getBearer() {
        return authInfo.getTokenResponse().getBearer();
    }

    private <R> Single<R> applySessionHelper(Function<String, Single<R>> func) {
        return sessionHelper
                .requireThreshold()
                .andThen(Single.defer(() -> func.apply(getBearer())))
                .doOnError(throwable -> sessionHelper.interceptError(throwable).blockingAwait());
    }

    private Single<TokenResponse> applyAuthSessionHelper(Single<TokenResponse> query) {
        return sessionHelper
                .resetThreshold()
                .andThen(query)
                .doOnError(throwable -> {
                    //noinspection ResultOfMethodCallIgnored
                    sessionHelper.interceptError(throwable)
                            .andThen(setAuthToken(TokenResponse.errorToken()))
                            .blockingGet();
                })
                .flatMap(this::setAuthToken);
    }
}
