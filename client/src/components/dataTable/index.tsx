import * as React from 'react';
import { makeStyles } from '@mui/styles';
import CircularProgress from '@mui/material/CircularProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import { drizzleReactHooks } from '@drizzle/react-plugin';

export namespace DataTable {
  export interface Props {
    user: string,
    selectedDay: string,
    selectedRoom: {
      id: number,
      name: string
    }
  }
}

const useStyles = makeStyles(() => ({
  minWidth: {
    minWidth: 114
  },
  loadingArea: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  noBorder: {
    borderBottom: '0 !important'
  },
  hour: {
    position: 'absolute',
    textAlign: 'center',
    borderBottom: '0 !important',
    width: '10%',
    marginTop: -18
  },
  actionArea: {
    width: '90%'
  }
}));

export default function DataTable({ user, selectedDay, selectedRoom }: DataTable.Props) {
  const classes = useStyles();
  const { useCacheCall, useCacheSend } = drizzleReactHooks.useDrizzle();
  const { send: cancelBooking, TXObjects: transactionCancel } = useCacheSend('Reservation', 'cancelBooking');
  const { send: addBooking, TXObjects: transactionAdd } = useCacheSend('Reservation', 'addBooking');
  const availabilities = useCacheCall('Reservation', 'getAvailabilities', selectedRoom.id, selectedDay);
  type TBooking = {
    room: number,
    day: string,
    hour: string
  }

  type TAvailability = {
    user: string,
    company: string,
    hour: string,
    isBooked: boolean
  }

  function Header({ name }: any): JSX.Element {
    return <TableCell><h1>{name}</h1></TableCell>
  }

  function Booked({ company }: { company: string }): JSX.Element {
    return <Button className={classes.minWidth} variant='contained' color='warning' >{company}</Button>
  }

  function Cancel({ room, day, hour }: TBooking): JSX.Element {
    return <Button className={classes.minWidth} variant='contained' color='success' onClick={() => cancelBooking(room, day, hour)}><Icon>delete_forever</Icon></Button>
  }
  function Available({ room, day, hour }: TBooking): JSX.Element {
    return <Button className={classes.minWidth} variant='contained' color='primary' onClick={() => addBooking(room, day, hour)}><Icon>add</Icon></Button>
  }

  if (!availabilities
    || transactionAdd[transactionAdd.length - 1]?.status === 'pending'
    || transactionCancel[transactionCancel - 1]?.status === 'pending') {
    return (
      <div className={classes.loadingArea}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <Table size='small'>
      <TableHead>
        <TableRow>
          <TableCell className={classes.noBorder}></TableCell>
          <Header name={selectedRoom.name} />
        </TableRow>
      </TableHead>
      <TableBody>
        {availabilities?.map((availability: TAvailability) => (
          <TableRow key={availability.hour} >
            <TableCell className={classes.hour}><small>{availability.hour}</small></TableCell>
            <TableCell sx={{ textAlign: 'right' }} className={classes.actionArea}>
              {availability.isBooked && availability.user !== user && <Booked company={availability.company} />}
              {availability.isBooked && availability.user === user && <Cancel room={selectedRoom.id} day={selectedDay} hour={availability.hour} />}
              {!availability.isBooked && <Available room={selectedRoom.id} day={selectedDay} hour={availability.hour} />}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table >
  );
}
