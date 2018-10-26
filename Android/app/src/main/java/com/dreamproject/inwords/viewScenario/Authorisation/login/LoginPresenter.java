package com.dreamproject.inwords.viewScenario.Authorisation.login;

import io.reactivex.Observable;

public interface LoginPresenter {

    void onSignUpHandler(Observable<Object> obs);

    void onSignInHandler(Observable<Object> obs);
}
