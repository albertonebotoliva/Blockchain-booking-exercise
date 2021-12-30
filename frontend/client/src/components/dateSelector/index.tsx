import React from 'react';
import { makeStyles } from '@mui/styles';
import IconButton from '@mui/material/IconButton';
import Icon from '@mui/material/Icon';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

export namespace DateSelector {
    export interface Props {
        user: string,
        selectedDay: string,
        setSelectedDay: (day: string) => void
    }
}

const useStyles = makeStyles(() => ({
    right: {
        float: 'right'
    }
}));

function DateSelector({ user, selectedDay, setSelectedDay }: DateSelector.Props): JSX.Element {
    const classes = useStyles();

    const handleNext = () => {
        const date = new Date(selectedDay);
        const next = new Date(date.setDate(date.getDate() + 1)).toISOString().slice(0, 10);
        setSelectedDay(next);
    }
    const handlePrevious = () => {
        const date = new Date(selectedDay);
        const next = new Date(date.setDate(date.getDate() - 1)).toISOString().slice(0, 10);
        setSelectedDay(next);
    }

    return (
        <AppBar position='static' elevation={0}>
            <Toolbar>
                <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
                    {user}
                </Typography>
                <div className={classes.right}>
                    <IconButton onClick={handlePrevious}><Icon>arrow_left</Icon></IconButton>
                    <p style={{ margin: 10, display: 'inline' }}>{selectedDay}</p>
                    <IconButton onClick={handleNext}><Icon>arrow_right</Icon></IconButton>
                </div>
            </Toolbar>
        </AppBar>
    )
}

export default DateSelector;
