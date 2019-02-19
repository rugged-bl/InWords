package com.dreamproject.inwords.data.source.webService;

import com.dreamproject.inwords.data.source.webService.session.TokenResponse;

import javax.inject.Inject;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import okhttp3.Authenticator;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.Route;

public class BasicAuthenticator implements Authenticator {
    interface OnUnauthorisedCallback {
        TokenResponse perform();
    }

    private OnUnauthorisedCallback callback;

    @Inject
    BasicAuthenticator() {
    }

    void setOnUnauthorisedCallback(OnUnauthorisedCallback callback) {
        this.callback = callback;
    }

    @Nullable
    @Override
    public Request authenticate(@NonNull Route route, @NonNull Response response) {
        final TokenResponse errorToken = TokenResponse.errorToken();

        String header = response.request().header("Authorization");
        if (callback == null || (header != null && header.contains(errorToken.getAccessToken()))) { //TODO: think about COSTIL
            return null; // Give up, we've already failed to authenticate.
        }

        TokenResponse tokenResponse = callback.perform();

        return response.request().newBuilder()
                .header("Authorization", tokenResponse.getBearer())
                .build();
    }
}