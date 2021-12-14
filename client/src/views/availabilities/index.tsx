import React, { useEffect } from 'react';
import { drizzleReactHooks } from '@drizzle/react-plugin';
import { makeStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Icon from '@mui/material/Icon';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import '../../App.css';
import DataTable from '../../components/dataTable';

export namespace Availabilities {
    export interface Props {
        drizzleState: {
            accounts: Array<string>
        }
    }
}

const useStyles = makeStyles(() => ({
    background: {
        background: '#f8f8f8'
    },
    column: {
        position: 'relative',
        height: '100vh',
        overflow: 'scroll'
    },
    right: {
        float: 'right'
    }
}));

function Availabilities({ drizzleState }: Availabilities.Props): JSX.Element {
    const classes = useStyles();
    const [rooms, setRooms] = React.useState<Array<number | never>>([]);
    const [selectedDay, setSelectedDay] = React.useState(new Date().toISOString().slice(0, 10));
    const [selectedRoom, setSelectedRoom] = React.useState(null);
    const { useCacheCall } = drizzleReactHooks.useDrizzle();
    const roomsCount = useCacheCall('Reservation', 'roomsCount');

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

    useEffect(() => {
        // We create a new array of numbers from 0 to roomsCount
        setRooms(Array.from({ length: roomsCount }, (_, i) => i));
    }, [roomsCount]);

    const Room = ({ index }: { index: number }) => {
        const room = useCacheCall('Reservation', 'rooms', index);

        return room
            ? <ListItem disablePadding key={`room${index}`}>
                <ListItemButton onClick={() => setSelectedRoom(room)}>
                    <ListItemIcon>
                        <Icon>meeting_room</Icon>
                    </ListItemIcon>
                    <ListItemText primary={room.name} />
                </ListItemButton>
            </ListItem>
            : <div />
    }

    return (
        <Grid container spacing={0}>
            <AppBar position='static' elevation={0}>
                <Toolbar>
                    <IconButton
                        size='large'
                        edge='start'
                        color='inherit'
                        aria-label='menu'
                        sx={{ mr: 2 }}
                    >
                        <Icon>
                            menu
                        </Icon>
                    </IconButton>
                    <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
                        {drizzleState.accounts[0]}
                    </Typography>
                    <div className={classes.right}>
                        <IconButton onClick={handlePrevious}><Icon>arrow_left</Icon></IconButton>
                        <p style={{ margin: 10, display: 'inline' }}>{selectedDay}</p>
                        <IconButton onClick={handleNext}><Icon>arrow_right</Icon></IconButton>
                    </div>
                </Toolbar>
            </AppBar>
            <Grid item xs={2} className={`${classes.background} ${classes.column}`}>
                <List>
                    {rooms?.map((_, index) =>
                        <Room index={index} />
                    )}
                </List>
            </Grid>
            <Grid item xs={8} className={classes.column}>
                {selectedRoom ? (
                    <DataTable
                        user={drizzleState.accounts[0]}
                        selectedDay={selectedDay}
                        selectedRoom={selectedRoom}
                    />
                ) : <div />}
            </Grid>
            <Grid item xs={2} className={classes.background}></Grid>
        </Grid >
    )
}

export default Availabilities;
