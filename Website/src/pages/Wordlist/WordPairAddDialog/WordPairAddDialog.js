import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center'
  },
  chip: {
    margin: theme.spacing(1)
  }
}));

function WordPairAddDialog({
  open,
  handleClose,
  inputs,
  handleChange,
  handleSubmit,
  handleReset,
  translations,
  handleTranslationAddition
}) {
  const classes = useStyles();
  const theme = useTheme();

  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleCloseWithReset = () => {
    handleClose();
    handleReset();
  };

  return (
    <Dialog
      aria-labelledby="word-pair-add-dialog"
      open={open}
      onClose={handleCloseWithReset}
      fullScreen={fullScreen}
    >
      <DialogTitle id="word-pair-add-dialog">Добавление слова</DialogTitle>
      <DialogContent>
        <form
          id="word-pair-add-form"
          onSubmit={event => {
            handleSubmit(event);
            handleCloseWithReset();
          }}
        >
          <TextField
            id="word-foreign"
            label="Слово или фраза на английском"
            name="wordForeign"
            value={inputs.wordForeign}
            onChange={handleChange}
            margin="normal"
            fullWidth
          />
          <TextField
            id="word-native"
            label="Перевод"
            name="wordNative"
            value={inputs.wordNative}
            onChange={handleChange}
            margin="normal"
            fullWidth
          />
        </form>
        <div className={classes.translations}>
          {translations.map(({ id, value }) => (
            <Chip
              key={id}
              label={value}
              onClick={handleTranslationAddition(id)}
              className={classes.chip}
            />
          ))}
          <Typography variant="body2" className={classes.footer}>
            Реализовано с помощью сервиса{' '}
            <Link href="https://tech.yandex.ru/dictionary">
              «Яндекс.Словарь»
            </Link>
          </Typography>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseWithReset}>Отмена</Button>
        <Button type="submit" form="word-pair-add-form" color="primary">
          Добавить
        </Button>
      </DialogActions>
    </Dialog>
  );
}

WordPairAddDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  inputs: PropTypes.shape({
    wordForeign: PropTypes.string.isRequired,
    wordNative: PropTypes.string.isRequired
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleReset: PropTypes.func.isRequired,
  translations: PropTypes.arrayOf(
    PropTypes.exact({
      id: PropTypes.number.isRequired,
      value: PropTypes.string.isRequired
    }).isRequired
  ).isRequired,
  handleTranslationAddition: PropTypes.func.isRequired
};

export default WordPairAddDialog;
