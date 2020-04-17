package ru.inwords.inwords.data.repository.integration

import io.reactivex.Completable
import io.reactivex.Single

interface IntegrationDatabaseRepository {
    fun clearAllTables()
    fun getPolicyAgreementState(): Single<Boolean>
    fun setPolicyAgreementState(state: Boolean): Completable
}