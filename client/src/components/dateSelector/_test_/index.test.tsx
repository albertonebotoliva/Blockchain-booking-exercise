import React from 'react';
import { render, screen } from '@testing-library/react';
import DateSelector from '../';

test('DateSelector - Renders', () => {
    render(
        <DateSelector
            selectedDay={'26/05/1980'}
            setSelectedDay={() => { }}
            user={'TEST ACCOUNT'}
        />
    );
    const element = screen.getByText(/26\/05\/1980/i);
    expect(element).toBeInTheDocument();
});
