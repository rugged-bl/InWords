import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { syncWordPairs } from 'src/actions/dictionaryApiActions';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import DictionaryToolbar from './DictionaryToolbar';
import Wordlist from './Wordlist';
import WordPairAddButton from './WordPairAddButton';

function DictionaryContainer() {
  const { actual, wordPairs } = useSelector(store => store.dictionary);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!actual) {
      dispatch(syncWordPairs(wordPairs));
    }
  }, [actual, wordPairs, dispatch]);

  const [checkedValues, setCheckedValues] = useState([]);

  const handleToggle = useCallback(
    value => event => {
      event.stopPropagation();

      setCheckedValues(checkedValues => {
        const currentIndex = checkedValues.indexOf(value);
        const newChecked = [...checkedValues];

        if (currentIndex === -1) {
          newChecked.push(value);
        } else {
          newChecked.splice(currentIndex, 1);
        }

        return newChecked;
      });
    },
    []
  );

  const [editingModeEnabled, setEditingModeEnabled] = useState(false);

  React.useEffect(() => {
    if (checkedValues.length > 0) {
      if (!editingModeEnabled) {
        setEditingModeEnabled(true);
      }
    } else if (checkedValues.length === 0) {
      if (editingModeEnabled) {
        setEditingModeEnabled(false);
      }
    }
  }, [checkedValues, editingModeEnabled]);

  const handleReset = () => {
    setCheckedValues([]);
  };

  const [pattern, setPattern] = useState('');

  const filteredWordPairs = useMemo(
    () =>
      wordPairs.filter(({ wordForeign, wordNative }) => {
        const upperCaseSearchWord = pattern.toUpperCase();

        return (
          wordForeign.toUpperCase().includes(upperCaseSearchWord) ||
          wordNative.toUpperCase().includes(upperCaseSearchWord)
        );
      }),
    [pattern, wordPairs]
  );

  return (
    <Paper>
      <DictionaryToolbar
        editingModeEnabled={editingModeEnabled}
        checkedValues={checkedValues}
        handleReset={handleReset}
        setPattern={setPattern}
      />
      <Divider />
      <Wordlist
        editingModeEnabled={editingModeEnabled}
        wordPairs={!pattern ? wordPairs : filteredWordPairs}
        checkedValues={checkedValues}
        handleToggle={handleToggle}
      />
      <WordPairAddButton visible={!editingModeEnabled} />
    </Paper>
  );
}

export default DictionaryContainer;
