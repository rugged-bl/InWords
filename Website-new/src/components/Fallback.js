import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    progress: {
        display: 'block',
        margin: theme.spacing(2),
        marginLeft: 'auto',
        marginRight: 'auto',
    },
}));

function Fallback() {
    const classes = useStyles();

    return (
        <CircularProgress className={classes.progress} />
    );
}

export default Fallback;
