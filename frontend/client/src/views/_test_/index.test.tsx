import React from 'react';
import { render, screen } from '@testing-library/react';
import { drizzleReactHooks } from '@drizzle/react-plugin';
import Availabilities from '..';

jest.mock('@drizzle/react-plugin', () => {
    const useDrizzle = () => {
        return {
            useCacheCall: jest.fn((contract, method) => {
                if (method === 'getAvailabilities')
                    return [];
            }),
            useCacheSend: jest.fn(() => { return { send: jest.fn(), TXObjects: '' } })
        }
    };
    return { drizzleReactHooks: { useDrizzle } }
});


test('Availabilities - Renders', async () => {
    render(
        <Availabilities drizzleState={{ accounts: ['0x0'] }} />
    );
    const element = screen.getByText(/0x0/i);
    expect(element).toBeInTheDocument();
});
