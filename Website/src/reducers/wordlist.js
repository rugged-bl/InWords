import { combineReducers } from 'redux';
import { wordlistConstants } from '../constants/wordlistConstants';

function wordPairs(state = [], action) {
    switch (action.type) {
        case wordlistConstants.PAIRS_PULL_LOCAL_REFRESH:
            return action.wordPairs;

        case wordlistConstants.PAIRS_DEL_LOCAL_REFRESH:
            return state.filter((pair) => pair.serverId !== action.pairId);

        case wordlistConstants.PAIRS_ADD_LOCAL_REFRESH:
            if (state.find((wordPair) => wordPair.serverId === action.wordPair.serverId)) {
                return state;
            }
            const refreshedWordPairs = state.slice();
            refreshedWordPairs.push(action.wordPair);
            return refreshedWordPairs;

        case wordlistConstants.PAIRS_EDIT_LOCAL_REFRESH:
            if (state.find((wordPair) => wordPair.serverId === action.wordPair.serverId)) {
                return state;
            }
            return state.map((wordPair) => {
                return wordPair.serverId !== action.pairId ?
                    wordPair :
                    action.wordPair
            });

        default:
            return state;
    }
};

export const wordlist = combineReducers({
    wordPairs: wordPairs
});