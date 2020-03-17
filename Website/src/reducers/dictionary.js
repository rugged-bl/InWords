import {
  SYNC_WORD_PAIRS,
  DELETE_WORD_PAIRS,
  ADD_WORD_PAIRS,
  EDIT_WORD_PAIRS,
  RESET_WORD_PAIRS_ACTUALITY
} from 'src/actions/dictionaryActions';

const lexicographicalComparison = (firstWordPair, secondWordPair) =>
  firstWordPair.wordForeign.localeCompare(secondWordPair.wordForeign);

const dictionary = (
  state = {
    actual: false,
    wordPairs: []
  },
  action
) => {
  switch (action.type) {
    case SYNC_WORD_PAIRS:
      return {
        actual: true,
        wordPairs: state.wordPairs
          .filter(({ serverId }) => !action.payload.toDelete.includes(serverId))
          .concat(
            action.payload.toAdd
              .map(wordPair => {
                const convertedWordPair = {
                  ...wordPair,
                  serverId: wordPair.userWordPair
                };
                delete convertedWordPair.userWordPair;

                return convertedWordPair;
              })
              .sort(lexicographicalComparison)
          )
      };
    case DELETE_WORD_PAIRS:
      return {
        ...state,
        wordPairs: state.wordPairs.filter(
          ({ serverId }) => !action.payload.includes(serverId)
        )
      };
    case ADD_WORD_PAIRS: {
      const wordPairs = state.wordPairs.concat(action.payload);

      const wordPairsMap = {};
      wordPairs.forEach(wordPair => {
        wordPairsMap[wordPair.serverId] = wordPair;
      });

      return {
        ...state,
        wordPairs: Object.values(wordPairsMap).sort(lexicographicalComparison)
      };
    }
    case EDIT_WORD_PAIRS: {
      const wordPairs = state.wordPairs.map(wordPair => {
        const foundEditedWordPair = action.payload.find(
          ({ oldServerId }) => oldServerId === wordPair.serverId
        );
        return foundEditedWordPair ? foundEditedWordPair : wordPair;
      });

      const wordPairsMap = {};
      wordPairs.forEach(wordPair => {
        wordPairsMap[wordPair.serverId] = wordPair;
      });

      return {
        ...state,
        wordPairs: Object.values(wordPairsMap).sort(lexicographicalComparison)
      };
    }
    case RESET_WORD_PAIRS_ACTUALITY: {
      return {
        ...state,
        actual: false
      };
    }
    default:
      return state;
  }
};

export default dictionary;
