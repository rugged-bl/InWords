import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import useDialog from 'src/components/core/useDialog';
import Icon from 'src/components/core/Icon';
import Zoom from 'src/components/core/Zoom';
import Fab from 'src/components/core/Fab';
import WordPairAddDialog from './WordPairAddDialog';

import './ControlledWordPairAddDialog.css';

function ControlledWordPairAddDialog({ visible }) {
  const { open, handleOpen, handleClose } = useDialog();

  return (
    <Fragment>
      <Zoom in={visible}>
        <div className="word-pair-add-button-container">
          <Fab id="fab" aria-label="добавить" onClick={handleOpen}>
            <Icon>add</Icon>
          </Fab>
        </div>
      </Zoom>
      <WordPairAddDialog open={open} handleClose={handleClose} />
    </Fragment>
  );
}

ControlledWordPairAddDialog.propTypes = {
  visible: PropTypes.bool.isRequired
};

export default ControlledWordPairAddDialog;
