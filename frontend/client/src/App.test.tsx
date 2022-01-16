import React from 'react';
import { render, screen } from '@testing-library/react';
import { drizzleReactHooks } from '@drizzle/react-plugin';
import App from './App';

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
    const useDrizzleState = ((drizzleState: any) => ({
        accounts: ['0x0']
    }));
    return { drizzleReactHooks: { useDrizzle, useDrizzleState } }
});

test('App - Renders', async () => {
    render(
        <App />
    );
    const element = screen.getByText(/0x0/i);
    expect(element).toBeInTheDocument();
});
