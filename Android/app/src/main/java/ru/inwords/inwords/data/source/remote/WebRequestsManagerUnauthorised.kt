package ru.inwords.inwords.data.source.remote

import io.reactivex.Single
import ru.inwords.inwords.data.source.remote.session.TokenResponse
import ru.inwords.inwords.profile.data.bean.UserCredentials
import ru.inwords.inwords.texttospeech.data.bean.TtsSynthesizeRequest

interface WebRequestsManagerUnauthorised {
    fun isUnauthorised(): Boolean
    fun invalidateToken()
    fun getToken(userCredentials: UserCredentials): Single<TokenResponse>
    fun getTokenGoogle(tokenId: String): Single<TokenResponse>
    fun registerUser(userCredentials: UserCredentials): Single<TokenResponse>
    fun ttsSynthesize(request: TtsSynthesizeRequest, googleServicesApiKey: String): Single<String>
}