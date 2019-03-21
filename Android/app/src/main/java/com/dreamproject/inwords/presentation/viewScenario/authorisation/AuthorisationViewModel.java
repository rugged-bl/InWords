package com.dreamproject.inwords.presentation.viewScenario.authorisation;

import com.dreamproject.inwords.core.util.Event;
import com.dreamproject.inwords.data.dto.UserCredentials;
import com.dreamproject.inwords.domain.interactor.authorisation.AuthorisationInteractor;
import com.dreamproject.inwords.presentation.viewScenario.BasicViewModel;

import java.util.concurrent.TimeUnit;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import io.reactivex.Completable;
import io.reactivex.Observable;
import io.reactivex.disposables.Disposable;

public abstract class AuthorisationViewModel extends BasicViewModel {
    private final MutableLiveData<Event<AuthorisationViewState>> authorisationStateLiveData;
    private final MutableLiveData<Event<Boolean>> navigateToLiveData;

    protected AuthorisationInteractor authorisationInteractor;

    protected AuthorisationViewModel(AuthorisationInteractor authorisationInteractor) {
        authorisationStateLiveData = new MutableLiveData<>();
        navigateToLiveData = new MutableLiveData<>();

        this.authorisationInteractor = authorisationInteractor;
    }

    public LiveData<Event<AuthorisationViewState>> getAuthorisationStateLiveData() {
        return authorisationStateLiveData;
    }

    public LiveData<Event<Boolean>> getNavigateToLiveData() {
        return navigateToLiveData;
    }

    public void onNavigateHandler(Observable<Object> clicksObservable) {
        Disposable d = clicksObservable
                .debounce(200, TimeUnit.MILLISECONDS)
                .subscribe(__ -> navigateToLiveData.postValue(new Event<>(true)));
        compositeDisposable.add(d);
    }

    public void onSignHandler(Observable<Object> clicksObservable, Observable<UserCredentials> userCredentialsObservable) {
        Disposable d = clicksObservable
                .debounce(200, TimeUnit.MILLISECONDS)
                .doOnNext(__ -> authorisationStateLiveData.postValue(new Event<>(AuthorisationViewState.loading())))
                .switchMap(__ -> userCredentialsObservable)
                .subscribe(userCredentials -> {
                            if (validateInput(userCredentials)) {
                                compositeDisposable.add(performAuthAction(userCredentials)
                                        .subscribe(() -> authorisationStateLiveData.postValue(new Event<>(AuthorisationViewState.success())),
                                                t -> authorisationStateLiveData.postValue(new Event<>(AuthorisationViewState.error(t)))));
                            }
                        }
                );

        compositeDisposable.add(d);
    }

    protected abstract Completable performAuthAction(UserCredentials userCredentials);

    private boolean validateInput(UserCredentials userCredentials) {
        String emailError = validateEmail(userCredentials);
        String passwordError = validatePassword(userCredentials);

        if (emailError != null && passwordError != null) {
            authorisationStateLiveData.postValue(new Event<>(
                    AuthorisationViewState.invalidInput(emailError, passwordError)));
        } else if (emailError != null) {
            authorisationStateLiveData.postValue(new Event<>(
                    AuthorisationViewState.invalidEmail(emailError)));
        } else if (passwordError != null) {
            authorisationStateLiveData.postValue(new Event<>(
                    AuthorisationViewState.invalidPassword(passwordError)));
        }

        return emailError == null && passwordError == null;
    }

    private String validateEmail(UserCredentials userCredentials) {
        if (userCredentials.getEmail().length() < 3) {
            return "Invalid email";
        }

        return null;
    }

    private String validatePassword(UserCredentials userCredentials) {
        if (userCredentials.getPassword().isEmpty()) {
            return "Invalid password";
        }

        return null;
    }
}