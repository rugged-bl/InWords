package ru.inwords.inwords.domain.interactor.authorisation

import android.util.Log
import io.reactivex.Completable
import io.reactivex.Single
import retrofit2.HttpException
import ru.inwords.inwords.data.dto.UserCredentials
import ru.inwords.inwords.data.source.webService.AuthenticationException
import ru.inwords.inwords.data.source.webService.WebRequestsManager
import ru.inwords.inwords.data.source.webService.session.TokenResponse
import ru.inwords.inwords.domain.interactor.integration.IntegrationInteractor
import ru.inwords.inwords.domain.util.getErrorMessage
import java.net.SocketTimeoutException
import java.net.UnknownHostException
import javax.inject.Inject

class AuthorisationWebInteractor @Inject
internal constructor(private val webRequestsManager: WebRequestsManager,
                     private val integrationInteractor: IntegrationInteractor) : AuthorisationInteractor {
    override fun trySignInExistingAccount(): Completable {
        return webRequestsManager.getToken()
                .interceptError()
                .checkAuthToken()
    }

    override fun signIn(userCredentials: UserCredentials): Completable {
        return webRequestsManager.getToken(userCredentials)
                .interceptError()
                .checkAuthToken()
                .detectNewUser(userCredentials.email)
    }

    override fun signUp(userCredentials: UserCredentials): Completable {
        return webRequestsManager.registerUser(userCredentials)
                .interceptError()
                .checkAuthToken()
                .detectNewUser(userCredentials.email)
    }

    private fun Completable.detectNewUser(email: String): Completable {
        return webRequestsManager.getUserEmail()
                .flatMapCompletable {
                    if (it == email || it.isEmpty()) { //TODO care its for not clearing data if its first login
                        this
                    } else {
                        integrationInteractor.getOnNewUserCallback()
                                .andThen(this)
                    }
                }
    }

    private fun Single<TokenResponse>.interceptError(): Single<TokenResponse> {
        return onErrorResumeNext { e ->
            Log.e(javaClass.simpleName, e.message.orEmpty())

            val t = when (e) {
                is HttpException -> AuthenticationException(getErrorMessage(e), e.code())
                is UnknownHostException, is SocketTimeoutException -> RuntimeException("Network troubles")
                else -> RuntimeException(e.message)
            }

            Single.error(t)
        }
    }

    private fun Single<TokenResponse>.checkAuthToken(): Completable {
        return flatMapCompletable { tokenResponse ->
            if (tokenResponse.isValid) {
                integrationInteractor.getOnAuthCallback()
            } else {
                Completable.error(RuntimeException("unhandled")) //TODO think
            }
        }
    }
}
