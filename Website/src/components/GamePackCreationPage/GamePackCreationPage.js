import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import IconButton from '@material-ui/core/IconButton';

const styles = theme => ({
    root: {
        [theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
            width: 600,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing.unit * 2,
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    },
    form: {
        marginTop: theme.spacing.unit,
    },
    actions: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    button: {
        marginTop: theme.spacing.unit,
    },
    submit: {
        marginTop: theme.spacing.unit * 3,
    },
});

function GamePackCreationPage(
    {
        descriptionValues,
        handleDescriptionValuesChange,
        levelPacks,
        handleLevelPackAddition,
        handleLevelPackDeletion,
        handleWordTranslationAddition,
        handleWordTranslationDeletion,
        handleSubmit,
        classes
    }
) {
    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <form onSubmit={handleSubmit}>
                    <TextField
                        required
                        autoFocus
                        id="title"
                        label="Название"
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        value={descriptionValues.title}
                        onChange={handleDescriptionValuesChange('title')}
                    />
                    <TextField
                        id="description"
                        label="Описание"
                        multiline
                        rows="4"
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        value={descriptionValues.description}
                        onChange={handleDescriptionValuesChange('description')}
                    />
                    {levelPacks.map((levelPack, levelPackIndex) =>
                        <Paper key={levelPackIndex} className={classes.paper}>
                            <Typography variant="h6">
                                Уровень {levelPackIndex + 1}
                            </Typography>
                            {levelPack.wordTranslations.map((wordTranslation, wordTranslationIndex) =>
                                <Paper key={wordTranslationIndex} className={classes.paper}>
                                    <Typography variant="h6">
                                        Пара слов {wordTranslationIndex + 1}
                                    </Typography>
                                    <TextField
                                        required
                                        id="wordForeign"
                                        label="Слово или фраза"
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                        name={`${levelPackIndex}.${wordTranslationIndex}.wordForeign`}
                                        defaultValue={wordTranslation.defaultWordForeign}
                                    />
                                    <TextField
                                        required
                                        id="wordNative"
                                        label="Перевод"
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                        name={`${levelPackIndex}.${wordTranslationIndex}.wordNative`}
                                        defaultValue={wordTranslation.defaultWordNative}
                                    />
                                </Paper>
                            )}
                            <div className={classes.actions}>
                                <IconButton
                                    color="inherit"
                                    aria-label="Remove"
                                    disabled={levelPacks[levelPackIndex].wordTranslations.length < 2}
                                    className={classes.button}
                                    onClick={handleWordTranslationDeletion(levelPackIndex)}
                                >
                                    <RemoveIcon />
                                </IconButton>
                                <IconButton
                                    color="inherit"
                                    aria-label="Add"
                                    className={classes.button}
                                    onClick={handleWordTranslationAddition(levelPackIndex)}
                                >
                                    <AddIcon />
                                </IconButton>
                            </div>
                        </Paper>)}
                    <div className={classes.actions}>
                        <IconButton
                            color="inherit"
                            aria-label="Remove"
                            disabled={levelPacks.length < 2}
                            className={classes.button}
                            onClick={handleLevelPackDeletion}
                        >
                            <RemoveIcon />
                        </IconButton>
                        <IconButton
                            color="inherit"
                            aria-label="Add"
                            className={classes.button}
                            onClick={handleLevelPackAddition}
                        >
                            <AddIcon />
                        </IconButton>
                    </div>
                    <div className={classes.actions}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Создать
                        </Button>
                    </div>
                </form>
            </Paper>
        </div>
    );
}

GamePackCreationPage.propTypes = {
    descriptionValues: PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired
    }).isRequired,
    handleDescriptionValuesChange: PropTypes.func.isRequired,
    levelPacks: PropTypes.arrayOf(
        PropTypes.shape({
            level: PropTypes.number.isRequired,
            wordTranslations: PropTypes.arrayOf(
                PropTypes.shape({
                    defaultWordForeign: PropTypes.string.isRequired,
                    defaultWordNative: PropTypes.string.isRequired
                }).isRequired
            ).isRequired
        }).isRequired
    ).isRequired,
    handleLevelPackAddition: PropTypes.func.isRequired,
    handleLevelPackDeletion: PropTypes.func.isRequired,
    handleWordTranslationAddition: PropTypes.func.isRequired,
    handleWordTranslationDeletion: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(GamePackCreationPage);
