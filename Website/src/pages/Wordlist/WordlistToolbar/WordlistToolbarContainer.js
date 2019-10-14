import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { setSnackbar } from 'actions/commonActions';
import { deleteWordPairs } from 'actions/wordPairsApiActions';
import useForm from 'hooks/useForm';
import WordlistToolbar from './WordlistToolbar';

function WordlistToolbarContainer({ checkedValues, setPattern, ...rest }) {
  const dispatch = useDispatch();

  const handleDelete = () => {
    dispatch(
      setSnackbar({
        text: 'Слова будут удалены через 5 секунд',
        actionText: 'Отменить',
        actionHandler: () => {
          window.clearTimeout(timerId);
        }
      })
    );

    let timerId = window.setTimeout(() => {
      dispatch(deleteWordPairs(checkedValues));
    }, 5100);
  };

  const { inputs, handleChange } = useForm({ pattern: '' });

  const searchTimerRef = useRef();

  useEffect(() => {
    window.clearTimeout(searchTimerRef.current);
    searchTimerRef.current = window.setTimeout(() => {
      setPattern(inputs.pattern);
    }, 200);
  }, [inputs, setPattern]);

  return (
    <WordlistToolbar
      numberOfChecked={checkedValues.length}
      handleDelete={handleDelete}
      inputs={inputs}
      handleChange={handleChange}
      {...rest}
    />
  );
}

WordlistToolbarContainer.propTypes = {
  checkedValues: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
  setPattern: PropTypes.func.isRequired,
  handleReset: PropTypes.func,
  editingModeEnabled: PropTypes.bool
};

export default WordlistToolbarContainer;