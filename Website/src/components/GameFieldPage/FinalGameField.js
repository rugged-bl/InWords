import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography/index';
import StarIcon from '@material-ui/icons/Star';
import IconButton from '@material-ui/core/IconButton/index';
import ReplayIcon from '@material-ui/icons/Replay';
import Zoom from '@material-ui/core/Zoom/index';

const styles = theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    gameResult: {
        marginTop: theme.spacing.unit * 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: theme.spacing.unit * 2,
    },
});

function FinalGameField({ score = 0, handleReplay, classes }) {
    return (
        <div className={classes.root}>
            <Zoom in>
                <div className={classes.gameResult}>
                    <Typography
                        variant="h4"
                        color="secondary"
                        align="center"
                        gutterBottom
                    >
                        WINNER WINNER CHICKEN DINNER!
                    </Typography>
                    <Typography gutterBottom>
                        <StarIcon fontSize="large" color={score > 0 ? 'secondary' : 'disabled'} />
                        <StarIcon fontSize="large" color={score > 1 ? 'secondary' : 'disabled'} />
                        <StarIcon fontSize="large" color={score > 2 ? 'secondary' : 'disabled'} />
                    </Typography>
                    <Typography>
                        <IconButton color="primary" aria-label="Replay" onClick={handleReplay}>
                            <ReplayIcon fontSize="large" />
                        </IconButton>
                    </Typography>
                </div>
            </Zoom>
        </div>
    );
}

FinalGameField.propTypes = {
    score: PropTypes.number,
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FinalGameField);