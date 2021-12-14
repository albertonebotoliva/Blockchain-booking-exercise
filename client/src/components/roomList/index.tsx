import React from 'react';
import { drizzleReactHooks } from '@drizzle/react-plugin';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Icon from '@mui/material/Icon';

export namespace RoomList {
    export interface Props {
        rooms: Array<number | never>,
        setSelectedRoom: (room: any) => void
    }
}

function RoomList({ rooms, setSelectedRoom }: RoomList.Props): JSX.Element {
    const { useCacheCall } = drizzleReactHooks.useDrizzle();
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
        <List>
            {rooms?.map((_, index) =>
                <Room index={index} />
            )}
        </List>
    )
}

export default RoomList;
