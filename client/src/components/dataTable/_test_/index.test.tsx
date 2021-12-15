import React from 'react';
import { render, screen } from '@testing-library/react';
import DataTable from '../';

test('DataTable - Renders', () => {
    render(
        <DataTable
            availabilities={
                [
                    [
                        '0x0000000000000000000000000000000000000000',
                        '0',
                        '',
                        '2021-12-15',
                        '00:00',
                        false
                    ]
                ]
            }
            addBooking={() => { }}
            cancelBooking={() => { }}
            transactionAdd={{}}
            transactionCancel={{}}
            user={'TEST ACCOUNT'}
            selectedDay={'2021-12-15'}
            selectedRoom={{ id: 0, name: 'Room 0' }}
        />);
    const element = screen.getByText(/ROOM 0/i);
    expect(element).toBeInTheDocument();
});

test('DataTable - Loading', () => {
    render(
        <DataTable
            availabilities={null}
            addBooking={() => { }}
            cancelBooking={() => { }}
            transactionAdd={{}}
            transactionCancel={{}}
            user={'TEST ACCOUNT'}
            selectedDay={'2021-12-15'}
            selectedRoom={{ id: 0, name: 'Room 0' }}
        />);
    const element = screen.getByRole('progressbar');
    expect(element).toBeInTheDocument();
});