package com.dreamproject.inwords.domain

import com.dreamproject.inwords.data.dto.WordTranslation

class CardsData(wordTranslations: List<WordTranslation>) {
    private val _words: List<String>
    private val _wordsMapping: Map<String, String>

    init {
        _words = ArrayList(wordTranslations.size)
        val wordsMapping = HashMap<String, String>()

        for (wordTranslation in wordTranslations) {
            _words.add(wordTranslation.wordForeign)
            _words.add(wordTranslation.wordNative)

            wordsMapping[wordTranslation.wordForeign] = wordTranslation.wordNative
            wordsMapping[wordTranslation.wordNative] = wordTranslation.wordForeign
        }
        _words.shuffle()

        this._wordsMapping = wordsMapping
    }

    val words: List<String> get() = _words

    fun getCorrespondingWord(word: String): String? = _wordsMapping[word]
}