import React from 'react';
import { render, screen } from '@testing-library/react';
import RoomList from '../';

test('RoomList - Renders', () => {
    const useCacheCall = jest.fn();
    render(
        <RoomList
            useCacheCall={useCacheCall.mockReturnValue({ id: "0", name: "Room 0" })}
            rooms={[0]}
            setSelectedRoom={() => { }} />
    );
    const element = screen.getByText(/Room 0/i);
    expect(element).toBeInTheDocument();
});
