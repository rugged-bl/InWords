import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { saveValue } from 'src/localStorage';
import useForm from 'src/components/core/useForm';
import Dialog from 'src/components/core/Dialog';
import DialogTitle from 'src/components/core/DialogTitle';
import DialogContent from 'src/components/core/DialogContent';
import DialogActions from 'src/components/core/DialogActions';
import FormGroup from 'src/components/core/FormGroup';
import FormControlLabel from 'src/components/core/FormControlLabel';
import Typography from 'src/components/core/Typography';
import Checkbox from 'src/components/core/Checkbox';
import Button from 'src/components/core/Button';
import Slider from 'src/components/core/Slider';

function CardsGameSettingsDialog({
  open,
  handleClose,
  trainingSettings,
  setTrainingSettings,
  voiceSettingEditable = true
}) {
  const { inputs, setInputs, handleChange } = useForm({});

  useEffect(() => {
    if (open) {
      setInputs(trainingSettings);
    }
  }, [trainingSettings, open, setInputs]);

  const handleSubmit = event => {
    event.preventDefault();

    saveValue('trainingSettings-*Cards', inputs);
    setTrainingSettings(inputs);
  };

  return (
    <Dialog
      aria-labelledby="cards-game-settings-dialog"
      open={open}
      onClose={handleClose}
    >
      <DialogTitle id="cards-game-settings-dialog">
        Настройки тренировки
      </DialogTitle>
      <DialogContent>
        <form
          id="cards-game-settings-form"
          onSubmit={event => {
            handleSubmit(event);
            handleClose();
          }}
        >
          <FormGroup>
            <Typography component="p" gutterBottom>
              Размер карточки: {inputs.cardDimension}
            </Typography>
            <Slider
              name="cardDimension"
              min="80"
              max="140"
              step="5"
              value={inputs.cardDimension}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Typography component="p" gutterBottom>
              Размер текста на карточке: {inputs.cardTextSize}
            </Typography>
            <Slider
              name="cardTextSize"
              min="0.75"
              max="1.5"
              step="0.0625"
              value={inputs.cardTextSize}
              onChange={handleChange}
            />
          </FormGroup>
          <div>
            <FormControlLabel
              control={
                <Checkbox
                  name="voiceOn"
                  checked={inputs.voiceOn}
                  onChange={handleChange}
                  edge="start"
                />
              }
              label="Озвучивать английские слова"
              disabled={!voiceSettingEditable}
            />
          </div>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="text">
          Отменить
        </Button>
        <Button
          type="submit"
          form="cards-game-settings-form"
          variant="text"
          color="primary"
        >
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
}

CardsGameSettingsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  trainingSettings: PropTypes.shape({
    voiceOn: PropTypes.bool,
    cardDimension: PropTypes.string,
    cardTextSize: PropTypes.string
  }).isRequired,
  setTrainingSettings: PropTypes.func.isRequired,
  voiceSettingEditable: PropTypes.bool
};

export default CardsGameSettingsDialog;
