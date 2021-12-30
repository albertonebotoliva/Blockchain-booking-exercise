import React, { useEffect } from 'react';
import { drizzleReactHooks } from '@drizzle/react-plugin';
import { makeStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import DataTable from './../components/dataTable';
import DateSelector from './../components/dateSelector';
import RoomList from './../components/roomList';
import './../App.css';

const useStyles = makeStyles(() => ({
    background: {
        background: '#f8f8f8'
    },
    column: {
        position: 'relative',
        height: '100vh',
        overflow: 'scroll'
    }
}));

export namespace Availabilities {
    export interface Props {
        drizzleState: {
            accounts: Array<string>
        }
    }
}

function Availabilities({ drizzleState }: Availabilities.Props): JSX.Element {
    const classes = useStyles();
    const { useCacheCall, useCacheSend } = drizzleReactHooks.useDrizzle();
    const [rooms, setRooms] = React.useState<Array<number | never>>([]);
    const [selectedDay, setSelectedDay] = React.useState(new Date().toISOString().slice(0, 10));
    const [selectedRoom, setSelectedRoom] = React.useState({ id: 0, name: 'Room 0' });

    const { send: cancelBooking, TXObjects: transactionCancel } = useCacheSend('Reservation', 'cancelBooking');
    const { send: addBooking, TXObjects: transactionAdd } = useCacheSend('Reservation', 'addBooking');

    const roomsCount = useCacheCall('Reservation', 'roomsCount');
    const availabilities = useCacheCall('Reservation', 'getAvailabilities', selectedRoom.id, selectedDay);


    useEffect(() => {
        // We create a new array of numbers from 0 to roomsCount
        setRooms(Array.from({ length: roomsCount }, (_, i) => i));
    }, [roomsCount]);

    return (
        <Grid container spacing={0}>
            <DateSelector selectedDay={selectedDay} setSelectedDay={setSelectedDay} user={drizzleState.accounts[0]} />
            <Grid item xs={2} className={`${classes.background} ${classes.column}`}>
                <RoomList rooms={rooms} setSelectedRoom={setSelectedRoom} useCacheCall={useCacheCall} />
            </Grid>
            <Grid item xs={8} className={classes.column}>
                {selectedRoom ? (
                    <DataTable
                        availabilities={availabilities}
                        addBooking={addBooking}
                        cancelBooking={cancelBooking}
                        transactionAdd={transactionAdd}
                        transactionCancel={transactionCancel}
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
