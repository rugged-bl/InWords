import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import wordPairsApiActions from '../../../actions/wordPairsApiActions';
import WordPairsDeleteAppbar from './WordPairsDeleteAppbar';

function WordPairsDeleteAppbarContainer({ checked, ...rest }) {
    const dispatch = useDispatch();
    const deleteWordPairs = useCallback(
        pairIds => dispatch(wordPairsApiActions.deleteWordPairs(pairIds)),
        [dispatch]
    );

    const handleDelete = () => {
        deleteWordPairs(checked);
    };

    return (
        <WordPairsDeleteAppbar
            numberOfSelected={checked.length}
            handleDelete={handleDelete}
            {...rest}
        />
    );
}

WordPairsDeleteAppbarContainer.propTypes = {
    checked: PropTypes.arrayOf(
        PropTypes.number.isRequired
    ).isRequired,
    handleReset: PropTypes.func
};

export default WordPairsDeleteAppbarContainer;