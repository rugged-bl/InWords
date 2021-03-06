import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { setSnackbar } from 'src/actions/commonActions';
import { initializeWordSetLevel } from 'src/actions/wordSetActions';
import { getWordPairsToStudy } from 'src/actions/dictionaryApiActions';
import convertWordPairsToStudy from 'src/converters/convertWordPairsToStudy';
import TrainingTypes from 'src/components/routes-common/TrainingTypes';

function MainTrainingTypes() {
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        const { pairs } = await dispatch(getWordPairsToStudy());
        dispatch(initializeWordSetLevel(0, convertWordPairsToStudy(pairs)));
      } catch (error) {
        dispatch(
          setSnackbar({
            text: 'Не удалось загрузить слова для повторения'
          })
        );
      }
    })();
  }, [dispatch]);

  const levelsMap = useSelector(store => store.wordSet.levelsMap);

  return <TrainingTypes trainingLevel={levelsMap[0] || { levelId: 0 }} />;
}

MainTrainingTypes.propTypes = {
  level: PropTypes.number
};

export default MainTrainingTypes;
