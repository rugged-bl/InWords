import apiAction from './apiAction';
import * as wordPairsActions from './wordPairsActions';
import * as commonActions from './commonActions';

export function receiveWordPairs() {
  return apiAction({
    endpoint: 'sync/pullWordPairs',
    method: 'POST',
    data: JSON.stringify([]),
    actionsOnSuccess: [
      (dispatch, data) => {
        dispatch(wordPairsActions.initializeWordPairs(data));
      }
    ],
    actionsOnFailure: [
      dispatch => {
        dispatch(
          commonActions.setSnackbar({ text: 'Не удалось загрузить словарь' })
        );
      }
    ]
  });
}

export function deleteWordPairs(pairIds) {
  return apiAction({
    endpoint: 'words/deletePair',
    method: 'POST',
    data: JSON.stringify(pairIds),
    actionsOnSuccess: [
      dispatch => {
        dispatch(wordPairsActions.updateWordPairsAfterDeletion(pairIds));
      }
    ],
    actionsOnFailure: [
      dispatch => {
        dispatch(
          commonActions.setSnackbar({ text: 'Не удалось удалить слова' })
        );
      }
    ]
  });
}

export function addWordPair(wordPair) {
  return apiAction({
    endpoint: 'words/addPair',
    method: 'POST',
    data: JSON.stringify([wordPair]),
    actionsOnSuccess: [
      (dispatch, data) => {
        dispatch(
          wordPairsActions.updateWordPairsAfterAddition({
            serverId: data[0].serverId,
            ...wordPair
          })
        );
      }
    ],
    actionsOnFailure: [
      dispatch => {
        dispatch(
          commonActions.setSnackbar({ text: 'Не удалось добавить слово' })
        );
      }
    ]
  });
}

// delete previous word pair and add new word pair
export function editWordPair(pairId, wordPair) {
  return apiAction({
    endpoint: 'words/deletePair',
    method: 'POST',
    data: JSON.stringify([pairId]),
    actionsOnSuccess: [addEditedWordPair],
    actionsOnFailure: [
      dispatch => {
        dispatch(
          commonActions.setSnackbar({
            text: 'Не удалось отредактировать слово'
          })
        );
      }
    ]
  });

  function addEditedWordPair(dispatch) {
    dispatch(
      apiAction({
        endpoint: 'words/addPair',
        method: 'POST',
        data: JSON.stringify([wordPair]),
        actionsOnSuccess: [
          (dispatch, data) => {
            dispatch(
              wordPairsActions.updateWordPairsAfterEditing(pairId, {
                serverId: data[0].serverId,
                ...wordPair
              })
            );
          }
        ],
        actionsOnFailure: [
          dispatch => {
            dispatch(
              commonActions.setSnackbar({
                text: 'Не удалось отредактировать слово'
              })
            );
          }
        ]
      })
    );
  }
}
